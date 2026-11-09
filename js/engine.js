// Game Engine: Vòng lặp trò chơi, xử lý điều khiển, camera và va chạm

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
        this.screenShake = 0;
        this.score = 0;
        this.chapterStartScore = 0;
        this.starsCollectedCount = 0;
        this.detectedCount = 0;
        this.maxHp = 100;
        this.hp = 100;
        this.bullets = [];
        this.pebbles = [];
        this.supplies = [];
        this.npcs = [];
        this.shortcuts = [];
        this.nearNpc = null;
        this.nearGuardForTakedown = null;

        this.playTime = 0;
        this.chapterStartTime = 0;
        this.nearDocument = null;

        this.isRunning = false;
        this.isPaused = false;
        this.animationFrameId = null;

        this.initInputListeners();
    }

    initInputListeners() {
        const isTypingTarget = (e) => {
            const t = e.target;
            return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
        };

        window.addEventListener("keydown", (e) => {
            if (isTypingTarget(e)) return;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
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

            if (e.repeat) return;

            // Phím E: Tương tác văn kiện hoặc NPC
            if (e.key.toLowerCase() === "e") {
                if (this.nearDocument) {
                    this.readNearDocument();
                } else if (this.nearNpc) {
                    this.interactWithNpc();
                }
            }

            // Phím F: Ném sỏi đánh lạc hướng
            if (e.key.toLowerCase() === "f") {
                this.throwPebble();
            }

            // Phím Q: Khống chế lính sau lưng
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

        // Điều khiển cảm ứng trên mobile
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

        bindTouchBtn("btn-touch-interact", () => {
            if (this.nearDocument) {
                this.readNearDocument();
            } else if (this.nearNpc) {
                this.interactWithNpc();
            }
        }, () => {});

        bindTouchBtn("btn-touch-distract", () => this.throwPebble(), () => {});
        bindTouchBtn("btn-touch-takedown", () => this.performTakedown(), () => {});

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

    throwPebble() {
        if (!this.player || !this.isRunning || this.isPaused || this.player.isDying) return;
        const pebble = this.player.throwPebble();
        if (pebble) {
            this.pebbles.push(pebble);
        }
    }

    // Khống chế mật thám từ sau lưng
    performTakedown() {
        if (!this.player || !this.isRunning || this.isPaused || this.player.isDying) return;
        if (this.player.takedownCooldown > 0) return;

        for (const guard of this.guards) {
            if (this.player.canTakedown(guard)) {
                this.player.takedownCooldown = this.player.maxTakedownCooldown;
                this.player.actionAnimTimer = 20;
                this.player.actionAnimType = "takedown";
                this.player.scaleX = 1.25;
                this.player.scaleY = 0.84;
                guard.stun(720);
                guard.timesTakenDown++;

                const isFirstTime = guard.timesTakenDown === 1;
                if (isFirstTime) {
                    this.score += 150;
                    this.updateHUD();
                }
                this.particles.addTakedownBurst(
                    guard.x + guard.width / 2,
                    guard.y + 10,
                    isFirstTime ? "💥 +150" : "💫"
                );
                if (typeof audio !== "undefined" && audio.playTakedown) {
                    audio.playTakedown();
                }
                this.screenShake = 6;
                this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer, 35);
                return;
            }
        }
    }

    // Áp dụng hiệu ứng vật phẩm
    applySupplyEffect(type, x, y) {
        const p = this.player;
        if (!p) return "";
        if (type === "shield") {
            p.hasShield = true;
            this.particles.addFloatingText(x, y, "🛡️ +1", "#10b981", 15, 95);
            this.particles.addBurst(x, y + 30, "#10b981", 18);
            return "🛡️";
        }
        if (type === "speed") {
            p.speedBoostTimer = 480;
            this.particles.addFloatingText(x, y, "⚡ 8s", "#facc15", 15, 95);
            this.particles.addBurst(x, y + 30, "#facc15", 18);
            return "⚡";
        }
        if (type === "disguise") {
            p.disguiseTimer = 720;
            this.particles.addFloatingText(x, y, "🎭 12s", "#c084fc", 15, 95);
            this.particles.addBurst(x, y + 30, "#c084fc", 18);
            return "🎭";
        }
        // Hồi máu
        this.hp = Math.min(this.maxHp, this.hp + 25);
        this.updateHUD();
        this.particles.addFloatingText(x, y, "❤️ +25", "#4ade80", 15, 95);
        this.particles.addBurst(x, y + 30, "#4ade80", 18);
        return "❤️";
    }

    // Tương tác NPC
    interactWithNpc() {
        if (!this.nearNpc || this.isPaused || !this.isRunning || !this.player || this.player.isDying) return;
        const npc = this.nearNpc;
        if (!npc.talked) {
            const cost = npc.starCost || 3;
            if (this.starsCollectedCount < cost) {
                if (typeof audio !== "undefined" && audio.playLocked) {
                    audio.playLocked();
                }
                this.particles.addFloatingText(
                    npc.x + 14,
                    npc.y - 26,
                    `🔒 ★ ${this.starsCollectedCount}/${cost}`,
                    "#f87171",
                    14,
                    90
                );
                return;
            }

            this.starsCollectedCount -= cost;
            npc.talked = true;
            this.updateHUD();

            this.applySupplyEffect(npc.giftType, npc.x + 14, npc.y - 30);

            if (npc.shortcutId) {
                for (const sc of this.shortcuts) {
                    if (sc.id === npc.shortcutId) {
                        sc.isOpen = true;
                        this.particles.addBurst(sc.x + sc.w / 2, sc.y + sc.h / 2, "#10b981", 24);
                        this.particles.addFloatingText(sc.x + sc.w / 2, sc.y - 18, "🔓", "#10b981", 16, 110);
                    }
                }
            }

            if (typeof audio !== "undefined" && audio.playUnlock) audio.playUnlock();
        }
    }

    readNearDocument() {
        if (!this.nearDocument || this.nearDocument.collected || this.isPaused || !this.isRunning) return;
        const doc = this.nearDocument;
        doc.collected = true;
        doc.isNear = false;
        this.nearDocument = null;
        this.updateActionButtons();

        if (typeof audio !== "undefined" && audio.playKey) {
            audio.playKey();
        }
        this.particles.addBurst(doc.x + 14, doc.y + 16, "#fbbf24", 24);
        this.particles.addFloatingText(doc.x + 14, doc.y - 20, "📜", "#fbbf24", 16, 90);

        this.pause();
        if (this.onDocumentFound) {
            this.onDocumentFound(doc.docId);
        }
    }

    // Cập nhật trạng thái các nút ảo trên mobile
    updateActionButtons() {
        if (!this._btnState) this._btnState = {};
        const st = this._btnState;

        const interactMode = this.nearDocument ? "doc" : (this.nearNpc ? "npc" : "none");
        if (st.interact !== interactMode) {
            st.interact = interactMode;
            const btnInteract = document.getElementById("btn-touch-interact");
            if (btnInteract) {
                if (interactMode === "doc") {
                    btnInteract.style.display = "flex";
                    btnInteract.innerHTML = '<i class="fa-solid fa-book-open"></i><span class="btn-subtext">ĐỌC</span>';
                } else if (interactMode === "npc") {
                    btnInteract.style.display = "flex";
                    btnInteract.innerHTML = '<i class="fa-solid fa-comments"></i><span class="btn-subtext">GẶP</span>';
                } else {
                    btnInteract.style.display = "none";
                }
            }
        }

        const takedownVisible = !!this.nearGuardForTakedown;
        const takedownCooling = !!(this.player && this.player.takedownCooldown > 0);
        const btnTakedown = document.getElementById("btn-touch-takedown");
        if (st.takedown !== takedownVisible) {
            st.takedown = takedownVisible;
            if (btnTakedown) btnTakedown.style.display = takedownVisible ? "flex" : "none";
        }
        if (st.takedownCooling !== takedownCooling) {
            st.takedownCooling = takedownCooling;
            if (btnTakedown) btnTakedown.classList.toggle("cooling", takedownCooling);
        }

        const cooling = !!(this.player && this.player.pebbleCooldown > 0);
        if (st.cooling !== cooling) {
            st.cooling = cooling;
            const btnDistract = document.getElementById("btn-touch-distract");
            if (btnDistract) btnDistract.classList.toggle("cooling", cooling);
        }
    }

    updateInteractBtn() {
        this.updateActionButtons();
    }

    loadLevel(levelIndex) {
        this.levelIndex = levelIndex;
        const levelData = LEVELS[levelIndex];
        this.currentLevel = JSON.parse(JSON.stringify(levelData));

        this.player = new Player(this.currentLevel.startPos.x, this.currentLevel.startPos.y);
        this.guards = this.currentLevel.guards.map(g => new Guard(g));
        this.documents = this.currentLevel.documents.map(d => new DocumentItem(d));
        this.stars = this.currentLevel.stars.map(s => new StarItem(s.x, s.y));
        this.supplies = (this.currentLevel.supplies || []).map(s => new SupplyItem(s));
        this.npcs = (this.currentLevel.npcs || []).map(n => new ComradeNPC(n));
        this.shortcuts = (this.currentLevel.shortcuts || []).map(sc => ({ ...sc, isOpen: false }));

        this.bullets = [];
        this.pebbles = [];
        this.cameraX = 0;
        this.screenShake = 0;
        this.isPaused = false;
        this.maxHp = 100;
        this.hp = 100;
        this.starsCollectedCount = 0;
        this.nearDocument = null;
        this.nearNpc = null;
        this.nearGuardForTakedown = null;
        this.updateActionButtons();

        if (levelIndex === 0) {
            this.playTime = 0;
            this.chapterStartTime = 0;
            this.score = 0;
            this.chapterStartScore = 0;
        } else {
            this.chapterStartTime = this.playTime;
        }
        this.score = this.chapterStartScore;
        this.updateHUD();
    }

    // Xử lý sát thương người chơi
    handlePlayerDamage(type, amount = 25, label = "") {
        if (this.hp <= 0) return;

        // Có khiên thì đỡ 1 đòn
        if (this.player && this.player.hasShield && type !== "pit") {
            this.player.hasShield = false;
            this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer, 45);
            this.particles.addShieldBreak(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
            this.particles.addFloatingText(this.player.x + this.player.width / 2, this.player.y - 25, "🛡️", "#38bdf8", 16, 95);
            if (typeof audio !== "undefined" && audio.playTone) {
                audio.playTone(320, "square", 0.15, 0.2);
            }
            return;
        }

        this.hp = Math.max(0, this.hp - amount);
        this.updateHUD();

        let text = `💔 -${amount}`;

        let px = this.player ? this.player.x + this.player.width / 2 : 200;
        let py = this.player ? this.player.y - 22 : 200;
        if (type === "pit" && this.player) {
            px = this.player.checkpointX + this.player.width / 2;
            py = this.player.checkpointY - 25;
        }

        this.particles.addFloatingText(px, py, text, "#ef4444", 15, 105);

        if (this.hp <= 0) {
            this.particles.addFloatingText(px, py - 28, "💀 0 HP", "#ef4444", 16, 140);
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
        this.lastTime = performance.now();
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
            starsCount: this.starsCollectedCount,
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

        // Đồng hồ thời gian thực
        const now = performance.now();
        if (this.lastTime) {
            const dt = (now - this.lastTime) / 1000;
            if (dt > 0 && dt < 0.5) {
                this.playTime += dt;
            }
        }
        this.lastTime = now;

        const currentSec = Math.floor(this.playTime);
        if (this._lastHudSec !== currentSec) {
            this._lastHudSec = currentSec;
            const timerEl = document.getElementById("hud-timer");
            if (timerEl) timerEl.innerText = this.getFormattedTime();
        }

        if (this.screenShake > 0) {
            this.screenShake *= 0.88;
            if (this.screenShake < 0.2) this.screenShake = 0;
        }

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

        // Cập nhật Player
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
                this.player.invulnerableTimer = 65;
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

        // Cập nhật Camera
        const scale = this.canvas.height > 0 ? this.canvas.height / 600 : 1;
        const virtualWidth = this.canvas.width / scale;
        const targetCameraX = this.player.x - virtualWidth * 0.35;
        this.cameraX += (targetCameraX - this.cameraX) * 0.08;
        if (this.cameraX < 0) this.cameraX = 0;
        const maxCameraX = Math.max(0, this.currentLevel.levelWidth - virtualWidth);
        if (this.cameraX > maxCameraX) this.cameraX = maxCameraX;

        // Cập nhật Sỏi
        for (let i = this.pebbles.length - 1; i >= 0; i--) {
            const p = this.pebbles[i];
            const isDead = p.update(this.currentLevel.platforms, this.guards, this.particles);
            if (isDead) {
                this.pebbles.splice(i, 1);
            }
        }

        // Cập nhật Đạn
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            const bRes = b.update(this.currentLevel.platforms);
            if (bRes && (bRes.hitObstacle || bRes.expired)) {
                this.particles.addBurst(b.x, b.y, "#fde047", 6);
                this.bullets.splice(i, 1);
                continue;
            }

            if (b.checkHitPlayer(this.player)) {
                audio.playHit();
                this.screenShake = 12;
                this.particles.addHitShockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                this.player.invulnerableTimer = 60;
                this.handlePlayerDamage("bullet", b.damage || 25);
                this.bullets.splice(i, 1);
            }
        }

        // Cập nhật Mật thám
        for (const guard of this.guards) {
            const shot = guard.update(this.player, this.currentLevel.platforms);
            if (shot && shot.fired) {
                audio.playGunshot();
                this.bullets.push(new Bullet(shot.x, shot.y, shot.dir));
                this.particles.addMuzzleFlash(shot.x, shot.y, shot.dir);
            }

            if (!this.player.isDying && this.player.invulnerableTimer === 0 && !this.player.isHidden && guard.stunTimer <= 0) {
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

        // Cập nhật Checkpoint
        for (const cp of this.currentLevel.checkpoints) {
            if (!cp.reached && !this.player.isDying && Math.abs(this.player.x - cp.x) < 42 && this.player.y <= cp.y + 70 && this.player.y >= cp.y - 140) {
                cp.reached = true;
                this.player.setCheckpoint(cp.x, cp.y - 10);
                this.particles.addBurst(cp.x, cp.y, "#fbbf24", 20);
                this.particles.addFloatingText(cp.x, cp.y - 32, "🚩", "#10b981", 16, 100);
                if (typeof audio !== "undefined" && audio.playKey) audio.playKey();
            }
        }

        // Cập nhật Sao
        for (const star of this.stars) {
            star.update();
            if (star.checkCollect(this.player)) {
                audio.playCollect();
                this.score += 50;
                this.starsCollectedCount++;
                this.particles.addBurst(star.x, star.y, "#fbbf24", 14);
                this.particles.addFloatingText(star.x, star.y - 20, "★ +1", "#fbbf24", 14, 90);
                this.hp = Math.min(this.maxHp, this.hp + 5);
                this.updateHUD();
            }
        }

        // Cập nhật Vật phẩm
        for (const item of this.supplies) {
            item.update();
            if (!item.collected && item.checkCollect(this.player)) {
                item.collected = true;
                if (typeof audio !== "undefined" && audio.playPowerup) audio.playPowerup();

                this.applySupplyEffect(item.type, item.x + 12, item.y - 22);
                this.score += 75;
                this.updateHUD();
            }
        }

        // Cập nhật NPC
        let foundNearNpc = null;
        for (const npc of this.npcs) {
            npc.update(this.player);
            if (npc.isNear) {
                foundNearNpc = npc;
            }
        }
        this.nearNpc = foundNearNpc;

        // Cập nhật Lối tắt
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

        // Cập nhật Văn kiện
        let foundNearDoc = null;
        for (const doc of this.documents) {
            doc.update();
            if (doc.checkNear(this.player)) {
                foundNearDoc = doc;
            }
        }
        this.nearDocument = foundNearDoc;

        // Kiểm tra khả năng khống chế lính
        let canTakedownAny = false;
        for (const guard of this.guards) {
            if (this.player.canTakedown(guard)) {
                canTakedownAny = true;
                break;
            }
        }
        this.nearGuardForTakedown = canTakedownAny;
        this.updateActionButtons();

        this.particles.update();

        // Kiểm tra đích đến
        const exitX = this.currentLevel.exitPos.x;
        const exitY = this.currentLevel.exitPos.y;
        const pCenterX = this.player.x + this.player.width / 2;
        const pCenterY = this.player.y + this.player.height / 2;

        const inExitZone = (
            pCenterX >= exitX - 30 &&
            pCenterX <= exitX + 160 &&
            Math.abs(pCenterY - (exitY + 20)) < 120
        );

        if (inExitZone) {
            this.pause();
            this.chapterStartScore = this.score;
            audio.playLevelComplete();
            if (this.onLevelVictory) {
                this.onLevelVictory(this.levelIndex);
            }
        }
    }

    triggerScreenNotice(text, type = "info", duration = 2500) {
        const noticeEl = document.getElementById("game-notice");
        if (!noticeEl) return;
        if (this._noticeTimer) clearTimeout(this._noticeTimer);
        noticeEl.innerText = text;
        noticeEl.className = `notice-badge show ${type}`;
        this._noticeTimer = setTimeout(() => {
            noticeEl.className = "notice-badge";
            this._noticeTimer = null;
        }, duration);
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
            hpTextEl.innerText = `${this.hp}`;

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

