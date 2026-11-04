// Các thực thể trong Game: Người chơi, Mật thám, Vật phẩm, Hạt hiệu ứng

class Player {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 48;
        this.normalHeight = 48;
        this.crouchHeight = 28;

        this.vx = 0;
        this.vy = 0;
        this.speed = 1.85; // Tốc độ di chuyển chuẩn mực, vừa vặn, không quá nhanh để dễ kiểm soát bước chân
        this.jumpForce = -10.4;
        this.gravity = 0.46;
        this.maxFallSpeed = 11;

        this.onGround = false;
        this.wasOnGround = false;
        this.jumpsLeft = 2; // Hỗ trợ Nhảy đúp (Double Jump)
        this.isCrouching = false;
        this.isHidden = false;
        this.facing = 1; // 1: phải, -1: trái

        this.checkpointX = x;
        this.checkpointY = y;

        this.animTimer = 0;
        this.animFrame = 0;
        this.invulnerableTimer = 0;

        // Chuẩn game thiết kế chuyên nghiệp: Coyote Time & Jump Buffering
        this.coyoteTimer = 0;       // Thời gian ân hạn nhảy khi vừa rời mép vực (6 frames)
        this.jumpBufferTimer = 0;   // Lưu phím bấm nhảy trước khi chạm đất (6 frames)

        // Trạng thái trúng đòn / rơi bẫy (Death sequence với hit-knockback & nảy lên)
        this.isDying = false;
        this.deathTimer = 0;
        this.deathCause = null;
    }

    startDeath(cause = "hazard") {
        if (this.isDying) {
            if (cause === "hp_depleted") {
                this.deathCause = "hp_depleted";
            }
            return;
        }
        this.isDying = true;
        this.deathTimer = 22; // ~0.36 giây hiệu ứng văng nảy trước khi hồi sinh
        this.deathCause = cause;
        this.vy = -5.8; // Bật nảy lên không trung như Mario / Celeste khi trúng bẫy
        this.vx = -this.facing * 1.8; // Bị đẩy giật lùi về sau
        this.invulnerableTimer = 0;
    }

    resetToCheckpoint() {
        this.x = this.checkpointX;
        this.y = this.checkpointY;
        this.vx = 0;
        this.vy = 0;
        this.isDying = false;
        this.deathTimer = 0;
        this.deathCause = null;
        this.invulnerableTimer = 90; // ~1.5 giây nhấp nháy bất tử bảo vệ sau khi spawn
    }

    setCheckpoint(x, y) {
        this.checkpointX = x;
        this.checkpointY = y;
    }

    jump() {
        if (this.isDying) return false;
        // Ghi nhận jump buffer (người chơi bấm nhảy trước khi chạm sàn)
        this.jumpBufferTimer = 6;
        return this.executeJump();
    }

    executeJump() {
        if (this.isDying) return false;

        // 1. Nhảy từ mặt đất HOẶC Coyote Time (vừa bước hụt mép vực trong vòng 6 frames)
        if (this.onGround || this.coyoteTimer > 0) {
            this.vy = this.jumpForce;
            if (typeof audio !== "undefined" && audio.playJump) audio.playJump();
            this.jumpsLeft = 1; // Còn 1 lần nhảy đúp trên không
            this.onGround = false;
            this.coyoteTimer = 0;
            this.jumpBufferTimer = 0;
            return { jumped: true, isDouble: false };
        }
        // 2. Nhảy đúp trên không (Double Jump)
        else if (this.jumpsLeft > 0) {
            this.vy = this.jumpForce * 0.96;
            if (typeof audio !== "undefined" && audio.playDoubleJump) audio.playDoubleJump();
            this.jumpsLeft--;
            this.jumpBufferTimer = 0;
            return { jumped: true, isDouble: true };
        }
        return false;
    }

    setCrouch(crouch) {
        if (this.isDying) return;
        if (crouch && !this.isCrouching) {
            this.isCrouching = true;
            this.height = this.crouchHeight;
            this.y += (this.normalHeight - this.crouchHeight);
        } else if (!crouch && this.isCrouching) {
            this.isCrouching = false;
            this.y -= (this.normalHeight - this.crouchHeight);
            this.height = this.normalHeight;
        }
    }

    update(controls, platforms, hazards, hidingSpots, levelWidth, levelHeight) {
        const events = {};

        // Xử lý hiệu ứng trúng bẫy / va chạm mật thám (Death sequence)
        if (this.isDying) {
            this.deathTimer--;
            this.vy += this.gravity * 0.85;
            this.x += this.vx;
            this.y += this.vy;

            if (this.deathTimer <= 0) {
                if (this.deathCause === "hp_depleted") {
                    this.deathTimer = 0;
                    return null; // Giữ nguyên trạng thái nằm gục chờ Game Over modal hiển thị mượt mà
                }
                this.resetToCheckpoint();
                return { respawned: true };
            }
            return null;
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        // Kiểm tra xem người chơi có đang đứng trên bề mặt tuyết/băng trơn trượt (Màn 2 Moskva) hay không
        let onIce = false;
        for (const plat of platforms) {
            if (plat.type === "snow_brick" || plat.type === "ice") {
                if (this.x + this.width > plat.x && this.x < plat.x + plat.w && Math.abs((this.y + this.height) - plat.y) <= 6) {
                    onIce = true;
                    break;
                }
            }
        }

        // Cập nhật Coyote Time khi rơi khỏi mép vực
        if (this.onGround) {
            this.coyoteTimer = 6;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer--;
        }

        // Kiểm tra Jump Buffer nếu người chơi bấm nhảy trước khi chạm sàn
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer--;
            if (this.onGround || this.coyoteTimer > 0) {
                const jRes = this.executeJump();
                if (jRes && jRes.jumped) {
                    events.jumpDust = { x: this.x + this.width / 2, y: this.y + this.height };
                }
            }
        }

        // Điều khiển ngang với hiệu ứng quán tính trượt chân thực trên băng
        let moveDir = 0;
        if (controls.left) moveDir -= 1;
        if (controls.right) moveDir += 1;

        if (moveDir !== 0) {
            this.facing = moveDir;
            const currentSpeed = this.isCrouching ? this.speed * 0.55 : this.speed;

            if (onIce) {
                // Trên băng tuyết: nếu đang có đà ngược hướng phím -> trượt lết phanh trước khi đổi chiều
                if (Math.sign(this.vx) !== 0 && Math.sign(this.vx) !== moveDir) {
                    this.vx += moveDir * 0.22;
                    events.iceSkid = { x: this.x + this.width / 2, y: this.y + this.height, dir: -moveDir };
                } else {
                    // Tăng tốc dần tạo cảm giác trơn trượt tự nhiên
                    this.vx += moveDir * 0.14;
                }

                // Cho phép trượt băng đạt tốc độ lướt sảng khoái (1.15x)
                const maxIceSpeed = this.isCrouching ? this.speed * 0.6 : this.speed * 1.15;
                if (Math.abs(this.vx) > maxIceSpeed) {
                    this.vx = Math.sign(this.vx) * maxIceSpeed;
                }
            } else {
                // Mặt đất thông thường: kiểm soát dứt khoát, chính xác
                this.vx = moveDir * currentSpeed;
            }

            this.animTimer++;
            if (this.animTimer > 6) {
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }
        } else {
            if (onIce) {
                // Trượt lướt đà dài trên băng tuyết (~1s) trước khi dừng hẳn
                this.vx *= 0.978;
                if (Math.abs(this.vx) < 0.08) this.vx = 0;
            } else {
                this.vx = 0;
            }
            this.animFrame = 0;
        }

        // Cúi / Trượt né đèn
        this.setCrouch(controls.down);

        // Trọng lực
        const prevVy = this.vy;
        this.vy += this.gravity;
        if (this.vy > this.maxFallSpeed) this.vy = this.maxFallSpeed;

        // Di chuyển trục X và va chạm nền tảng
        this.x += this.vx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > levelWidth) this.x = levelWidth - this.width;

        for (const plat of platforms) {
            if (this.checkCollision(this, plat)) {
                if (this.vx > 0) {
                    this.x = plat.x - this.width;
                    if (onIce) this.vx = 0;
                } else if (this.vx < 0) {
                    this.x = plat.x + plat.w;
                    if (onIce) this.vx = 0;
                }
            }
        }

        // Di chuyển trục Y và va chạm nền tảng
        this.y += this.vy;
        this.wasOnGround = this.onGround;
        this.onGround = false;

        for (const plat of platforms) {
            if (this.checkCollision(this, plat)) {
                // Rơi từ trên xuống sàn
                if (this.vy > 0 && (this.y + this.height - this.vy) <= plat.y + 12) {
                    this.y = plat.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                    this.jumpsLeft = 2; // Hồi lại 2 lượt nhảy

                    // Bụi tiếp đất nếu vừa rơi từ độ cao xuống
                    if (!this.wasOnGround && prevVy > 3.2) {
                        events.landDust = { x: this.x + this.width / 2, y: this.y + this.height };
                    }
                } else if (this.vy < 0) { // Va đầu vào trần dưới
                    this.y = plat.y + plat.h;
                    this.vy = 0;
                }
            }
        }

        // Kiểm tra rơi xuống vực đáy màn hình -> kích hoạt chuỗi văng/rơi
        if (this.y > levelHeight + 35) {
            this.startDeath("pit");
            events.fellInPit = true;
            return events;
        }

        // Kiểm tra dẫm vào cạm bẫy hazards (nếu không trong thời gian bất tử)
        if (this.invulnerableTimer === 0) {
            for (const haz of hazards) {
                if (this.checkCollision(this, { x: haz.x, y: haz.y, w: haz.w, h: haz.h })) {
                    this.startDeath("hazard");
                    events.hitHazard = true;
                    events.label = haz.label;
                    return events;
                }
            }
        }

        // Kiểm tra vị trí nấp
        let inSpot = false;
        for (const spot of hidingSpots) {
            if (this.checkCollision(this, { x: spot.x, y: spot.y, w: spot.w, h: spot.h })) {
                inSpot = true;
                break;
            }
        }
        
        if (inSpot && !this.isHidden) {
            if (typeof audio !== "undefined" && audio.playHide) audio.playHide();
        }
        this.isHidden = inSpot;

        return Object.keys(events).length > 0 ? events : null;
    }

    checkCollision(rect1, rect2) {
        if (!rect1 || !rect2) return false;
        const w1 = rect1.width ?? rect1.w ?? 0;
        const h1 = rect1.height ?? rect1.h ?? 0;
        const w2 = rect2.width ?? rect2.w ?? 0;
        const h2 = rect2.height ?? rect2.h ?? 0;
        return (
            rect1.x < rect2.x + w2 &&
            rect1.x + w1 > rect2.x &&
            rect1.y < rect2.y + h2 &&
            rect1.y + h1 > rect2.y
        );
    }
}

class Bullet {
    constructor(x, y, dir, speed = 7.8) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.vx = dir * speed;
        this.width = 12;
        this.height = 4;
        this.w = 12;
        this.h = 4;
        this.life = 120; // Tồn tại 2 giây
        this.damage = 25; // Gây trừ 25 HP
    }

    update(platforms) {
        this.x += this.vx;
        this.life--;

        // Đạn va chạm chướng ngại vật/mặt đất -> tan biến
        for (const plat of platforms) {
            const pw = plat.w ?? plat.width ?? 0;
            const ph = plat.h ?? plat.height ?? 0;
            if (this.x < plat.x + pw &&
                this.x + this.width > plat.x &&
                this.y < plat.y + ph &&
                this.y + this.height > plat.y) {
                return { hitObstacle: true };
            }
        }

        if (this.life <= 0) return { expired: true };
        return null;
    }

    checkHitPlayer(player) {
        if (!player || player.invulnerableTimer > 0 || player.isHidden || player.isDying) return false;
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}

class Guard {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.width = 30;
        this.height = 48;
        this.w = 30;
        this.h = 48;
        this.minX = config.minX;
        this.maxX = config.maxX;
        this.speed = config.speed ? Math.min(config.speed, 0.85) : 0.75;
        this.dir = config.dir || 1;
        // Giảm mạnh tầm quét đèn theo yêu cầu (95 - 110 px)
        this.visionRange = config.range ? Math.min(115, Math.max(85, config.range)) : 95;
        this.visionAngle = 0.28; // Nón sáng hẹp gọn gàng (~16 độ)
        this.animTimer = 0;
        this.animFrame = 0;
        this.crouchSuspicionTimer = 0;
        this.isAlerted = false;

        // Cơ chế ngắm & bắn súng khi phát hiện người chơi
        this.isAiming = false;
        this.aimTimer = 0; // Đếm thời gian ngắm (~24 frames) trước khi bóp cò
        this.shootCooldown = 0; // Giãn cách giữa các loạt đạn
        this.muzzleFlashTimer = 0;
        this.lostPlayerTimer = 0;
    }

    update(player, platforms) {
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.muzzleFlashTimer > 0) this.muzzleFlashTimer--;

        let shotResult = null;
        const seesPlayer = player && this.detectsPlayer(player);

        if (seesPlayer) {
            // Khi vừa phát hiện lần đầu
            if (!this.isAiming && typeof audio !== "undefined" && audio.playAlert) {
                audio.playAlert();
            }

            this.lostPlayerTimer = 0;
            this.isAiming = true;
            this.isAlerted = true;

            // Xoay súng về phía người chơi
            const playerCenterX = player.x + player.width / 2;
            const guardCenterX = this.x + this.width / 2;
            this.dir = playerCenterX >= guardCenterX ? 1 : -1;

            // Ngắm bắn nhanh nhạy sau 14 frames (~0.23s)
            this.aimTimer++;
            if (this.aimTimer >= 14 && this.shootCooldown <= 0) {
                this.shootCooldown = 40; // Giãn cách bắn nhanh hơn (~0.66s giữa các loạt đạn)
                this.muzzleFlashTimer = 6;
                this.aimTimer = 0;

                const gunX = this.dir === 1 ? this.x + this.width + 10 : this.x - 10;
                const gunY = this.y + 16;
                shotResult = {
                    fired: true,
                    x: gunX,
                    y: gunY,
                    dir: this.dir
                };
            }
        } else {
            // Người chơi đã nấp an toàn hoặc chạy thoát khỏi tầm nhìn
            if (this.isAiming) {
                this.lostPlayerTimer++;
                // Sau ~35 frames không thấy, hạ súng và quay lại tuần tra
                if (this.lostPlayerTimer > 35) {
                    this.isAiming = false;
                    this.isAlerted = false;
                    this.aimTimer = 0;
                }
            } else {
                // Tuần tra bình thường
                this.x += this.speed * this.dir;
                if (this.x >= this.maxX) {
                    this.x = this.maxX;
                    this.dir = -1;
                } else if (this.x <= this.minX) {
                    this.x = this.minX;
                    this.dir = 1;
                }

                this.animTimer++;
                if (this.animTimer > 8) {
                    this.animFrame = (this.animFrame + 1) % 4;
                    this.animTimer = 0;
                }
            }
        }

        return shotResult;
    }

    // Kiểm tra xem người chơi có bị nón đèn quét trúng hay không
    detectsPlayer(player) {
        if (!player || player.isHidden || player.invulnerableTimer > 0) {
            this.crouchSuspicionTimer = Math.max(0, this.crouchSuspicionTimer - 2);
            if (!this.isAiming) this.isAlerted = false;
            return false;
        }

        const eyeX = this.dir === 1 ? this.x + this.width : this.x;
        const eyeY = this.y + 16;

        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        const dx = playerCenterX - eyeX;
        const dy = playerCenterY - eyeY;
        const dist = Math.hypot(dx, dy);

        // Nằm ngoài tầm quét đèn đã thu hẹp
        if (dist > this.visionRange) {
            this.crouchSuspicionTimer = Math.max(0, this.crouchSuspicionTimer - 2);
            return false;
        }

        // Ngược hướng nhìn của mật thám
        if ((this.dir === 1 && dx < 0) || (this.dir === -1 && dx > 0)) {
            this.crouchSuspicionTimer = Math.max(0, this.crouchSuspicionTimer - 2);
            return false;
        }

        // Góc nhìn tương đối hoặc cự ly rất gần cùng độ cao
        const angleToPlayer = Math.abs(Math.atan2(dy, Math.abs(dx)));
        const inCloseRange = dist < 45 && Math.abs(dy) < 32;

        if (angleToPlayer < this.visionAngle || inCloseRange) {
            if (!player.isCrouching) {
                this.crouchSuspicionTimer = 0;
                this.isAlerted = true;
                return true;
            } else {
                // Đang cúi người né đèn: nếu ngồi trước mắt quá lâu mới bị nghi ngờ
                const rate = dist < 55 ? 2 : 1;
                this.crouchSuspicionTimer += rate;

                if (this.crouchSuspicionTimer > 40) {
                    this.isAlerted = true;
                }

                if (this.crouchSuspicionTimer >= 95) {
                    this.crouchSuspicionTimer = 0;
                    this.isAlerted = true;
                    return true;
                }

                return false;
            }
        }

        this.crouchSuspicionTimer = Math.max(0, this.crouchSuspicionTimer - 2);
        return false;
    }
}

class DocumentItem {
    constructor(config) {
        this.docId = config.docId;
        this.x = config.x;
        this.y = config.y;
        this.baseY = config.y;
        this.width = 28;
        this.height = 34;
        this.collected = false;
        this.isNear = false;
        this.bobTime = Math.random() * Math.PI * 2;
    }

    update() {
        if (this.collected) return;
        this.bobTime += 0.05;
        this.y = this.baseY + Math.sin(this.bobTime) * 6;
    }

    // Kiểm tra xem người chơi có đang đứng gần để hiện nút/phím [E] mở văn kiện không
    checkNear(player) {
        if (this.collected || !player) {
            this.isNear = false;
            return false;
        }
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const docCenterX = this.x + this.width / 2;
        const docCenterY = this.y + this.height / 2;

        const isClose = Math.abs(pCenterX - docCenterX) < 48 && Math.abs(pCenterY - docCenterY) < 56;
        this.isNear = isClose;
        return isClose;
    }
}

class StarItem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.radius = 10;
        this.collected = false;
        this.bobTime = Math.random() * Math.PI * 2;
    }

    update() {
        if (this.collected) return;
        this.bobTime += 0.06;
        this.y = this.baseY + Math.sin(this.bobTime) * 4;
    }

    checkCollect(player) {
        if (this.collected) return false;
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const dist = Math.hypot(pCenterX - this.x, pCenterY - this.y);
        if (dist < this.radius + 18) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    // Huy hiệu / chữ số nổi phong cách Arcade Retro (Lưu lại lâu ~2.6 giây, rõ nét, trôi chậm)
    addFloatingText(x, y, text, color = "#fbbf24", fontSize = 15, duration = 160) {
        this.floatingTexts.push({
            x,
            y,
            text,
            color,
            fontSize,
            vy: -0.45,
            duration,
            life: duration,
            alpha: 1.0
        });
    }

    // Tia lửa đầu nòng súng khi mật thám bóp cò
    addMuzzleFlash(x, y, dir) {
        for (let i = 0; i < 7; i++) {
            const angle = (dir === 1 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.75;
            const speed = 2.2 + Math.random() * 3.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2.5,
                color: Math.random() > 0.4 ? "#fde047" : "#f97316",
                alpha: 1,
                decay: 0.12
            });
        }
    }

    addBurst(x, y, color = "#fbbf24", count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: 2 + Math.random() * 4,
                color,
                alpha: 1,
                decay: 0.025 + Math.random() * 0.02
            });
        }
    }

    // Hiệu ứng bụi nhẹ khi nhảy hoặc tiếp đất
    addDust(x, y, count = 4, color = "rgba(226, 232, 240, 0.75)") {
        for (let i = 0; i < count; i++) {
            const vx = (Math.random() - 0.5) * 2.2;
            const vy = -0.4 - Math.random() * 1.2;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 14,
                y: y - 2,
                vx,
                vy,
                size: 2 + Math.random() * 3,
                color,
                alpha: 0.75,
                decay: 0.04 + Math.random() * 0.03
            });
        }
    }

    // Hiệu ứng tia tuyết bắn ra khi trượt trên băng (Moskva)
    addSnowSpray(x, y, dir = 1) {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y - 2,
                vx: dir * (1.2 + Math.random() * 2.0),
                vy: -0.6 - Math.random() * 1.5,
                size: 1.5 + Math.random() * 2.5,
                color: "#e0f2fe",
                alpha: 0.85,
                decay: 0.04
            });
        }
    }

    // Hiệu ứng sóng va chạm & mảnh vỡ khi trúng cạm bẫy / mật thám (Hit Stop Shockwave)
    addHitShockwave(x, y) {
        // Vòng sóng xung kích lan tỏa
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: 8,
            maxRadius: 42,
            isRing: true,
            color: "#ef4444",
            lineWidth: 3,
            alpha: 1,
            decay: 0.055
        });

        // Hạt tia lửa đỏ - vàng văng toé
        const colors = ["#ef4444", "#f97316", "#fbbf24", "#ffffff"];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.2 + Math.random() * 5.0;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2.5 + Math.random() * 3.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.035 + Math.random() * 0.02
            });
        }
    }

    // Hào quang hồi sinh rạng rỡ tại điểm Checkpoint (Respawn Halo)
    addRespawnHalo(x, y) {
        // Vòng sóng hồi sinh vàng - xanh ngọc
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: 6,
            maxRadius: 48,
            isRing: true,
            color: "#fde047",
            lineWidth: 3.5,
            alpha: 1,
            decay: 0.045
        });

        // 20 đốm sáng bay tỏa tròn như sao
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 1.8 + Math.random() * 2.2;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                size: 2.5 + Math.random() * 2.5,
                color: i % 2 === 0 ? "#fde047" : "#67e8f9",
                alpha: 1,
                decay: 0.025
            });
        }
    }

    addFireworks(x, y) {
        const colors = ["#ef4444", "#fbbf24", "#3b82f6", "#10b981", "#ec4899", "#f59e0b"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.addBurst(x, y, color, 30);
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.isRing) {
                p.radius += (p.maxRadius - p.radius) * 0.18;
                p.alpha -= p.decay;
                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                }
                continue;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.06; // Nhẹ trọng lực
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Cập nhật thông báo nổi trong canvas (giữ 100% độ sáng trong 70% thời gian, trôi êm)
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.vy *= 0.985;
            ft.life--;

            if (ft.life > ft.duration * 0.3) {
                ft.alpha = 1.0;
            } else {
                ft.alpha = Math.max(0, ft.life / (ft.duration * 0.3));
            }

            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);

            if (p.isRing) {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.lineWidth || 2;
                ctx.beginPath();
                ctx.arc(p.x - cameraX, p.y, p.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                continue;
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Vẽ thông báo nổi phong cách game arcade (viên thuốc bo tròn viền neon, rõ nét lâu phai)
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.alpha);
            const screenX = ft.x - cameraX;
            const screenY = ft.y;

            ctx.font = `bold ${ft.fontSize}px 'Outfit', -apple-system, sans-serif`;
            const textMetrics = ctx.measureText(ft.text);
            const textW = textMetrics.width;
            const padX = 14;
            const pillH = ft.fontSize + 12;
            const pillW = textW + padX * 2;
            const rx = screenX - pillW / 2;
            const ry = screenY - pillH / 2;
            const radius = pillH / 2;

            // Nền viên thuốc sẫm màu với viền sáng neon
            ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
            ctx.strokeStyle = ft.color;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(rx, ry, pillW, pillH, radius);
            } else {
                ctx.moveTo(rx + radius, ry);
                ctx.lineTo(rx + pillW - radius, ry);
                ctx.quadraticCurveTo(rx + pillW, ry, rx + pillW, ry + radius);
                ctx.lineTo(rx + pillW, ry + pillH - radius);
                ctx.quadraticCurveTo(rx + pillW, ry + pillH, rx + pillW - radius, ry + pillH);
                ctx.lineTo(rx + radius, ry + pillH);
                ctx.quadraticCurveTo(rx, ry + pillH, rx, ry + pillH - radius);
                ctx.lineTo(rx, ry + radius);
                ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
                ctx.closePath();
            }
            ctx.fill();
            ctx.stroke();

            // Chữ hiển thị rực rỡ với đổ bóng nhẹ
            ctx.fillStyle = ft.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = ft.color;
            ctx.shadowBlur = 8;
            ctx.fillText(ft.text, screenX, screenY + 1);
            ctx.restore();
        }
    }
}

