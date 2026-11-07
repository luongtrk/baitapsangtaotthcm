// Game Audio Manager - Bộ Sample SFX Kinh Điển & Nhạc Nền Game 2D Thuần Nhạc Cụ
// Đơn giản, rõ ràng, âm lượng vừa phải, không gây chói tai

class SoundManager {
    constructor() {
        this.isMuted = false;
        this.bgmPlaying = false;

        // Danh sách 3 bản nhạc nền game thuần nhạc cụ 100% (không có lời / không có giọng nói)
        this.bgmFiles = [
            "assets/audio/bgm/bgm_main.mp3",
            "assets/audio/bgm/bgm_stealth.mp3",
            "assets/audio/bgm/bgm_retro.mp3"
        ];
        this.currentTrackIndex = 0;

        // Trình phát nhạc nền HTML5 Audio
        this.bgmAudio = new Audio(this.bgmFiles[this.currentTrackIndex]);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.32;
        this.bgmAudio.preload = "auto";

        // Kho hiệu ứng âm thanh game 2D kinh điển, đơn giản, nghe rõ ràng mà không bị to
        this.sfxPaths = {
            jump: "assets/audio/sfx/jump.wav",
            double_jump: "assets/audio/sfx/double_jump.wav",
            collect: "assets/audio/sfx/collect.wav",
            book: "assets/audio/sfx/book.wav",
            powerup: "assets/audio/sfx/powerup.wav",
            takedown: "assets/audio/sfx/takedown.wav",
            unlock: "assets/audio/sfx/unlock.wav",
            fail: "assets/audio/sfx/fail.wav",
            alert: "assets/audio/sfx/alert.wav",
            shot: "assets/audio/sfx/shot.wav",
            hit: "assets/audio/sfx/hit.wav",
            pebble: "assets/audio/sfx/pebble.wav",
            hide: "assets/audio/sfx/hide.wav",
            quiz_correct: "assets/audio/sfx/quiz_correct.wav",
            win: "assets/audio/sfx/win.wav",
            gameover: "assets/audio/sfx/gameover.wav"
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

    // Phát một sample SFX với âm lượng chuẩn mực (mặc định 0.45 - rõ ràng, sắc nét, không gắt tai)
    playSample(name, volume = 0.45, playbackRate = 1.0) {
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
            this.playSample("fail", 0.42);
        } else if (freq > 600) {
            this.playSample("pebble", 0.42);
        } else {
            this.playSample("collect", 0.44);
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
    // CÁC HIỆU ỨNG ÂM THANH GAME 2D BASIC (RÕ RÀNG, VỪA PHẢI, KHÔNG QUÁ TO)
    // =========================================================================

    // Nhảy đơn
    playJump() {
        this.playSample("jump", 0.45, 1.0);
    }

    // Nhảy đúp
    playDoubleJump() {
        this.playSample("double_jump", 0.45, 1.0);
    }

    // Nhặt Sao Vàng (★) - chuông 2 nốt 'ding-ding' trong trẻo
    playCollect() {
        this.playSample("collect", 0.46, 1.0);
    }

    // Nhặt Văn kiện lịch sử / Checkpoint - hợp âm chuông 3 nốt
    playKey() {
        this.playSample("book", 0.45, 1.0);
    }

    // Nhặt Tiếp tế (Áo Trấn Thủ, Dép Cao Su, Cải Trang, Lương Khô) - thăng hoa 4 nốt
    playPowerup() {
        this.playSample("powerup", 0.45, 1.0);
    }

    // Khống chế mật thám [Q] - tiếng 'bụp' đục gọn gàng
    playTakedown() {
        this.playSample("takedown", 0.48, 1.0);
    }

    // Đổi Sao Vàng mở khóa Liên lạc viên & Cầu bí mật
    playUnlock() {
        this.playSample("unlock", 0.45, 1.0);
    }

    // Báo âm khi chưa đủ Sao Vàng (★ < 3) / Trả lời sai
    playLocked() {
        this.playSample("fail", 0.42, 1.0);
    }

    // Tiếng sỏi nghi binh nảy trên mặt đất [F]
    playPebbleBounce() {
        this.playSample("pebble", 0.44, 1.0);
    }

    // Mật thám phát hiện người chơi (!)
    playAlert() {
        this.playSample("alert", 0.45, 1.0);
    }

    // Mật thám bắn súng - tiếng 'pew' laser/pop ngắn gọn arcade
    playGunshot() {
        this.playSample("shot", 0.44, 1.0);
    }

    // Trúng đạn / Va chạm mất máu
    playHit() {
        this.playSample("hit", 0.46, 1.0);
    }

    // Hồi sinh tại Checkpoint
    playRespawn() {
        this.playSample("powerup", 0.42, 1.0);
    }

    // Trả lời đúng trắc nghiệm
    playQuizSuccess() {
        this.playSample("quiz_correct", 0.46, 1.0);
    }

    // Trả lời sai trắc nghiệm
    playQuizFail() {
        this.playSample("fail", 0.44, 1.0);
    }

    // Hoàn thành màn chơi
    playLevelComplete() {
        this.playSample("win", 0.48, 1.0);
    }

    // Hết máu / Game Over
    playGameOver() {
        this.playSample("gameover", 0.46, 1.0);
    }

    // Ẩn nấp vào bụi cây / thùng hàng
    playHide() {
        this.playSample("hide", 0.40, 1.0);
    }
}

const audio = new SoundManager();
