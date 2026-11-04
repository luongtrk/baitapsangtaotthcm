// Game Engine: Xử lý Vòng lặp trò chơi, Phím bấm, Cảm ứng Mobile, Camera & Va chạm

class GameEngine {
    constructor(canvas, onDocumentFound, onLevelVictory, onGameOver) {
        this.canvas = canvas;
        this.renderer = new GameRenderer(canvas);
        this.onDocumentFound = onDocumentFound;
        this.onLevelVictory = onLevelVictory;
        this.onGameOver = onGameOver;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.levelIndex = 0;
        this.currentLevel = null;
        this.player = null;
        this.guards = [];
        this.documents = [];
        this.stars = [];
        this.particles = new ParticleSystem();

        this.cameraX = 0;
        this.screenShake = 0; // Chấn động màn hình khi va chạm / trúng bẫy
        this.score = 0;
        this.chapterStartScore = 0;
        this.starsCollectedCount = 0;
        this.detectedCount = 0; // Số lần bị mật thám phát hiện
        this.maxHp = 100;
        this.hp = 100;
        this.bullets = [];
        this.playTime = 0; // Tổng thời gian chơi tính bằng giây
        this.chapterStartTime = 0;
        this.nearDocument = null; // Văn kiện đang đứng gần để bấm [E] mở

        this.isRunning = false;
        this.isPaused = false;
        this.animationFrameId = null;

        this.initInputListeners();
    }

    initInputListeners() {
        // Bàn phím máy tính
        window.addEventListener("keydown", (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault(); // Ngăn cuộn trang web
            }
            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") this.controls.left = true;
            if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") this.controls.right = true;
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") this.controls.down = true;
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key === " ") {
                if (!this.controls.up && this.player && this.isRunning && !this.isPaused) {
                    const jRes = this.player.jump();
                    if (jRes && jRes.jumped && !jRes.isDouble) {
                        this.particles.addDust(this.player.x + this.player.width / 2, this.player.y + this.player.height, 4);
                    }
                }
                this.controls.up = true;
            }
            // Phím E hoặc F tương tác mở đọc văn kiện khi đứng gần
            if (e.key.toLowerCase() === "e" || e.key.toLowerCase() === "f") {
                this.readNearDocument();
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") this.controls.left = false;
            if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") this.controls.right = false;
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") this.controls.down = false;
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key === " ") this.controls.up = false;
        });

        // Nút cảm ứng ảo trên màn hình điện thoại / máy tính bảng
        const bindTouchBtn = (elementId, actionDown, actionUp) => {
            const btn = document.getElementById(elementId);
            if (!btn) return;

            const handleStart = (e) => {
                e.preventDefault();
                actionDown();
            };
            const handleEnd = (e) => {
                e.preventDefault();
                actionUp();
            };

            btn.addEventListener("touchstart", handleStart, { passive: false });
            btn.addEventListener("touchend", handleEnd, { passive: false });
            btn.addEventListener("mousedown", handleStart);
            btn.addEventListener("mouseup", handleEnd);
            btn.addEventListener("mouseleave", handleEnd);
        };

        bindTouchBtn("btn-touch-left", () => this.controls.left = true, () => this.controls.left = false);
        bindTouchBtn("btn-touch-right", () => this.controls.right = true, () => this.controls.right = false);
        bindTouchBtn("btn-touch-down", () => this.controls.down = true, () => this.controls.down = false);
        bindTouchBtn("btn-touch-jump", () => {
            if (this.player && this.isRunning && !this.isPaused) {
                const jRes = this.player.jump();
                if (jRes && jRes.jumped && !jRes.isDouble) {
                    this.particles.addDust(this.player.x + this.player.width / 2, this.player.y + this.player.height, 4);
                }
            }
        }, () => {});
        bindTouchBtn("btn-touch-interact", () => this.readNearDocument(), () => {});
    }

    getFormattedTime() {
        const totalSecs = Math.floor(this.playTime);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    readNearDocument() {
        if (!this.nearDocument || this.nearDocument.collected || this.isPaused || !this.isRunning) return;
        const doc = this.nearDocument;
        doc.collected = true;
        doc.isNear = false;
        this.nearDocument = null;
        this.updateInteractBtn();

        if (typeof audio !== "undefined" && audio.playCollect) {
            audio.playCollect();
        }
        this.particles.addBurst(doc.x + 14, doc.y + 16, "#fbbf24", 28);
        this.particles.addFloatingText(doc.x + 14, doc.y - 25, "VĂN KIỆN", "#38bdf8", 15, 160);

        // Tạm dừng game để mở Modal câu hỏi & tư liệu học thuật
        this.pause();
        if (this.onDocumentFound) {
            this.onDocumentFound(doc.docId);
        }
    }

    updateInteractBtn() {
        const btn = document.getElementById("btn-touch-interact");
        if (btn) {
            btn.style.display = this.nearDocument ? "flex" : "none";
        }
    }

    loadLevel(levelIndex) {
        this.levelIndex = levelIndex;
        const levelData = LEVELS[levelIndex];
        this.currentLevel = JSON.parse(JSON.stringify(levelData)); // Bản sao dữ liệu

        // Khởi tạo người chơi
        this.player = new Player(this.currentLevel.startPos.x, this.currentLevel.startPos.y);

        // Khởi tạo lính tuần tra
        this.guards = this.currentLevel.guards.map(g => new Guard(g));

        // Khởi tạo tài liệu văn kiện
        this.documents = this.currentLevel.documents.map(d => new DocumentItem(d));

        // Khởi tạo sao thưởng
        this.stars = this.currentLevel.stars.map(s => new StarItem(s.x, s.y));

        this.bullets = [];
        this.cameraX = 0;
        this.screenShake = 0;
        this.isPaused = false;
        this.maxHp = 100;
        this.hp = 100;
        this.starsCollectedCount = 0;
        this.score = this.chapterStartScore;
        this.nearDocument = null;
        this.updateInteractBtn();

        if (levelIndex === 0) {
            this.playTime = 0;
            this.chapterStartTime = 0;
        } else {
            this.chapterStartTime = this.playTime;
        }
        this.updateHUD();
    }

    // Xử lý mất máu khi trúng đạn, cạm bẫy hoặc rơi vực
    handlePlayerDamage(type, amount = 25, label = "") {
        if (this.hp <= 0) return;
        this.hp = Math.max(0, this.hp - amount);
        this.updateHUD();

        let text = `-${amount}`;

        let px = this.player ? this.player.x + this.player.width / 2 : 200;
        let py = this.player ? this.player.y - 22 : 200;
        if (type === "pit" && this.player) {
            px = this.player.checkpointX + this.player.width / 2;
            py = this.player.checkpointY - 25;
        }

        this.particles.addFloatingText(px, py, text, "#ef4444", 15, 140);

        // Nếu hết sạch máu -> Kích hoạt chuỗi Game Over và cho phép chơi lại màn từ đầu
        if (this.hp <= 0) {
            this.particles.addFloatingText(px, py - 28, "HẾT MÁU", "#ef4444", 16, 180);
            if (this.player) {
                this.player.startDeath("hp_depleted");
            }
            setTimeout(() => {
                if (this.hp <= 0) {
                    this.pause();
                    if (this.onGameOver) {
                        this.onGameOver();
                    }
                }
            }, 600);
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.loop();
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    loop() {
        if (!this.isRunning) return;

        if (!this.isPaused) {
            this.update();
        }

        // Vẽ đồ họa
        this.renderer.render({
            currentLevel: this.currentLevel,
            player: this.player,
            guards: this.guards,
            bullets: this.bullets,
            documents: this.documents,
            stars: this.stars,
            particles: this.particles,
            cameraX: this.cameraX,
            screenShake: this.screenShake
        });

        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    update() {
        if (!this.player || !this.currentLevel) return;

        // Tính tổng thời gian chơi (tăng theo từng frame 60fps)
        this.playTime += 1 / 60;

        // Giảm dần chấn động màn hình (Screen Shake decay)
        if (this.screenShake > 0) {
            this.screenShake *= 0.88;
            if (this.screenShake < 0.2) this.screenShake = 0;
        }

        // Khi máu về 0 (Game Over pending): khóa phím điều khiển, chỉ cho chạy hiệu ứng ngã gục & hạt nổi
        if (this.hp <= 0) {
            this.player.update(
                { left: false, right: false, up: false, down: false },
                this.currentLevel.platforms,
                [],
                [],
                this.currentLevel.levelWidth,
                this.currentLevel.levelHeight
            );
            this.particles.update();
            return;
        }

        // 1. Cập nhật Player
        const result = this.player.update(
            this.controls,
            this.currentLevel.platforms,
            this.currentLevel.hazards,
            this.currentLevel.hidingSpots,
            this.currentLevel.levelWidth,
            this.currentLevel.levelHeight
        );

        if (result) {
            if (result.respawned) {
                audio.playRespawn();
                this.particles.addRespawnHalo(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
            }
            if (result.hitHazard) {
                this.detectedCount++;
                this.screenShake = 12;
                audio.playHit();
                audio.playAlert();
                this.particles.addHitShockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                this.player.invulnerableTimer = 65; // ~1s bất tử nhấp nháy né dính bẫy liên tục
                this.handlePlayerDamage("hazard", 20, result.label);
            } else if (result.fellInPit) {
                this.detectedCount++;
                this.screenShake = 8;
                audio.playHit();
                audio.playAlert();
                this.handlePlayerDamage("pit", 30);
            }
            if (result.jumpDust) {
                this.particles.addDust(result.jumpDust.x, result.jumpDust.y, 4);
            }
            if (result.landDust) {
                this.particles.addDust(result.landDust.x, result.landDust.y, 5);
            }
            if (result.iceSkid) {
                this.particles.addSnowSpray(result.iceSkid.x, result.iceSkid.y, result.iceSkid.dir);
            }
        }

        // 2. Cập nhật Camera theo chân Người chơi mượt mà (Tương thích màn hình Fullscreen)
        const scale = this.canvas.height > 0 ? this.canvas.height / 600 : 1;
        const virtualWidth = this.canvas.width / scale;
        const targetCameraX = this.player.x - virtualWidth * 0.35;
        this.cameraX += (targetCameraX - this.cameraX) * 0.08;
        if (this.cameraX < 0) this.cameraX = 0;
        const maxCameraX = Math.max(0, this.currentLevel.levelWidth - virtualWidth);
        if (this.cameraX > maxCameraX) this.cameraX = maxCameraX;

        // 3. Cập nhật Đạn của mật thám
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            const bRes = b.update(this.currentLevel.platforms);
            if (bRes && (bRes.hitObstacle || bRes.expired)) {
                this.particles.addBurst(b.x, b.y, "#fde047", 6);
                this.bullets.splice(i, 1);
                continue;
            }

            // Đạn trúng người chơi
            if (b.checkHitPlayer(this.player)) {
                audio.playHit();
                this.screenShake = 12;
                this.particles.addHitShockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                this.player.invulnerableTimer = 60; // 1 giây nhấp nháy bất tử bảo vệ
                this.handlePlayerDamage("bullet", b.damage || 25);
                this.bullets.splice(i, 1);
            }
        }

        // 4. Cập nhật Mật thám & Bắn súng
        for (const guard of this.guards) {
            const shot = guard.update(this.player, this.currentLevel.platforms);
            if (shot && shot.fired) {
                audio.playGunshot();
                this.bullets.push(new Bullet(shot.x, shot.y, shot.dir));
                this.particles.addMuzzleFlash(shot.x, shot.y, shot.dir);
            }

            // Va chạm cơ thể trực tiếp với mật thám (nếu không ẩn nấp và không bất tử)
            if (!this.player.isDying && this.player.invulnerableTimer === 0 && !this.player.isHidden) {
                if (this.player.checkCollision(this.player, guard)) {
                    audio.playHit();
                    audio.playAlert();
                    this.screenShake = 12;
                    this.particles.addHitShockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                    this.player.invulnerableTimer = 60;
                    this.handlePlayerDamage("guard_touch", 25);
                }
            }
        }

        // 5. Cập nhật Điểm lưu (Checkpoints)
        for (const cp of this.currentLevel.checkpoints) {
            if (!cp.reached && Math.abs(this.player.x - cp.x) < 40 && Math.abs(this.player.y - cp.y) < 70) {
                cp.reached = true;
                this.player.setCheckpoint(cp.x, cp.y - 10);
                this.particles.addBurst(cp.x, cp.y, "#fbbf24", 20);
                this.particles.addFloatingText(cp.x, cp.y - 35, "CHECKPOINT", "#10b981", 15, 170);
                audio.playTone(660, "triangle", 0.2, 0.15);
            }
        }

        // 6. Cập nhật Sao cách mạng (Stars)
        for (const star of this.stars) {
            star.update();
            if (star.checkCollect(this.player)) {
                audio.playCollect();
                this.score += 50;
                this.starsCollectedCount++;
                this.particles.addBurst(star.x, star.y, "#fbbf24", 14);
                this.particles.addFloatingText(star.x, star.y - 20, "+50", "#fbbf24", 13, 150);
                this.hp = Math.min(this.maxHp, this.hp + 5); // Nhặt sao hồi phục nhẹ 5 HP
                this.updateHUD();
            }
        }

        // 7. Cập nhật Tài liệu văn kiện (Documents) - người chơi tự chọn bấm [E] mở hoặc lướt qua
        let foundNearDoc = null;
        for (const doc of this.documents) {
            doc.update();
            if (doc.checkNear(this.player)) {
                foundNearDoc = doc;
            }
        }
        this.nearDocument = foundNearDoc;
        this.updateInteractBtn();

        // 8. Cập nhật Hạt hiệu ứng & Chữ nổi
        this.particles.update();

        // 9. Kiểm tra Đích đến của màn chơi (Level Exit)
        const exitX = this.currentLevel.exitPos.x;
        const exitY = this.currentLevel.exitPos.y;
        const pCenterX = this.player.x + this.player.width / 2;
        const pCenterY = this.player.y + this.player.height / 2;

        // Vùng kích hoạt đích đến bao phủ toàn bộ công trình (tàu / xe lửa / hang đá / lễ đài)
        const inExitZone = (
            pCenterX >= exitX - 30 &&
            pCenterX <= exitX + 160 &&
            Math.abs(pCenterY - (exitY + 20)) < 120
        );

        if (inExitZone) {
            // Hoàn thành màn chơi
            this.pause();
            this.chapterStartScore = this.score;
            audio.playLevelComplete();
            if (this.onLevelVictory) {
                this.onLevelVictory(this.levelIndex);
            }
        }
    }

    triggerScreenNotice(text, type = "info") {
        const noticeEl = document.getElementById("game-notice");
        if (!noticeEl) return;
        noticeEl.innerText = text;
        noticeEl.className = `notice-badge show ${type}`;
        setTimeout(() => {
            noticeEl.className = "notice-badge";
        }, 2500);
    }

    updateHUD() {
        const scoreEl = document.getElementById("hud-score");
        const starsEl = document.getElementById("hud-stars");
        const hpFillEl = document.getElementById("hud-hp-fill");
        const hpTextEl = document.getElementById("hud-hp-text");
        const timerEl = document.getElementById("hud-timer");

        if (scoreEl) scoreEl.innerText = this.score;
        if (starsEl) starsEl.innerText = this.starsCollectedCount;
        if (timerEl) timerEl.innerText = this.getFormattedTime();

        if (hpFillEl && hpTextEl) {
            const percent = Math.max(0, Math.min(100, (this.hp / this.maxHp) * 100));
            hpFillEl.style.width = `${percent}%`;
            hpTextEl.innerText = `${this.hp}/${this.maxHp} HP`;

            if (percent > 50) {
                hpFillEl.className = "hud-hp-bar-fill high";
            } else if (percent > 25) {
                hpFillEl.className = "hud-hp-bar-fill mid";
            } else {
                hpFillEl.className = "hud-hp-bar-fill low";
            }
        }
    }
}

