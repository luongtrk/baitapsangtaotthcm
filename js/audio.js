// Web Audio API Sound Synthesizer & Procedural BGM
// Không cần file mp3 bên ngoài, chạy 100% offline không bị lỗi CORS/404

class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.noteIndex = 0;

        // Patriotic / Heroic pentatonic melody notes (Hz)
        // Dựa trên âm hưởng ngũ cung và hào hùng cách mạng
        this.melody = [
            261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00,
            329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 523.25, 440.00,
            392.00, 329.63, 293.66, 261.63, 293.66, 329.63, 392.00, 329.63,
            261.63, 220.00, 261.63, 293.66, 329.63, 293.66, 261.63, 196.00
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isInitialized = true;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, decay = true) {
        if (this.isMuted) return;
        this.init();

        try {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gainNode.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            if (decay) {
                gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            }

            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio error safeguard
        }
    }

    playJump() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(420, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }

    playDoubleJump() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch (e) {}
    }

    playCollect() {
        if (this.isMuted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.18, 0.15);
            }, idx * 60);
        });
    }

    playAlert() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
        } catch (e) {}
    }

    // Tiếng súng nổ đanh gọn khi mật thám bóp cò
    playGunshot() {
        if (this.isMuted) return;
        this.init();
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.022));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
        } catch (e) {
            this.playTone(380, 'sawtooth', 0.12, 0.3);
        }
    }

    playHit() {
        if (this.isMuted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch (e) {}
    }

    playRespawn() {
        if (this.isMuted) return;
        this.init();
        const notes = [392, 523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.18, 0.12);
            }, idx * 40);
        });
    }

    playQuizSuccess() {
        if (this.isMuted) return;
        this.init();
        const chord = [440, 554.37, 659.25, 880];
        chord.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.35, 0.18);
            }, idx * 75);
        });
    }

    playQuizFail() {
        if (this.isMuted) return;
        this.init();
        this.playTone(220, 'sawtooth', 0.3, 0.18);
        setTimeout(() => {
            this.playTone(164.81, 'sawtooth', 0.4, 0.2);
        }, 150);
    }

    playLevelComplete() {
        if (this.isMuted) return;
        this.init();
        const fanfare = [
            { f: 523.25, d: 0.15, wait: 0 },
            { f: 523.25, d: 0.15, wait: 140 },
            { f: 523.25, d: 0.15, wait: 280 },
            { f: 659.25, d: 0.4,  wait: 420 },
            { f: 587.33, d: 0.2,  wait: 700 },
            { f: 783.99, d: 0.6,  wait: 900 }
        ];
        fanfare.forEach(item => {
            setTimeout(() => {
                this.playTone(item.f, 'triangle', item.d, 0.2);
            }, item.wait);
        });
    }

    playGameOver() {
        if (this.isMuted) return;
        this.init();
        const jingle = [
            { f: 392.00, d: 0.16, wait: 0 },    // G4
            { f: 369.99, d: 0.16, wait: 160 },  // F#4
            { f: 349.23, d: 0.16, wait: 320 },  // F4
            { f: 329.63, d: 0.42, wait: 480 },  // E4
            { f: 261.63, d: 0.2,  wait: 780 },  // C4
            { f: 196.00, d: 0.6,  wait: 980 }   // G3
        ];
        jingle.forEach(item => {
            setTimeout(() => {
                this.playTone(item.f, 'sawtooth', item.d, 0.22);
            }, item.wait);
        });
    }

    playHide() {
        this.playTone(180, 'sine', 0.1, 0.05);
    }

    startBGM() {
        if (this.isMuted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;
        this.noteIndex = 0;

        const playNext = () => {
            if (!this.bgmPlaying || this.isMuted) return;
            const freq = this.melody[this.noteIndex % this.melody.length];
            this.playTone(freq, 'sine', 0.3, 0.04);

            // Add soft bass accompaniment every 4 beats
            if (this.noteIndex % 4 === 0) {
                this.playTone(freq / 2, 'triangle', 0.4, 0.06);
            }

            this.noteIndex++;
            this.bgmTimer = setTimeout(playNext, 380);
        };
        playNext();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

const audio = new SoundManager();

