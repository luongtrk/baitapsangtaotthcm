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

        // Tính năng gameplay mới: Nghi Binh, Khống Chế, Hóa Trang, Khiên Áo Trấn Thủ, Dép Cao Su
        this.pebbleCooldown = 0;    // Hồi chiêu ném sỏi nghi binh (frames)
        this.maxPebbleCooldown = 180; // 3 giây hồi chiêu
        this.hasShield = false;     // Áo trấn thủ: đỡ trọn 1 đòn đạn/bẫy
        this.speedBoostTimer = 0;   // Dép cao su vạn dặm: tăng tốc chạy & nhảy
        this.disguiseTimer = 0;     // Hòm đồ cải trang: lính không nhận diện
        this.nearGuardForTakedown = null; // Mật thám đang có thể khống chế từ phía sau
        this.nearNpc = null;        // Đồng chí liên lạc viên đang đứng gần

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
        const jumpBoost = this.speedBoostTimer > 0 ? 1.12 : 1.0;

        // 1. Nhảy từ mặt đất HOẶC Coyote Time (vừa bước hụt mép vực trong vòng 6 frames)
        if (this.onGround || this.coyoteTimer > 0) {
            this.vy = this.jumpForce * jumpBoost;
            if (typeof audio !== "undefined" && audio.playJump) audio.playJump();
            this.jumpsLeft = 1; // Còn 1 lần nhảy đúp trên không
            this.onGround = false;
            this.coyoteTimer = 0;
            this.jumpBufferTimer = 0;
            return { jumped: true, isDouble: false };
        }
        // 2. Nhảy đúp trên không (Double Jump)
        else if (this.jumpsLeft > 0) {
            this.vy = this.jumpForce * 0.96 * jumpBoost;
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

        // Cập nhật bộ đếm hồi chiêu và hiệu ứng hỗ trợ
        if (this.pebbleCooldown > 0) this.pebbleCooldown--;
        if (this.speedBoostTimer > 0) this.speedBoostTimer--;
        if (this.disguiseTimer > 0) this.disguiseTimer--;

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
            const boostMult = this.speedBoostTimer > 0 ? 1.45 : 1.0;
            const currentSpeed = (this.isCrouching ? this.speed * 0.55 : this.speed) * boostMult;

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
                const maxIceSpeed = (this.isCrouching ? this.speed * 0.6 : this.speed * 1.15) * boostMult;
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

    // Kỹ năng Nghi Binh: Ném một viên sỏi gây tiếng động giả dụ mật thám
    throwPebble() {
        if (this.pebbleCooldown > 0 || this.isDying) return null;
        this.pebbleCooldown = this.maxPebbleCooldown;
        // Sinh viên sỏi tại tâm người chơi (không bao giờ nằm trong tường) để tránh kẹt sỏi khi đứng sát vách
        return new DistractionPebble(
            this.x + this.width / 2,
            this.y + 14,
            this.facing
        );
    }

    // Kiểm tra xem người chơi có đang ở vị trí khống chế sau lưng mật thám hay không
    canTakedown(guard) {
        if (!guard || guard.stunTimer > 0 || this.isDying) return false;
        const pCenterX = this.x + this.width / 2;
        const gCenterX = guard.x + guard.width / 2;
        const dist = Math.abs(pCenterX - gCenterX);
        const dy = Math.abs((this.y + this.height / 2) - (guard.y + guard.height / 2));

        if (dist > 48 || dy > 32) return false;

        // Phải ở phía sau lưng mật thám (mật thám nhìn phải -> người chơi ở trái, mật thám nhìn trái -> người chơi ở phải)
        const isBehind = (guard.dir === 1 && pCenterX < gCenterX) || (guard.dir === -1 && pCenterX > gCenterX);
        return isBehind && !guard.isAiming;
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

        // Cơ chế Choáng (Stun do bị khống chế) & Điều tra tiếng động Nghi binh
        this.stunTimer = 0;             // Thời gian bị điểm huyệt / đánh ngất
        this.investigateTimer = 0;      // Thời gian tò mò đi kiểm tra tiếng sỏi
        this.investigateX = null;       // Tọa độ tiếng sỏi rơi
        this.timesTakenDown = 0;        // Số lần bị khống chế (chỉ thưởng điểm lần đầu, chống farm điểm)
    }

    // Làm choáng mật thám
    stun(duration = 720) {
        this.stunTimer = duration;
        this.isAiming = false;
        this.isAlerted = false;
        this.aimTimer = 0;
    }

    // Nghe thấy tiếng động nghi binh (ném sỏi / gõ vật)
    hearDistraction(targetX) {
        if (this.stunTimer > 0 || this.isAiming) return;
        this.investigateTimer = 210; // ~3.5 giây đi kiểm tra
        // Giới hạn trong vùng tuần tra (quy đổi về tọa độ tâm) để lính không bước hụt khỏi bục
        this.investigateX = Math.max(this.minX + this.width / 2, Math.min(this.maxX + this.width / 2, targetX));
        this.dir = this.investigateX >= this.x + this.width / 2 ? 1 : -1;
        // Không bật isAlerted ở đây: trạng thái "nghi binh" được hiển thị riêng bằng investigateTimer,
        // tránh lỗi lính giữ mãi dấu "?" vàng sau khi đã điều tra xong
    }

    update(player, platforms) {
        // Đang bị khống chế choáng ngất: không di chuyển, không bắn súng
        if (this.stunTimer > 0) {
            this.stunTimer--;
            this.isAiming = false;
            this.isAlerted = false;
            return null;
        }

        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.muzzleFlashTimer > 0) this.muzzleFlashTimer--;

        let shotResult = null;
        const seesPlayer = player && this.detectsPlayer(player);

        if (seesPlayer) {
            // Khi phát hiện người chơi: hủy bỏ ngay trạng thái tò mò điều tra
            this.investigateTimer = 0;
            this.investigateX = null;

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
            } else if (this.investigateTimer > 0) {
                // Đang tò mò kiểm tra tiếng sỏi nghi binh
                this.investigateTimer--;
                if (this.investigateX !== null) {
                    const dx = this.investigateX - (this.x + this.width / 2);
                    if (Math.abs(dx) > 8) {
                        this.dir = dx > 0 ? 1 : -1;
                        this.x += this.dir * (this.speed * 0.7);
                    }
                }
                this.animTimer++;
                if (this.animTimer > 10) {
                    this.animFrame = (this.animFrame + 1) % 4;
                    this.animTimer = 0;
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
        if (!player || player.isHidden || player.invulnerableTimer > 0 || this.stunTimer > 0) {
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

        // Nếu người chơi đang trong trang phục cải trang: lính chỉ phát hiện khi va chạm quá gần (< 36px)
        if (player.disguiseTimer > 0 && dist > 36) {
            this.crouchSuspicionTimer = Math.max(0, this.crouchSuspicionTimer - 2);
            if (!this.isAiming) this.isAlerted = false;
            return false;
        }

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

    // Hiệu ứng sóng âm thanh khi sỏi nghi binh chạm đất
    addDistractionWave(x, y) {
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: 8,
            maxRadius: 65,
            isRing: true,
            color: "#38bdf8",
            lineWidth: 2.5,
            alpha: 1,
            decay: 0.04
        });
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: 4,
            maxRadius: 40,
            isRing: true,
            color: "#fde047",
            lineWidth: 2,
            alpha: 0.9,
            decay: 0.05
        });
    }

    // Hiệu ứng khiên Áo Trấn Thủ vỡ khi đỡ trọn phát đạn
    addShieldBreak(x, y) {
        this.particles.push({
            x,
            y,
            vx: 0,
            vy: 0,
            radius: 12,
            maxRadius: 55,
            isRing: true,
            color: "#10b981",
            lineWidth: 4,
            alpha: 1,
            decay: 0.05
        });
        const colors = ["#10b981", "#34d399", "#6ee7b7", "#ffffff"];
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 4.0;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2.5 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.04
            });
        }
    }

    // Hiệu ứng khi khống chế mật thám từ sau lưng thành công
    addTakedownBurst(x, y, label = "💥 +150") {
        if (label) this.addFloatingText(x, y - 28, label, "#facc15", 15, 110);
        const colors = ["#facc15", "#f59e0b", "#ffffff"];
        for (let i = 0; i < 18; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.5 + Math.random() * 4.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2.5 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.035
            });
        }
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

        // Vẽ thông báo nổi kiểu Game Indie/Arcade (gọn gàng, ưu tiên icon & số, viền đậm sắc nét)
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.alpha);
            const screenX = ft.x - cameraX;
            const screenY = ft.y;

            // Hiệu ứng phóng nhẹ lúc mới xuất hiện (pop-in scale)
            const progress = 1 - (ft.life / ft.duration);
            const popScale = progress < 0.12 ? 0.75 + (progress / 0.12) * 0.35 : (progress < 0.22 ? 1.1 - ((progress - 0.12) / 0.1) * 0.1 : 1.0);

            ctx.translate(screenX, screenY);
            ctx.scale(popScale, popScale);

            ctx.font = `700 ${ft.fontSize}px 'Oswald', 'Courier Prime', sans-serif`;
            const textMetrics = ctx.measureText(ft.text);
            const textW = textMetrics.width;
            const padX = 10;
            const pillH = ft.fontSize + 9;
            const pillW = textW + padX * 2;
            const rx = -pillW / 2;
            const ry = -pillH / 2;

            // Đế bóng cứng góc cạnh (3px offset) đồng bộ 100% với Menu
            ctx.fillStyle = "#090706";
            ctx.fillRect(rx + 3, ry + 3, pillW, pillH);

            // Nền bảng vuông vức #211c17 + viền đồng/màu thưởng
            ctx.fillStyle = "#211c17";
            ctx.fillRect(rx, ry, pillW, pillH);
            ctx.strokeStyle = ft.color;
            ctx.lineWidth = 1.8;
            ctx.strokeRect(rx, ry, pillW, pillH);

            // Chữ & Icon sắc nét
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = ft.color;
            ctx.fillText(ft.text, 0, 1);
            ctx.restore();
        }
    }
}

// =========================================================================
// 1. VIÊN SỎI NGHI BINH (DISTRACTION PEBBLE)
// Bay theo hình parabol, nảy trên mặt đất và phát ra sóng âm thanh dụ mật thám
// =========================================================================
class DistractionPebble {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.vx = dir * 6.5;
        this.vy = -4.8;
        this.radius = 4;
        this.gravity = 0.38;
        this.bounces = 0;
        this.maxBounces = 2;
        this.hasLanded = false;
        this.life = 140;        // Tồn tại ~2.3 giây sau khi nằm yên
        this.flightTime = 0;    // Thời gian bay (giới hạn để không tồn tại vô hạn)
        this.alertTriggered = false;
    }

    // Phát tiếng động một lần duy nhất: sóng âm + thu hút mật thám trong bán kính 200px
    makeNoise(guards, particles) {
        if (this.alertTriggered) return;
        this.alertTriggered = true;
        if (typeof audio !== "undefined" && audio.playPebbleBounce) {
            audio.playPebbleBounce();
        }
        if (particles && particles.addDistractionWave) {
            particles.addDistractionWave(this.x, this.y);
        }
        for (const guard of guards) {
            const gx = guard.x + guard.width / 2;
            const gy = guard.y + guard.height / 2;
            if (Math.hypot(gx - this.x, gy - this.y) < 200) {
                guard.hearDistraction(this.x);
            }
        }
    }

    // Trả về true khi viên sỏi cần được xóa khỏi màn chơi
    update(platforms, guards, particles) {
        if (this.hasLanded) {
            this.life--;
            return this.life <= 0;
        }

        this.flightTime++;
        const prevX = this.x;
        const prevY = this.y;
        const r = this.radius;

        this.vy = Math.min(this.vy + this.gravity, 12);
        this.x += this.vx;
        this.y += this.vy;

        for (const plat of platforms) {
            const pw = plat.w ?? plat.width ?? 0;
            const ph = plat.h ?? plat.height ?? 0;
            const overlap = this.x + r > plat.x && this.x - r < plat.x + pw &&
                            this.y + r > plat.y && this.y - r < plat.y + ph;
            if (!overlap) continue;

            if (this.vy > 0 && prevY + r <= plat.y + 1) {
                // Rơi xuống mặt bục: nảy hoặc nằm yên
                this.y = plat.y - r;
                this.bounces++;
                if (this.bounces >= this.maxBounces) {
                    this.hasLanded = true;
                    this.vx = 0;
                    this.vy = 0;
                } else {
                    this.vy = -this.vy * 0.45;
                    this.vx *= 0.6;
                }
            } else if (this.vy < 0 && prevY - r >= plat.y + ph - 1) {
                // Đập vào trần (mặt dưới bục) -> rơi xuống
                this.y = plat.y + ph + r;
                this.vy = 0;
            } else {
                // Đập vào vách bên -> bật ngược lại, không xuyên tường
                this.x = prevX;
                this.vx = -this.vx * 0.4;
            }
            this.makeNoise(guards, particles);
            break;
        }

        // Rơi xuống vực / nước hoặc bay quá lâu -> xóa để tránh rò rỉ bộ nhớ
        return this.y > 700 || this.flightTime > 300;
    }
}

// =========================================================================
// 2. VẬT PHẨM TIẾP TẾ CÁCH MẠNG (SUPPLY ITEMS)
// Áo Trấn Thủ (Khiên), Dép Cao Su (Tốc độ), Hòm Cải Trang, Lương Khô (Máu)
// =========================================================================
class SupplyItem {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.baseY = config.y;
        this.type = config.type; // 'shield', 'speed', 'disguise', 'heal'
        this.title = config.title || "Vật Phẩm Tiếp Tế";
        this.desc = config.desc || "";
        this.width = 28;
        this.height = 28;
        this.w = 28;
        this.h = 28;
        this.collected = false;
        this.bobTime = Math.random() * Math.PI * 2;
    }

    update() {
        if (this.collected) return;
        this.bobTime += 0.055;
        this.y = this.baseY + Math.sin(this.bobTime) * 5;
    }

    checkCollect(player) {
        if (this.collected || !player || player.isDying) return false;
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const iCenterX = this.x + this.width / 2;
        const iCenterY = this.y + this.height / 2;
        const dist = Math.hypot(pCenterX - iCenterX, pCenterY - iCenterY);

        if (dist < 34) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

// =========================================================================
// 3. ĐỒNG CHÍ LIÊN LẠC BÍ MẬT / QUẦN CHÚNG NH N D N (COMRADE NPC)
// Nhân vật lịch sử hỗ trợ người chơi, chỉ đường bí mật và tiếp tế
// =========================================================================
class ComradeNPC {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.name = config.name || "Đồng Chí Liên Lạc";
        this.role = config.role || "Cơ sở bí mật";
        this.quote = config.quote || "Đường cứu nước gian nan, chúc đồng chí bình an!";
        this.giftType = config.giftType || "shield"; // 'shield', 'speed', 'disguise', 'heal'
        this.shortcutId = config.shortcutId || null;
        this.starCost = config.starCost || 3; // Số Sao Vàng cần để đổi liên lạc & mở lối tắt
        this.width = 28;
        this.height = 48;
        this.w = 28;
        this.h = 48;
        this.talked = false;
        this.isNear = false;
        this.animTimer = 0;
    }

    update(player) {
        this.animTimer += 0.06;
        if (!player) {
            this.isNear = false;
            return;
        }
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const nCenterX = this.x + this.width / 2;
        const nCenterY = this.y + this.height / 2;
        this.isNear = Math.abs(pCenterX - nCenterX) < 56 && Math.abs(pCenterY - nCenterY) < 52;
    }
}

