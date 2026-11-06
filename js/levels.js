// Thiết kế 4 Màn Chơi Lịch Sử với Độ Khó Tăng Dần & Cơ Chế Đặc Trưng Riêng Biệt

const LEVELS = [
    // =========================================================================
    // MÀN 1: BẾN CẢNG SÀI GÒN & PARIS (1911 - 1919)
    // [MỨC ĐỘ: DỄ / NHẬP MÔN]
    // Đặc trưng: Nền đất liền mạch, nhiều thùng hàng ẩn nấp, lính tuần tra chậm rãi
    // =========================================================================
    {
        id: 1,
        name: "Chương 1: Ra Đi Tìm Đường Cứu Nước (1911 - 1919)",
        theme: "harbor_paris",
        bgColor: "#0f172a",
        skyColor: ["#020617", "#1e1b4b"],
        groundColor: "#334155",
        platformColor: "#475569",
        levelWidth: 2600,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 2360, y: 440 },
        exitType: "ship", // Tàu Amiral Latouche-Tréville

        // Địa hình: Bằng phẳng, dễ đi, khoảng nhảy ngắn
        platforms: [
            // Mặt đất bến cảng chính
            { x: 0,    y: 520, w: 850,  h: 80, type: "dock" },
            // Cầu gỗ chắc chắn bắc qua lạch nước
            { x: 850,  y: 510, w: 160,  h: 20, type: "wood" },
            // Phố Paris bằng phẳng
            { x: 1010, y: 520, w: 800,  h: 80, type: "stone" },
            { x: 1810, y: 520, w: 790,  h: 80, type: "stone" },

            // Các bục gỗ thấp dễ nhảy
            { x: 250,  y: 430, w: 140, h: 20, type: "wood" },
            { x: 450,  y: 360, w: 160, h: 20, type: "wood" },
            { x: 670,  y: 420, w: 140, h: 20, type: "wood" },

            // Ban công ngõ Paris
            { x: 1220, y: 430, w: 160, h: 20, type: "stone" },
            { x: 1440, y: 350, w: 170, h: 20, type: "stone" },
            { x: 1680, y: 420, w: 160, h: 20, type: "stone" },

            // Khu vực gần đại hội Versailles
            { x: 2050, y: 430, w: 160, h: 20, type: "stone" },
            { x: 2260, y: 350, w: 160, h: 20, type: "stone" }
        ],

        // Rất nhiều chỗ ẩn nấp an toàn (6 vị trí)
        hidingSpots: [
            { x: 200,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng bến cảng" },
            { x: 580,  y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ" },
            { x: 1100, y: 470, w: 55, h: 50, type: "arch",  label: "Ngõ tối Paris" },
            { x: 1400, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách báo" },
            { x: 1750, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cửa cổ" },
            { x: 2150, y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ" }
        ],

        // Kẻ địch: 3 mật thám tuần tra bến cảng & đại lộ Paris
        guards: [
            { x: 480,  y: 472, minX: 380,  maxX: 620,  speed: 0.78, dir: 1,  range: 98 },
            { x: 1350, y: 472, minX: 1200, maxX: 1540, speed: 0.82, dir: -1, range: 105 },
            { x: 2040, y: 472, minX: 1950, maxX: 2220, speed: 0.85, dir: -1, range: 105 }
        ],

        // Bẫy cạm: 2 lạch nước hiểm trở
        hazards: [
            { x: 860,  y: 540, w: 140, h: 60, type: "water", label: "Lạch nước bến cảng" },
            { x: 1720, y: 540, w: 100, h: 60, type: "water", label: "Hố nước Paris" }
        ],

        // Điểm lưu vị trí
        checkpoints: [
            { x: 1040, y: 460, id: "cp1_1", reached: false },
            { x: 1840, y: 460, id: "cp1_2", reached: false }
        ],

        // 3 Di sản Văn kiện
        documents: [
            { docId: "ben_nha_rong", x: 490,  y: 290 },
            { docId: "hoi_yeu_nuoc",  x: 1490, y: 280 },
            { docId: "yeu_sach_1919", x: 2310, y: 280 }
        ],

        // Sao thưởng
        stars: [
            { x: 160, y: 470 }, { x: 300, y: 380 }, { x: 500, y: 310 },
            { x: 720, y: 370 }, { x: 1150, y: 470 }, { x: 1300, y: 380 },
            { x: 1520, y: 300 }, { x: 1950, y: 470 }, { x: 2100, y: 380 }
        ],

        // Vật phẩm tiếp tế cách mạng mới
        supplies: [
            { x: 380, y: 485, type: "shield" },   // Áo Trấn Thủ ở bến cảng
            { x: 1250, y: 485, type: "heal" },    // Lương khô ở ngõ Paris
            { x: 1600, y: 315, type: "speed" },   // Dép Cao Su trên ban công Paris
            { x: 2180, y: 485, type: "disguise" } // Hòm cải trang trước Versailles
        ],

        // Đồng chí liên lạc bí mật
        npcs: [
            {
                x: 750, y: 468,
                name: "Đồng chí Thợ Thuyền Ba Son",
                quote: "Anh Ba! Tàu sắp nhổ neo, tôi đã hạ sẵn chiếc cầu bí mật giúp anh vượt qua lạch nước an toàn!",
                giftType: "shield",
                shortcutId: "shortcut_harbor"
            }
        ],

        // Lối tắt bí mật
        shortcuts: [
            { id: "shortcut_harbor", x: 850, y: 470, w: 160, h: 20 }
        ]
    },

    // =========================================================================
    // MÀN 2: MÙA ĐÔNG MOSKVA & ĐƯỜNG KÁCH MỆNH (1920 - 1927)
    // [MỨC ĐỘ: TRUNG BÌNH]
    // Đặc trưng: Băng tuyết trơn trượt (Icy Slip Physics) & Vực băng rộng đòi hỏi Nhảy đúp
    // =========================================================================
    {
        id: 2,
        name: "Chương 2: Ánh Sáng Luận Cương & Đường Kách Mệnh (1920 - 1927)",
        theme: "moscow_guangzhou",
        bgColor: "#1c1917",
        skyColor: ["#0c0a09", "#292524"],
        groundColor: "#44403c",
        platformColor: "#57534e",
        levelWidth: 2900,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 2650, y: 460 },
        exitType: "train", // Chuyến tàu cách mạng

        // Bục phủ tuyết trắng trơn trượt (snow_brick)
        platforms: [
            { x: 0,    y: 520, w: 800,  h: 80, type: "snow_brick" },
            // Vực băng 1 giữa x=800 và x=950 (150px)
            { x: 950,  y: 520, w: 900,  h: 80, type: "snow_brick" },
            // Vực băng 2 giữa x=1850 và x=2020 (170px)
            { x: 2020, y: 520, w: 880,  h: 80, type: "brick" },

            // Giàn bục tuyết nhảy qua vực 1 (Yêu cầu nhảy đúp)
            { x: 220,  y: 420, w: 150, h: 20, type: "snow_brick" },
            { x: 440,  y: 330, w: 160, h: 20, type: "snow_brick" },
            { x: 680,  y: 250, w: 170, h: 20, type: "snow_brick" },
            { x: 840,  y: 430, w: 70,  h: 18, type: "snow_brick" }, // Bục băng trơn nhỏ

            // Khu tòa soạn Báo Le Paria
            { x: 1140, y: 420, w: 160, h: 20, type: "snow_brick" },
            { x: 1370, y: 330, w: 180, h: 20, type: "snow_brick" },
            { x: 1620, y: 250, w: 180, h: 20, type: "snow_brick" },
            { x: 1880, y: 420, w: 80,  h: 18, type: "wood" }, // Cầu gỗ nhỏ qua vực 2

            // Lớp học chính trị Quảng Châu
            { x: 2150, y: 410, w: 160, h: 20, type: "brick" },
            { x: 2380, y: 320, w: 180, h: 20, type: "brick" },
            { x: 2620, y: 240, w: 170, h: 20, type: "brick" }
        ],

        hidingSpots: [
            { x: 320,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng in báo" },
            { x: 1200, y: 470, w: 55, h: 50, type: "arch",  label: "Cửa hầm Moskva" },
            { x: 1520, y: 470, w: 50, h: 50, type: "crate", label: "Thùng phủ tuyết" },
            { x: 1720, y: 200, w: 50, h: 50, type: "crate", label: "Kiện sách tầng cao" },
            { x: 2250, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách Quảng Châu" }
        ],

        // 4 lính tuần tra tuyết mật vụ dày đặc
        guards: [
            { x: 420,  y: 472, minX: 320,  maxX: 580,  speed: 0.82, dir: 1,  range: 102 },
            { x: 1280, y: 472, minX: 1150, maxX: 1450, speed: 0.85, dir: -1, range: 105 },
            { x: 1450, y: 282, minX: 1390, maxX: 1530, speed: 0.84, dir: 1,  range: 100 }, // Canh gác tầng cao
            { x: 2300, y: 472, minX: 2180, maxX: 2480, speed: 0.86, dir: 1,  range: 105 }
        ],

        // 2 Vực băng giá sâu
        hazards: [
            { x: 800,  y: 530, w: 150, h: 70, type: "ice_pit", label: "Vực băng tuyết sâu" },
            { x: 1850, y: 530, w: 170, h: 70, type: "ice_pit", label: "Hố băng trơn trượt" }
        ],

        checkpoints: [
            { x: 1020, y: 460, id: "cp2_1", reached: false },
            { x: 2080, y: 460, id: "cp2_2", reached: false }
        ],

        documents: [
            { docId: "luan_cuong_lenin", x: 730,  y: 190 },
            { docId: "le_paria",         x: 1680, y: 190 },
            { docId: "duong_kach_menh",  x: 2680, y: 180 }
        ],

        stars: [
            { x: 150, y: 470 }, { x: 260, y: 360 }, { x: 490, y: 270 },
            { x: 870, y: 370 }, { x: 1200, y: 360 }, { x: 1430, y: 270 },
            { x: 1910, y: 360 }, { x: 2210, y: 350 }, { x: 2440, y: 260 }
        ],

        // Vật phẩm tiếp tế cách mạng mới
        supplies: [
            { x: 380, y: 485, type: "speed" },    // Dép Cao Su chạy băng tuyết
            { x: 1320, y: 485, type: "shield" },  // Áo Trấn Thủ chống lạnh & đỡ đòn
            { x: 1750, y: 215, type: "heal" },    // Lương khô tầng cao
            { x: 2450, y: 285, type: "disguise" } // Hòm cải trang tại Quảng Châu
        ],

        // Đồng chí liên lạc bí mật
        npcs: [
            {
                x: 720, y: 468,
                name: "Đồng chí Quốc Tế Cộng Sản",
                quote: "Đồng chí Nguyễn! Luận cương của Lênin là ngọn đuốc soi đường. Cây cầu bí mật vượt vực tuyết đã mở!",
                giftType: "speed",
                shortcutId: "shortcut_moscow"
            }
        ],

        // Lối tắt bí mật
        shortcuts: [
            { id: "shortcut_moscow", x: 800, y: 480, w: 150, h: 20 }
        ]
    },

    // =========================================================================
    // MÀN 3: RỪNG NÚI PÁC BÓ & TIẾNG GỌI TỔ QUỐC (1930 - 1941)
    // [MỨC ĐỘ: KHÓ]
    // Đặc trưng: Địa hình Leo Vách Núi Thẳng Đứng (Vertical Platforming), Vực thác sâu
    // =========================================================================
    {
        id: 3,
        name: "Chương 3: Thành Lập Đảng & Tiếng Gọi Pác Bó (1930 - 1941)",
        theme: "jungle_pacbo",
        bgColor: "#064e3b",
        skyColor: ["#022c22", "#064e3b"],
        groundColor: "#14532d",
        platformColor: "#15803d",
        levelWidth: 3200,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 2980, y: 490 },
        exitType: "cave", // Hang Pác Bó thiêng liêng

        // Địa hình leo núi zíc zắc lên đỉnh cao (y từ 440 lên 170)
        platforms: [
            // Chân núi Hương Cảng ban đầu
            { x: 0,    y: 520, w: 650,  h: 80, type: "moss_rock" },

            // Dốc leo vách đá Các Mác đợt 1
            { x: 250,  y: 430, w: 140, h: 20, type: "rock" },
            { x: 430,  y: 340, w: 150, h: 20, type: "rock" },
            { x: 620,  y: 260, w: 160, h: 20, type: "rock" },
            { x: 820,  y: 190, w: 200, h: 25, type: "moss_rock" }, // Đỉnh núi cao 1

            // Cầu tre mỏng qua thác ghềnh
            { x: 1060, y: 270, w: 90,  h: 18, type: "bamboo" },
            { x: 1200, y: 360, w: 100, h: 18, type: "bamboo" },
            { x: 1350, y: 450, w: 110, h: 18, type: "bamboo" },

            // Đảo đá giữa suối Lê-nin (Vực nước hiểm bao quanh)
            { x: 1500, y: 520, w: 550,  h: 80, type: "moss_rock" },

            // Leo vách núi đợt 2 dẫn về Cột mốc 108 & Khu rừng Trần Hưng Đạo
            { x: 1650, y: 420, w: 140, h: 20, type: "rock" },
            { x: 1840, y: 330, w: 150, h: 20, type: "rock" },
            { x: 2040, y: 240, w: 160, h: 20, type: "rock" },
            { x: 2240, y: 170, w: 220, h: 25, type: "moss_rock" }, // Đỉnh núi cao 2

            // Cầu dây rừng rậm
            { x: 2500, y: 260, w: 90,  h: 18, type: "bamboo" },
            { x: 2640, y: 350, w: 100, h: 18, type: "bamboo" },
            { x: 2780, y: 440, w: 120, h: 18, type: "bamboo" },

            // Thềm đá cửa Hang Pác Bó
            { x: 2940, y: 520, w: 260,  h: 80, type: "moss_rock" }
        ],

        // Ẩn nấp: Bụi rậm và hốc đá tự nhiên
        hidingSpots: [
            { x: 180,  y: 470, w: 55, h: 50, type: "bush", label: "Bụi trúc Cao Bằng" },
            { x: 920,  y: 140, w: 55, h: 50, type: "rock_hide", label: "Hốc đá đỉnh núi" },
            { x: 1580, y: 470, w: 55, h: 50, type: "bush", label: "Bụi cây rừng" },
            { x: 1990, y: 280, w: 45, h: 50, type: "bush", label: "Lùm cây vách đá" },
            { x: 2320, y: 120, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá che chắn" },
            { x: 2980, y: 470, w: 55, h: 50, type: "bush", label: "Lùm cây cửa hang" }
        ],

        // 5 lính tuần tra biên giới phong tỏa nghiêm ngặt
        guards: [
            { x: 400,  y: 472, minX: 300,  maxX: 550,  speed: 0.88, dir: 1,  range: 108 },
            { x: 880,  y: 142, minX: 840,  maxX: 980,  speed: 0.85, dir: -1, range: 102 }, // Gác trên đỉnh cao 1
            { x: 1750, y: 472, minX: 1600, maxX: 1950, speed: 0.9,  dir: 1,  range: 110 },
            { x: 1880, y: 282, minX: 1840, maxX: 1980, speed: 0.86, dir: 1,  range: 105 }, // Canh giữ vách núi 2
            { x: 2300, y: 122, minX: 2260, maxX: 2420, speed: 0.85, dir: -1, range: 105 }  // Gác trên mỏm đá 2
        ],

        // Thác ghềnh cuộn sóng sâu
        hazards: [
            { x: 650,  y: 530, w: 850, h: 70, type: "water", label: "Thác ghềnh cuộn sóng" },
            { x: 2050, y: 530, w: 890, h: 70, type: "water", label: "Dòng suối nước sâu" }
        ],

        checkpoints: [
            { x: 640,  y: 205, id: "cp3_1", reached: false }, // Đặt tại bậc leo núi an toàn trước đỉnh canh gác
            { x: 1520, y: 460, id: "cp3_2", reached: false }, // Đặt tại bãi đá giữa suối
            { x: 2060, y: 185, id: "cp3_3", reached: false }  // Đặt tại bậc đá an toàn trước mỏm đá 2
        ],

        documents: [
            { docId: "cuong_linh_1930",    x: 870,  y: 130 },
            { docId: "cot_moc_108",        x: 1890, y: 270 },
            { docId: "doi_tuyentruyen_1944", x: 2330, y: 110 }
        ],

        stars: [
            { x: 120, y: 470 }, { x: 300, y: 370 }, { x: 490, y: 280 },
            { x: 1100, y: 210 }, { x: 1250, y: 300 }, { x: 1700, y: 360 },
            { x: 2090, y: 180 }, { x: 2540, y: 200 }, { x: 2690, y: 290 }
        ],

        // Vật phẩm tiếp tế cách mạng mới
        supplies: [
            { x: 350, y: 485, type: "shield" },   // Áo Trấn Thủ du kích
            { x: 950, y: 155, type: "heal" },     // Lương khô đỉnh núi 1
            { x: 1600, y: 485, type: "speed" },   // Dép Cao Su vượt suối Lê-nin
            { x: 2360, y: 135, type: "disguise" } // Hòm cải trang đỉnh núi 2
        ],

        // Đồng chí liên lạc bí mật
        npcs: [
            {
                x: 550, y: 468,
                name: "Đồng chí Dân Tộc Pác Bó",
                quote: "Bác đã về với núi rừng quê hương! Đồng bào đã dựng cầu tre bí mật đưa Bác qua dòng thác ghềnh!",
                giftType: "shield",
                shortcutId: "shortcut_pacbo"
            }
        ],

        // Lối tắt bí mật
        shortcuts: [
            { id: "shortcut_pacbo", x: 650, y: 490, w: 200, h: 20 }
        ]
    },

    // =========================================================================
    // MÀN 4: MÙA THU ĐỘC LẬP - BA ĐÌNH LỊCH SỬ (1945)
    // [MỨC ĐỘ: RẤT KHÓ / CAO TRÀO]
    // Đặc trưng: Chạy mái ngói phố cổ, rào thép gai dày đặc, trượt cúi người né chướng ngại
    // =========================================================================
    {
        id: 4,
        name: "Chương 4: Mùa Thu Độc Lập - Ba Đình Lịch Sử (1945)",
        theme: "revolution_badinh",
        bgColor: "#262335",
        skyColor: ["#0b1021", "#182238"],
        groundColor: "#334155",
        platformColor: "#b45309",
        levelWidth: 3400,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 3180, y: 330 },
        exitType: "podium", // Đại Lễ Đài Ba Đình

        // Dưới lòng đường bị rào chắn thép gai chiếm đóng, người chơi phải leo lên các mái ngói
        platforms: [
            { x: 0,    y: 520, w: 450,  h: 80, type: "red_brick" },

            // Dãy mái ngói phố cổ Thăng Long liên tục
            { x: 220,  y: 430, w: 160, h: 20, type: "tile" },
            { x: 420,  y: 340, w: 180, h: 20, type: "tile" },
            { x: 650,  y: 260, w: 180, h: 20, type: "tile" },
            { x: 880,  y: 350, w: 170, h: 20, type: "tile" },

            // Cầu mái nhà nối nhịp
            { x: 1090, y: 420, w: 90,  h: 18, type: "wood" },

            // Khu phố cổ Hà Nội nổi dậy (Nhiều bẫy rào dưới đất)
            { x: 1220, y: 400, w: 180, h: 20, type: "tile" },
            { x: 1450, y: 310, w: 190, h: 20, type: "tile" },
            { x: 1700, y: 230, w: 190, h: 20, type: "tile" },
            { x: 1940, y: 330, w: 170, h: 20, type: "tile" },

            // Nhịp cầu dẫn vào Quảng trường
            { x: 2150, y: 410, w: 90,  h: 18, type: "wood" },

            // Đại lộ và bậc thang hoa cương tiến vào Lễ đài
            { x: 2280, y: 520, w: 350,  h: 80, type: "marble" },
            { x: 2420, y: 420, w: 170, h: 20, type: "marble" },
            { x: 2640, y: 330, w: 180, h: 20, type: "marble" },
            { x: 2870, y: 250, w: 200, h: 20, type: "marble" },
            { x: 3120, y: 390, w: 260, h: 30, type: "marble_gold" }
        ],

        hidingSpots: [
            { x: 280,  y: 380, w: 50, h: 50, type: "crate", label: "Kiện cờ hoa trên mái" },
            { x: 720,  y: 210, w: 55, h: 50, type: "arch",  label: "Mái hiên phố cổ" },
            { x: 1510, y: 260, w: 50, h: 50, type: "crate", label: "Thùng loa phát thanh" },
            { x: 2320, y: 470, w: 55, h: 50, type: "bush",  label: "Vườn hoa Ba Đình" },
            { x: 2530, y: 470, w: 50, h: 50, type: "bush",  label: "Cây cảnh quảng trường" },
            { x: 2940, y: 200, w: 55, h: 50, type: "bush",  label: "Cột hoa lễ đài" }
        ],

        // 6 lính tuần tra tàn quân bảo vệ nghiêm ngặt
        guards: [
            { x: 500,  y: 292, minX: 430,  maxX: 590,  speed: 0.92, dir: 1,  range: 105 },
            { x: 920,  y: 302, minX: 890,  maxX: 1040, speed: 0.94, dir: -1, range: 110 },
            { x: 1500, y: 262, minX: 1460, maxX: 1630, speed: 0.94, dir: 1,  range: 110 },
            { x: 1980, y: 282, minX: 1950, maxX: 2100, speed: 0.95, dir: -1, range: 110 },
            { x: 2420, y: 472, minX: 2300, maxX: 2540, speed: 0.94, dir: 1,  range: 110 }, // Canh gác đại lộ Ba Đình
            { x: 2700, y: 282, minX: 2650, maxX: 2810, speed: 0.92, dir: 1,  range: 110 }
        ],

        // Rào thép gai dày đặc của tàn quân dưới đất (Bắt buộc phải chạy trên mái)
        hazards: [
            { x: 450,  y: 530, w: 750, h: 70, type: "spikes", label: "Rào thép gai công sự" },
            { x: 1200, y: 530, w: 950, h: 70, type: "spikes", label: "Hàng rào chướng ngại" },
            { x: 2630, y: 530, w: 450, h: 70, type: "spikes", label: "Cọc thép phòng thủ" }
        ],

        checkpoints: [
            { x: 670,  y: 200, id: "cp4_1", reached: false },
            { x: 1720, y: 170, id: "cp4_2", reached: false },
            { x: 2890, y: 190, id: "cp4_3", reached: false }
        ],

        documents: [
            { docId: "nhat_phap_1945",   x: 710,  y: 200 },
            { docId: "tong_khoi_nghia",  x: 1760, y: 170 },
            { docId: "tuyen_ngon_1945",  x: 2930, y: 190 }
        ],

        stars: [
            { x: 160, y: 470 }, { x: 300, y: 380 }, { x: 500, y: 290 },
            { x: 950, y: 300 }, { x: 1300, y: 350 }, { x: 1580, y: 250 },
            { x: 2020, y: 270 }, { x: 2500, y: 360 }, { x: 2740, y: 270 }
        ],

        // Vật phẩm tiếp tế cách mạng mới
        supplies: [
            { x: 350, y: 395, type: "disguise" }, // Cải trang đi trên mái phố cổ
            { x: 1350, y: 365, type: "heal" },    // Lương khô
            { x: 1800, y: 195, type: "shield" },  // Áo Trấn Thủ tự vệ đỏ
            { x: 2350, y: 485, type: "speed" }    // Dép Cao Su chạy vào lễ đài
        ],

        // Đồng chí liên lạc bí mật
        npcs: [
            {
                x: 360, y: 468,
                name: "Nữ Tự Vệ Cứu Quốc Ba Đình",
                quote: "Thưa Bác! Toàn thể đồng bào đang reo hò đón Bác. Chúng cháu đã mở lối cầu ván vượt qua rào thép gai!",
                giftType: "disguise",
                shortcutId: "shortcut_badinh"
            }
        ],

        // Lối tắt bí mật
        shortcuts: [
            { id: "shortcut_badinh", x: 450, y: 490, w: 200, h: 20 }
        ]
    }
];
