// Thiết kế 4 Màn Chơi Lịch Sử Hợp Lý, Mượt Mà & Cân Bằng (Mỗi màn 5 phân khu tương ứng 5 Văn Kiện)

const LEVELS = [
    // =========================================================================
    // MÀN 1: BẾN CẢNG SÀI GÒN & PARIS (1911 - 1919)
    // [MỨC ĐỘ: NHẬP MÔN / DỄ TIẾP CẬN] - Chiều dài 4500px, 5 Văn kiện chia đều 5 khu
    // Đặc trưng: Đường đất rộng rãi, các lạch nước hẹp (90-100px) có cầu ván gỗ hỗ trợ phía trên
    // =========================================================================
    {
        id: 1,
        name: "Chương 1: Ra Đi Tìm Đường Cứu Nước (1911 - 1919)",
        theme: "harbor_paris",
        bgColor: "#0f172a",
        skyColor: ["#020617", "#1e1b4b"],
        groundColor: "#334155",
        platformColor: "#475569",
        levelWidth: 4500,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4260, y: 440 },
        exitType: "ship", // Tàu Amiral Latouche-Tréville

        // Địa hình 5 khu vực liền lạc, bậc nhảy cách nhau đúng 80px (y=520 -> 440 -> 360)
        platforms: [
            // 5 Nền đất chính ngăn cách bởi 4 lạch nước nhỏ (rộng 90-100px, nhảy đơn qua dễ dàng)
            { x: 0,    y: 520, w: 860,  h: 80, type: "dock" },  // Khu 1: Bến Nhà Rồng (0..860)
            { x: 960,  y: 520, w: 800,  h: 80, type: "stone" }, // Khu 2: Hải trình & Marseille (960..1760)
            { x: 1850, y: 520, w: 800,  h: 80, type: "stone" }, // Khu 3: Ngõ phố Paris (1850..2650)
            { x: 2740, y: 520, w: 780,  h: 80, type: "stone" }, // Khu 4: Quận 13 Paris (2740..3520)
            { x: 3610, y: 520, w: 890,  h: 80, type: "stone" }, // Khu 5: Cung điện Versailles (3610..4500)

            // Khu 1: Các bục gỗ bến cảng dẫn lên Văn kiện 1 (x=520, y=300)
            { x: 240,  y: 440, w: 170, h: 20, type: "wood" },
            { x: 450,  y: 360, w: 200, h: 20, type: "wood" },
            { x: 680,  y: 440, w: 150, h: 20, type: "wood" },

            // Khu 2: Ban công cảng Pháp dẫn lên Văn kiện 2 (x=1420, y=300)
            { x: 1140, y: 440, w: 170, h: 20, type: "stone" },
            { x: 1350, y: 360, w: 200, h: 20, type: "stone" },
            { x: 1590, y: 440, w: 150, h: 20, type: "wood" },
            // Cầu gỗ hỗ trợ phía trên Lạch nước 2 (1760..1850)
            { x: 1750, y: 450, w: 110, h: 18, type: "wood" },

            // Khu 3: Trụ sở Hội người Việt yêu nước - Văn kiện 3 (x=2260, y=300)
            { x: 1990, y: 440, w: 170, h: 20, type: "stone" },
            { x: 2190, y: 360, w: 200, h: 20, type: "stone" },
            { x: 2430, y: 440, w: 160, h: 20, type: "stone" },
            // Cầu gỗ hỗ trợ phía trên Lạch nước 3 (2650..2740)
            { x: 2640, y: 450, w: 110, h: 18, type: "wood" },

            // Khu 4: Khảo sát Năm Châu & Cách mạng Tháng Mười - Văn kiện 4 (x=3120, y=300)
            { x: 2850, y: 440, w: 170, h: 20, type: "stone" },
            { x: 3050, y: 360, w: 200, h: 20, type: "stone" },
            { x: 3290, y: 440, w: 160, h: 20, type: "stone" },
            // Cầu gỗ hỗ trợ phía trên Lạch nước 4 (3520..3610)
            { x: 3510, y: 450, w: 110, h: 18, type: "wood" },

            // Khu 5: Hội nghị Versailles - Văn kiện 5 (x=3960, y=300)
            { x: 3700, y: 440, w: 170, h: 20, type: "stone" },
            { x: 3890, y: 360, w: 200, h: 20, type: "stone" },
            { x: 4120, y: 440, w: 150, h: 20, type: "wood" }
        ],

        // Chỗ ẩn nấp đặt ngay cạnh đường tuần tra của địch
        hidingSpots: [
            { x: 200,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng bến cảng" },
            { x: 600,  y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ bến tàu" },
            { x: 1100, y: 470, w: 55, h: 50, type: "arch",  label: "Ngõ tối Marseille" },
            { x: 1520, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách báo" },
            { x: 1960, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cửa cổ Paris" },
            { x: 2380, y: 470, w: 55, h: 50, type: "arch",  label: "Hành lang Paris" },
            { x: 2880, y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng quận 13" },
            { x: 3760, y: 470, w: 55, h: 50, type: "arch",  label: "Cổng vòm Versailles" }
        ],

        // Kẻ địch: 5 mật thám tuần tra dưới mặt đất (mỗi khu 1 tên, tốc độ vừa phải, không chặn trên bục lấy văn kiện)
        guards: [
            { x: 480,  y: 472, minX: 340,  maxX: 620,  speed: 0.8,  dir: 1,  range: 102 },
            { x: 1320, y: 472, minX: 1150, maxX: 1500, speed: 0.82, dir: -1, range: 105 },
            { x: 2180, y: 472, minX: 2020, maxX: 2360, speed: 0.85, dir: 1,  range: 105 },
            { x: 3060, y: 472, minX: 2920, maxX: 3280, speed: 0.85, dir: -1, range: 108 },
            { x: 3920, y: 472, minX: 3800, maxX: 4100, speed: 0.88, dir: 1,  range: 108 }
        ],

        // 4 lạch nước vừa phải (90-100px) khớp chính xác giữa các nền đất
        hazards: [
            { x: 860,  y: 540, w: 100, h: 60, type: "water", label: "Lạch nước bến cảng" },
            { x: 1760, y: 540, w: 90,  h: 60, type: "water", label: "Hố nước cảng Pháp" },
            { x: 2650, y: 540, w: 90,  h: 60, type: "water", label: "Kênh nước Seine" },
            { x: 3520, y: 540, w: 90,  h: 60, type: "water", label: "Hào nước Versailles" }
        ],

        // 4 Điểm lưu vị trí đặt ngay đầu mỗi khu đất mới
        checkpoints: [
            { x: 1000, y: 460, id: "cp1_1", reached: false },
            { x: 1890, y: 460, id: "cp1_2", reached: false },
            { x: 2780, y: 460, id: "cp1_3", reached: false },
            { x: 3650, y: 460, id: "cp1_4", reached: false }
        ],

        // 5 Di sản Văn kiện chia đều vào đúng 5 khu vực (mỗi khu 1 văn kiện trên bục y=360)
        documents: [
            { docId: "truoc_1911",    x: 520,  y: 300 },
            { docId: "ben_nha_rong",  x: 1420, y: 300 },
            { docId: "hoi_yeu_nuoc",  x: 2260, y: 300 },
            { docId: "nam_chau_1917", x: 3120, y: 300 },
            { docId: "yeu_sach_1919", x: 3960, y: 300 }
        ],

        // Sao thưởng (16 sao dẫn đường trực quan)
        stars: [
            { x: 160,  y: 470 }, { x: 310,  y: 390 }, { x: 480,  y: 310 }, { x: 740,  y: 390 },
            { x: 1200, y: 390 }, { x: 1380, y: 310 }, { x: 1650, y: 390 },
            { x: 2050, y: 390 }, { x: 2220, y: 310 }, { x: 2490, y: 390 },
            { x: 2910, y: 390 }, { x: 3080, y: 310 }, { x: 3350, y: 390 },
            { x: 3760, y: 390 }, { x: 3920, y: 310 }, { x: 4180, y: 390 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 360,  y: 485, type: "shield" },   // Áo Trấn Thủ ở bến cảng
            { x: 1060, y: 485, type: "disguise" }, // Hòm cải trang đầu khu 2
            { x: 1940, y: 485, type: "speed" },    // Dép Cao Su đầu khu 3
            { x: 2820, y: 485, type: "disguise" }, // Hòm cải trang đầu khu 4
            { x: 3700, y: 485, type: "heal" }      // Lương khô Versailles
        ],

        // Đồng chí liên lạc bí mật (cần 3 Sao Vàng để mở cầu tắt qua lạch nước 1)
        npcs: [
            {
                x: 780, y: 472,
                name: "Đồng chí Thợ Thuyền Ba Son",
                quote: "Anh Ba! Tàu sắp nhổ neo, tôi đã hạ sẵn chiếc cầu bí mật giúp anh vượt qua lạch nước an toàn!",
                giftType: "shield",
                shortcutId: "shortcut_harbor",
                starCost: 3
            }
        ],

        // Lối tắt bí mật (nối liền Khu 1 x=860 sang Khu 2 x=960 ở mặt đất y=520)
        shortcuts: [
            { id: "shortcut_harbor", x: 860, y: 520, w: 100, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 2: MÙA ĐÔNG MOSKVA & ĐƯỜNG KÁCH MỆNH (1920 - 1927)
    // [MỨC ĐỘ: VỪA PHẢI] - Chiều dài 5000px, 5 Văn kiện chia đều 5 khu
    // Đặc trưng: Bề mặt tuyết trơn nhẹ, các vực băng hẹp (100-110px) đều có cầu gỗ rộng bắc qua
    // =========================================================================
    {
        id: 2,
        name: "Chương 2: Ánh Sáng Luận Cương & Đường Kách Mệnh (1920 - 1927)",
        theme: "moscow_guangzhou",
        bgColor: "#1c1917",
        skyColor: ["#0c0a09", "#292524"],
        groundColor: "#44403c",
        platformColor: "#57534e",
        levelWidth: 5000,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4720, y: 460 },
        exitType: "train", // Chuyến tàu cách mạng

        // 5 Khu nền đất rõ ràng, các bậc nhảy cách nhau 80px (y=520 -> 440 -> 360 -> 280)
        platforms: [
            { x: 0,    y: 520, w: 850,  h: 80, type: "snow_brick" }, // Khu 1: Paris Mùa Đông (0..850)
            { x: 960,  y: 520, w: 880,  h: 80, type: "snow_brick" }, // Khu 2: Đại hội Tours (960..1840)
            { x: 1950, y: 520, w: 880,  h: 80, type: "snow_brick" }, // Khu 3: Báo Le Paria & Moskva (1950..2830)
            { x: 2940, y: 520, w: 880,  h: 80, type: "brick" },      // Khu 4: Quốc tế Cộng sản (2940..3820)
            { x: 3930, y: 520, w: 1070, h: 80, type: "brick" },      // Khu 5: Quảng Châu (3930..5000)

            // Khu 1: Bậc thang dẫn lên Văn kiện 1 (x=540, y=280)
            { x: 240,  y: 440, w: 180, h: 20, type: "snow_brick" },
            { x: 460,  y: 360, w: 210, h: 20, type: "snow_brick" },
            { x: 700,  y: 440, w: 140, h: 20, type: "snow_brick" },
            // Cầu gỗ rộng qua Vực băng 1 (850..960)
            { x: 845,  y: 450, w: 120, h: 18, type: "wood" },

            // Khu 2: Đại hội Tours - Văn kiện 2 (x=1420, y=300)
            { x: 1120, y: 440, w: 180, h: 20, type: "snow_brick" },
            { x: 1340, y: 360, w: 210, h: 20, type: "snow_brick" },
            { x: 1590, y: 440, w: 160, h: 20, type: "snow_brick" },
            // Cầu gỗ rộng qua Vực băng 2 (1840..1950)
            { x: 1835, y: 450, w: 120, h: 18, type: "wood" },

            // Khu 3: Tòa soạn báo Le Paria - Văn kiện 3 (x=2400, y=300)
            { x: 2100, y: 440, w: 180, h: 20, type: "snow_brick" },
            { x: 2320, y: 360, w: 210, h: 20, type: "snow_brick" },
            { x: 2570, y: 440, w: 160, h: 20, type: "snow_brick" },
            // Cầu gỗ rộng qua Vực băng 3 (2830..2940)
            { x: 2825, y: 450, w: 120, h: 18, type: "wood" },

            // Khu 4: Bản án chế độ thực dân Pháp - Văn kiện 4 (x=3380, y=300)
            { x: 3090, y: 440, w: 180, h: 20, type: "brick" },
            { x: 3300, y: 360, w: 210, h: 20, type: "brick" },
            { x: 3550, y: 440, w: 160, h: 20, type: "brick" },
            // Cầu gỗ rộng qua Vực băng 4 (3820..3930)
            { x: 3815, y: 450, w: 120, h: 18, type: "wood" },

            // Khu 5: Lớp huấn luyện Quảng Châu & Đường Kách Mệnh - Văn kiện 5 (x=4360, y=300)
            { x: 4080, y: 440, w: 180, h: 20, type: "brick" },
            { x: 4290, y: 360, w: 210, h: 20, type: "brick" },
            { x: 4530, y: 440, w: 160, h: 20, type: "brick" }
        ],

        hidingSpots: [
            { x: 200,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng in báo" },
            { x: 640,  y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ mùa đông" },
            { x: 1180, y: 470, w: 55, h: 50, type: "arch",  label: "Cửa hầm Tours" },
            { x: 1540, y: 470, w: 50, h: 50, type: "crate", label: "Thùng phủ tuyết" },
            { x: 2160, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cổng Kremlin" },
            { x: 2520, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách Moskva" },
            { x: 3150, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách Quốc tế" },
            { x: 4140, y: 470, w: 50, h: 50, type: "crate", label: "Hòm tài liệu Quảng Châu" }
        ],

        // 6 lính tuần tra dưới đất (tốc độ vừa phải, không đứng chặn trên bục văn kiện)
        guards: [
            { x: 440,  y: 472, minX: 290,  maxX: 600,  speed: 0.85, dir: 1,  range: 108, angle: 0.30 },
            { x: 1320, y: 472, minX: 1120, maxX: 1500, speed: 0.88, dir: -1, range: 110, angle: 0.30 },
            { x: 1680, y: 472, minX: 1580, maxX: 1790, speed: 0.85, dir: 1,  range: 105, angle: 0.30 },
            { x: 2300, y: 472, minX: 2100, maxX: 2480, speed: 0.88, dir: 1,  range: 110, angle: 0.30 },
            { x: 3300, y: 472, minX: 3100, maxX: 3500, speed: 0.9,  dir: -1, range: 112, angle: 0.30 },
            { x: 4280, y: 472, minX: 4080, maxX: 4480, speed: 0.9,  dir: 1,  range: 112, angle: 0.30 }
        ],

        // 4 Vực băng vừa vặn (110px) khớp chính xác giữa 5 khu nền đất
        hazards: [
            { x: 850,  y: 530, w: 110, h: 70, type: "ice_pit", label: "Vực băng tuyết sâu" },
            { x: 1840, y: 530, w: 110, h: 70, type: "ice_pit", label: "Hố băng trơn trượt" },
            { x: 2830, y: 530, w: 110, h: 70, type: "ice_pit", label: "Khe băng lạnh giá" },
            { x: 3820, y: 530, w: 110, h: 70, type: "ice_pit", label: "Vực sâu Quảng Châu" }
        ],

        checkpoints: [
            { x: 1010, y: 460, id: "cp2_1", reached: false },
            { x: 2000, y: 460, id: "cp2_2", reached: false },
            { x: 2990, y: 460, id: "cp2_3", reached: false },
            { x: 3980, y: 460, id: "cp2_4", reached: false }
        ],

        // 5 Di sản Văn kiện chia đều 5 khu trên các bục y=360
        documents: [
            { docId: "luan_cuong_lenin",    x: 540,  y: 300 },
            { docId: "dai_hoi_tours_1920",  x: 1420, y: 300 },
            { docId: "le_paria",            x: 2400, y: 300 },
            { docId: "ban_an_thuc_dan",     x: 3380, y: 300 },
            { docId: "duong_kach_menh",     x: 4360, y: 300 }
        ],

        stars: [
            { x: 150,  y: 470 }, { x: 300,  y: 390 }, { x: 500,  y: 310 }, { x: 750,  y: 390 },
            { x: 890,  y: 400 }, { x: 1180, y: 390 }, { x: 1380, y: 310 },
            { x: 1880, y: 400 }, { x: 2160, y: 390 }, { x: 2360, y: 310 },
            { x: 2870, y: 400 }, { x: 3150, y: 390 }, { x: 3340, y: 310 },
            { x: 4140, y: 390 }, { x: 4320, y: 310 }, { x: 4600, y: 470 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 360,  y: 485, type: "speed" },    // Dép Cao Su chạy băng tuyết
            { x: 1060, y: 485, type: "disguise" }, // Hòm cải trang khu 2
            { x: 1640, y: 395, type: "shield" },   // Áo Trấn Thủ chống lạnh & đỡ đòn
            { x: 2050, y: 485, type: "heal" },     // Lương khô Moskva
            { x: 3040, y: 485, type: "disguise" }, // Hòm cải trang tại Quảng Châu
            { x: 4030, y: 485, type: "heal" }      // Lương khô chặng cuối
        ],

        // Đồng chí liên lạc bí mật (cần 3 Sao Vàng để mở cầu tắt qua vực băng 1)
        npcs: [
            {
                x: 760, y: 472,
                name: "Đồng chí Quốc Tế Cộng Sản",
                quote: "Đồng chí Nguyễn! Luận cương của Lênin là ngọn đuốc soi đường. Cây cầu bí mật vượt vực tuyết đã mở!",
                giftType: "speed",
                shortcutId: "shortcut_moscow",
                starCost: 3
            }
        ],

        // Lối tắt bí mật (bắc ngang vực băng 850..960 ở cao độ y=520)
        shortcuts: [
            { id: "shortcut_moscow", x: 850, y: 520, w: 110, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 3: RỪNG NÚI PÁC BÓ & TIẾNG GỌI TỔ QUỐC (1930 - 1941)
    // [MỨC ĐỘ: THỬ THÁCH VỪA PHẢI] - Chiều dài 5200px, 5 Văn kiện chia đều 5 khu núi rừng
    // Đặc trưng: Leo đồi đá thoải (3 tầng y=440, 360, 280) và vượt cầu tre rộng qua suối Lê-nin
    // =========================================================================
    {
        id: 3,
        name: "Chương 3: Thành Lập Đảng & Tiếng Gọi Pác Bó (1930 - 1941)",
        theme: "jungle_pacbo",
        bgColor: "#064e3b",
        skyColor: ["#022c22", "#064e3b"],
        groundColor: "#14532d",
        platformColor: "#15803d",
        levelWidth: 5200,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4940, y: 490 },
        exitType: "cave", // Hang Pác Bó thiêng liêng

        // 5 Đảo đá núi rừng rộng rãi ngăn cách bởi 4 dòng suối hẹp (220-260px) đều có cầu tre bắc qua
        platforms: [
            // 5 Nền đảo đá chính
            { x: 0,    y: 520, w: 800,  h: 80, type: "moss_rock" }, // Khu 1: Hương Cảng (0..800)
            { x: 1020, y: 520, w: 820,  h: 80, type: "moss_rock" }, // Khu 2: Biên giới Cao Bằng (1020..1840)
            { x: 2060, y: 520, w: 820,  h: 80, type: "moss_rock" }, // Khu 3: Lán Khuổi Nặm (2060..2880)
            { x: 3100, y: 520, w: 820,  h: 80, type: "moss_rock" }, // Khu 4: Rừng Trần Hưng Đạo (3100..3920)
            { x: 4140, y: 520, w: 1060, h: 80, type: "moss_rock" }, // Khu 5: Suối Lê-nin & Hang Pác Bó (4140..5200)

            // Khu 1: Leo đồi đá lấy Văn kiện 1 (x=520, y=220 trên đỉnh y=280)
            { x: 200,  y: 440, w: 160, h: 20, type: "rock" },
            { x: 340,  y: 360, w: 160, h: 20, type: "rock" },
            { x: 460,  y: 280, w: 190, h: 22, type: "moss_rock" },
            // Cầu tre đôi vượt Suối 1 (800..1020)
            { x: 780,  y: 450, w: 120, h: 18, type: "bamboo" },
            { x: 910,  y: 450, w: 120, h: 18, type: "bamboo" },

            // Khu 2: Cột mốc 108 - Văn kiện 2 (x=1480, y=220 trên đỉnh y=280)
            { x: 1160, y: 440, w: 160, h: 20, type: "rock" },
            { x: 1300, y: 360, w: 160, h: 20, type: "rock" },
            { x: 1420, y: 280, w: 190, h: 22, type: "moss_rock" },
            // Cầu tre đôi vượt Suối 2 (1840..2060)
            { x: 1820, y: 450, w: 120, h: 18, type: "bamboo" },
            { x: 1950, y: 450, w: 120, h: 18, type: "bamboo" },

            // Khu 3: Hội nghị TW 8 & Mặt trận Việt Minh - Văn kiện 3 (x=2520, y=220)
            { x: 2200, y: 440, w: 160, h: 20, type: "rock" },
            { x: 2340, y: 360, w: 160, h: 20, type: "rock" },
            { x: 2460, y: 280, w: 190, h: 22, type: "moss_rock" },
            // Cầu tre đôi vượt Suối 3 (2880..3100)
            { x: 2860, y: 450, w: 120, h: 18, type: "bamboo" },
            { x: 2990, y: 450, w: 120, h: 18, type: "bamboo" },

            // Khu 4: Đội VN Tuyên truyền Giải phóng quân - Văn kiện 4 (x=3560, y=220)
            { x: 3240, y: 440, w: 160, h: 20, type: "rock" },
            { x: 3380, y: 360, w: 160, h: 20, type: "rock" },
            { x: 3500, y: 280, w: 190, h: 22, type: "moss_rock" },
            // Cầu tre đôi vượt Suối 4 (3920..4140)
            { x: 3900, y: 450, w: 120, h: 18, type: "bamboo" },
            { x: 4030, y: 450, w: 120, h: 18, type: "bamboo" },

            // Khu 5: Kim chỉ nam Tư tưởng trước cửa Hang Pác Bó - Văn kiện 5 (x=4600, y=220)
            { x: 4280, y: 440, w: 160, h: 20, type: "rock" },
            { x: 4420, y: 360, w: 160, h: 20, type: "rock" },
            { x: 4540, y: 280, w: 190, h: 22, type: "moss_rock" }
        ],

        // Ẩn nấp: Bụi rậm và hốc đá tự nhiên dọc 5 khu
        hidingSpots: [
            { x: 180,  y: 470, w: 55, h: 50, type: "bush",      label: "Bụi trúc Cao Bằng" },
            { x: 620,  y: 470, w: 55, h: 50, type: "rock_hide", label: "Hốc đá chân núi" },
            { x: 1140, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây biên giới" },
            { x: 1640, y: 470, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá Cột mốc 108" },
            { x: 2180, y: 470, w: 55, h: 50, type: "bush",      label: "Lùm cây Khuổi Nặm" },
            { x: 2680, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây thung lũng" },
            { x: 3220, y: 470, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá rừng già" },
            { x: 4260, y: 470, w: 55, h: 50, type: "bush",      label: "Rừng vầu Pác Bó" },
            { x: 4820, y: 470, w: 55, h: 50, type: "bush",      label: "Lùm cây cửa hang" }
        ],

        // 6 lính tuần tra biên giới dưới mặt đất (không đứng chắn trên các mỏm đá lấy văn kiện)
        guards: [
            { x: 420,  y: 472, minX: 250,  maxX: 600,  speed: 0.9,  dir: 1,  range: 112, angle: 0.31, aimDelay: 20 },
            { x: 1400, y: 472, minX: 1200, maxX: 1620, speed: 0.92, dir: -1, range: 114, angle: 0.31, aimDelay: 20 },
            { x: 2420, y: 472, minX: 2220, maxX: 2660, speed: 0.92, dir: 1,  range: 114, angle: 0.31, aimDelay: 20 },
            { x: 3460, y: 472, minX: 3260, maxX: 3700, speed: 0.95, dir: -1, range: 116, angle: 0.31, aimDelay: 20 },
            { x: 4460, y: 472, minX: 4300, maxX: 4680, speed: 0.95, dir: 1,  range: 116, angle: 0.31, aimDelay: 20 },
            { x: 4760, y: 472, minX: 4660, maxX: 4860, speed: 0.9,  dir: -1, range: 110, angle: 0.31, aimDelay: 20 }
        ],

        // 4 Dòng suối/thác vừa phải (220px) khớp chính xác giữa 5 đảo đá
        hazards: [
            { x: 800,  y: 530, w: 220, h: 70, type: "water", label: "Thác ghềnh cuộn sóng" },
            { x: 1840, y: 530, w: 220, h: 70, type: "water", label: "Dòng suối biên giới" },
            { x: 2880, y: 530, w: 220, h: 70, type: "water", label: "Suối Khuổi Nặm" },
            { x: 3920, y: 530, w: 220, h: 70, type: "water", label: "Suối Lê-nin" }
        ],

        // 4 Checkpoint đặt ngay đầu mỗi đảo đá mới, cực kỳ dễ chạm tới
        checkpoints: [
            { x: 1060, y: 460, id: "cp3_1", reached: false },
            { x: 2100, y: 460, id: "cp3_2", reached: false },
            { x: 3140, y: 460, id: "cp3_3", reached: false },
            { x: 4180, y: 460, id: "cp3_4", reached: false }
        ],

        // 5 Văn kiện chia đều ở đỉnh 5 khu đồi đá (y=280 -> doc y=220)
        documents: [
            { docId: "cuong_linh_1930",      x: 520,  y: 220 },
            { docId: "cot_moc_108",          x: 1480, y: 220 },
            { docId: "mat_tran_viet_minh",   x: 2520, y: 220 },
            { docId: "doi_tuyentruyen_1944", x: 3560, y: 220 },
            { docId: "nen_tang_tu_tuong",    x: 4600, y: 220 }
        ],

        stars: [
            { x: 140,  y: 470 }, { x: 260,  y: 390 }, { x: 400,  y: 310 }, { x: 840,  y: 400 },
            { x: 1220, y: 390 }, { x: 1360, y: 310 }, { x: 1880, y: 400 },
            { x: 2260, y: 390 }, { x: 2400, y: 310 }, { x: 2920, y: 400 },
            { x: 3300, y: 390 }, { x: 3440, y: 310 }, { x: 3960, y: 400 },
            { x: 4340, y: 390 }, { x: 4480, y: 310 }, { x: 4860, y: 470 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 320,  y: 485, type: "shield" },   // Áo Trấn Thủ du kích
            { x: 1120, y: 485, type: "disguise" }, // Hòm cải trang khu 2
            { x: 1700, y: 485, type: "heal" },     // Lương khô biên giới
            { x: 2150, y: 485, type: "speed" },    // Dép Cao Su vượt suối
            { x: 3180, y: 485, type: "disguise" }, // Hòm cải trang khu 4
            { x: 4230, y: 485, type: "heal" }      // Lương khô rừng Pác Bó
        ],

        // Đồng chí liên lạc bí mật (cần 3 Sao Vàng để mở cầu tre thẳng qua Suối 1)
        npcs: [
            {
                x: 700, y: 472,
                name: "Đồng chí Dân Tộc Pác Bó",
                quote: "Bác đã về với núi rừng quê hương! Đồng bào đã dựng cầu tre bí mật đưa Bác qua dòng thác ghềnh!",
                giftType: "shield",
                shortcutId: "shortcut_pacbo",
                starCost: 3
            }
        ],

        // Lối tắt bí mật (cầu tre nối liền Khu 1 x=800 sang Khu 2 x=1020 ở cao độ y=520)
        shortcuts: [
            { id: "shortcut_pacbo", x: 800, y: 520, w: 220, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 4: MÙA THU ĐỘC LẬP - BA ĐÌNH LỊCH SỬ (1945)
    // [MỨC ĐỘ: CAO TRÀO HẤP DẪN] - Chiều dài 5600px, 5 Văn kiện chia đều 5 khu phố Hà Nội
    // Đặc trưng: 5 Khu phố xen kẽ mái ngói cổ Thăng Long & Quảng trường Ba Đình trang nghiêm
    // =========================================================================
    {
        id: 4,
        name: "Chương 4: Mùa Thu Độc Lập - Ba Đình Lịch Sử (1945)",
        theme: "revolution_badinh",
        bgColor: "#262335",
        skyColor: ["#0b1021", "#182238"],
        groundColor: "#334155",
        platformColor: "#b45309",
        levelWidth: 5600,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 5360, y: 330 },
        exitType: "podium", // Đại Lễ Đài Ba Đình

        // 5 Khu phố có nền đất an toàn xen kẽ với 4 đoạn rào thép gai vừa phải (360-400px) có dãy mái ngói bắc qua
        platforms: [
            // 5 Nền đất chính của Thủ đô Hà Nội
            { x: 0,    y: 520, w: 680,  h: 80, type: "red_brick" }, // Khu 1: Cửa ô Hà Nội (0..680)
            { x: 1060, y: 520, w: 720,  h: 80, type: "marble" },    // Khu 2: Phố cổ Thăng Long (1060..1780)
            { x: 2160, y: 520, w: 740,  h: 80, type: "marble" },    // Khu 3: Bắc Bộ Phủ (2160..2900)
            { x: 3280, y: 520, w: 740,  h: 80, type: "marble" },    // Khu 4: Phố 48 Hàng Ngang (3280..4020)
            { x: 4400, y: 520, w: 1200, h: 80, type: "marble" },    // Khu 5: Quảng trường Ba Đình (4400..5600)

            // Cụm mái ngói 1: Vượt rào thép gai 1 (680..1060) & lấy Văn kiện 1 (x=760, y=220)
            { x: 280,  y: 440, w: 170, h: 20, type: "tile" },
            { x: 470,  y: 360, w: 180, h: 20, type: "tile" },
            { x: 670,  y: 280, w: 210, h: 20, type: "tile" },
            { x: 900,  y: 380, w: 170, h: 20, type: "tile" },

            // Cụm mái ngói 2: Vượt rào thép gai 2 (1780..2160) & lấy Văn kiện 2 (x=1860, y=220)
            { x: 1380, y: 440, w: 170, h: 20, type: "tile" },
            { x: 1570, y: 360, w: 180, h: 20, type: "tile" },
            { x: 1770, y: 280, w: 210, h: 20, type: "tile" },
            { x: 2000, y: 380, w: 170, h: 20, type: "tile" },

            // Cụm mái ngói 3: Vượt rào thép gai 3 (2900..3280) & lấy Văn kiện 3 (x=2980, y=220)
            { x: 2500, y: 440, w: 170, h: 20, type: "tile" },
            { x: 2690, y: 360, w: 180, h: 20, type: "tile" },
            { x: 2890, y: 280, w: 210, h: 20, type: "tile" },
            { x: 3120, y: 380, w: 170, h: 20, type: "tile" },

            // Cụm mái ngói 4: Vượt rào thép gai 4 (4020..4400) & lấy Văn kiện 4 (x=4100, y=220)
            { x: 3620, y: 440, w: 170, h: 20, type: "tile" },
            { x: 3810, y: 360, w: 180, h: 20, type: "tile" },
            { x: 4010, y: 280, w: 210, h: 20, type: "tile" },
            { x: 4240, y: 380, w: 170, h: 20, type: "tile" },

            // Khu 5: Bậc thềm hoa cương tiến lên Lễ đài Ba Đình & Văn kiện 5 (x=5020, y=220)
            { x: 4580, y: 440, w: 180, h: 20, type: "marble" },
            { x: 4780, y: 360, w: 190, h: 20, type: "marble" },
            { x: 4950, y: 280, w: 210, h: 20, type: "marble" },
            { x: 5240, y: 390, w: 360, h: 30, type: "marble_gold" }
        ],

        hidingSpots: [
            { x: 220,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện cờ hoa cửa ô" },
            { x: 1180, y: 470, w: 55, h: 50, type: "arch",  label: "Mái hiên phố cổ" },
            { x: 1620, y: 310, w: 50, h: 50, type: "crate", label: "Thùng loa phát thanh" },
            { x: 2280, y: 470, w: 55, h: 50, type: "bush",  label: "Cây cảnh Bắc Bộ Phủ" },
            { x: 2740, y: 310, w: 55, h: 50, type: "arch",  label: "Vòm cửa sổ cổ" },
            { x: 3400, y: 470, w: 55, h: 50, type: "bush",  label: "Cửa hiệu Hàng Ngang" },
            { x: 3860, y: 310, w: 55, h: 50, type: "arch",  label: "Ban công Hàng Đào" },
            { x: 4500, y: 470, w: 55, h: 50, type: "bush",  label: "Vườn hoa Ba Đình" },
            { x: 5020, y: 470, w: 55, h: 50, type: "bush",  label: "Hàng tùng lễ đài" }
        ],

        // 7 lính tuần tra dưới các khu phố & bậc thềm (không đứng chắn trên mái nhà có văn kiện)
        guards: [
            { x: 420,  y: 472, minX: 260,  maxX: 560,  speed: 0.92, dir: 1,  range: 112, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 1380, y: 472, minX: 1180, maxX: 1680, speed: 0.95, dir: -1, range: 115, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 2480, y: 472, minX: 2280, maxX: 2780, speed: 0.95, dir: 1,  range: 115, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 2740, y: 312, minX: 2695, maxX: 2835, speed: 0.88, dir: -1, range: 110, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 3600, y: 472, minX: 3400, maxX: 3900, speed: 0.96, dir: -1, range: 116, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 4720, y: 472, minX: 4520, maxX: 5020, speed: 0.98, dir: 1,  range: 118, angle: 0.32, aimDelay: 20, fireRate: 50 },
            { x: 4840, y: 312, minX: 4785, maxX: 4935, speed: 0.9,  dir: -1, range: 112, angle: 0.32, aimDelay: 20, fireRate: 50 }
        ],

        // 4 Bãi rào thép gai vừa phải (380px) nằm gọn giữa 5 khu phố, có dãy mái ngói bắc qua hoàn toàn
        hazards: [
            { x: 680,  y: 530, w: 380, h: 70, type: "spikes", label: "Rào thép gai công sự" },
            { x: 1780, y: 530, w: 380, h: 70, type: "spikes", label: "Hàng rào chướng ngại" },
            { x: 2900, y: 530, w: 380, h: 70, type: "spikes", label: "Chướng ngại Bắc Bộ Phủ" },
            { x: 4020, y: 530, w: 380, h: 70, type: "spikes", label: "Rào thép phố cổ" }
        ],

        // 4 Checkpoint đặt ngay đầu mỗi khu phố an toàn (y=460 trên nền đất y=520)
        checkpoints: [
            { x: 1100, y: 460, id: "cp4_1", reached: false },
            { x: 2200, y: 460, id: "cp4_2", reached: false },
            { x: 3320, y: 460, id: "cp4_3", reached: false },
            { x: 4440, y: 460, id: "cp4_4", reached: false }
        ],

        // 5 Văn kiện chia đều trên đỉnh 5 cụm mái ngói / lễ đài (y=280 -> doc y=220)
        documents: [
            { docId: "nhat_phap_1945",   x: 760,  y: 220 },
            { docId: "dai_hoi_tan_trao", x: 1860, y: 220 },
            { docId: "tong_khoi_nghia",  x: 2980, y: 220 },
            { docId: "so_48_hang_ngang", x: 4100, y: 220 },
            { docId: "tuyen_ngon_1945",  x: 5020, y: 220 }
        ],

        stars: [
            { x: 160,  y: 470 }, { x: 340,  y: 390 }, { x: 530,  y: 310 }, { x: 960,  y: 330 },
            { x: 1440, y: 390 }, { x: 1630, y: 310 }, { x: 2060, y: 330 },
            { x: 2560, y: 390 }, { x: 2750, y: 310 }, { x: 3180, y: 330 },
            { x: 3680, y: 390 }, { x: 3870, y: 310 }, { x: 4300, y: 330 },
            { x: 4640, y: 390 }, { x: 4840, y: 310 }, { x: 5160, y: 470 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 340,  y: 395, type: "disguise" }, // Cải trang ở đầu phố Hà Nội
            { x: 1260, y: 485, type: "heal" },     // Lương khô phố cổ
            { x: 1520, y: 485, type: "shield" },   // Áo Trấn Thủ tự vệ đỏ
            { x: 2380, y: 485, type: "disguise" }, // Cải trang ở Bắc Bộ Phủ
            { x: 3500, y: 485, type: "speed" },    // Dép Cao Su chạy mái phố
            { x: 4540, y: 485, type: "heal" }      // Lương khô Ba Đình
        ],

        // Đồng chí liên lạc bí mật (cần 3 Sao Vàng để mở cầu ván vượt bãi rào thép gai 1)
        npcs: [
            {
                x: 600, y: 472,
                name: "Nữ Tự Vệ Cứu Quốc Ba Đình",
                quote: "Thưa Bác! Toàn thể đồng bào đang reo hò đón Bác. Chúng cháu đã mở lối cầu ván vượt qua rào thép gai!",
                giftType: "disguise",
                shortcutId: "shortcut_badinh",
                starCost: 3
            }
        ],

        // Lối tắt bí mật (nối liền Khu 1 x=680 sang Khu 2 x=1060 ở cao độ mặt đất y=520)
        shortcuts: [
            { id: "shortcut_badinh", x: 680, y: 520, w: 380, h: 18 }
        ]
    }
];
