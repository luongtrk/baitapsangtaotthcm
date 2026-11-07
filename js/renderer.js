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
    // HỆ THỐNG TẠO TEXTURE PATTERNS ĐỒ HỌA GAME 2D SẮC NÉT
    // =========================================================================
    initTextures() {
        // A. Texture Gỗ Bến Cảng (Beveled Wood Planks & Rivets)
        const canWood = document.createElement("canvas");
        canWood.width = 48;
        canWood.height = 24;
        const ctxWood = canWood.getContext("2d");
        ctxWood.fillStyle = "#6b2f0e";
        ctxWood.fillRect(0, 0, 48, 24);
        // Hai tầng ván gỗ xen kẽ màu
        ctxWood.fillStyle = "#7c3610";
        ctxWood.fillRect(0, 0, 48, 11);
        ctxWood.fillStyle = "#5c260a";
        ctxWood.fillRect(0, 12, 48, 11);
        // Khe ghép ván đen sẫm
        ctxWood.strokeStyle = "#2e1103";
        ctxWood.lineWidth = 1.5;
        ctxWood.beginPath();
        ctxWood.moveTo(0, 11.5); ctxWood.lineTo(48, 11.5);
        ctxWood.moveTo(0, 23.5); ctxWood.lineTo(48, 23.5);
        ctxWood.moveTo(16, 0); ctxWood.lineTo(16, 11.5);
        ctxWood.moveTo(36, 11.5); ctxWood.lineTo(36, 24);
        ctxWood.stroke();
        // Vân gỗ mảnh và viền bevel bắt sáng
        ctxWood.strokeStyle = "rgba(251, 191, 36, 0.16)";
        ctxWood.lineWidth = 1;
        ctxWood.beginPath();
        ctxWood.moveTo(0, 1.5); ctxWood.lineTo(48, 1.5);
        ctxWood.moveTo(0, 13); ctxWood.lineTo(48, 13);
        ctxWood.stroke();
        this.patterns.wood = this.ctx.createPattern(canWood, "repeat");

        // B. Texture Đá Cuội Paris Cổ Kính (Beveled Cobblestone Masonry)
        const canStone = document.createElement("canvas");
        canStone.width = 40;
        canStone.height = 24;
        const ctxStone = canStone.getContext("2d");
        ctxStone.fillStyle = "#1e293b";
        ctxStone.fillRect(0, 0, 40, 24);
        const drawBrick = (bx, by, bw, bh, tone) => {
            ctxStone.fillStyle = tone;
            ctxStone.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
            ctxStone.fillStyle = "rgba(255,255,255,0.14)";
            ctxStone.fillRect(bx + 1, by + 1, bw - 2, 2);
            ctxStone.fillStyle = "rgba(0,0,0,0.28)";
            ctxStone.fillRect(bx + 1, by + bh - 3, bw - 2, 2);
        };
        drawBrick(0, 0, 20, 12, "#334155");
        drawBrick(20, 0, 20, 12, "#3b495e");
        drawBrick(-10, 12, 20, 12, "#3b495e");
        drawBrick(10, 12, 20, 12, "#2d3a4f");
        drawBrick(30, 12, 20, 12, "#334155");
        this.patterns.stone = this.ctx.createPattern(canStone, "repeat");

        // C. Texture Gạch Tuyết Moskva (Frosty Ice-Rim Brick)
        const canSnowBrick = document.createElement("canvas");
        canSnowBrick.width = 36;
        canSnowBrick.height = 20;
        const ctxSnow = canSnowBrick.getContext("2d");
        ctxSnow.fillStyle = "#292524";
        ctxSnow.fillRect(0, 0, 36, 20);
        ctxSnow.fillStyle = "#44403c";
        ctxSnow.fillRect(1, 1, 16, 8);
        ctxSnow.fillStyle = "#57534e";
        ctxSnow.fillRect(19, 1, 16, 8);
        ctxSnow.fillStyle = "#44403c";
        ctxSnow.fillRect(10, 11, 16, 8);
        ctxSnow.fillRect(-8, 11, 16, 8);
        ctxSnow.fillRect(28, 11, 16, 8);
        // Vết băng giá xanh ngọc
        ctxSnow.fillStyle = "rgba(186, 230, 253, 0.22)";
        ctxSnow.fillRect(2, 1, 14, 2);
        ctxSnow.fillRect(11, 11, 14, 2);
        this.patterns.snowBrick = this.ctx.createPattern(canSnowBrick, "repeat");

        // D. Texture Đá Rêu Pác Bó (Deep Mossy Limestone Strata)
        const canMoss = document.createElement("canvas");
        canMoss.width = 44;
        canMoss.height = 26;
        const ctxMoss = canMoss.getContext("2d");
        ctxMoss.fillStyle = "#0f3f22";
        ctxMoss.fillRect(0, 0, 44, 26);
        ctxMoss.fillStyle = "#14532d";
        ctxMoss.fillRect(2, 2, 18, 10);
        ctxMoss.fillRect(22, 12, 20, 11);
        ctxMoss.strokeStyle = "#052e16";
        ctxMoss.lineWidth = 1.5;
        ctxMoss.beginPath();
        ctxMoss.moveTo(0, 9); ctxMoss.bezierCurveTo(15, 6, 28, 12, 44, 9);
        ctxMoss.moveTo(0, 19); ctxMoss.bezierCurveTo(12, 22, 32, 16, 44, 19);
        ctxMoss.stroke();
        ctxMoss.fillStyle = "rgba(74, 222, 128, 0.22)";
        ctxMoss.fillRect(4, 3, 10, 3);
        ctxMoss.fillRect(24, 13, 12, 3);
        this.patterns.mossRock = this.ctx.createPattern(canMoss, "repeat");

        // E. Texture Mái Ngói Vảy Cá Cổ Thăng Long (Terracotta Fish-Scale Roof Tiles)
        const canTile = document.createElement("canvas");
        canTile.width = 24;
        canTile.height = 16;
        const ctxTile = canTile.getContext("2d");
        ctxTile.fillStyle = "#7f1d1d";
        ctxTile.fillRect(0, 0, 24, 16);
        ctxTile.fillStyle = "#991b1b";
        ctxTile.beginPath();
        ctxTile.arc(12, 8, 10, Math.PI, 0);
        ctxTile.fill();
        ctxTile.strokeStyle = "#450a0a";
        ctxTile.lineWidth = 1.4;
        ctxTile.beginPath();
        ctxTile.arc(12, 8, 10, Math.PI, 0);
        ctxTile.stroke();
        ctxTile.strokeStyle = "rgba(252, 165, 165, 0.45)";
        ctxTile.lineWidth = 1;
        ctxTile.beginPath();
        ctxTile.arc(12, 7.5, 8.5, Math.PI * 1.15, Math.PI * 1.85);
        ctxTile.stroke();
        this.patterns.roofTile = this.ctx.createPattern(canTile, "repeat");

        // F. Texture Đá Hoa Cương Ba Đình (Imperial Royal Marble)
        const canMarble = document.createElement("canvas");
        canMarble.width = 48;
        canMarble.height = 24;
        const ctxMarble = canMarble.getContext("2d");
        ctxMarble.fillStyle = "#78350f";
        ctxMarble.fillRect(0, 0, 48, 24);
        ctxMarble.fillStyle = "rgba(255,255,255,0.06)";
        ctxMarble.fillRect(1, 1, 22, 10);
        ctxMarble.fillRect(25, 13, 22, 10);
        ctxMarble.strokeStyle = "rgba(251, 191, 36, 0.32)";
        ctxMarble.lineWidth = 1.2;
        ctxMarble.beginPath();
        ctxMarble.moveTo(0, 12); ctxMarble.lineTo(18, 4); ctxMarble.lineTo(34, 18); ctxMarble.lineTo(48, 10);
        ctxMarble.stroke();
        this.patterns.marble = this.ctx.createPattern(canMarble, "repeat");
    }

    // =========================================================================
    // HELPER: VẼ NÚT PHÍM CƠ 3D TRÊN CANVAS ([E], [Q]) & ICON ĐỒ HỌA
    // =========================================================================
    drawKeycap(x, y, keyText, accentColor = "#d4a349", cooldownRatio = 0) {
        const ctx = this.ctx;
        ctx.save();
        const w = 22;
        const h = 20;
        const rx = x - w / 2;
        const ry = y - h / 2;

        // Đế bóng cứng góc cạnh đồng bộ với Menu
        ctx.fillStyle = "#090706";
        ctx.fillRect(rx + 2, ry + 3, w, h);

        // Mặt phím vuông vức #211c17 viền đồng
        ctx.fillStyle = cooldownRatio > 0 ? "#161310" : "#211c17";
        ctx.fillRect(rx, ry, w, h);

        // Lớp phủ tiến trình hồi chiêu từ dưới lên (không dùng chữ rườm rà)
        if (cooldownRatio > 0) {
            const fillH = h * (1 - cooldownRatio);
            ctx.fillStyle = "rgba(212, 163, 73, 0.25)";
            ctx.fillRect(rx, ry + h - fillH, w, fillH);
        }

        ctx.strokeStyle = cooldownRatio > 0 ? "#594d3f" : accentColor;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(rx, ry, w, h);

        // Ký tự phím
        ctx.fillStyle = cooldownRatio > 0 ? "#756857" : "#efe6d5";
        ctx.font = "700 11px 'Courier Prime', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(keyText, x, ry + h / 2 + 0.5);
        ctx.restore();
    }

    drawSupplyIcon(type, cx, cy, scale = 1) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        if (type === "shield") {
            // Khiên Áo Trấn Thủ lục bảo viền vàng
            ctx.fillStyle = "#10b981";
            ctx.strokeStyle = "#ecfdf5";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(7, -5);
            ctx.lineTo(7, 1);
            ctx.quadraticCurveTo(7, 7, 0, 9);
            ctx.quadraticCurveTo(-7, 7, -7, 1);
            ctx.lineTo(-7, -5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#fde047";
            ctx.font = "700 8px 'Be Vietnam Pro', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("★", 0, 0.5);
        } else if (type === "speed") {
            // Tia chớp tốc độ vàng rực
            ctx.fillStyle = "#facc15";
            ctx.strokeStyle = "#713f12";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(2, -9);
            ctx.lineTo(-6, 1);
            ctx.lineTo(-1, 1);
            ctx.lineTo(-3, 9);
            ctx.lineTo(6, -1);
            ctx.lineTo(1, -1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (type === "disguise") {
            // Mũ phớt & mặt nạ cải trang tím neon
            ctx.fillStyle = "#c084fc";
            ctx.fillRect(-8, -2, 16, 2.5);
            ctx.beginPath();
            ctx.roundRect(-5, -8, 10, 6.5, 2);
            ctx.fill();
            // Kính cải trang trắng sáng
            ctx.strokeStyle = "#f8fafc";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(-3.2, 3.5, 2.5, 0, Math.PI * 2);
            ctx.arc(3.2, 3.5, 2.5, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Trái tim / Chữ thập hồi máu Lương Khô
            ctx.fillStyle = "#22c55e";
            ctx.strokeStyle = "#dcfce7";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(-2.5, -7, 5, 14, 1.5);
            ctx.roundRect(-7, -2.5, 14, 5, 1.5);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
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

        const {
            currentLevel,
            player,
            guards,
            documents,
            stars,
            particles,
            cameraX,
            screenShake = 0,
            bullets = [],
            pebbles = [],
            supplies = [],
            npcs = [],
            shortcuts = [],
            nearGuardForTakedown = false,
            nearNpc = null,
            starsCount = 0
        } = gameState;

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

        // 4.5. Vẽ Lối tắt bí mật (cầu ván hoặc đường vượt cạm bẫy do đồng chí liên lạc mở)
        this.drawShortcuts(shortcuts, cameraX, width);

        // 5. Vẽ Cột mốc cờ đỏ sao vàng uốn lượn hình sin 3D
        this.drawCheckpoints(currentLevel.checkpoints, cameraX, width);

        // 6. Vẽ Điểm đích màn chơi lộng lẫy (Tàu thủy, Tàu hỏa, Hang Pác Bó, Đại Lễ Đài)
        this.drawExit(currentLevel, cameraX, width);

        // 6.5. Vẽ Vật phẩm tiếp tế cách mạng (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang, Lương Khô)
        this.drawSupplies(supplies, cameraX, width);

        // 6.8. Vẽ Đồng chí liên lạc viên bí mật
        this.drawNpcs(npcs, cameraX, width, starsCount);

        // 7. Vẽ Ngôi sao cách mạng 3D tỏa hào quang
        this.drawStars(stars, cameraX, width);

        // 8. Vẽ Cuộn Văn Kiện Di Sản thếp vàng, niêm phong sáp đỏ
        this.drawDocuments(documents, cameraX, width);

        // 9. Vẽ Mật thám áo măng-tô, mũ phớt, đèn bão, nón sáng & súng
        this.drawGuards(guards, cameraX, width);

        // 9.5. Vẽ Sỏi nghi binh bay & nảy trên địa hình
        this.drawPebbles(pebbles, cameraX, width);

        // 10. Vẽ Đường đạn bắn của mật thám
        this.drawBullets(bullets, cameraX, width);

        // 11. Vẽ Người chơi (Sprite Vector sắc nét, nhấp nháy i-frame, khiên Áo Trấn Thủ, vệt bóng dép cao su & cải trang)
        this.drawPlayer(player, cameraX, nearGuardForTakedown, nearNpc);

        // 12. Vẽ Hạt hiệu ứng & Chữ nổi Canvas
        particles.draw(ctx, cameraX);

        // 12. Hiệu ứng khí hậu đặc biệt (Tuyết rơi đa tầng Moskva)
        this.drawWeatherEffects(currentLevel.id, width, height);

        // 13. Lớp phủ Vignette cổ điển & khung viền đồng bộ với giao diện Menu góc cạnh
        ctx.save();
        const vig = ctx.createRadialGradient(
            width / 2, height / 2, Math.min(width, height) * 0.35,
            width / 2, height / 2, Math.max(width, height) * 0.72
        );
        vig.addColorStop(0, "rgba(22, 19, 16, 0)");
        vig.addColorStop(1, "rgba(14, 12, 10, 0.42)");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Chớp đỏ màn hình (Hit Flash Vignette) khi bị chấn động va chạm
        if (screenShake > 3) {
            ctx.save();
            const flashAlpha = Math.min(0.28, screenShake / 35);
            ctx.fillStyle = `rgba(185, 28, 28, ${flashAlpha})`;
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
            if (p.isShortcut) continue; // Cầu bí mật được vẽ riêng trong drawShortcuts
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

            // Icon con mắt ẩn thân tinh tế thay vì chữ "NẤP"
            const cx = screenX + spot.w / 2;
            const cy = spot.y - 8;
            ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 6, 3.2, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - 5, cy + 4);
            ctx.lineTo(cx + 5, cy - 4);
            ctx.stroke();

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
                ctx.font = "700 11px 'Be Vietnam Pro', sans-serif";
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

            // Bảng tên đích góc cạnh đồng bộ với Menu
            ctx.fillStyle = "#090706";
            ctx.fillRect(screenX - 16, y - 59, 168, 22);
            ctx.fillStyle = "#211c17";
            ctx.fillRect(screenX - 18, y - 61, 168, 22);
            ctx.strokeStyle = "#d4a349";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(screenX - 18, y - 61, 168, 22);
            ctx.fillStyle = "#d4a349";
            ctx.font = "700 11px 'Oswald', sans-serif";
            ctx.fillText("⚓ LATOUCHE-TRÉVILLE (1911)", screenX - 10, y - 46);
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

            ctx.fillStyle = "#090706";
            ctx.fillRect(screenX, y - 31, 126, 22);
            ctx.fillStyle = "#211c17";
            ctx.fillRect(screenX - 2, y - 33, 126, 22);
            ctx.strokeStyle = "#d4a349";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(screenX - 2, y - 33, 126, 22);
            ctx.fillStyle = "#d4a349";
            ctx.font = "700 11px 'Oswald', sans-serif";
            ctx.fillText("🚂 QUẢNG CHÂU (1927)", screenX + 6, y - 18);
        } else if (level.exitType === "cave") {
            // Cửa Hang Pác Bó thiêng liêng
            const caveGrad = ctx.createRadialGradient(screenX + 50, y + 30, 10, screenX + 50, y + 30, 48);
            caveGrad.addColorStop(0, "#022c22");
            caveGrad.addColorStop(1, "#064e3b");
            ctx.fillStyle = caveGrad;
            ctx.beginPath();
            ctx.arc(screenX + 50, y + 30, 48, Math.PI, 0);
            ctx.fill();

            ctx.fillStyle = "#090706";
            ctx.fillRect(screenX - 2, y - 41, 108, 22);
            ctx.fillStyle = "#211c17";
            ctx.fillRect(screenX - 4, y - 43, 108, 22);
            ctx.strokeStyle = "#d4a349";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(screenX - 4, y - 43, 108, 22);
            ctx.fillStyle = "#d4a349";
            ctx.font = "700 11px 'Oswald', sans-serif";
            ctx.fillText("⛰️ PÁC BÓ (1941)", screenX + 4, y - 28);
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
            ctx.font = "800 18px 'Be Vietnam Pro', sans-serif";
            ctx.fillText("★", screenX + 85, y - 76);

            ctx.fillStyle = "#090706";
            ctx.fillRect(screenX + 2, y - 127, 136, 22);
            ctx.fillStyle = "#211c17";
            ctx.fillRect(screenX, y - 129, 136, 22);
            ctx.strokeStyle = "#d4a349";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(screenX, y - 129, 136, 22);
            ctx.fillStyle = "#d4a349";
            ctx.font = "700 12px 'Oswald', sans-serif";
            ctx.fillText("★ BA ĐÌNH (2/9/1945)", screenX + 10, y - 114);
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
            ctx.strokeStyle = "#92400e";
            ctx.lineWidth = 2;
            ctx.font = "800 17px 'Be Vietnam Pro', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeText("★", screenX, star.y);
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
            docGlow.addColorStop(0, "rgba(254, 240, 138, 0.65)");
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
            ctx.font = "800 8px 'Be Vietnam Pro', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★", docCenterX, doc.y + 19);

            // Khi người chơi đến gần: chỉ hiện nút phím cơ [E] sắc nét
            if (doc.isNear) {
                const badgeY = doc.y - 16 + Math.sin(this.time * 7) * 2;
                this.drawKeycap(docCenterX, badgeY, "E", "#fbbf24");
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

            const isStunned = guard.stunTimer && guard.stunTimer > 0;

            // A. CHÙM ÁNH SÁNG VOLUMETRIC NÓN ĐÈN TUẦN TRA (Chỉ bật khi không bị choáng/bất tỉnh)
            if (!isStunned) {
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
            }

            // B. THÂN HÌNH MẬT THÁM PHÁP (Áo Măng-tô Xám Than & Mũ Phớt Fedora)
            // Áo khoác măng tô dài (Trench coat)
            ctx.fillStyle = isStunned ? "#334155" : "#1e293b";
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
            ctx.fillStyle = isStunned ? "#cbd5e1" : "#fed7aa";
            ctx.beginPath();
            ctx.arc(screenX + 15, guard.y + 11, 7.5, 0, Math.PI * 2);
            ctx.fill();

            // Mũ phớt Fedora cổ điển (nếu bị choáng thì mũ hơi lệch)
            ctx.fillStyle = "#0f172a";
            const hatTilt = isStunned ? 3 : 0;
            ctx.fillRect(screenX + 2, guard.y + 4 + hatTilt, 26, 4); // Vành mũ rộng che nửa trán
            ctx.fillRect(screenX + 7, guard.y - 4 + hatTilt, 16, 9); // Chóp mũ
            // Dải ruy băng xám trên mũ
            ctx.fillStyle = "#475569";
            ctx.fillRect(screenX + 7, guard.y + 2 + hatTilt, 16, 2);

            // Đôi chân bước đi tuần
            ctx.fillStyle = "#0f172a";
            const legWalk = isStunned ? 0 : Math.sin(this.time * 6) * 4;
            ctx.fillRect(screenX + 6, guard.y + 44, 6, 8 + (guard.dir * legWalk));
            ctx.fillRect(screenX + 17, guard.y + 44, 6, 8 - (guard.dir * legWalk));

            // Đèn bão bọc đồng cầm tay (Hurricane Lantern) - nếu choáng thì đèn tắt tối
            ctx.fillStyle = "#ca8a04";
            ctx.fillRect(eyeX - 3, eyeY - 6, 7, 10);
            ctx.fillStyle = isStunned ? "#475569" : "#fde047";
            ctx.fillRect(eyeX - 1, eyeY - 4, 3, 6);

            // SÚNG NGẮN CỦA MẬT THÁM KHI NGẮM / BẮN (chỉ vẽ khi không bị choáng)
            if (!isStunned && (guard.isAiming || guard.shootCooldown > 0)) {
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

            // C. HIỆU ỨNG CHOÁNG BẤT TỈNH SAU LƯNG (STUNNED BY TAKEDOWN - Vòng sao xoay tròn + thanh đếm ngược)
            if (isStunned) {
                const stunAngle = this.time * 7;
                for (let s = 0; s < 3; s++) {
                    const a = stunAngle + (s * (Math.PI * 2 / 3));
                    const sx = screenX + 15 + Math.cos(a) * 15;
                    const sy = guard.y - 10 + Math.sin(a) * 5;
                    ctx.fillStyle = "#facc15";
                    ctx.font = "800 10px 'Be Vietnam Pro', sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("★", sx, sy);
                }
                // Thanh thời gian choáng nhỏ gọn
                const stunRatio = Math.max(0, Math.min(1, guard.stunTimer / 360));
                ctx.fillStyle = "#090d16";
                ctx.fillRect(screenX + 3, guard.y - 22, 24, 4);
                ctx.fillStyle = "#facc15";
                ctx.fillRect(screenX + 3, guard.y - 22, 24 * stunRatio, 4);
            }
            // D. HIỆU ỨNG ĐI ĐIỀU TRA ÂM THANH NÉM SỎI (DISTRACTED / INVESTIGATING)
            else if (guard.investigateTimer && guard.investigateTimer > 0) {
                const iconY = guard.y - 14 + Math.sin(this.time * 6) * 2;
                ctx.fillStyle = "#090706";
                ctx.fillRect(screenX + 7, iconY - 8, 20, 20);
                ctx.fillStyle = "#211c17";
                ctx.fillRect(screenX + 5, iconY - 10, 20, 20);
                ctx.strokeStyle = "#d4a349";
                ctx.lineWidth = 1.8;
                ctx.strokeRect(screenX + 5, iconY - 10, 20, 20);

                ctx.fillStyle = "#d4a349";
                ctx.font = "700 13px 'Courier Prime', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("?", screenX + 15, iconY + 0.5);
            }
            // E. BIỂU TƯỢNG CẢNH BÁO TRÊN ĐẦU MẬT THÁM (? NGHI VẤN / ! PHÁT HIỆN)
            else if (guard.isAlerted || (guard.crouchSuspicionTimer && guard.crouchSuspicionTimer > 35)) {
                const iconY = guard.y - 14;
                if (guard.crouchSuspicionTimer >= 80 || guard.isAiming) {
                    // Huy hiệu chấm than đỏ góc cạnh khi phát hiện!
                    ctx.fillStyle = "#090706";
                    ctx.fillRect(screenX + 6, iconY - 8, 22, 20);
                    ctx.fillStyle = "#9e2222";
                    ctx.fillRect(screenX + 4, iconY - 10, 22, 20);
                    ctx.strokeStyle = "#d4a349";
                    ctx.lineWidth = 1.8;
                    ctx.strokeRect(screenX + 4, iconY - 10, 22, 20);

                    ctx.fillStyle = "#efe6d5";
                    ctx.font = "700 14px 'Courier Prime', monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("!", screenX + 15, iconY + 0.5);
                } else {
                    // Dấu hỏi vàng nghi vấn góc cạnh
                    ctx.fillStyle = "#090706";
                    ctx.fillRect(screenX + 7, iconY - 8, 20, 20);
                    ctx.fillStyle = "#211c17";
                    ctx.fillRect(screenX + 5, iconY - 10, 20, 20);
                    ctx.strokeStyle = "#d4a349";
                    ctx.lineWidth = 1.8;
                    ctx.strokeRect(screenX + 5, iconY - 10, 20, 20);

                    ctx.fillStyle = "#d4a349";
                    ctx.font = "700 13px 'Courier Prime', monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("?", screenX + 15, iconY + 0.5);
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
    drawPlayer(player, cameraX, nearGuardForTakedown = false, nearNpc = null) {
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

        // B. Hào quang Khiên Áo Trấn Thủ (Cách mạng kháng chiến)
        if (player.hasShield && !player.isDying) {
            const shieldR = 27 + Math.sin(this.time * 6) * 2.5;
            ctx.save();
            ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
            ctx.lineWidth = 2.2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.arc(screenX + player.width / 2, player.y + player.height / 2, shieldR, 0, Math.PI * 2);
            ctx.stroke();

            // Vòng hào quang sáng ngọc
            const sGrad = ctx.createRadialGradient(
                screenX + player.width / 2, player.y + player.height / 2, 8,
                screenX + player.width / 2, player.y + player.height / 2, shieldR
            );
            sGrad.addColorStop(0, "rgba(52, 211, 153, 0.1)");
            sGrad.addColorStop(1, "rgba(16, 185, 129, 0.25)");
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.arc(screenX + player.width / 2, player.y + player.height / 2, shieldR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // C. Vệt bóng mờ thần tốc khi mang Dép Cao Su Vạn Dặm
        if (player.speedBoostTimer > 0 && Math.abs(player.vx) > 0.5) {
            ctx.save();
            ctx.fillStyle = "rgba(250, 204, 21, 0.25)";
            const trailOffset = -player.facing * 12;
            ctx.fillRect(screenX + trailOffset + 4, player.y + 12, player.width, player.height - 12);
            ctx.restore();
        }

        // D. Huy hiệu Icon + Vòng cung đếm ngược thời gian Buff (Zero-text Game HUD trên đầu nhân vật)
        const headCenterX = screenX + player.width / 2;
        const headBadgeY = player.y - 14;
        if (player.isHidden) {
            ctx.globalAlpha = 0.55;
            // Icon con mắt ẩn thân màu xanh lá
            ctx.save();
            ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
            ctx.strokeStyle = "#4ade80";
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(headCenterX, headBadgeY, 9.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#4ade80";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.ellipse(headCenterX, headBadgeY, 5, 2.8, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(headCenterX - 4, headBadgeY + 4);
            ctx.lineTo(headCenterX + 4, headBadgeY - 4);
            ctx.stroke();
            ctx.restore();
        } else if (player.disguiseTimer > 0) {
            // Huy hiệu Cải Trang + Vòng cung đếm ngược thời gian (Radial Timer Ring)
            const ratio = Math.max(0, Math.min(1, player.disguiseTimer / 720));
            ctx.save();
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.beginPath();
            ctx.arc(headCenterX, headBadgeY, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(192, 132, 252, 0.25)";
            ctx.lineWidth = 2.4;
            ctx.stroke();
            // Vòng cung tiến trình
            ctx.strokeStyle = "#c084fc";
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(headCenterX, headBadgeY, 11, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
            ctx.stroke();
            this.drawSupplyIcon("disguise", headCenterX, headBadgeY, 0.72);
            ctx.restore();
        } else if (player.speedBoostTimer > 0) {
            // Huy hiệu Tăng Tốc + Vòng cung đếm ngược thời gian
            const ratio = Math.max(0, Math.min(1, player.speedBoostTimer / 480));
            ctx.save();
            ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            ctx.beginPath();
            ctx.arc(headCenterX, headBadgeY, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(headCenterX, headBadgeY, 11, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
            ctx.stroke();
            this.drawSupplyIcon("speed", headCenterX, headBadgeY, 0.72);
            ctx.restore();
        }

        // E. Hiệu ứng va chạm trúng bẫy (Hit Reaction Glow)
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
        } else {
            // DỰ PHÒNG: Đồ họa Canvas nếu thiếu ảnh
            const pCenterX = screenX + player.width / 2;
            ctx.fillStyle = "#78350f";
            ctx.fillRect(screenX + 3, player.y + 15, player.width - 6, 22);
            ctx.fillStyle = "#fed7aa";
            ctx.beginPath();
            ctx.arc(pCenterX, player.y + 8, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // F. Nút phím cơ [Q] khi áp sát sau lưng mật thám (kèm thanh nạp hồi chiêu không dùng chữ)
        if (nearGuardForTakedown && !player.isDying) {
            const cdRatio = player.maxTakedownCooldown > 0
                ? Math.max(0, Math.min(1, (player.takedownCooldown || 0) / player.maxTakedownCooldown))
                : 0;
            const badgeY = player.y - 32 + (cdRatio > 0 ? 0 : Math.sin(this.time * 8) * 2);
            this.drawKeycap(headCenterX, badgeY, "Q", "#ef4444", cdRatio);
        }

        ctx.restore();
    }

    // =========================================================================
    // 10.5. VẼ SỎI NGHI BINH ĐÁNH LẠC HƯỚNG
    // =========================================================================
    drawPebbles(pebbles, cameraX, viewWidth = 1000) {
        if (!pebbles || pebbles.length === 0) return;
        const ctx = this.ctx;
        for (const p of pebbles) {
            const sx = p.x - cameraX;
            if (sx < -30 || sx > viewWidth + 30) continue;

            ctx.save();
            // Vệt đuôi quán tính
            ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx - p.vx * 2, p.y - p.vy * 2);
            ctx.lineTo(sx, p.y);
            ctx.stroke();

            // Viên sỏi xoay tròn
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(sx, p.y, p.radius || 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#f8fafc";
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }
    }

    // =========================================================================
    // 10.8. VẼ VẬT PHẨM TIẾP TẾ CÁCH MẠNG (HUY HIỆU GAME LỤC GIÁC + ICON VECTOR, KHÔNG DÙNG CHỮ RƯỜM RÀ)
    // =========================================================================
    drawSupplies(supplies, cameraX, viewWidth = 1000) {
        if (!supplies || supplies.length === 0) return;
        const ctx = this.ctx;
        for (const item of supplies) {
            if (item.collected) continue;
            const sx = item.x - cameraX;
            if (sx < -50 || sx > viewWidth + 50) continue;

            ctx.save();
            const cx = sx + 12;
            const cy = item.y + 12;

            // Màu chủ đạo theo loại trang bị
            let glowColor = "rgba(34, 197, 94, 0.5)";
            let rimColor = "#4ade80";
            let bgColor = "#064e3b";
            if (item.type === "shield") {
                glowColor = "rgba(16, 185, 129, 0.55)";
                rimColor = "#34d399";
                bgColor = "#064e3b";
            } else if (item.type === "speed") {
                glowColor = "rgba(250, 204, 21, 0.55)";
                rimColor = "#fde047";
                bgColor = "#422006";
            } else if (item.type === "disguise") {
                glowColor = "rgba(192, 132, 252, 0.55)";
                rimColor = "#d8b4fe";
                bgColor = "#3b0764";
            }

            // Hào quang xung nhịp phía sau
            const pulseR = 19 + Math.sin(this.time * 5 + item.x) * 3;
            const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, pulseR);
            grad.addColorStop(0, glowColor);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
            ctx.fill();

            // Khung huy hiệu lục giác kim loại (Hexagonal Tactical Medallion)
            const r = 13;
            ctx.fillStyle = bgColor;
            ctx.strokeStyle = rimColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 6;
                const hx = cx + r * Math.cos(angle);
                const hy = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Vẽ Icon đồ họa sắc nét ở tâm huy hiệu
            this.drawSupplyIcon(item.type, cx, cy, 1);

            ctx.restore();
        }
    }

    // =========================================================================
    // 10.9. VẼ ĐỒNG CHÍ LIÊN LẠC VIÊN BÍ MẬT (BONG BÓNG ĐỔI SAO ★ BẰNG ICON)
    // =========================================================================
    drawNpcs(npcs, cameraX, viewWidth = 1000, starsCount = 0) {
        if (!npcs || npcs.length === 0) return;
        const ctx = this.ctx;
        for (const npc of npcs) {
            const sx = npc.x - cameraX;
            if (sx < -100 || sx > viewWidth + 100) continue;

            ctx.save();
            const pCenterX = sx + npc.width / 2;

            // Hào quang chân đồng chí liên lạc
            if (!npc.talked) {
                const baseGlow = ctx.createRadialGradient(pCenterX, npc.y + 44, 2, pCenterX, npc.y + 44, 22);
                baseGlow.addColorStop(0, "rgba(16, 185, 129, 0.35)");
                baseGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
                ctx.fillStyle = baseGlow;
                ctx.beginPath();
                ctx.ellipse(pCenterX, npc.y + 46, 20, 6, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Thân người đồng chí cách mạng (Áo trấn thủ xanh chàm + khăn quàng đỏ)
            ctx.fillStyle = "#1e3a8a";
            ctx.beginPath();
            ctx.roundRect(sx + 4, npc.y + 16, npc.width - 8, 24, 3);
            ctx.fill();
            ctx.fillStyle = "#dc2626";
            ctx.fillRect(sx + 6, npc.y + 16, npc.width - 12, 4);

            // Đầu và khuôn mặt
            ctx.fillStyle = "#fed7aa";
            ctx.beginPath();
            ctx.arc(pCenterX, npc.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();

            // Mũ beret / mũ ca-lô có ngôi sao nhỏ
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(pCenterX, npc.y + 6, 9, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = "#fbbf24";
            ctx.font = "800 7px 'Be Vietnam Pro', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★", pCenterX, npc.y + 5);

            // Đôi chân
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(sx + 6, npc.y + 40, 5, 10);
            ctx.fillRect(sx + npc.width - 11, npc.y + 40, 5, 10);

            // Bong bóng trao đổi bằng Icon (Trade Pill: ★ 2/3 ▸ [Icon Quà])
            const bobY = npc.y - 18 + Math.sin(this.time * 5) * 2.5;
            if (!npc.talked) {
                const cost = npc.starCost || 3;
                const canAfford = starsCount >= cost;
                const pillW = 68;
                const pillH = 22;
                const pillX = pCenterX - pillW / 2;
                const pillY = bobY - pillH / 2;

                // Đế bóng cứng góc cạnh đồng bộ với giao diện Menu & HUD
                ctx.fillStyle = "#090706";
                ctx.fillRect(pillX + 3, pillY + 3, pillW, pillH);

                // Khung bảng trao đổi góc cạnh #211c17
                ctx.fillStyle = "#211c17";
                ctx.fillRect(pillX, pillY, pillW, pillH);
                ctx.strokeStyle = canAfford ? "#75965d" : "#d4a349";
                ctx.lineWidth = 1.8;
                ctx.strokeRect(pillX, pillY, pillW, pillH);

                // Sao + Số lượng hiện có / Giá đổi
                ctx.fillStyle = canAfford ? "#fde047" : "#fca5a5";
                ctx.font = "700 11px 'Courier Prime', monospace";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(`★${Math.min(starsCount, cost)}/${cost}`, pillX + 6, bobY + 0.5);

                // Mũi tên đổi
                ctx.fillStyle = "#a69882";
                ctx.font = "700 10px 'Courier Prime', monospace";
                ctx.fillText("▸", pillX + 39, bobY + 0.5);

                // Icon vật phẩm phần thưởng bên phải
                this.drawSupplyIcon(npc.giftType || "shield", pillX + 55, bobY, 0.72);

                // Nếu đứng gần: Hiện nút phím cơ 3D [E] phía trên bong bóng
                if (npc.isNear) {
                    this.drawKeycap(pCenterX, pillY - 13, "E", canAfford ? "#75965d" : "#d4a349");
                }
            } else {
                // Đã liên lạc xong: Huy hiệu dấu tích vuông vức
                ctx.fillStyle = "#090706";
                ctx.fillRect(pCenterX - 7, bobY - 7, 18, 18);
                ctx.fillStyle = "#4d8b31";
                ctx.fillRect(pCenterX - 9, bobY - 9, 18, 18);
                ctx.strokeStyle = "#d4a349";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(pCenterX - 9, bobY - 9, 18, 18);
                ctx.fillStyle = "#ffffff";
                ctx.font = "700 11px 'Courier Prime', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("✓", pCenterX, bobY + 0.5);
            }

            ctx.restore();
        }
    }

    // =========================================================================
    // 10.10. VẼ LỐI TẮT BÍ MẬT (SECRET SHORTCUTS / BRIDGES - ICON KHÓA GỌN GÀNG)
    // =========================================================================
    drawShortcuts(shortcuts, cameraX, viewWidth = 1000) {
        if (!shortcuts || shortcuts.length === 0) return;
        const ctx = this.ctx;
        for (const sc of shortcuts) {
            const sx = sc.x - cameraX;
            if (sx < -sc.w || sx > viewWidth + sc.w) continue;

            ctx.save();
            if (sc.isOpen) {
                // Cầu gỗ bí mật đã được mở
                ctx.fillStyle = this.patterns.wood || "#78350f";
                ctx.fillRect(sx, sc.y, sc.w, sc.h);

                // Viền ván gỗ trên sáng rõ
                ctx.fillStyle = "#d97706";
                ctx.fillRect(sx, sc.y, sc.w, 3.5);

                // Lan can dây thừng chiến thuật
                ctx.strokeStyle = "#b45309";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sx, sc.y - 10);
                ctx.quadraticCurveTo(sx + sc.w / 2, sc.y - 2, sx + sc.w, sc.y - 10);
                ctx.stroke();

                // Cọc gỗ hai đầu cầu
                ctx.fillStyle = "#78350f";
                ctx.fillRect(sx, sc.y - 12, 5, 14);
                ctx.fillRect(sx + sc.w - 5, sc.y - 12, 5, 14);

                // Đinh tán đồng dọc thân cầu
                ctx.fillStyle = "#fde047";
                for (let x = sx + 10; x < sx + sc.w; x += 26) {
                    ctx.beginPath();
                    ctx.arc(x, sc.y + 6, 1.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Cầu chưa mở: khung nét đứt + Huy hiệu khóa ★3 góc cạnh ở giữa
                ctx.strokeStyle = "rgba(212, 163, 73, 0.45)";
                ctx.lineWidth = 1.8;
                ctx.setLineDash([6, 6]);
                ctx.strokeRect(sx, sc.y, sc.w, sc.h);
                ctx.setLineDash([]);

                const midX = sx + sc.w / 2;
                const midY = sc.y + sc.h / 2;
                ctx.fillStyle = "#090706";
                ctx.fillRect(midX - 21, midY - 7, 48, 20);

                ctx.fillStyle = "#211c17";
                ctx.fillRect(midX - 24, midY - 10, 48, 20);
                ctx.strokeStyle = "#d4a349";
                ctx.lineWidth = 1.6;
                ctx.strokeRect(midX - 24, midY - 10, 48, 20);

                ctx.fillStyle = "#d4a349";
                ctx.font = "700 10px 'Courier Prime', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("🔒 ★3", midX, midY + 0.5);
            }
            ctx.restore();
        }
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
