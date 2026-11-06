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
        this.pebbles = []; // Sỏi nghi binh đang bay / nảy
        this.supplies = []; // Vật phẩm tiếp tế (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang)
        this.npcs = []; // Đồng chí liên lạc bí mật
        this.shortcuts = []; // Cầu/lối tắt bí mật
        this.nearNpc = null; // NPC đang đứng gần
        this.nearGuardForTakedown = null; // Mật thám có thể khống chế sau lưng

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

            // Phím E: Tương tác mở đọc văn kiện HOẶC trò chuyện với đồng chí liên lạc
            if (e.key.toLowerCase() === "e") {
                if (this.nearDocument) {
                    this.readNearDocument();
                } else if (this.nearNpc) {
                    this.interactWithNpc();
                }
            }

            // Phím F: Tung Nghi Binh (Ném sỏi đánh lạc hướng mật thám)
            if (e.key.toLowerCase() === "f") {
                this.throwPebble();
            }

            // Phím Q: Khống Chế Từ Phía Sau (Stealth Takedown)
            if (e.key.toLowerCase() === "q") {
                this.performTakedown();
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
                if (e.cancelable) e.preventDefault();
                btn.classList.add("touch-active");
                actionDown();
            };
            const handleEnd = (e) => {
                if (e.cancelable) e.preventDefault();
                btn.classList.remove("touch-active");
                actionUp();
            };

            btn.addEventListener("touchstart", handleStart, { passive: false });
            btn.addEventListener("touchend", handleEnd, { passive: false });
            btn.addEventListener("touchcancel", handleEnd, { passive: false });
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

        // Nút đọc văn kiện / trò chuyện với NPC
        bindTouchBtn("btn-touch-interact", () => {
            if (this.nearDocument) {
                this.readNearDocument();
            } else if (this.nearNpc) {
                this.interactWithNpc();
            }
        }, () => {});

        // Nút tung sỏi nghi binh trên mobile
        bindTouchBtn("btn-touch-distract", () => this.throwPebble(), () => {});

        // Nút khống chế mật thám sau lưng trên mobile
        bindTouchBtn("btn-touch-takedown", () => this.performTakedown(), () => {});

        // Đảm bảo không bị kẹt phím khi người chơi nhấc toàn bộ ngón tay hoặc chuyển ứng dụng
        window.addEventListener("touchend", (e) => {
            if (e.touches && e.touches.length === 0) {
                this.controls.left = false;
                this.controls.right = false;
                this.controls.down = false;
                document.querySelectorAll(".touch-btn").forEach(b => b.classList.remove("touch-active"));
            }
        });
        window.addEventListener("touchcancel", () => {
            this.controls.left = false;
            this.controls.right = false;
            this.controls.down = false;
            document.querySelectorAll(".touch-btn").forEach(b => b.classList.remove("touch-active"));
        });
    }

    getFormattedTime() {
        const totalSecs = Math.floor(this.playTime);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    // Kỹ năng Nghi Binh (Phím F hoặc nút cảm ứng): Ném sỏi đánh lạc hướng
    throwPebble() {
        if (!this.player || !this.isRunning || this.isPaused || this.player.isDying) return;
        const pebble = this.player.throwPebble();
        if (pebble) {
            this.pebbles.push(pebble);
            this.triggerScreenNotice("🎯 Nghi Binh: Đã ném sỏi đánh lạc hướng!", "info");
            this.particles.addFloatingText(this.player.x + 14, this.player.y - 25, "NGHI BINH", "#38bdf8", 14, 140);
        } else if (this.player.pebbleCooldown > 0) {
            const sec = (this.player.pebbleCooldown / 60).toFixed(1);
            this.triggerScreenNotice(`Sỏi đang hồi: ${sec}s`, "info");
        }
    }

    // Kỹ năng Tự Vệ Khống Chế Từ Phía Sau (Phím Q hoặc nút cảm ứng)
    performTakedown() {
        if (!this.player || !this.isRunning || this.isPaused || this.player.isDying) return;
        for (const guard of this.guards) {
            if (this.player.canTakedown(guard)) {
                guard.stun(720); // Choáng 12 giây
                this.score += 150;
                this.updateHUD();
                this.particles.addTakedownBurst(guard.x + guard.width / 2, guard.y + 10);
                this.triggerScreenNotice("🥋 Khống chế thành công! Mật thám bị bất tỉnh.", "info");
                if (typeof audio !== "undefined" && audio.playTone) {
                    audio.playTone(320, "triangle", 0.15, 0.25);
                    setTimeout(() => { if (audio.playTone) audio.playTone(480, "triangle", 0.2, 0.25); }, 80);
                }
                this.screenShake = 6;
                this.player.invulnerableTimer = 35;
                this.updateActionButtons();
                return;
            }
        }
    }

    // Trò chuyện & Nhận tiếp tế từ Đồng chí liên lạc bí mật
    interactWithNpc() {
        if (!this.nearNpc || this.isPaused || !this.isRunning) return;
        const npc = this.nearNpc;
        if (!npc.talked) {
            npc.talked = true;
            if (npc.giftType === "shield") {
                this.player.hasShield = true;
                this.particles.addFloatingText(npc.x + 14, npc.y - 30, "+ÁO TRẤN THỦ", "#10b981", 15, 170);
                this.triggerScreenNotice(`🤝 ${npc.name}: "${npc.quote}" (Nhận Áo Trấn Thủ!)`, "info");
            } else if (npc.giftType === "speed") {
                this.player.speedBoostTimer = 480;
                this.particles.addFloatingText(npc.x + 14, npc.y - 30, "+DÉP CAO SU", "#facc15", 15, 170);
                this.triggerScreenNotice(`🤝 ${npc.name}: "${npc.quote}" (Tăng tốc độ di chuyển!)`, "info");
            } else {
                this.hp = Math.min(this.maxHp, this.hp + 35);
                this.updateHUD();
                this.particles.addFloatingText(npc.x + 14, npc.y - 30, "+35 HP HỒI PHỤC", "#4ade80", 15, 170);
                this.triggerScreenNotice(`🤝 ${npc.name}: "${npc.quote}" (+35 HP Tiếp Tế)`, "info");
            }

            // Mở lối tắt bí mật nếu có
            if (npc.shortcutId) {
                for (const sc of this.shortcuts) {
                    if (sc.id === npc.shortcutId) {
                        sc.isOpen = true;
                        this.particles.addBurst(sc.x + sc.w / 2, sc.y + sc.h / 2, "#10b981", 24);
                        this.particles.addFloatingText(sc.x + sc.w / 2, sc.y - 20, "LỐI TẮT MỞ", "#10b981", 14, 160);
                    }
                }
            }

            if (typeof audio !== "undefined" && audio.playCollect) audio.playCollect();
        } else {
            this.triggerScreenNotice(`🤝 ${npc.name}: "${npc.quote}"`, "info");
        }
    }

    readNearDocument() {
        if (!this.nearDocument || this.nearDocument.collected || this.isPaused || !this.isRunning) return;
        const doc = this.nearDocument;
        doc.collected = true;
        doc.isNear = false;
        this.nearDocument = null;
        this.updateActionButtons();

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

    // Cập nhật trạng thái hiển thị của các nút hành động trên màn hình cảm ứng
    updateActionButtons() {
        const btnInteract = document.getElementById("btn-touch-interact");
        if (btnInteract) {
            if (this.nearDocument) {
                btnInteract.style.display = "flex";
                btnInteract.innerHTML = '<i class="fa-solid fa-book-open"></i><span class="btn-subtext">ĐỌC</span>';
            } else if (this.nearNpc) {
                btnInteract.style.display = "flex";
                btnInteract.innerHTML = '<i class="fa-solid fa-comments"></i><span class="btn-subtext">GẶP</span>';
            } else {
                btnInteract.style.display = "none";
            }
        }

        const btnTakedown = document.getElementById("btn-touch-takedown");
        if (btnTakedown) {
            btnTakedown.style.display = this.nearGuardForTakedown ? "flex" : "none";
        }
    }

    updateInteractBtn() {
        this.updateActionButtons();
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

        // Khởi tạo vật phẩm tiếp tế cách mạng mới (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang)
        this.supplies = (this.currentLevel.supplies || []).map(s => new SupplyItem(s));

        // Khởi tạo đồng chí liên lạc viên bí mật
        this.npcs = (this.currentLevel.npcs || []).map(n => new ComradeNPC(n));

        // Khởi tạo lối tắt / cầu bí mật
        this.shortcuts = (this.currentLevel.shortcuts || []).map(sc => ({ ...sc, isOpen: false }));

        this.bullets = [];
        this.pebbles = [];
        this.cameraX = 0;
        this.screenShake = 0;
        this.isPaused = false;
        this.maxHp = 100;
        this.hp = 100;
        this.starsCollectedCount = 0;
        this.score = this.chapterStartScore;
        this.nearDocument = null;
        this.nearNpc = null;
        this.nearGuardForTakedown = null;
        this.updateActionButtons();

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

        // Nếu người chơi đang có Áo Trấn Thủ (Khiên bảo vệ), đỡ trọn đòn sát thương này (ngoại trừ rơi vực sâu)
        if (this.player && this.player.hasShield && type !== "pit") {
            this.player.hasShield = false;
            this.player.invulnerableTimer = 45;
            this.particles.addShieldBreak(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
            this.particles.addFloatingText(this.player.x + this.player.width / 2, this.player.y - 25, "KHIÊN ĐỠ TRỌN!", "#38bdf8", 15, 150);
            this.triggerScreenNotice("🛡️ Áo Trấn Thủ đã đỡ trọn một đòn sát thương!", "info");
            if (typeof audio !== "undefined" && audio.playTone) {
                audio.playTone(320, "square", 0.15, 0.2);
            }
            return;
        }

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
            pebbles: this.pebbles,
            supplies: this.supplies,
            npcs: this.npcs,
            shortcuts: this.shortcuts,
            nearGuardForTakedown: this.nearGuardForTakedown,
            nearNpc: this.nearNpc,
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

        // 3. Cập nhật Sỏi nghi binh (Ném sỏi đánh lạc hướng)
        for (let i = this.pebbles.length - 1; i >= 0; i--) {
            const p = this.pebbles[i];
            const isDead = p.update(this.currentLevel.platforms, this.guards, this.particles);
            if (isDead) {
                this.pebbles.splice(i, 1);
            }
        }

        // 4. Cập nhật Đạn của mật thám
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

        // 5. Cập nhật Mật thám & Bắn súng
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

        // 6. Cập nhật Điểm lưu (Checkpoints)
        for (const cp of this.currentLevel.checkpoints) {
            if (!cp.reached && Math.abs(this.player.x - cp.x) < 40 && Math.abs(this.player.y - cp.y) < 70) {
                cp.reached = true;
                this.player.setCheckpoint(cp.x, cp.y - 10);
                this.particles.addBurst(cp.x, cp.y, "#fbbf24", 20);
                this.particles.addFloatingText(cp.x, cp.y - 35, "CHECKPOINT", "#10b981", 15, 170);
                audio.playTone(660, "triangle", 0.2, 0.15);
            }
        }

        // 7. Cập nhật Sao cách mạng (Stars)
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

        // 8. Cập nhật Vật phẩm tiếp tế cách mạng (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang, Lương Khô)
        for (const item of this.supplies) {
            item.update();
            if (!item.collected && item.checkCollect(this.player)) {
                item.collected = true;
                if (typeof audio !== "undefined" && audio.playCollect) audio.playCollect();

                if (item.type === "shield") {
                    this.player.hasShield = true;
                    this.particles.addFloatingText(item.x + 12, item.y - 25, "+ÁO TRẤN THỦ", "#10b981", 14, 160);
                    this.particles.addBurst(item.x + 12, item.y + 12, "#10b981", 20);
                    this.triggerScreenNotice("🛡️ Nhặt được Áo Trấn Thủ! Đỡ được 1 đòn sát thương.", "info");
                } else if (item.type === "speed") {
                    this.player.speedBoostTimer = 480; // 8 giây chạy vạn dặm
                    this.particles.addFloatingText(item.x + 12, item.y - 25, "+DÉP CAO SU", "#facc15", 14, 160);
                    this.particles.addBurst(item.x + 12, item.y + 12, "#facc15", 20);
                    this.triggerScreenNotice("⚡ Dép Cao Su Vạn Dặm: Tăng tốc độ chạy & nhảy trong 8 giây!", "info");
                } else if (item.type === "disguise") {
                    this.player.disguiseTimer = 720; // 12 giây cải trang
                    this.particles.addFloatingText(item.x + 12, item.y - 25, "+CẢI TRANG", "#c084fc", 14, 160);
                    this.particles.addBurst(item.x + 12, item.y + 12, "#c084fc", 20);
                    this.triggerScreenNotice("🎩 Cải Trang Thành Công: Mật thám không thể phát hiện từ xa trong 12s!", "info");
                } else if (item.type === "heal") {
                    this.hp = Math.min(this.maxHp, this.hp + 25);
                    this.updateHUD();
                    this.particles.addFloatingText(item.x + 12, item.y - 25, "+25 HP LƯƠNG KHÔ", "#4ade80", 14, 160);
                    this.particles.addBurst(item.x + 12, item.y + 12, "#4ade80", 20);
                    this.triggerScreenNotice("🥖 Nhặt được Lương Khô Cách Mạng! Hồi phục 25 HP.", "info");
                }
                this.score += 75;
                this.updateHUD();
            }
        }

        // 9. Cập nhật Đồng chí liên lạc viên bí mật
        let foundNearNpc = null;
        for (const npc of this.npcs) {
            npc.update(this.player);
            if (npc.isNear) {
                foundNearNpc = npc;
            }
        }
        this.nearNpc = foundNearNpc;

        // 10. Cập nhật Lối tắt bí mật (khi mở thì thêm platform vào bản đồ)
        for (const sc of this.shortcuts) {
            if (sc.isOpen && !sc.platformAdded) {
                this.currentLevel.platforms.push({
                    x: sc.x,
                    y: sc.y,
                    w: sc.w,
                    h: sc.h,
                    isShortcut: true
                });
                sc.platformAdded = true;
            }
        }

        // 11. Cập nhật Tài liệu văn kiện (Documents) - người chơi tự chọn bấm [E] mở hoặc lướt qua
        let foundNearDoc = null;
        for (const doc of this.documents) {
            doc.update();
            if (doc.checkNear(this.player)) {
                foundNearDoc = doc;
            }
        }
        this.nearDocument = foundNearDoc;

        // 12. Kiểm tra xem có thể thực hiện đòn khống chế (Takedown) mật thám sau lưng không
        let canTakedownAny = false;
        for (const guard of this.guards) {
            if (this.player.canTakedown(guard)) {
                canTakedownAny = true;
                break;
            }
        }
        this.nearGuardForTakedown = canTakedownAny;
        this.updateActionButtons();

        // 13. Cập nhật Hạt hiệu ứng & Chữ nổi
        this.particles.update();

        // 14. Kiểm tra Đích đến của màn chơi (Level Exit)
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

