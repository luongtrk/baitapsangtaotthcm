// Game Audio Manager - Sử dụng bộ Sample Audio & BGM miễn phí (Royalty-Free Game Samples)
// Toàn bộ file sample được đóng gói trực tiếp trong thư mục assets/audio/

class SoundManager {
    constructor() {
        this.isMuted = false;
        this.bgmPlaying = false;

        // Danh sách nhạc nền game sample (không hiển thị tên nhạc)
        this.bgmFiles = [
            "assets/audio/bgm/bgm_main.mp3",
            "assets/audio/bgm/bgm_stealth.mp3",
            "assets/audio/bgm/bgm_action.mp3"
        ];
        this.currentTrackIndex = 0;

        // Trình phát nhạc nền HTML5 Audio
        this.bgmAudio = new Audio(this.bgmFiles[this.currentTrackIndex]);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.36;
        this.bgmAudio.preload = "auto";

        // Kho hiệu ứng âm thanh (SFX Samples)
        this.sfxPaths = {
            jump: "assets/audio/sfx/jump.wav",
            collect: "assets/audio/sfx/collect.mp3",
            key: "assets/audio/sfx/key.wav",
            powerup: "assets/audio/sfx/powerup.wav",
            gunshot: "assets/audio/sfx/gunshot.wav",
            hit: "assets/audio/sfx/hit.wav",
            takedown: "assets/audio/sfx/takedown.mp3",
            unlock: "assets/audio/sfx/unlock.wav",
            alert: "assets/audio/sfx/alert.wav",
            quiz_correct: "assets/audio/sfx/quiz_correct.mp3",
            quiz_wrong: "assets/audio/sfx/quiz_wrong.wav",
            gameover: "assets/audio/sfx/gameover.wav",
            win: "assets/audio/sfx/win.ogg",
            step: "assets/audio/sfx/step.mp3"
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

    // Phát một sample SFX (hỗ trợ phát chồng nhiều âm thanh cùng lúc và chỉnh tốc độ/cao độ)
    playSample(name, volume = 0.55, playbackRate = 1.0) {
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

    // Tương thích ngược nếu có nơi gọi playTone
    playTone(freq = 440) {
        if (this.isMuted) return;
        if (freq < 240) {
            this.playSample("quiz_wrong", 0.45);
        } else if (freq > 600) {
            this.playSample("step", 0.5, 1.3);
        } else {
            this.playSample("key", 0.5);
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
        this.bgmAudio.volume = 0.36;
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
            this.bgmAudio.volume = 0.36;
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
    // CÁC HIỆU ỨNG ÂM THANH TRONG GAME (SAMPLE-BASED SFX)
    // =========================================================================

    // Nhảy đơn
    playJump() {
        this.playSample("jump", 0.42, 1.0);
    }

    // Nhảy đúp (cao độ cao hơn nhảy đơn)
    playDoubleJump() {
        this.playSample("jump", 0.48, 1.25);
    }

    // Nhặt Sao Vàng (★)
    playCollect() {
        this.playSample("collect", 0.55, 1.0);
    }

    // Nhặt Văn kiện lịch sử hoặc chạm cột cờ Checkpoint
    playKey() {
        this.playSample("key", 0.6, 1.0);
    }

    // Nhặt vật phẩm tiếp tế (Áo Trấn Thủ, Dép Cao Su, Hòm Cải Trang, Lương Khô)
    playPowerup() {
        this.playSample("powerup", 0.58, 1.0);
    }

    // Khống chế mật thám từ phía sau ([Q])
    playTakedown() {
        this.playSample("takedown", 0.65, 1.0);
    }

    // Đổi Sao Vàng mở khóa Liên lạc viên & Cầu bí mật
    playUnlock() {
        this.playSample("unlock", 0.6, 1.0);
    }

    // Báo âm khóa khi chưa đủ Sao Vàng (★ < 3)
    playLocked() {
        this.playSample("quiz_wrong", 0.45, 0.95);
    }

    // Tiếng sỏi nghi binh nảy trên mặt đất ([F])
    playPebbleBounce() {
        this.playSample("step", 0.55, 1.35);
    }

    // Mật thám phát hiện người chơi (!)
    playAlert() {
        this.playSample("alert", 0.55, 1.0);
    }

    // Mật thám bắn súng
    playGunshot() {
        this.playSample("gunshot", 0.6, 1.0);
    }

    // Trúng đạn / Va chạm mất máu
    playHit() {
        this.playSample("hit", 0.65, 1.0);
    }

    // Hồi sinh tại Checkpoint
    playRespawn() {
        this.playSample("powerup", 0.5, 1.15);
    }

    // Trả lời đúng câu hỏi trắc nghiệm
    playQuizSuccess() {
        this.playSample("quiz_correct", 0.65, 1.0);
    }

    // Trả lời sai câu hỏi trắc nghiệm
    playQuizFail() {
        this.playSample("quiz_wrong", 0.6, 1.0);
    }

    // Hoàn thành màn chơi / Qua màn
    playLevelComplete() {
        this.playSample("win", 0.7, 1.0);
    }

    // Hết máu / Game Over
    playGameOver() {
        this.playSample("gameover", 0.65, 1.0);
    }

    // Ẩn nấp vào bụi cây / thùng hàng / vòm cửa
    playHide() {
        this.playSample("step", 0.45, 0.9);
    }
}

const audio = new SoundManager();
