// Web Audio API Sound Synthesizer & Procedural BGM - Chủ đề Tư tưởng Hồ Chí Minh
// 100% Offline, hoạt động mượt mà không cần nạp file MP3 từ bên ngoài (tránh lỗi CORS / 404)

// Bảng tần số chuẩn các nốt nhạc (Hz)
const TTHCM_NOTES = {
    REST: 0,
    G2: 98.00,  A2: 110.00, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Tuyển tập các tuyệt phẩm âm nhạc cách mạng bất hủ về Chủ tịch Hồ Chí Minh
const BAC_HO_TRACKS = [
    {
        id: 'nhu-co-bac-ho',
        title: 'Như Có Bác Hồ Trong Ngày Vui Đại Thắng',
        composer: 'Nhạc sĩ Phạm Tuyên (1975)',
        tempoMs: 440,
        notes: [
            // "Như có Bác Hồ trong ngày vui đại thắng"
            { f: TTHCM_NOTES.G3, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.C4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.E3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Lời Bác nay đã thành chiến thắng vẻ vang"
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.A2 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.F3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.G4, b: 0.25 },
            { f: TTHCM_NOTES.E4, b: 0.25 },
            { f: TTHCM_NOTES.D4, b: 1.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Ba mươi năm đấu tranh giành toàn vẹn non sông"
            { f: TTHCM_NOTES.C4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.C4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.E3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Ba mươi năm dân chủ cộng hòa kháng chiến đã thành công"
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.A2 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.F3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.D5, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.C5, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // Điệp khúc: "Việt Nam - Hồ Chí Minh!"
            { f: TTHCM_NOTES.C5, b: 0.75, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C5, b: 0.75, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 1.0, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Việt Nam - Hồ Chí Minh!"
            { f: TTHCM_NOTES.C5, b: 0.75, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C5, b: 0.75, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 1.0, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Việt Nam - Hồ Chí Minh! Việt Nam - Hồ Chí Minh!"
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.D5, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 1.0, bass: TTHCM_NOTES.A2 },

            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D5, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.C5, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 1.0 }
        ]
    },
    {
        id: 'bac-dang-cung-chung-chau',
        title: 'Bác Đang Cùng Chúng Cháu Hành Quân',
        composer: 'Nhạc sĩ Huy Thục (1969)',
        tempoMs: 420,
        notes: [
            // "Đêm nay trên đường hành quân ra mặt trận"
            { f: TTHCM_NOTES.A3, b: 0.5, bass: TTHCM_NOTES.A2 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.D4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D4, b: 1.0, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Trùng trùng đoàn quân tiến bước theo con đường của Bác"
            { f: TTHCM_NOTES.C4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 0.5, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.D4, b: 1.0, bass: TTHCM_NOTES.D3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Nở ngàn hoa chiến công dâng lên Người"
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D5, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 1.0, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // Điệp khúc: "Bác vẫn cùng chúng cháu hành quân!"
            { f: TTHCM_NOTES.C5, b: 0.75, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D5, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.C5, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 1.0 }
        ]
    },
    {
        id: 'ai-yeu-bac-ho',
        title: 'Ai Yêu Bác Hồ Chí Minh Hơn Thiếu Niên Nhi Đồng',
        composer: 'Nhạc sĩ Phong Nhã (1945)',
        tempoMs: 440,
        notes: [
            // "Ai yêu Bác Hồ Chí Minh hơn thiếu niên nhi đồng"
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.A2 },
            { f: TTHCM_NOTES.C5, b: 0.75 },
            { f: TTHCM_NOTES.A4, b: 0.25 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D4, b: 0.5 },
            { f: TTHCM_NOTES.C4, b: 1.0, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Ai yêu Bác Hồ Chí Minh hơn thiếu niên nhi đồng"
            { f: TTHCM_NOTES.E4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.A2 },
            { f: TTHCM_NOTES.C5, b: 0.75 },
            { f: TTHCM_NOTES.A4, b: 0.25 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.E4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.D4, b: 0.5 },
            { f: TTHCM_NOTES.C4, b: 1.0, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Bác chúng em dáng cao cao người thanh thanh"
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.A4, b: 0.5, bass: TTHCM_NOTES.F3 },
            { f: TTHCM_NOTES.G4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 1.0, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 0.5 },

            // "Hồ Chí Minh kính yêu, chúng em kính yêu Bác Hồ Chí Minh trọn một đời"
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.C5, b: 0.5 },
            { f: TTHCM_NOTES.D5, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.E5, b: 0.75 },
            { f: TTHCM_NOTES.D5, b: 0.25 },
            { f: TTHCM_NOTES.C5, b: 0.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.G4, b: 0.5, bass: TTHCM_NOTES.G2 },
            { f: TTHCM_NOTES.A4, b: 0.5 },
            { f: TTHCM_NOTES.C5, b: 1.5, bass: TTHCM_NOTES.C3 },
            { f: TTHCM_NOTES.REST, b: 1.0 }
        ]
    }
];

class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isInitialized = false;

        // BGM Playback state
        this.tracks = BAC_HO_TRACKS;
        this.currentTrackIndex = 0;
        this.noteIndex = 0;
        this.bgmPlaying = false;
        this.bgmTimer = null;

        // Tương thích ngược với các hàm cũ
        this.melody = this.tracks[0].notes.map(n => n.f);
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

    // Lấy thông tin bài hát hiện tại
    getCurrentTrack() {
        const track = this.tracks[this.currentTrackIndex] || this.tracks[0];
        return {
            title: track.title,
            composer: track.composer,
            index: this.currentTrackIndex,
            total: this.tracks.length
        };
    }

    // Chuyển sang bài tiếp theo trong danh sách các bài hát về Bác Hồ
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.noteIndex = 0;
        if (this.bgmPlaying && !this.isMuted) {
            this.stopBGM();
            this.startBGM();
        }
        return this.getCurrentTrack();
    }

    // Chọn bài theo vị trí index
    setTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            this.noteIndex = 0;
            if (this.bgmPlaying && !this.isMuted) {
                this.stopBGM();
                this.startBGM();
            }
        }
        return this.getCurrentTrack();
    }

    // Phát âm thanh đơn lẻ (SFX)
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

    // Phát nốt nhạc giai điệu BGM với âm sắc êm dịu, không click loa
    playBgmMelodyNote(freq, durationSec, gainVal = 0.065) {
        if (this.isMuted || !freq || freq <= 0) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Kết hợp sóng triangle tạo âm thanh phong cách cổ điển, trang trọng và ấm áp
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Envelope mềm: attack êm trong 0.02s tránh click loa, sustain và release mượt mà
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(gainVal, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + durationSec);
        } catch (e) {}
    }

    // Phát nốt trầm Bass BGM đệm nhịp phách hành tiến
    playBgmBassNote(freq, durationSec, gainVal = 0.05) {
        if (this.isMuted || !freq || freq <= 0) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(gainVal, now + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + durationSec);
        } catch (e) {}
    }

    // Nhảy
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

    // Nhảy đúp
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

    // Nhặt ngôi sao / điểm thưởng
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

    // Báo động khi lọt vào tầm nhìn mật thám
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

    // Trúng đạn / Mất máu
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

    // Hồi sinh tại checkpoint
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

    // Trả lời đúng trắc nghiệm
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

    // Trả lời sai trắc nghiệm
    playQuizFail() {
        if (this.isMuted) return;
        this.init();
        this.playTone(220, 'sawtooth', 0.3, 0.18);
        setTimeout(() => {
            this.playTone(164.81, 'sawtooth', 0.4, 0.2);
        }, 150);
    }

    // Hoàn thành màn chơi / Vượt ải
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

    // Game Over
    playGameOver() {
        if (this.isMuted) return;
        this.init();
        const jingle = [
            { f: 392.00, d: 0.16, wait: 0 },
            { f: 369.99, d: 0.16, wait: 160 },
            { f: 349.23, d: 0.16, wait: 320 },
            { f: 329.63, d: 0.42, wait: 480 },
            { f: 261.63, d: 0.2,  wait: 780 },
            { f: 196.00, d: 0.6,  wait: 980 }
        ];
        jingle.forEach(item => {
            setTimeout(() => {
                this.playTone(item.f, 'sawtooth', item.d, 0.22);
            }, item.wait);
        });
    }

    // Âm thanh nấp bụi rậm
    playHide() {
        this.playTone(180, 'sine', 0.1, 0.05);
    }

    // Bắt đầu phát BGM giai điệu bài hát về Bác Hồ
    startBGM() {
        if (this.isMuted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;

        const playNextStep = () => {
            if (!this.bgmPlaying || this.isMuted) return;

            const track = this.tracks[this.currentTrackIndex];
            if (!track || !track.notes || track.notes.length === 0) return;

            const note = track.notes[this.noteIndex];
            const stepDurationMs = note.b * track.tempoMs;
            const playDurationSec = Math.max(0.08, (note.b * track.tempoMs * 0.92) / 1000);

            // Phát nốt giai điệu chính
            if (note.f && note.f > 0) {
                this.playBgmMelodyNote(note.f, playDurationSec, 0.065);
            }

            // Phát nốt đệm bè trầm Bass
            if (note.bass && note.bass > 0) {
                this.playBgmBassNote(note.bass, Math.min(0.38, playDurationSec * 1.1), 0.055);
            }

            this.noteIndex++;

            // Khi hết bài, chuyển bài tiếp theo hoặc lặp lại
            if (this.noteIndex >= track.notes.length) {
                this.noteIndex = 0;
                // Tự động chuyển tuần hoàn sang bài tiếp theo về Bác Hồ
                this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
            }

            this.bgmTimer = setTimeout(playNextStep, stepDurationMs);
        };

        playNextStep();
    }

    // Dừng phát BGM
    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

const audio = new SoundManager();
