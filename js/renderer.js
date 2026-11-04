// Renderer: Vẽ đồ họa Canvas 2D Đỉnh Cao, Texture Bề Mặt Chi Tiết, Ánh Sáng & Hiệu Ứng Nghệ Thuật

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.time = 0;
        this.virtualWidth = 1000;
        this.virtualHeight = 600;

        // 1. Hệ thống hạt môi trường (Tuyết, đốm sáng, mây trôi)
        this.snowParticles = [];
        this.twinkleStars = [];
        this.clouds = [];

        // Hạt tuyết rơi đa tầng cho Chương 2 (Moskva)
        for (let i = 0; i < 90; i++) {
            this.snowParticles.push({
                x: Math.random() * 1200,
                y: Math.random() * 600,
                radius: 1 + Math.random() * 2.8,
                speedY: 0.7 + Math.random() * 1.6,
                speedX: (Math.random() - 0.5) * 0.9,
                alpha: 0.4 + Math.random() * 0.6
            });
        }

        // Sao đêm nhấp nháy cho Chương 1 & Chương 3
        for (let i = 0; i < 60; i++) {
            this.twinkleStars.push({
                x: Math.random() * 1200,
                y: Math.random() * 260,
                size: 0.8 + Math.random() * 1.6,
                speed: 1 + Math.random() * 3,
                baseAlpha: 0.3 + Math.random() * 0.6
            });
        }

        // Mây trôi lãng đãng bầu trời
        for (let i = 0; i < 6; i++) {
            this.clouds.push({
                x: Math.random() * 1400,
                y: 40 + Math.random() * 120,
                w: 120 + Math.random() * 160,
                h: 28 + Math.random() * 35,
                speed: 0.15 + Math.random() * 0.25,
                alpha: 0.12 + Math.random() * 0.18
            });
        }

        // 2. Bộ nạp Sprite nhân vật Vector SVG / PNG tùy biến
        const loadCustomSprite = (baseName) => {
            const img = new Image();
            img.src = `assets/player/${baseName}.svg`;
            img.onerror = () => {
                img.onerror = null;
                img.src = `assets/player/${baseName}.png`;
            };
            return img;
        };

        this.sprites = {
            playerIdle: loadCustomSprite("idle"),
            playerRun: loadCustomSprite("run"),
            playerJump: loadCustomSprite("jump"),
            playerCrouch: loadCustomSprite("crouch"),
            hasCustomPlayer: false
        };

        this.sprites.playerIdle.onload = () => {
            this.sprites.hasCustomPlayer = true;
        };

        // 3. Khởi tạo Texture Patterns nghệ thuật bằng Offscreen Canvas
        this.patterns = {};
        this.initTextures();
    }

    // =========================================================================
    // HỆ THỐNG TẠO TEXTURE PATTERNS ĐỒ HỌA CHUYÊN NGHIỆP
    // =========================================================================
    initTextures() {
        // A. Texture Gỗ Bến Cảng (Wood Grain & Iron Rivets)
        const canWood = document.createElement("canvas");
        canWood.width = 40;
        canWood.height = 20;
        const ctxWood = canWood.getContext("2d");
        ctxWood.fillStyle = "#78350f";
        ctxWood.fillRect(0, 0, 40, 20);
        // Vân thớ gỗ sẫm
        ctxWood.strokeStyle = "#5a2709";
        ctxWood.lineWidth = 1;
        ctxWood.beginPath();
        ctxWood.moveTo(0, 5); ctxWood.lineTo(40, 5);
        ctxWood.moveTo(0, 15); ctxWood.lineTo(40, 15);
        ctxWood.moveTo(12, 0); ctxWood.lineTo(12, 5);
        ctxWood.moveTo(28, 5); ctxWood.lineTo(28, 15);
        ctxWood.stroke();
        // Ánh sáng viền thớ gỗ
        ctxWood.strokeStyle = "#92400e";
        ctxWood.beginPath();
        ctxWood.moveTo(0, 6); ctxWood.lineTo(40, 6);
        ctxWood.stroke();
        this.patterns.wood = this.ctx.createPattern(canWood, "repeat");

        // B. Texture Đá Cuội Paris Cổ Kính (Cobblestone Masonry)
        const canStone = document.createElement("canvas");
        canStone.width = 36;
        canStone.height = 24;
        const ctxStone = canStone.getContext("2d");
        ctxStone.fillStyle = "#334155";
        ctxStone.fillRect(0, 0, 36, 24);
        // Mạch vữa sẫm màu
        ctxStone.strokeStyle = "#1e293b";
        ctxStone.lineWidth = 1.5;
        ctxStone.strokeRect(0, 0, 18, 12);
        ctxStone.strokeRect(18, 0, 18, 12);
        ctxStone.strokeRect(9, 12, 18, 12);
        ctxStone.strokeRect(-9, 12, 18, 12);
        ctxStone.strokeRect(27, 12, 18, 12);
        // Viền sáng nổi khối các phiến đá
        ctxStone.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctxStone.strokeRect(1, 1, 16, 10);
        this.patterns.stone = this.ctx.createPattern(canStone, "repeat");

        // C. Texture Gạch Tuyết Moskva (Frosty Brick)
        const canSnowBrick = document.createElement("canvas");
        canSnowBrick.width = 32;
        canSnowBrick.height = 18;
        const ctxSnow = canSnowBrick.getContext("2d");
        ctxSnow.fillStyle = "#44403c";
        ctxSnow.fillRect(0, 0, 32, 18);
        ctxSnow.strokeStyle = "#292524";
        ctxSnow.lineWidth = 1.5;
        ctxSnow.strokeRect(0, 0, 16, 9);
        ctxSnow.strokeRect(16, 0, 16, 9);
        ctxSnow.strokeRect(8, 9, 16, 9);
        ctxSnow.strokeRect(-8, 9, 16, 9);
        // Vết đóng băng xanh ngọc mờ
        ctxSnow.fillStyle = "rgba(186, 230, 253, 0.15)";
        ctxSnow.fillRect(2, 2, 12, 5);
        this.patterns.snowBrick = this.ctx.createPattern(canSnowBrick, "repeat");

        // D. Texture Đá Rêu Pác Bó (Mossy Bedrock Strata)
        const canMoss = document.createElement("canvas");
        canMoss.width = 40;
        canMoss.height = 24;
        const ctxMoss = canMoss.getContext("2d");
        ctxMoss.fillStyle = "#14532d";
        ctxMoss.fillRect(0, 0, 40, 24);
        ctxMoss.strokeStyle = "#052e16";
        ctxMoss.lineWidth = 1.2;
        ctxMoss.beginPath();
        ctxMoss.moveTo(0, 8); ctxMoss.bezierCurveTo(15, 6, 25, 10, 40, 8);
        ctxMoss.moveTo(0, 18); ctxMoss.bezierCurveTo(10, 20, 30, 16, 40, 18);
        ctxMoss.stroke();
        ctxMoss.fillStyle = "rgba(74, 222, 128, 0.15)";
        ctxMoss.fillRect(4, 3, 8, 4);
        ctxMoss.fillRect(24, 12, 10, 4);
        this.patterns.mossRock = this.ctx.createPattern(canMoss, "repeat");

        // E. Texture Mái Ngói Vảy Cá Cổ Thăng Long (Terracotta Fish-Scale Roof Tiles)
        const canTile = document.createElement("canvas");
        canTile.width = 24;
        canTile.height = 16;
        const ctxTile = canTile.getContext("2d");
        ctxTile.fillStyle = "#991b1b";
        ctxTile.fillRect(0, 0, 24, 16);
        // Vòng cung ngói cong âm dương
        ctxTile.strokeStyle = "#450a0a";
        ctxTile.lineWidth = 1.2;
        ctxTile.beginPath();
        ctxTile.arc(12, 8, 10, Math.PI, 0);
        ctxTile.stroke();
        ctxTile.strokeStyle = "#f87171";
        ctxTile.beginPath();
        ctxTile.arc(12, 7, 9, Math.PI * 0.9, Math.PI * 0.1);
        ctxTile.stroke();
        this.patterns.roofTile = this.ctx.createPattern(canTile, "repeat");

        // F. Texture Đá Hoa Cương Ba Đình (Imperial Royal Marble)
        const canMarble = document.createElement("canvas");
        canMarble.width = 48;
        canMarble.height = 24;
        const ctxMarble = canMarble.getContext("2d");
        ctxMarble.fillStyle = "#78350f";
        ctxMarble.fillRect(0, 0, 48, 24);
        // Vân đá cẩm thạch vàng son
        ctxMarble.strokeStyle = "rgba(251, 191, 36, 0.25)";
        ctxMarble.lineWidth = 1.2;
        ctxMarble.beginPath();
        ctxMarble.moveTo(0, 12); ctxMarble.lineTo(18, 4); ctxMarble.lineTo(34, 18); ctxMarble.lineTo(48, 10);
        ctxMarble.stroke();
        this.patterns.marble = this.ctx.createPattern(canMarble, "repeat");
    }

    // =========================================================================
    // VÒNG LẶP VẼ CHÍNH
    // =========================================================================
    render(gameState) {
        this.time += 0.025;
        const ctx = this.ctx;
        const rawW = this.canvas.width;
        const rawH = this.canvas.height;
        ctx.clearRect(0, 0, rawW, rawH);

        // Chuẩn hóa tỷ lệ đồ họa ảo: chiều cao chuẩn 600px, co giãn tự do Fullscreen
        const scale = rawH > 0 ? rawH / 600 : 1;
        const width = rawW / scale;
        const height = 600;
        this.virtualWidth = width;
        this.virtualHeight = height;

        const { currentLevel, player, guards, documents, stars, particles, cameraX, screenShake = 0, bullets = [] } = gameState;

        // Chấn động màn hình (Screen Shake) chân thực như các game danh tiếng
        const shakeX = screenShake > 0.3 ? (Math.random() - 0.5) * screenShake : 0;
        const shakeY = screenShake > 0.3 ? (Math.random() - 0.5) * screenShake : 0;

        ctx.save();
        ctx.translate(shakeX, shakeY);
        ctx.scale(scale, scale);

        // 1. Vẽ bầu trời, sao nhấp nháy, mây trôi & Parallax Nền sống động
        this.drawBackground(currentLevel, cameraX, width, height);

        // 2. Vẽ Chướng ngại vật (Hazards với sóng nước cuộn & bẫy rào)
        this.drawHazards(currentLevel.hazards, cameraX, width);

        // 3. Vẽ Vị trí nấp (Hiding Spots với thùng hàng, bụi rậm đa tầng, vòm ngõ sâu)
        this.drawHidingSpots(currentLevel.hidingSpots, cameraX, width);

        // 4. Vẽ Mặt đất & Nền tảng với Texture bề mặt nghệ thuật
        this.drawPlatforms(currentLevel.platforms, currentLevel.platformColor, cameraX, width);

        // 5. Vẽ Cột mốc cờ đỏ sao vàng uốn lượn hình sin 3D
        this.drawCheckpoints(currentLevel.checkpoints, cameraX, width);

        // 6. Vẽ Điểm đích màn chơi lộng lẫy (Tàu thủy, Tàu hỏa, Hang Pác Bó, Đại Lễ Đài)
        this.drawExit(currentLevel, cameraX, width);

        // 7. Vẽ Ngôi sao cách mạng 3D tỏa hào quang
        this.drawStars(stars, cameraX, width);

        // 8. Vẽ Cuộn Văn Kiện Di Sản thếp vàng, niêm phong sáp đỏ
        this.drawDocuments(documents, cameraX, width);

        // 9. Vẽ Mật thám áo măng-tô, mũ phớt, đèn bão, nón sáng & súng
        this.drawGuards(guards, cameraX, width);

        // 10. Vẽ Đường đạn bắn của mật thám
        this.drawBullets(bullets, cameraX, width);

        // 11. Vẽ Người chơi (Sprite Vector sắc nét, nhấp nháy i-frame & hiệu ứng bảo vệ)
        this.drawPlayer(player, cameraX);

        // 12. Vẽ Hạt hiệu ứng & Chữ nổi Canvas
        particles.draw(ctx, cameraX);

        // 12. Hiệu ứng khí hậu đặc biệt (Tuyết rơi đa tầng Moskva)
        this.drawWeatherEffects(currentLevel.id, width, height);

        // Chớp đỏ màn hình (Hit Flash Vignette) khi bị chấn động va chạm
        if (screenShake > 3) {
            ctx.save();
            const flashAlpha = Math.min(0.28, screenShake / 35);
            ctx.fillStyle = `rgba(239, 68, 68, ${flashAlpha})`;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        ctx.restore();
    }

    // =========================================================================
    // 1. BẦU TRỜ, SAO ĐÊM, MÂY TRÔI & PARALLAX BACKGROUND
    // =========================================================================
    drawBackground(level, cameraX, width, height) {
        const ctx = this.ctx;

        // Bầu trời chuyển sắc (Vivid Sky Gradient)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, level.skyColor[0]);
        skyGrad.addColorStop(0.7, level.skyColor[1]);
        skyGrad.addColorStop(1, level.bgColor);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Sao đêm & sao mai nhấp nháy êm dịu
        ctx.save();
        for (const star of this.twinkleStars) {
            const alpha = star.baseAlpha + Math.sin(this.time * star.speed + star.x) * 0.25;
            ctx.fillStyle = `rgba(254, 240, 138, ${Math.max(0.1, alpha)})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Mây lững lờ trôi chậm trên bầu trời
        ctx.save();
        for (const cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.w < 0) cloud.x = width + 50;

            const cloudGrad = ctx.createRadialGradient(cloud.x + cloud.w / 2, cloud.y + cloud.h / 2, 10, cloud.x + cloud.w / 2, cloud.y + cloud.h / 2, cloud.w / 2);
            cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.alpha})`);
            cloudGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = cloudGrad;
            ctx.beginPath();
            ctx.ellipse(cloud.x + cloud.w / 2, cloud.y + cloud.h / 2, cloud.w / 2, cloud.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // PARALLAX LAYER 1: Cảnh xa xăm (Tỷ lệ cuộn 0.08)
        ctx.save();
        if (level.id === 1) {
            // Bóng tháp Eiffel & Mái nhà Paris trong sương đêm
            ctx.fillStyle = "rgba(30, 41, 59, 0.45)";
            const p1 = (cameraX * 0.08) % 650;
            for (let i = -1; i < 3; i++) {
                const bx = i * 650 - p1;
                // Tháp Eiffel sắc sảo
                ctx.beginPath();
                ctx.moveTo(bx + 480, 520);
                ctx.lineTo(bx + 508, 220);
                ctx.lineTo(bx + 512, 220);
                ctx.lineTo(bx + 540, 520);
                ctx.fill();
                // Khối nhà cổ kính Paris
                ctx.fillRect(bx + 60, 340, 130, 180);
                ctx.fillRect(bx + 230, 370, 150, 150);
            }
        } else if (level.id === 2) {
            // Điện Kremlin & tháp Spasskaya với mái vòm củ hành phủ tuyết
            ctx.fillStyle = "rgba(41, 37, 36, 0.55)";
            const p1 = (cameraX * 0.08) % 550;
            for (let i = -1; i < 3; i++) {
                const bx = i * 550 - p1;
                // Mái vòm tròn củ hành cổ điển
                ctx.beginPath();
                ctx.arc(bx + 220, 340, 48, Math.PI, 0);
                ctx.fill();
                ctx.fillRect(bx + 175, 340, 90, 180);
            }
        } else if (level.id === 3) {
            // Dãy Núi Các Mác trùng điệp đại ngàn
            ctx.fillStyle = "rgba(6, 78, 59, 0.45)";
            const p1 = (cameraX * 0.08) % 700;
            for (let i = -1; i < 3; i++) {
                const bx = i * 700 - p1;
                ctx.beginPath();
                ctx.moveTo(bx, 520);
                ctx.lineTo(bx + 260, 200);
                ctx.lineTo(bx + 430, 310);
                ctx.lineTo(bx + 620, 180);
                ctx.lineTo(bx + 700, 520);
                ctx.fill();
            }
        } else if (level.id === 4) {
            // Cột cờ Hà Nội & Khuê Văn Các uy nghiêm bóng thẫm sương sớm
            ctx.fillStyle = "rgba(30, 41, 59, 0.65)";
            const p1 = (cameraX * 0.08) % 600;
            for (let i = -1; i < 3; i++) {
                const bx = i * 600 - p1;
                ctx.fillRect(bx + 270, 260, 50, 260);
                ctx.beginPath();
                ctx.arc(bx + 295, 260, 35, Math.PI, 0);
                ctx.fill();
            }
        }
        ctx.restore();

        // PARALLAX LAYER 2: Cảnh tầm trung (Tỷ lệ cuộn 0.2)
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
        const p2 = (cameraX * 0.2) % 420;
        for (let i = -1; i < 4; i++) {
            const bx = i * 420 - p2;
            ctx.fillRect(bx + 40, 410, 80, 110);
            ctx.fillRect(bx + 200, 430, 90, 90);
        }
        ctx.restore();
    }

    // =========================================================================
    // 2. NỀN TẢNG & TEXTURE BỀ MẶT NGHỆ THUẬT
    // =========================================================================
    drawPlatforms(platforms, defaultColor, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const p of platforms) {
            const screenX = p.x - cameraX;
            if (screenX + p.w < -60 || screenX > viewWidth + 60) continue;

            ctx.save();
            switch (p.type) {
                case "dock":
                case "wood":
                    // A. Gỗ Bến Cảng với Texture vân thớ và đinh tán kim loại
                    ctx.fillStyle = this.patterns.wood || "#78350f";
                    ctx.fillRect(screenX, p.y, p.w, p.h);

                    // Mép ván gỗ trên bắt sáng rực rỡ
                    ctx.fillStyle = "#b45309";
                    ctx.fillRect(screenX, p.y, p.w, 4);

                    // Các đinh tán đồng gia cố góc ván
                    ctx.fillStyle = "#fde047";
                    for (let vx = screenX + 15; vx < screenX + p.w; vx += 30) {
                        ctx.beginPath();
                        ctx.arc(vx, p.y + 3, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;

                case "snow_brick":
                    // B. Gạch Moskva phủ lớp tuyết xốp và nhũ băng rủ lấp lánh
                    ctx.fillStyle = this.patterns.snowBrick || "#44403c";
                    ctx.fillRect(screenX, p.y, p.w, p.h);

                    // Lớp tuyết xốp dày bắt mắt
                    ctx.fillStyle = "#f8fafc";
                    ctx.beginPath();
                    ctx.roundRect(screenX, p.y - 4, p.w, 8, 4);
                    ctx.fill();

                    // Các dải nhũ băng nhọn rủ xuống dưới bục
                    ctx.fillStyle = "rgba(186, 230, 253, 0.75)";
                    for (let ix = screenX + 12; ix < screenX + p.w - 10; ix += 22) {
                        const icicleLen = 6 + Math.sin(ix * 0.4) * 4;
                        ctx.beginPath();
                        ctx.moveTo(ix - 3, p.y + 4);
                        ctx.lineTo(ix + 3, p.y + 4);
                        ctx.lineTo(ix, p.y + 4 + icicleLen);
                        ctx.closePath();
                        ctx.fill();
                    }
                    break;

                case "moss_rock":
                case "rock":
                    // C. Đá Vôi Pác Bó phủ thảm rêu nhung xanh mướt & dây leo rừng
                    ctx.fillStyle = this.patterns.mossRock || "#14532d";
                    ctx.fillRect(screenX, p.y, p.w, p.h);

                    // Thảm rêu nhung uốn lượn tự nhiên
                    ctx.fillStyle = "#22c55e";
                    ctx.beginPath();
                    ctx.moveTo(screenX, p.y);
                    for (let rx = screenX; rx <= screenX + p.w; rx += 15) {
                        const ry = p.y + Math.sin(rx * 0.3) * 3;
                        ctx.lineTo(rx, ry);
                    }
                    ctx.lineTo(screenX + p.w, p.y + 5);
                    ctx.lineTo(screenX, p.y + 5);
                    ctx.closePath();
                    ctx.fill();

                    // Dây leo rừng rủ lãng đãng bên dưới
                    ctx.strokeStyle = "#16a34a";
                    ctx.lineWidth = 1.5;
                    for (let vx = screenX + 16; vx < screenX + p.w; vx += 35) {
                        ctx.beginPath();
                        ctx.moveTo(vx, p.y + 5);
                        ctx.quadraticCurveTo(vx + 4, p.y + 12, vx - 2, p.y + 18);
                        ctx.stroke();
                    }
                    break;

                case "bamboo":
                    // D. Cầu Tre Rừng Rậm Pác Bó bó dây thừng gai
                    ctx.fillStyle = "#ca8a04";
                    ctx.fillRect(screenX, p.y, p.w, p.h);
                    ctx.fillStyle = "#fef08a";
                    ctx.fillRect(screenX, p.y, p.w, 3);
                    // Các mối lạt tre buộc chặt
                    ctx.strokeStyle = "#713f12";
                    ctx.lineWidth = 2;
                    for (let bx = screenX + 12; bx < screenX + p.w; bx += 20) {
                        ctx.beginPath();
                        ctx.moveTo(bx, p.y);
                        ctx.lineTo(bx, p.y + p.h);
                        ctx.stroke();
                    }
                    break;

                case "tile":
                    // E. Mái Ngói Vảy Cá Cổ Thăng Long son đỏ
                    ctx.fillStyle = this.patterns.roofTile || "#991b1b";
                    ctx.fillRect(screenX, p.y, p.w, p.h);
                    // Đỉnh bờ nóc mái ngói bắt sáng
                    ctx.fillStyle = "#f87171";
                    ctx.fillRect(screenX, p.y, p.w, 3);
                    break;

                case "marble":
                case "marble_gold":
                    // F. Cẩm Thạch Lễ Đài Ba Đình Hoàng Gia viền nhũ vàng
                    ctx.fillStyle = this.patterns.marble || "#78350f";
                    ctx.fillRect(screenX, p.y, p.w, p.h);

                    // Nẹp viền nhũ vàng kim vương giả
                    const goldGrad = ctx.createLinearGradient(screenX, p.y, screenX, p.y + 5);
                    goldGrad.addColorStop(0, "#fde047");
                    goldGrad.addColorStop(1, "#ca8a04");
                    ctx.fillStyle = goldGrad;
                    ctx.fillRect(screenX, p.y, p.w, 5);
                    break;

                default:
                    // Đá gạch Paris thông thường
                    ctx.fillStyle = this.patterns.stone || defaultColor;
                    ctx.fillRect(screenX, p.y, p.w, p.h);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
                    ctx.fillRect(screenX, p.y, p.w, 3);
                    break;
            }
            ctx.restore();
        }
    }

    // =========================================================================
    // 3. NƠI ẨN NẤP CHI TIẾT (THÙNG HÀNG GIA CỐ, BỤI CÂY RẬM, VÒM NGÕ TỐI)
    // =========================================================================
    drawHidingSpots(spots, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const spot of spots) {
            const screenX = spot.x - cameraX;
            if (screenX + spot.w < -60 || screenX > viewWidth + 60) continue;

            ctx.save();
            if (spot.type === "crate") {
                // Thùng gỗ kiện hàng gia cố đai sắt & đinh tán
                ctx.fillStyle = "#854d0e";
                ctx.fillRect(screenX, spot.y, spot.w, spot.h);

                // Khung viền đai thép bảo vệ
                ctx.strokeStyle = "#292524";
                ctx.lineWidth = 3;
                ctx.strokeRect(screenX, spot.y, spot.w, spot.h);

                // Vạch nẹp chéo chữ X chịu lực
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(screenX, spot.y); ctx.lineTo(screenX + spot.w, spot.y + spot.h);
                ctx.moveTo(screenX + spot.w, spot.y); ctx.lineTo(screenX, spot.y + spot.h);
                ctx.stroke();

                // Đinh tán 4 góc thùng
                ctx.fillStyle = "#cbd5e1";
                const r = 2;
                ctx.beginPath();
                ctx.arc(screenX + 5, spot.y + 5, r, 0, Math.PI * 2);
                ctx.arc(screenX + spot.w - 5, spot.y + 5, r, 0, Math.PI * 2);
                ctx.arc(screenX + 5, spot.y + spot.h - 5, r, 0, Math.PI * 2);
                ctx.arc(screenX + spot.w - 5, spot.y + spot.h - 5, r, 0, Math.PI * 2);
                ctx.fill();
            } else if (spot.type === "bush") {
                // Bụi rậm rừng già 3 lớp lá phong phú đổ bóng
                ctx.fillStyle = "#14532d"; // Tầng bóng tối phía sau
                ctx.beginPath();
                ctx.arc(screenX + 16, spot.y + 24, 20, 0, Math.PI * 2);
                ctx.arc(screenX + spot.w - 16, spot.y + 24, 20, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#15803d"; // Tầng giữa
                ctx.beginPath();
                ctx.arc(screenX + spot.w / 2, spot.y + 18, 22, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#22c55e"; // Tầng lá ngọn bắt sáng
                ctx.beginPath();
                ctx.arc(screenX + spot.w / 2 - 6, spot.y + 14, 12, 0, Math.PI * 2);
                ctx.arc(screenX + spot.w / 2 + 8, spot.y + 16, 10, 0, Math.PI * 2);
                ctx.fill();
            } else if (spot.type === "arch") {
                // Vòm ngõ tối cổ kính sâu hun hút
                const archGrad = ctx.createRadialGradient(screenX + spot.w / 2, spot.y + spot.h / 2, 5, screenX + spot.w / 2, spot.y + spot.h / 2, spot.w / 2);
                archGrad.addColorStop(0, "#000000");
                archGrad.addColorStop(1, "rgba(15, 23, 42, 0.9)");
                ctx.fillStyle = archGrad;
                ctx.beginPath();
                ctx.arc(screenX + spot.w / 2, spot.y + 20, spot.w / 2, Math.PI, 0);
                ctx.lineTo(screenX + spot.w, spot.y + spot.h);
                ctx.lineTo(screenX, spot.y + spot.h);
                ctx.closePath();
                ctx.fill();

                // Đèn lồng vách ngõ hắt ánh vàng ấm áp
                ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
                ctx.beginPath();
                ctx.arc(screenX + spot.w / 2, spot.y + 24, 3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Mỏm đá Pác Bó che chở
                ctx.fillStyle = "#475569";
                ctx.beginPath();
                ctx.arc(screenX + spot.w / 2, spot.y + spot.h / 2, spot.w / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Huy hiệu chữ "NẤP" nhỏ tinh tế nổi phía trên
            ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("NẤP", screenX + spot.w / 2, spot.y - 6);

            ctx.restore();
        }
    }

    // =========================================================================
    // 4. CHƯỚNG NGẠI VẬT & CẠM BẪY NGHỆ THUẬT (SÓNG NƯỚC, DÂY THÉP GAI)
    // =========================================================================
    drawHazards(hazards, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const haz of hazards) {
            const screenX = haz.x - cameraX;
            if (screenX + haz.w < -60 || screenX > viewWidth + 60) continue;

            ctx.save();
            if (haz.type === "water" || haz.type === "ice_pit") {
                // Sóng nước đa tầng cuộn sóng phản chiếu ánh sáng
                const isIce = haz.type === "ice_pit";
                const waterGrad = ctx.createLinearGradient(0, haz.y, 0, haz.y + haz.h);
                waterGrad.addColorStop(0, isIce ? "#38bdf8" : "#0284c7");
                waterGrad.addColorStop(1, isIce ? "#0369a1" : "#0c4a6e");
                ctx.fillStyle = waterGrad;
                ctx.fillRect(screenX, haz.y, haz.w, haz.h);

                // Các bọt sóng trắng dập dềnh theo hàm sin thời gian
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                for (let wx = screenX; wx < screenX + haz.w; wx += 18) {
                    const waveY = haz.y + Math.sin(this.time * 4 + wx * 0.12) * 4;
                    ctx.beginPath();
                    ctx.arc(wx + 7, waveY, 3.5, 0, Math.PI);
                    ctx.fill();
                }
            } else {
                // Hàng rào thép gai công sự sắc bén (Thép xám đậm điểm gai bạc kim rõ nét)
                ctx.fillStyle = "#334155";
                const count = Math.floor(haz.w / 14);
                for (let i = 0; i < count; i++) {
                    const sx = screenX + i * 14;
                    ctx.beginPath();
                    ctx.moveTo(sx, haz.y + haz.h);
                    ctx.lineTo(sx + 7, haz.y + 8);
                    ctx.lineTo(sx + 14, haz.y + haz.h);
                    ctx.fill();
                    // Điểm gai nhọn màu bạc kim thép sáng
                    ctx.fillStyle = "#cbd5e1";
                    ctx.fillRect(sx + 6, haz.y + 6, 2, 4);
                    ctx.fillStyle = "#334155";
                }
            }
            ctx.restore();
        }
    }

    // =========================================================================
    // 5. CỘT CỜ CHECKPOINT VẢI 3D UỐN LƯỢN HÌNH SIN
    // =========================================================================
    drawCheckpoints(checkpoints, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const cp of checkpoints) {
            const screenX = cp.x - cameraX;
            if (screenX < -50 || screenX > viewWidth + 50) continue;

            ctx.save();
            // Cột cờ bằng thép không gỉ sáng bóng
            const poleGrad = ctx.createLinearGradient(screenX, cp.y, screenX + 5, cp.y);
            poleGrad.addColorStop(0, "#64748b");
            poleGrad.addColorStop(0.5, "#f8fafc");
            poleGrad.addColorStop(1, "#334155");
            ctx.fillStyle = poleGrad;
            ctx.fillRect(screenX, cp.y, 4.5, 55);

            // Búp măng đồng vàng đỉnh cột
            ctx.fillStyle = "#fde047";
            ctx.beginPath();
            ctx.arc(screenX + 2.2, cp.y - 2, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Lá cờ bay uốn lượn hình sin 3D
            const fWave = Math.sin(this.time * 5 + screenX * 0.05) * 5;
            ctx.fillStyle = cp.reached ? "#dc2626" : "#475569";
            ctx.beginPath();
            ctx.moveTo(screenX + 4.5, cp.y);
            ctx.quadraticCurveTo(screenX + 18, cp.y + 4 + fWave, screenX + 32, cp.y + 10 + fWave);
            ctx.lineTo(screenX + 32, cp.y + 24 + fWave);
            ctx.quadraticCurveTo(screenX + 18, cp.y + 18 + fWave, screenX + 4.5, cp.y + 22);
            ctx.closePath();
            ctx.fill();

            // Ngôi sao vàng cách mạng
            if (cp.reached) {
                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 11px sans-serif";
                ctx.fillText("★", screenX + 12, cp.y + 14 + fWave * 0.5);
            }
            ctx.restore();
        }
    }

    // =========================================================================
    // 6. CÔNG TRÌNH VỀ ĐÍCH HOÀNG GIA (TÀU THỦY, TÀU HỎA, PÁC BÓ, LỄ ĐÀI BA ĐÌNH)
    // =========================================================================
    drawExit(level, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        const screenX = level.exitPos.x - cameraX;
        const y = level.exitPos.y;
        if (screenX < -200 || screenX > viewWidth + 120) return;

        ctx.save();
        if (level.exitType === "ship") {
            // Con tàu Amiral Latouche-Tréville lịch sử
            // Thân tàu đen tuyền với vạch mớn nước trắng
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.moveTo(screenX - 25, y + 25);
            ctx.lineTo(screenX + 145, y + 25);
            ctx.lineTo(screenX + 125, y + 80);
            ctx.lineTo(screenX, y + 80);
            ctx.closePath();
            ctx.fill();

            // Vạch sơn trắng thân tàu
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(screenX - 15, y + 36, 150, 4);

            // Ca bin đài chỉ huy
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(screenX + 25, y, 70, 25);
            ctx.fillStyle = "#38bdf8"; // Cửa kính boong tàu
            ctx.fillRect(screenX + 35, y + 6, 12, 8);
            ctx.fillRect(screenX + 55, y + 6, 12, 8);
            ctx.fillRect(screenX + 75, y + 6, 12, 8);

            // Ống khói đỏ huyền thoại
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(screenX + 50, y - 28, 22, 28);
            ctx.fillStyle = "#000000";
            ctx.fillRect(screenX + 48, y - 32, 26, 6);

            // Cột cờ đuôi tàu
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(screenX + 130, y - 10, 3, 35);

            // Khói tàu bồng bềnh trôi
            ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
            for (let s = 0; s < 3; s++) {
                const sY = y - 40 - ((this.time * 25 + s * 20) % 50);
                const sX = screenX + 60 + s * 12;
                ctx.beginPath();
                ctx.arc(sX, sY, 8 + s * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Tên tàu son vàng
            ctx.fillStyle = "#fde047";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("TÀU LATOUCHE-TRÉVILLE (1911)", screenX - 15, y - 45);
        } else if (level.exitType === "train") {
            // Chuyến tàu cách mạng bọc thép
            ctx.fillStyle = "#334155";
            ctx.fillRect(screenX, y, 120, 60);
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(screenX, y + 12, 120, 8);

            // Các bánh đà xe lửa
            ctx.fillStyle = "#0f172a";
            for (let w = screenX + 15; w < screenX + 115; w += 30) {
                ctx.beginPath();
                ctx.arc(w, y + 60, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#94a3b8";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            ctx.fillStyle = "#fde047";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText("CHUYẾN TÀU CÁCH MẠNG", screenX, y - 15);
        } else if (level.exitType === "cave") {
            // Cửa Hang Pác Bó thiêng liêng
            const caveGrad = ctx.createRadialGradient(screenX + 50, y + 30, 10, screenX + 50, y + 30, 48);
            caveGrad.addColorStop(0, "#022c22");
            caveGrad.addColorStop(1, "#064e3b");
            ctx.fillStyle = caveGrad;
            ctx.beginPath();
            ctx.arc(screenX + 50, y + 30, 48, Math.PI, 0);
            ctx.fill();

            ctx.fillStyle = "#6ee7b7";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText("HANG PÁC BÓ - CAO BẰNG", screenX - 10, y - 25);
        } else {
            // ĐẠI LỄ ĐÀI QUẢNG TRƯỜNG BA ĐÌNH TRÁNG LỆ
            ctx.fillStyle = "#991b1b";
            ctx.fillRect(screenX, y - 20, 130, 80);
            ctx.fillStyle = "#fde047";
            ctx.fillRect(screenX, y - 25, 130, 6);

            // Cột cờ Tổ quốc vút cao giữa trời
            const cPoleGrad = ctx.createLinearGradient(screenX + 62, y - 100, screenX + 68, y - 100);
            cPoleGrad.addColorStop(0, "#94a3b8");
            cPoleGrad.addColorStop(0.5, "#ffffff");
            cPoleGrad.addColorStop(1, "#475569");
            ctx.fillStyle = cPoleGrad;
            ctx.fillRect(screenX + 62, y - 100, 6, 80);

            // Đại kỳ cờ đỏ sao vàng tung bay ngút trời
            const grandFlagWave = Math.sin(this.time * 6) * 7;
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(screenX + 68, y - 100, 52 + grandFlagWave, 34);
            ctx.fillStyle = "#fde047";
            ctx.font = "bold 18px sans-serif";
            ctx.fillText("★", screenX + 85, y - 76);

            ctx.fillStyle = "#fde047";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText("LỄ ĐÀI BA ĐÌNH (2/9/1945)", screenX + 10, y - 110);
        }
        ctx.restore();
    }

    // =========================================================================
    // 7. NGÔI SAO CÁCH MẠNG 3D TỎA HÀO QUANG
    // =========================================================================
    drawStars(stars, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const star of stars) {
            if (star.collected) continue;
            const screenX = star.x - cameraX;
            if (screenX < -30 || screenX > viewWidth + 30) continue;

            ctx.save();
            // Xung nhịp ánh sáng hào quang (Pulsing Glow)
            const pulse = Math.sin(this.time * 5 + star.x) * 4;
            const starGlow = ctx.createRadialGradient(screenX, star.y, 2, screenX, star.y, 16 + pulse);
            starGlow.addColorStop(0, "rgba(253, 224, 71, 0.7)");
            starGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
            ctx.fillStyle = starGlow;
            ctx.beginPath();
            ctx.arc(screenX, star.y, 16 + pulse, 0, Math.PI * 2);
            ctx.fill();

            // Ngôi sao vàng 5 cánh vát 3D
            ctx.fillStyle = "#fde047";
            ctx.font = "bold 17px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("★", screenX, star.y);
            ctx.restore();
        }
    }

    // =========================================================================
    // 8. CUỘN VĂN KIỆN DI SẢN THẾP VÀNG, NIÊM PHONG SÁP ĐỎ
    // =========================================================================
    drawDocuments(documents, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const doc of documents) {
            if (doc.collected) continue;
            const screenX = doc.x - cameraX;
            if (screenX < -40 || screenX > viewWidth + 40) continue;

            ctx.save();
            const docCenterY = doc.y + doc.height / 2;
            const docCenterX = screenX + doc.width / 2;

            // Hào quang tỏa tia sáng xoay tròn
            const docGlow = ctx.createRadialGradient(docCenterX, docCenterY, 4, docCenterX, docCenterY, 26);
            docGlow.addColorStop(0, "rgba(254, 240, 138, 0.6)");
            docGlow.addColorStop(1, "rgba(254, 240, 138, 0)");
            ctx.fillStyle = docGlow;
            ctx.beginPath();
            ctx.arc(docCenterX, docCenterY, 26, 0, Math.PI * 2);
            ctx.fill();

            // Cuộn giấy dó cổ truyền màu ngà vàng
            ctx.fillStyle = "#fef3c7";
            ctx.beginPath();
            ctx.roundRect(screenX + 2, doc.y + 2, doc.width - 4, doc.height - 4, 3);
            ctx.fill();
            ctx.strokeStyle = "#b45309";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Hai đầu trục cuốn gỗ gụ sơn son
            ctx.fillStyle = "#92400e";
            ctx.fillRect(screenX, doc.y, doc.width, 3);
            ctx.fillRect(screenX, doc.y + doc.height - 3, doc.width, 3);

            // Dải ruy băng cách mạng đỏ thắm
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(screenX + 2, doc.y + 13, doc.width - 4, 7);

            // Con dấu sáp son đỏ hoàng gia ở tâm
            ctx.fillStyle = "#b91c1c";
            ctx.beginPath();
            ctx.arc(docCenterX, doc.y + 16.5, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#fde047";
            ctx.font = "bold 8px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★", docCenterX, doc.y + 19);

            // Khi người chơi đến gần: Hiển thị huy hiệu tương tác bấm [E] ĐỌC
            if (doc.isNear) {
                const badgeY = doc.y - 16;
                ctx.save();
                ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
                ctx.strokeStyle = "#fbbf24";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(docCenterX - 26, badgeY - 10, 52, 18, 9);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("[E] ĐỌC", docCenterX, badgeY + 3);
                ctx.restore();
            } else {
                // Nhãn "VĂN KIỆN" lơ lửng phía trên
                ctx.fillStyle = "#fef08a";
                ctx.font = "bold 9px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("VĂN KIỆN", docCenterX, doc.y - 7);
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // 9. MẬT THÁM ÁO MĂNG-TÔ, MŨ PHỚT, ĐÈN BÃO & CHÙM SÁNG VOLUMETRIC
    // =========================================================================
    drawGuards(guards, cameraX, viewWidth = 1000) {
        const ctx = this.ctx;
        for (const guard of guards) {
            const screenX = guard.x - cameraX;
            if (screenX < -250 || screenX > viewWidth + 250) continue;

            ctx.save();
            const eyeX = guard.dir === 1 ? screenX + guard.width : screenX;
            const eyeY = guard.y + 18;

            // A. CHÙM ÁNH SÁNG VOLUMETRIC NÓN ĐÈN TUẦN TRA (Volumetric Lighting Cone)
            const targetX = eyeX + guard.dir * guard.visionRange;
            const spread = Math.tan(guard.visionAngle) * guard.visionRange;

            const coneGrad = ctx.createRadialGradient(eyeX, eyeY, 8, eyeX, eyeY, guard.visionRange);
            const isSuspicious = guard.crouchSuspicionTimer && guard.crouchSuspicionTimer > 40;
            if (isSuspicious) {
                // Ánh sáng chuyển sang vàng cam cảnh báo khi nghi ngờ
                coneGrad.addColorStop(0, "rgba(249, 115, 22, 0.65)");
                coneGrad.addColorStop(0.6, "rgba(239, 68, 68, 0.25)");
                coneGrad.addColorStop(1, "rgba(239, 68, 68, 0.0)");
            } else {
                coneGrad.addColorStop(0, "rgba(254, 240, 138, 0.5)");
                coneGrad.addColorStop(0.6, "rgba(254, 240, 138, 0.2)");
                coneGrad.addColorStop(1, "rgba(254, 240, 138, 0.0)");
            }

            ctx.fillStyle = coneGrad;
            ctx.beginPath();
            ctx.moveTo(eyeX, eyeY);
            ctx.lineTo(targetX, eyeY - spread);
            ctx.lineTo(targetX, eyeY + spread);
            ctx.closePath();
            ctx.fill();

            // B. TH N HÌNH MẬT THÁM PHÁP (Áo Măng-tô Xám Than & Mũ Phớt Fedora)
            // Áo khoác măng tô dài (Trench coat)
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(screenX + 4, guard.y + 16, 22, 28);
            // Ve áo măng-tô
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(screenX + 10, guard.y + 16);
            ctx.lineTo(screenX + 15, guard.y + 26);
            ctx.lineTo(screenX + 15, guard.y + 16);
            ctx.fill();

            // Cúc áo kim loại kép
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(screenX + 12, guard.y + 28, 1.2, 0, Math.PI * 2);
            ctx.arc(screenX + 12, guard.y + 36, 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Đầu & Khuôn mặt bí ẩn dưới vành mũ
            ctx.fillStyle = "#fed7aa";
            ctx.beginPath();
            ctx.arc(screenX + 15, guard.y + 11, 7.5, 0, Math.PI * 2);
            ctx.fill();

            // Mũ phớt Fedora cổ điển
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(screenX + 2, guard.y + 4, 26, 4); // Vành mũ rộng che nửa trán
            ctx.fillRect(screenX + 7, guard.y - 4, 16, 9); // Chóp mũ
            // Dải ruy băng xám trên mũ
            ctx.fillStyle = "#475569";
            ctx.fillRect(screenX + 7, guard.y + 2, 16, 2);

            // Đôi chân bước đi tuần
            ctx.fillStyle = "#0f172a";
            const legWalk = Math.sin(this.time * 6) * 4;
            ctx.fillRect(screenX + 6, guard.y + 44, 6, 8 + (guard.dir * legWalk));
            ctx.fillRect(screenX + 17, guard.y + 44, 6, 8 - (guard.dir * legWalk));

            // Đèn bão bọc đồng cầm tay (Hurricane Lantern)
            ctx.fillStyle = "#ca8a04";
            ctx.fillRect(eyeX - 3, eyeY - 6, 7, 10);
            ctx.fillStyle = "#fde047";
            ctx.fillRect(eyeX - 1, eyeY - 4, 3, 6);

            // SÚNG NGẮN CỦA MẬT THÁM KHI NGẮM / BẮN
            if (guard.isAiming || guard.shootCooldown > 0) {
                const gunHandX = eyeX + (guard.dir === 1 ? 5 : -5);
                const gunHandY = eyeY - 2;
                const barrelTipX = gunHandX + (guard.dir === 1 ? 13 : -13);

                // Cánh tay áo măng-tô vươn thẳng
                ctx.strokeStyle = "#1e293b";
                ctx.lineWidth = 4.5;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(screenX + 15, guard.y + 22);
                ctx.lineTo(gunHandX, gunHandY);
                ctx.stroke();

                // Thân súng lục đen bóng
                ctx.strokeStyle = "#0f172a";
                ctx.lineWidth = 3.2;
                ctx.beginPath();
                ctx.moveTo(gunHandX, gunHandY);
                ctx.lineTo(barrelTipX, gunHandY);
                ctx.stroke();

                // Báng súng gỗ nâu
                ctx.strokeStyle = "#78350f";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(gunHandX, gunHandY);
                ctx.lineTo(gunHandX - guard.dir * 3, gunHandY + 6);
                ctx.stroke();

                // Chớp lửa nòng súng khi bóp cò (Muzzle Flash)
                if (guard.muzzleFlashTimer && guard.muzzleFlashTimer > 0) {
                    ctx.fillStyle = "#fef08a";
                    ctx.beginPath();
                    ctx.arc(barrelTipX, gunHandY, 6, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#f97316";
                    ctx.beginPath();
                    ctx.arc(barrelTipX + guard.dir * 4, gunHandY, 3.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // C. BIỂU TƯỢNG CẢNH BÁO TRÊN ĐẦU MẬT THÁM (? NGHI VẤN / ! PHÁT HIỆN)
            if (guard.isAlerted || (guard.crouchSuspicionTimer && guard.crouchSuspicionTimer > 35)) {
                const iconY = guard.y - 12;
                if (guard.crouchSuspicionTimer >= 80 || guard.isAiming) {
                    // Dấu chấm than đỏ rực khi sắp phát hiện / đang ngắm bắn!
                    ctx.fillStyle = "#ef4444";
                    ctx.font = "bold 20px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("!", screenX + 15, iconY);

                    ctx.strokeStyle = "rgba(239, 68, 68, 0.65)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(screenX + 15, iconY - 6, 9 + Math.sin(this.time * 15) * 3, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    // Dấu hỏi vàng nghi vấn khi ngồi trước mắt quá lâu
                    ctx.fillStyle = "#fbbf24";
                    ctx.font = "bold 15px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("?", screenX + 15, iconY);
                }
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // 9.5. ĐƯỜNG ĐẠN BẮN CỦA MẬT THÁM (BULLET TRACERS)
    // =========================================================================
    drawBullets(bullets, cameraX, viewWidth = 1000) {
        if (!bullets || bullets.length === 0) return;
        const ctx = this.ctx;
        for (const b of bullets) {
            const screenX = b.x - cameraX;
            if (screenX < -50 || screenX > viewWidth + 50) continue;

            ctx.save();
            const tailX = screenX - b.dir * 18;
            const headX = screenX + b.dir * 4;

            // Vệt lửa đuôi đạn rực rỡ
            const bGrad = ctx.createLinearGradient(tailX, b.y, headX, b.y);
            bGrad.addColorStop(0, "rgba(239, 68, 68, 0)");
            bGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.8)");
            bGrad.addColorStop(1, "rgba(254, 240, 138, 1)");

            ctx.strokeStyle = bGrad;
            ctx.lineWidth = 3.2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(tailX, b.y);
            ctx.lineTo(headX, b.y);
            ctx.stroke();

            // Đầu đạn đồng vàng ánh kim
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(headX, b.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // =========================================================================
    // 10. NGƯỜI CHƠI (SPRITE VECTOR SẮC NÉT & HIỆU ỨNG NHẬP VAI CHUYÊN NGHIỆP)
    // =========================================================================
    drawPlayer(player, cameraX) {
        const ctx = this.ctx;
        const screenX = player.x - cameraX;

        ctx.save();

        // A. Hào quang bất tử bảo vệ khi vừa hồi sinh (Respawn Protection Aura)
        if (player.invulnerableTimer > 0 && !player.isDying) {
            const auraR = 26 + Math.sin(this.time * 8) * 3;
            const auraGrad = ctx.createRadialGradient(
                screenX + player.width / 2, player.y + player.height / 2, 6,
                screenX + player.width / 2, player.y + player.height / 2, auraR
            );
            auraGrad.addColorStop(0, "rgba(253, 224, 71, 0.45)");
            auraGrad.addColorStop(0.65, "rgba(103, 232, 249, 0.2)");
            auraGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
            ctx.fillStyle = auraGrad;
            ctx.beginPath();
            ctx.arc(screenX + player.width / 2, player.y + player.height / 2, auraR, 0, Math.PI * 2);
            ctx.fill();

            // Hiệu ứng nhấp nháy i-frame tần số cao chuẩn Mario/Celeste
            if (Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
                ctx.globalAlpha = 0.22;
            }
        }

        // B. Độ mờ khi đang nấp an toàn trong vùng ẩn nấp
        if (player.isHidden) {
            ctx.globalAlpha = 0.55;
            ctx.fillStyle = "#4ade80";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("✓ ĐANG NẤP", screenX + player.width / 2, player.y - 8);
        }

        // C. Hiệu ứng va chạm trúng bẫy (Hit Reaction Glow)
        if (player.isDying) {
            ctx.filter = "brightness(1.5) drop-shadow(0 0 10px #ef4444)";
        }

        // DÙNG ẢNH SPRITE VECTOR SẮC NÉT
        if (this.sprites.hasCustomPlayer && this.sprites.playerIdle.naturalWidth > 0) {
            let activeImg = this.sprites.playerIdle;
            if (!player.onGround && this.sprites.playerJump.naturalWidth > 0) {
                activeImg = this.sprites.playerJump;
            } else if (player.isCrouching && this.sprites.playerCrouch.naturalWidth > 0) {
                activeImg = this.sprites.playerCrouch;
            } else if (player.vx !== 0 && this.sprites.playerRun.naturalWidth > 0) {
                activeImg = this.sprites.playerRun;
            }

            const drawW = 34;
            const drawH = 50;
            const offsetY = player.isCrouching ? 5 : 0;

            ctx.save();
            ctx.translate(screenX + player.width / 2, player.y + player.height / 2);
            if (player.isDying) {
                ctx.rotate(-player.facing * 0.25);
            }
            ctx.scale(player.facing, 1);
            ctx.drawImage(
                activeImg,
                -drawW / 2,
                -drawH / 2 + offsetY,
                drawW,
                drawH
            );
            ctx.restore();
            ctx.restore();
            return;
        }

        // DỰ PHÒNG: Đồ họa Canvas nếu thiếu ảnh
        const pCenterX = screenX + player.width / 2;
        ctx.fillStyle = "#78350f";
        ctx.fillRect(screenX + 3, player.y + 15, player.width - 6, 22);
        ctx.fillStyle = "#fed7aa";
        ctx.beginPath();
        ctx.arc(pCenterX, player.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // =========================================================================
    // 12. HIỆU ỨNG KHÍ HẬU MÔI TRƯỜNG ĐẶC BIỆT
    // =========================================================================
    drawWeatherEffects(chapterId, width, height) {
        const ctx = this.ctx;
        if (chapterId === 2) {
            // Tuyết rơi đa tầng Moskva
            ctx.save();
            for (const sp of this.snowParticles) {
                sp.y += sp.speedY;
                sp.x += sp.speedX;
                if (sp.y > height) sp.y = -6;
                if (sp.x > width) sp.x = 0;
                if (sp.x < 0) sp.x = width;

                ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha})`;
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }
}
