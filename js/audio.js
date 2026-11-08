// Quản lý nhạc nền (BGM) và hiệu ứng âm thanh (SFX)

class SoundManager {
    constructor() {
        const savedBgmVol = localStorage.getItem("tthcm_bgm_volume");
        const savedSfxVol = localStorage.getItem("tthcm_sfx_volume");
        const savedBgmMuted = localStorage.getItem("tthcm_bgm_muted");
        const savedSfxMuted = localStorage.getItem("tthcm_sfx_muted");

        this.bgmVolume = savedBgmVol !== null ? parseFloat(savedBgmVol) : 0.35;
        this.sfxVolume = savedSfxVol !== null ? parseFloat(savedSfxVol) : 0.45;
        this.isBgmMuted = savedBgmMuted === "true";
        this.isSfxMuted = savedSfxMuted === "true";
        this.isMuted = false;
        this.bgmPlaying = false;

        this.bgmFiles = [
            "assets/audio/bgm/bgm_main.mp3",
            "assets/audio/bgm/bgm_stealth.mp3",
            "assets/audio/bgm/bgm_retro.mp3"
        ];
        this.currentTrackIndex = 0;

        this.bgmAudio = new Audio(this.bgmFiles[this.currentTrackIndex]);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.isBgmMuted ? 0 : this.bgmVolume;
        this.bgmAudio.preload = "auto";

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

        this.sfxCache = {};
        for (const [name, src] of Object.entries(this.sfxPaths)) {
            const a = new Audio(src);
            a.preload = "auto";
            this.sfxCache[name] = a;
        }

        // Mở khóa phát nhạc khi người dùng tương tác lần đầu
        const unlockAudio = () => {
            if (this.bgmPlaying && !this.isBgmMuted && !this.isMuted && this.bgmAudio.paused) {
                this.bgmAudio.play().catch(() => {});
            }
        };
        window.addEventListener("pointerdown", unlockAudio, { passive: true });
        window.addEventListener("keydown", unlockAudio, { passive: true });
    }

    init() {}

    setBgmVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, parseFloat(val) || 0));
        localStorage.setItem("tthcm_bgm_volume", this.bgmVolume.toString());
        if (!this.isBgmMuted && !this.isMuted) {
            this.bgmAudio.volume = this.bgmVolume;
        }
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, parseFloat(val) || 0));
        localStorage.setItem("tthcm_sfx_volume", this.sfxVolume.toString());
    }

    toggleBgm() {
        this.isBgmMuted = !this.isBgmMuted;
        localStorage.setItem("tthcm_bgm_muted", this.isBgmMuted ? "true" : "false");
        if (this.isBgmMuted) {
            this.bgmAudio.pause();
        } else {
            this.bgmAudio.volume = this.bgmVolume;
            if (this.bgmPlaying && !this.isMuted) {
                this.bgmAudio.play().catch(() => {});
            }
        }
        return this.isBgmMuted;
    }

    toggleSfx() {
        this.isSfxMuted = !this.isSfxMuted;
        localStorage.setItem("tthcm_sfx_muted", this.isSfxMuted ? "true" : "false");
        return this.isSfxMuted;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.bgmAudio.pause();
        } else {
            if (!this.isBgmMuted && this.bgmPlaying) {
                this.bgmAudio.volume = this.bgmVolume;
                this.bgmAudio.play().catch(() => {});
            }
        }
        return this.isMuted;
    }

    playSample(name, baseVol = 0.45, playbackRate = 1.0) {
        if (this.isMuted || this.isSfxMuted || this.sfxVolume <= 0) return;
        const base = this.sfxCache[name];
        if (!base) return;
        try {
            const sound = base.cloneNode();
            const realVol = Math.max(0, Math.min(1, baseVol * (this.sfxVolume / 0.45)));
            sound.volume = realVol;
            if (playbackRate !== 1.0) {
                sound.preservesPitch = false;
                sound.playbackRate = playbackRate;
            }
            sound.play().catch(() => {});
        } catch (e) {}
    }

    playTone(freq = 440) {
        if (this.isMuted || this.isSfxMuted) return;
        if (freq < 240) {
            this.playSample("fail", 0.42);
        } else if (freq > 600) {
            this.playSample("pebble", 0.42);
        } else {
            this.playSample("collect", 0.44);
        }
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
        this.bgmAudio.volume = this.isBgmMuted ? 0 : this.bgmVolume;
        if (this.bgmPlaying && !this.isBgmMuted && !this.isMuted) {
            this.bgmAudio.play().catch(() => {});
        }
        return this.getCurrentTrack();
    }

    setTrack(index) {
        if (index >= 0 && index < this.bgmFiles.length) {
            this.currentTrackIndex = index;
            this.bgmAudio.src = this.bgmFiles[this.currentTrackIndex];
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = this.isBgmMuted ? 0 : this.bgmVolume;
            if (this.bgmPlaying && !this.isBgmMuted && !this.isMuted) {
                this.bgmAudio.play().catch(() => {});
            }
        }
        return this.getCurrentTrack();
    }

    startBGM() {
        this.bgmPlaying = true;
        if (this.isMuted || this.isBgmMuted) return;
        if (this.bgmAudio.paused) {
            this.bgmAudio.volume = this.bgmVolume;
            this.bgmAudio.play().catch(() => {});
        }
    }

    stopBGM() {
        this.bgmPlaying = false;
        try {
            this.bgmAudio.pause();
        } catch (e) {}
    }

    // Các hàm phát hiệu ứng âm thanh
    playJump() {
        this.playSample("jump", 0.45, 1.0);
    }

    playDoubleJump() {
        this.playSample("double_jump", 0.45, 1.0);
    }

    playCollect() {
        this.playSample("collect", 0.46, 1.0);
    }

    playKey() {
        this.playSample("book", 0.45, 1.0);
    }

    playPowerup() {
        this.playSample("powerup", 0.45, 1.0);
    }

    playTakedown() {
        this.playSample("takedown", 0.48, 1.0);
    }

    playUnlock() {
        this.playSample("unlock", 0.45, 1.0);
    }

    playLocked() {
        this.playSample("fail", 0.42, 1.0);
    }

    playPebbleBounce() {
        this.playSample("pebble", 0.44, 1.0);
    }

    playAlert() {
        this.playSample("alert", 0.45, 1.0);
    }

    playGunshot() {
        this.playSample("shot", 0.44, 1.0);
    }

    playHit() {
        this.playSample("hit", 0.46, 1.0);
    }

    playRespawn() {
        this.playSample("powerup", 0.42, 1.0);
    }

    playQuizSuccess() {
        this.playSample("quiz_correct", 0.46, 1.0);
    }

    playQuizFail() {
        this.playSample("fail", 0.44, 1.0);
    }

    playLevelComplete() {
        this.playSample("win", 0.48, 1.0);
    }

    playGameOver() {
        this.playSample("gameover", 0.46, 1.0);
    }

    playHide() {
        this.playSample("hide", 0.40, 1.0);
    }
}

const audio = new SoundManager();
