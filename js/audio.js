// Game Audio Manager - Sử dụng bộ Sample Game SFX & BGM nhẹ nhàng, tinh tế (Kenney CC0 & Royalty-Free)
// Toàn bộ file sample được đóng gói trực tiếp trong thư mục assets/audio/

class SoundManager {
    constructor() {
        this.isMuted = false;
        this.bgmPlaying = false;

        // Danh sách nhạc nền game sample thuần nhạc cụ (êm dịu, 100% không lời / không giọng nói)
        this.bgmFiles = [
            "assets/audio/bgm/bgm_main.mp3",
            "assets/audio/bgm/bgm_stealth.mp3",
            "assets/audio/bgm/bgm_action.mp3",
            "assets/audio/bgm/bgm_retro.mp3"
        ];
        this.currentTrackIndex = 0;

        // Trình phát nhạc nền HTML5 Audio
        this.bgmAudio = new Audio(this.bgmFiles[this.currentTrackIndex]);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.32;
        this.bgmAudio.preload = "auto";

        // Kho hiệu ứng âm thanh dịu nhẹ, mộc mạc, không chói tai (Kenney CC0 gentle sound set)
        this.sfxPaths = {
            jump: "assets/audio/sfx/jump.ogg",
            double_jump: "assets/audio/sfx/double_jump.ogg",
            collect: "assets/audio/sfx/collect.ogg",
            book: "assets/audio/sfx/book.ogg",
            powerup: "assets/audio/sfx/powerup.ogg",
            takedown: "assets/audio/sfx/takedown.ogg",
            unlock: "assets/audio/sfx/unlock.ogg",
            fail: "assets/audio/sfx/fail.ogg",
            alert: "assets/audio/sfx/alert.ogg",
            shot: "assets/audio/sfx/shot.ogg",
            hit: "assets/audio/sfx/hit.ogg",
            pebble: "assets/audio/sfx/pebble.ogg",
            hide: "assets/audio/sfx/hide.ogg",
            quiz_correct: "assets/audio/sfx/quiz_correct.ogg",
            win: "assets/audio/sfx/win.ogg",
            gameover: "assets/audio/sfx/gameover.ogg"
        };

        // Nạp trước toàn bộ sample vào bộ nhớ đệm để phát tức thì (zero-latency)
        this.sfxCache = {};
        for (const [name, src] of Object.entries(this.sfxPaths)) {
            const a = new Audio(src);
            a.preload = "auto";
            this.sfxCache[name] = a;
        }

        // Tự động mở khóa BGM ở tương tác đầu tiên nếu trình duyệt chặn autoplay
        const unlockAudio = () => {
            if (this.bgmPlaying && !this.isMuted && this.bgmAudio.paused) {
                this.bgmAudio.play().catch(() => {});
            }
        };
        window.addEventListener("pointerdown", unlockAudio, { passive: true });
        window.addEventListener("keydown", unlockAudio, { passive: true });
    }

    init() {
        // Giữ tương thích với các lệnh gọi audio.init() trong engine
    }

    // Phát một sample SFX với âm lượng dịu nhẹ (mặc định 0.22 - 0.28, tránh gây giật mình hay lấn át nhạc nền)
    playSample(name, volume = 0.24, playbackRate = 1.0) {
        if (this.isMuted) return;
        const base = this.sfxCache[name];
        if (!base) return;
        try {
            const sound = base.cloneNode();
            sound.volume = Math.max(0, Math.min(1, volume));
            if (playbackRate !== 1.0) {
                sound.preservesPitch = false;
                sound.playbackRate = playbackRate;
            }
            sound.play().catch(() => {});
        } catch (e) {}
    }

    // Tương thích ngược nếu có chỗ gọi playTone
    playTone(freq = 440) {
        if (this.isMuted) return;
        if (freq < 240) {
            this.playSample("fail", 0.2);
        } else if (freq > 600) {
            this.playSample("pebble", 0.22);
        } else {
            this.playSample("collect", 0.22);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.bgmAudio.pause();
        } else if (this.bgmPlaying) {
            this.bgmAudio.play().catch(() => {});
        }
        return this.isMuted;
    }

    getCurrentTrack() {
        return {
            index: this.currentTrackIndex,
            total: this.bgmFiles.length
        };
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.bgmFiles.length;
        this.bgmAudio.src = this.bgmFiles[this.currentTrackIndex];
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.32;
        if (this.bgmPlaying && !this.isMuted) {
            this.bgmAudio.play().catch(() => {});
        }
        return this.getCurrentTrack();
    }

    setTrack(index) {
        if (index >= 0 && index < this.bgmFiles.length) {
            this.currentTrackIndex = index;
            this.bgmAudio.src = this.bgmFiles[this.currentTrackIndex];
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = 0.32;
            if (this.bgmPlaying && !this.isMuted) {
                this.bgmAudio.play().catch(() => {});
            }
        }
        return this.getCurrentTrack();
    }

    startBGM() {
        this.bgmPlaying = true;
        if (this.isMuted) return;
        if (this.bgmAudio.paused) {
            this.bgmAudio.play().catch(() => {});
        }
    }

    stopBGM() {
        this.bgmPlaying = false;
        try {
            this.bgmAudio.pause();
        } catch (e) {}
    }

    // =========================================================================
    // CÁC HIỆU ỨNG ÂM THANH TRONG GAME (GENTLE / SUBTLE SFX)
    // Âm lượng dịu nhẹ (0.20 - 0.28), thanh thoát, không cường điệu
    // =========================================================================

    // Nhảy đơn nhẹ nhàng
    playJump() {
        this.playSample("jump", 0.22, 1.0);
    }

    // Nhảy đúp thanh thoát
    playDoubleJump() {
        this.playSample("double_jump", 0.22, 1.0);
    }

    // Nhặt Sao Vàng (★) - chuông đôi nhỏ êm
    playCollect() {
        this.playSample("collect", 0.25, 1.0);
    }

    // Nhặt Văn kiện lịch sử hoặc chạm cột mốc Checkpoint - tiếng mở trang giấy dó cổ êm tai
    playKey() {
        this.playSample("book", 0.26, 1.0);
    }

    // Nhặt vật phẩm tiếp tế (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang, Lương Khô)
    playPowerup() {
        this.playSample("powerup", 0.25, 1.0);
    }

    // Khống chế mật thám từ phía sau ([Q]) - tiếng cộc nhẹ điểm huyệt gọn gàng
    playTakedown() {
        this.playSample("takedown", 0.26, 1.0);
    }

    // Đổi Sao Vàng mở khóa Liên lạc viên & Cầu bí mật
    playUnlock() {
        this.playSample("unlock", 0.26, 1.0);
    }

    // Báo âm khi chưa đủ Sao Vàng (★ < 3)
    playLocked() {
        this.playSample("fail", 0.22, 1.0);
    }

    // Tiếng sỏi nghi binh nảy trên mặt đất ([F]) - lách cách nhỏ nhẹ
    playPebbleBounce() {
        this.playSample("pebble", 0.24, 1.0);
    }

    // Mật thám phát hiện người chơi (!) - âm thông báo nhẹ
    playAlert() {
        this.playSample("alert", 0.25, 1.0);
    }

    // Mật thám bắn súng - âm pop ngắn gọn, không đinh tai nhức óc
    playGunshot() {
        this.playSample("shot", 0.24, 1.0);
    }

    // Trúng đạn / Va chạm mất máu - âm va chạm vải nhẹ
    playHit() {
        this.playSample("hit", 0.26, 1.0);
    }

    // Hồi sinh tại Checkpoint
    playRespawn() {
        this.playSample("powerup", 0.24, 1.0);
    }

    // Trả lời đúng câu hỏi trắc nghiệm - jingle nhỏ vui tươi
    playQuizSuccess() {
        this.playSample("quiz_correct", 0.28, 1.0);
    }

    // Trả lời sai câu hỏi trắc nghiệm - âm trầm êm dịu
    playQuizFail() {
        this.playSample("fail", 0.25, 1.0);
    }

    // Hoàn thành màn chơi / Qua màn - jingle chiến thắng ngắn gọn êm ái
    playLevelComplete() {
        this.playSample("win", 0.30, 1.0);
    }

    // Hết máu / Game Over - jingle kết thúc màn êm đềm
    playGameOver() {
        this.playSample("gameover", 0.28, 1.0);
    }

    // Ẩn nấp vào bụi cây / thùng hàng / vòm cửa - sột soạt êm ái
    playHide() {
        this.playSample("hide", 0.20, 1.0);
    }
}

const audio = new SoundManager();
