// Game Manager: Điều phối trạng thái, Giao diện Menu, Bảng Xếp Hạng & Bảo Tàng Di Sản

class GameManager {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.engine = new GameEngine(
            this.canvas,
            (docId) => this.showDocumentModal(docId),
            (levelIdx) => this.showVictoryModal(levelIdx),
            () => this.handleGameOver()
        );

        this.unlockedDocIds = new Set();
        this.currentChapterIndex = 0;
        this.totalQuizPoints = 0;

        this.loadSavedData();
        this.initUI();
    }

    loadSavedData() {
        try {
            const savedDocs = localStorage.getItem("tthcm_unlocked_docs");
            if (savedDocs) {
                const arr = JSON.parse(savedDocs);
                arr.forEach(id => this.unlockedDocIds.add(id));
            }
        } catch (e) {}
    }

    saveData() {
        try {
            localStorage.setItem("tthcm_unlocked_docs", JSON.stringify(Array.from(this.unlockedDocIds)));
        } catch (e) {}
    }

    initUI() {
        // Cập nhật kỷ lục hiển thị ở Menu chính
        this.updateHighScorePreview();

        // Nút Bắt đầu chơi (Chương 1)
        const btnStart = document.getElementById("btn-start-game");
        if (btnStart) {
            btnStart.onclick = () => {
                audio.startBGM();
                this.startChapter(0);
            };
        }

        // Nút Chọn màn chơi
        const btnSelect = document.getElementById("btn-select-chapter");
        if (btnSelect) {
            btnSelect.onclick = () => {
                this.showScreen("screen-chapter-select");
                this.renderChapterSelectCards();
            };
        }

        // Nút Mở bảo tàng di sản
        const btnMuseum = document.getElementById("btn-open-museum");
        if (btnMuseum) {
            btnMuseum.onclick = () => {
                this.showScreen("screen-museum");
                this.renderMuseum();
            };
        }

        // Nút Hướng dẫn & Bảng Xếp Hạng trên Header & Menu
        const btnGuideTop = document.getElementById("btn-guide-top");
        if (btnGuideTop) btnGuideTop.onclick = () => this.openGuideModal();

        const btnLeaderboardTop = document.getElementById("btn-leaderboard-top");
        if (btnLeaderboardTop) btnLeaderboardTop.onclick = () => this.openLeaderboardModal();

        const btnOpenLeaderboard = document.getElementById("btn-open-leaderboard");
        if (btnOpenLeaderboard) btnOpenLeaderboard.onclick = () => this.openLeaderboardModal();

        // Nút quay lại Menu từ các màn hình khác và trong các Popup/Modal
        document.querySelectorAll(".btn-back-menu").forEach(btn => {
            btn.onclick = () => {
                this.closeAllModals();
                this.engine.stop();
                this.showScreen("screen-menu");
            };
        });

        // Nút bật / tắt âm thanh (đồng bộ cả Header và trong HUD Game)
        const updateSoundIcons = (muted) => {
            const icon = muted ? "🔇" : "🔊";
            const btn1 = document.getElementById("btn-toggle-sound");
            const btn2 = document.getElementById("btn-game-sound");
            if (btn1) btn1.innerText = icon;
            if (btn2) btn2.innerText = icon;
        };

        const toggleAudio = () => {
            const isMuted = audio.toggleMute();
            updateSoundIcons(isMuted);
        };

        const btnMute = document.getElementById("btn-toggle-sound");
        if (btnMute) btnMute.onclick = toggleAudio;

        const btnGameSound = document.getElementById("btn-game-sound");
        if (btnGameSound) btnGameSound.onclick = toggleAudio;

        // Nút Fullscreen Toàn màn hình
        const toggleFullscreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                }
            }
        };

        const btnFs1 = document.getElementById("btn-toggle-fullscreen");
        if (btnFs1) btnFs1.onclick = toggleFullscreen;

        const btnFs2 = document.getElementById("btn-game-fullscreen");
        if (btnFs2) btnFs2.onclick = toggleFullscreen;

        // Tự động nhận diện thiết bị cảm ứng để tối ưu điều khiển
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;
        if (isTouch) {
            document.body.classList.add("touch-device");
        }

        const btnCloseHint = document.getElementById("btn-close-hint");
        if (btnCloseHint) {
            btnCloseHint.onclick = () => {
                const hint = document.getElementById("landscape-hint");
                if (hint) hint.style.display = "none";
            };
        }

        // Resize canvas toàn màn hình chuẩn xác & lắng nghe sự kiện xoay màn hình
        this.setupCanvasDPI();
        window.addEventListener("resize", () => {
            this.setupCanvasDPI();
            this.checkOrientationHint();
        });
        window.addEventListener("orientationchange", () => {
            setTimeout(() => {
                this.setupCanvasDPI();
                this.checkOrientationHint();
            }, 250);
        });
    }

    checkOrientationHint() {
        const hint = document.getElementById("landscape-hint");
        if (!hint) return;
        const isPortrait = window.innerHeight > window.innerWidth && window.innerWidth <= 768;
        const isTouch = document.body.classList.contains("touch-device") || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const gameScreen = document.getElementById("screen-game");
        const isGameActive = gameScreen && gameScreen.classList.contains("active");
        if (isTouch && isPortrait && isGameActive) {
            hint.style.display = "flex";
        } else {
            hint.style.display = "none";
        }
    }

    setupCanvasDPI() {
        // Tự động kéo giãn canvas vừa khít màn hình hiển thị (Fullscreen)
        this.canvas.width = window.innerWidth || 1280;
        this.canvas.height = window.innerHeight || 720;
    }

    closeAllModals() {
        document.querySelectorAll(".modal-overlay").forEach(modal => {
            modal.classList.remove("active");
        });
    }

    showScreen(screenId) {
        // Đóng toàn bộ popup/modal đang mở để không bao giờ bị kẹt lại trên màn hình
        this.closeAllModals();
        document.querySelectorAll(".screen-panel").forEach(panel => {
            panel.classList.remove("active");
        });
        const target = document.getElementById(screenId);
        if (target) target.classList.add("active");
        this.checkOrientationHint();
    }

    startChapter(chapterIndex) {
        this.currentChapterIndex = chapterIndex;
        this.showScreen("screen-game");

        const chapter = TTHCM_KNOWLEDGE.chapters[chapterIndex];
        const hudChapter = document.getElementById("hud-chapter-name");
        if (hudChapter) {
            hudChapter.innerText = chapter.title;
        }

        this.engine.loadLevel(chapterIndex);
        this.engine.start();
        this.engine.updateHUD();
    }

    renderChapterSelectCards() {
        const container = document.getElementById("chapter-cards-list");
        if (!container) return;
        container.innerHTML = "";

        TTHCM_KNOWLEDGE.chapters.forEach((chap, idx) => {
            const card = document.createElement("div");
            card.className = "chapter-card";

            // Kiểm tra bao nhiêu tài liệu trong chương này đã mở khóa
            const chapterDocs = TTHCM_KNOWLEDGE.getDocsForChapter(chap.id);
            const unlockedCount = chapterDocs.filter(d => this.unlockedDocIds.has(d.id)).length;

            card.innerHTML = `
                <div class="chap-badge">${chap.yearRange}</div>
                <h3>${chap.title}</h3>
                <div class="chap-subtitle">${chap.subtitle}</div>
                <p>${chap.desc}</p>
                <div class="chap-progress">
                    <span>Văn kiện: <strong>${unlockedCount}/${chapterDocs.length}</strong></span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(unlockedCount / chapterDocs.length) * 100}%"></div>
                    </div>
                </div>
                <button class="btn btn-primary btn-play-chapter">Chơi màn này</button>
            `;

            card.querySelector(".btn-play-chapter").onclick = () => {
                audio.startBGM();
                this.startChapter(idx);
            };

            container.appendChild(card);
        });
    }

    // Modal hiển thị văn kiện học thuật & câu hỏi trắc nghiệm
    showDocumentModal(docId) {
        const doc = TTHCM_KNOWLEDGE.getDocument(docId);
        if (!doc) return;

        // Lưu trạng thái đã mở khóa
        this.unlockedDocIds.add(docId);
        this.saveData();

        const modal = document.getElementById("modal-document");
        const titleEl = document.getElementById("modal-doc-title");
        const metaEl = document.getElementById("modal-doc-meta");
        const quoteEl = document.getElementById("modal-doc-quote");
        const contextEl = document.getElementById("modal-doc-context");
        const ideaEl = document.getElementById("modal-doc-idea");
        const quizArea = document.getElementById("modal-doc-quiz");
        const resumeBtn = document.getElementById("btn-resume-game");

        titleEl.innerText = doc.name;
        metaEl.innerHTML = `<span><strong>Thời gian:</strong> ${doc.year}</span> | <span><strong>Địa điểm:</strong> ${doc.location}</span> | <span class="badge-gold">${doc.badge}</span>`;
        quoteEl.innerHTML = `<em>"${doc.famousQuote}"</em>`;
        contextEl.innerText = doc.historicalContext;
        ideaEl.innerText = doc.coreIdea;

        // Xây dựng phần Quiz trắc nghiệm
        const isGameActive = document.getElementById("screen-game")?.classList.contains("active");
        quizArea.innerHTML = `
            <div class="quiz-box">
                <h4>Câu hỏi trắc nghiệm (+200 điểm)</h4>
                <p class="quiz-question">${doc.quiz.question}</p>
                <div class="quiz-options">
                    ${doc.quiz.options.map((opt, i) => `
                        <button class="quiz-opt-btn" data-index="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>
                    `).join("")}
                </div>
                <div class="quiz-feedback" style="display: none;"></div>
            </div>
        `;

        let answered = false;
        const optButtons = quizArea.querySelectorAll(".quiz-opt-btn");
        const feedbackEl = quizArea.querySelector(".quiz-feedback");

        optButtons.forEach(btn => {
            btn.onclick = () => {
                if (answered) return;
                answered = true;
                const chosenIdx = parseInt(btn.getAttribute("data-index"));

                if (chosenIdx === doc.quiz.correctIndex) {
                    btn.classList.add("correct");
                    feedbackEl.className = "quiz-feedback correct";
                    feedbackEl.innerHTML = `<strong>✓ Đúng (+200 điểm, +25 HP)</strong><p>${doc.quiz.explanation}</p>`;
                    if (typeof audio !== "undefined" && audio.playQuizSuccess) audio.playQuizSuccess();

                    // CHỈ CỘNG ĐIỂM & HỒI PHỤC MÁU KHI TRẢ LỜI ĐÚNG
                    if (isGameActive && this.engine) {
                        this.engine.score += 200;
                        this.totalQuizPoints += 200;
                        this.engine.hp = Math.min(this.engine.maxHp, this.engine.hp + 25);
                        this.engine.updateHUD();
                        if (this.engine.player) {
                            this.engine.particles.addFloatingText(
                                this.engine.player.x + this.engine.player.width / 2,
                                this.engine.player.y - 25,
                                "+200",
                                "#10b981",
                                16,
                                180
                            );
                        }
                    }
                } else {
                    btn.classList.add("wrong");
                    optButtons[doc.quiz.correctIndex].classList.add("correct");
                    feedbackEl.className = "quiz-feedback wrong";
                    feedbackEl.innerHTML = `<strong>✗ Sai (0 điểm)</strong><p>${doc.quiz.explanation}</p>`;
                    if (typeof audio !== "undefined" && audio.playQuizFail) audio.playQuizFail();

                    // TRẢ LỜI SAI: 0 ĐIỂM
                    if (isGameActive && this.engine && this.engine.player) {
                        this.engine.particles.addFloatingText(
                            this.engine.player.x + this.engine.player.width / 2,
                            this.engine.player.y - 25,
                            "0 ĐIỂM",
                            "#94a3b8",
                            14,
                            160
                        );
                    }
                }
                feedbackEl.style.display = "block";
            };
        });

        modal.classList.add("active");
        resumeBtn.innerText = isGameActive ? "Tiếp Tục ➔" : "Đóng";

        resumeBtn.onclick = () => {
            if (isGameActive && !answered) {
                // Yêu cầu người chơi trả lời câu hỏi trắc nghiệm trước khi tiếp tục
                feedbackEl.className = "quiz-feedback wrong";
                feedbackEl.innerHTML = `<strong>⚠️ Chưa chọn đáp án:</strong> Vui lòng chọn một đáp án trước khi tiếp tục.`;
                feedbackEl.style.display = "block";
                return;
            }
            modal.classList.remove("active");
            if (isGameActive && this.engine && this.engine.isPaused) {
                this.engine.resume();
            }
        };
    }

    // Modal Chiến thắng màn chơi (Level Victory)
    showVictoryModal(levelIndex) {
        const chapter = TTHCM_KNOWLEDGE.chapters[levelIndex];
        const modal = document.getElementById("modal-victory");
        const titleEl = document.getElementById("victory-title");
        const descEl = document.getElementById("victory-desc");
        const scoreEl = document.getElementById("victory-score");
        const nextBtn = document.getElementById("btn-next-chapter");

        titleEl.innerText = "QUA MÀN!";
        descEl.innerText = "Bạn đã hoàn thành màn chơi.";
        scoreEl.innerText = `Điểm: ${this.engine.score} | Thời gian: ${this.engine.getFormattedTime()} | Sao: ${this.engine.starsCollectedCount}`;

        // Kiểm tra xem đây có phải màn cuối cùng (Chương 4)
        if (levelIndex >= TTHCM_KNOWLEDGE.chapters.length - 1) {
            nextBtn.innerText = "Xem tổng kết ➔";
            nextBtn.onclick = () => {
                modal.classList.remove("active");
                this.showGrandVictory();
            };
        } else {
            nextBtn.innerText = "Màn tiếp theo ➔";
            nextBtn.onclick = () => {
                modal.classList.remove("active");
                this.startChapter(levelIndex + 1);
            };
        }

        // Nút Về Menu trong modal chiến thắng
        const victoryBackBtn = modal.querySelector(".btn-back-menu");
        if (victoryBackBtn) {
            victoryBackBtn.onclick = () => {
                modal.classList.remove("active");
                this.closeAllModals();
                this.engine.stop();
                this.showScreen("screen-menu");
            };
        }

        modal.classList.add("active");
    }

    // Màn hình Đại thắng lợi & Thống kê kỷ lục
    showGrandVictory() {
        this.engine.stop();
        const modal = document.getElementById("modal-grand-victory");
        const scoreEl = document.getElementById("grand-score");
        const timeEl = document.getElementById("grand-time");
        const docsCountEl = document.getElementById("grand-docs-count");
        const starsEl = document.getElementById("grand-stars");

        const finalScore = this.engine.score;
        const finalTime = this.engine.getFormattedTime();

        if (scoreEl) scoreEl.innerText = finalScore;
        if (timeEl) timeEl.innerText = finalTime;
        if (docsCountEl) docsCountEl.innerText = `${this.unlockedDocIds.size}/12`;
        if (starsEl) starsEl.innerText = `${this.engine.starsCollectedCount} ★`;

        // Xử lý gửi tên lưu vào Bảng xếp hạng
        const inputName = document.getElementById("grand-player-name");
        const btnSaveScore = document.getElementById("btn-submit-score");
        const saveNotice = document.getElementById("grand-save-notice");

        if (btnSaveScore && inputName) {
            btnSaveScore.disabled = false;
            btnSaveScore.innerText = "Lưu Kỷ Lục";
            if (saveNotice) saveNotice.innerText = "";

            btnSaveScore.onclick = () => {
                const name = inputName.value.trim() || "Người Chơi";
                this.addLeaderboardEntry(name, finalScore, finalTime);
                btnSaveScore.disabled = true;
                btnSaveScore.innerText = "✓ Đã Lưu";
                if (saveNotice) {
                    saveNotice.innerText = "Đã ghi danh vào Bảng Xếp Hạng!";
                    saveNotice.style.color = "#4ade80";
                }
            };
        }

        // Hiệu ứng pháo hoa ăn mừng
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.engine.particles.addFireworks(
                    200 + Math.random() * 600,
                    150 + Math.random() * 200
                );
            }, i * 350);
        }

        const restartBtn = document.getElementById("btn-restart-game");
        if (restartBtn) {
            restartBtn.onclick = () => {
                modal.classList.remove("active");
                this.closeAllModals();
                this.showScreen("screen-menu");
            };
        }

        const btnViewLb = document.getElementById("btn-grand-view-leaderboard");
        if (btnViewLb) {
            btnViewLb.onclick = () => {
                this.openLeaderboardModal();
            };
        }

        modal.classList.add("active");
    }

    // Giao diện Bảo tàng Di sản
    renderMuseum() {
        const container = document.getElementById("museum-grid");
        if (!container) return;
        container.innerHTML = "";

        const allDocs = Object.values(TTHCM_KNOWLEDGE.documents);
        const unlockedTotal = allDocs.filter(d => this.unlockedDocIds.has(d.id)).length;

        document.getElementById("museum-count-display").innerText = `${unlockedTotal}/${allDocs.length} Văn kiện`;

        allDocs.forEach(doc => {
            const isUnlocked = this.unlockedDocIds.has(doc.id);
            const card = document.createElement("div");
            card.className = `museum-card ${isUnlocked ? "unlocked" : "locked"}`;

            card.innerHTML = `
                <div class="card-status-badge">${isUnlocked ? "Đã mở khóa" : "Chưa mở khóa"}</div>
                <div class="card-icon">${isUnlocked ? "📜" : "❓"}</div>
                <h4>${isUnlocked ? doc.name : "Chưa mở khóa"}</h4>
                <div class="card-year">${isUnlocked ? doc.year : "Chương " + doc.chapterId}</div>
                <p>${isUnlocked ? doc.famousQuote : "Tìm và nhặt văn kiện này trong màn chơi."}</p>
                ${isUnlocked ? `<button class="btn btn-sm btn-outline">Xem</button>` : ""}
            `;

            if (isUnlocked) {
                card.onclick = () => this.showDocumentModal(doc.id);
            }

            container.appendChild(card);
        });
    }

    // =========================================================================
    // HỆ THỐNG BẢNG XẾP HẠNG & KỶ LỤC (LEADERBOARD)
    // =========================================================================
    getDefaultLeaderboard() {
        return [
            { rank: 1, name: "Chiến Sĩ Quyết Tử", score: 2650, time: "04:18", date: "Kỷ lục" },
            { rank: 2, name: "Nguyễn Tất Thành",  score: 2400, time: "05:05", date: "Kỷ lục" },
            { rank: 3, name: "Việt Minh 1945",     score: 2150, time: "06:12", date: "Kỷ lục" },
            { rank: 4, name: "Sao Vàng Pác Bó",    score: 1900, time: "07:30", date: "Kỷ lục" },
            { rank: 5, name: "Tân Binh Cứu Quốc",  score: 1550, time: "08:45", date: "Kỷ lục" }
        ];
    }

    loadLeaderboard() {
        try {
            const raw = localStorage.getItem("tthcm_leaderboard");
            if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) return list;
            }
        } catch (e) {}
        const def = this.getDefaultLeaderboard();
        this.saveLeaderboard(def);
        return def;
    }

    saveLeaderboard(list) {
        try {
            localStorage.setItem("tthcm_leaderboard", JSON.stringify(list));
        } catch (e) {}
    }

    addLeaderboardEntry(name, score, timeStr) {
        const list = this.loadLeaderboard();
        const trimmed = (name || "Người Chơi").trim() || "Người Chơi";
        list.push({
            name: trimmed,
            score: score,
            time: timeStr,
            date: new Date().toLocaleDateString("vi-VN")
        });

        // Sắp xếp: Điểm cao nhất trước, nếu bằng điểm thì thời gian ít hơn xếp trên
        list.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time.localeCompare(b.time);
        });

        const top10 = list.slice(0, 10).map((item, idx) => ({ ...item, rank: idx + 1 }));
        this.saveLeaderboard(top10);
        this.updateHighScorePreview();
        return top10;
    }

    updateHighScorePreview() {
        const preview = document.getElementById("menu-high-score-preview");
        if (!preview) return;
        const list = this.loadLeaderboard();
        if (list.length > 0) {
            const top = list[0];
            preview.innerText = `🏆 Kỷ lục: ${top.score} Điểm (⏱️ ${top.time}) - ${top.name}`;
        }
    }

    openLeaderboardModal() {
        const modal = document.getElementById("modal-leaderboard");
        if (!modal) return;
        this.renderLeaderboardTable();
        modal.classList.add("active");
    }

    renderLeaderboardTable() {
        const tbody = document.getElementById("leaderboard-tbody");
        if (!tbody) return;
        const list = this.loadLeaderboard();
        tbody.innerHTML = list.map((item, idx) => `
            <tr>
                <td class="leaderboard-rank leaderboard-rank-${idx + 1}">${idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : "#" + (idx + 1)}</td>
                <td style="font-weight: 700; color: #f8fafc;">${item.name}</td>
                <td style="color: var(--accent-gold); font-weight: 800; font-family: monospace;">${item.score}</td>
                <td style="color: #38bdf8; font-family: monospace;">⏱️ ${item.time}</td>
                <td style="color: #94a3b8; font-size: 0.85rem;">${item.date}</td>
            </tr>
        `).join("");
    }

    openGuideModal() {
        document.getElementById("modal-guide").classList.add("active");
    }

    handleGameOver() {
        audio.playGameOver();
        const modal = document.getElementById("modal-game-over");
        if (modal) {
            modal.classList.add("active");
            const retryBtn = document.getElementById("btn-retry-level");
            if (retryBtn) {
                retryBtn.onclick = () => {
                    modal.classList.remove("active");
                    this.startChapter(this.currentChapterIndex);
                };
            }
            const backBtn = modal.querySelector(".btn-back-menu");
            if (backBtn) {
                backBtn.onclick = () => {
                    modal.classList.remove("active");
                    this.closeAllModals();
                    this.engine.stop();
                    this.showScreen("screen-menu");
                };
            }
        }
    }
}

// Khởi tạo Game khi trang tải xong
window.addEventListener("DOMContentLoaded", () => {
    window.game = new GameManager();

    // 1. Đóng modal khi bấm nút X (không áp dụng cho modal kết thúc màn/kết thúc game)
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
        btn.onclick = (e) => {
            const modal = e.target.closest(".modal-overlay");
            if (!modal) return;
            // Bảo vệ trạng thái: Không cho tắt các modal trạng thái kết thúc/game over bằng nút X thông thường
            if (modal.id === "modal-game-over" || modal.id === "modal-victory" || modal.id === "modal-grand-victory") {
                return;
            }
            modal.classList.remove("active");
            const isGameActive = document.getElementById("screen-game")?.classList.contains("active");
            if (isGameActive && window.game && window.game.engine && window.game.engine.isPaused) {
                window.game.engine.resume();
            }
        };
    });

    // 2. Đóng modal khi click ra ngoài vùng nền mờ
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                // Bảo vệ trạng thái: Không cho click ngoài tắt modal game over / thắng cuộc
                if (overlay.id === "modal-game-over" || overlay.id === "modal-victory" || overlay.id === "modal-grand-victory") {
                    return;
                }
                overlay.classList.remove("active");
                const isGameActive = document.getElementById("screen-game")?.classList.contains("active");
                if (isGameActive && window.game && window.game.engine && window.game.engine.isPaused) {
                    window.game.engine.resume();
                }
            }
        });
    });

    // 3. Đóng modal khi bấm phím Esc, hoặc bấm Enter/R để chơi lại khi hết máu
    window.addEventListener("keydown", (e) => {
        const gameOverModal = document.getElementById("modal-game-over");
        if (gameOverModal && gameOverModal.classList.contains("active")) {
            if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "r") {
                e.preventDefault();
                gameOverModal.classList.remove("active");
                if (window.game) {
                    window.game.startChapter(window.game.currentChapterIndex);
                }
                return;
            }
        }

        if (e.key === "Escape") {
            const activeModal = document.querySelector(".modal-overlay.active");
            if (activeModal) {
                // Không đóng modal game over hoặc chiến thắng bằng phím Esc để tránh kẹt trạng thái
                if (activeModal.id === "modal-game-over" || activeModal.id === "modal-victory" || activeModal.id === "modal-grand-victory") {
                    return;
                }
                activeModal.classList.remove("active");
                const isGameActive = document.getElementById("screen-game")?.classList.contains("active");
                if (isGameActive && window.game && window.game.engine && window.game.engine.isPaused) {
                    window.game.engine.resume();
                }
            }
        }
    });
});
