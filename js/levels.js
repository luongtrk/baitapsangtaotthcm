// Thiết kế 4 Màn Chơi Lịch Sử với Độ Khó Tăng Dần & Cơ Chế Đặc Trưng Riêng Biệt (Bản mở rộng dài hơn)

const LEVELS = [
    // =========================================================================
    // MÀN 1: BẾN CẢNG SÀI GÒN & PARIS (1911 - 1919)
    // [MỨC ĐỘ: TRUNG BÌNH] - Mở rộng lên 4500px, 5 Văn kiện lịch sử
    // Đặc trưng: Nền đất liền mạch, nhiều thùng hàng ẩn nấp, bến cảng mở rộng & Paris phồn hoa
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

        // Địa hình mở rộng đến 4500px
        platforms: [
            // Mặt đất bến cảng chính (x: 0..850, cách lạch nước 850..1010)
            { x: 0,    y: 520, w: 850,  h: 80, type: "dock" },
            // Phố Paris bằng phẳng khu 1 (x: 1010..1720, cách hố nước 1720..1820)
            { x: 1010, y: 520, w: 710,  h: 80, type: "stone" },
            // Đại lộ Paris khu 2 (x: 1820..2540, cách kênh nước 2540..2650)
            { x: 1820, y: 520, w: 720,  h: 80, type: "stone" },
            // Khu vực quận 13 Paris & ngoại ô (x: 2650..3400, cách hào nước 3400..3520)
            { x: 2650, y: 520, w: 750,  h: 80, type: "stone" },
            // Đại lộ Versailles & Cung điện Hòa Bình (x: 3520..4500)
            { x: 3520, y: 520, w: 980,  h: 80, type: "stone" },

            // Các bục gỗ bến cảng Sài Gòn
            { x: 150,  y: 430, w: 130, h: 20, type: "wood" },
            { x: 320,  y: 350, w: 140, h: 20, type: "wood" },
            { x: 500,  y: 360, w: 160, h: 20, type: "wood" },
            { x: 690,  y: 420, w: 140, h: 20, type: "wood" },

            // Ban công ngõ Paris khu 1
            { x: 1220, y: 430, w: 160, h: 20, type: "stone" },
            { x: 1440, y: 350, w: 170, h: 20, type: "stone" },
            { x: 1680, y: 420, w: 160, h: 20, type: "stone" },

            // Ban công đại lộ Paris khu 2
            { x: 2020, y: 430, w: 160, h: 20, type: "stone" },
            { x: 2240, y: 350, w: 170, h: 20, type: "stone" },
            { x: 2470, y: 420, w: 150, h: 20, type: "wood" },

            // Khu vực quận 13 & Báo chí yêu nước
            { x: 2780, y: 430, w: 160, h: 20, type: "stone" },
            { x: 2980, y: 340, w: 170, h: 20, type: "stone" },
            { x: 3200, y: 420, w: 160, h: 20, type: "stone" },

            // Khu vực cung điện Versailles mở rộng
            { x: 3650, y: 430, w: 160, h: 20, type: "stone" },
            { x: 3880, y: 340, w: 180, h: 20, type: "stone" },
            { x: 4120, y: 420, w: 160, h: 20, type: "wood" }
        ],

        // Chỗ ẩn nấp (8 vị trí)
        hidingSpots: [
            { x: 200,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng bến cảng" },
            { x: 600,  y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ bến tàu" },
            { x: 1100, y: 470, w: 55, h: 50, type: "arch",  label: "Ngõ tối Paris" },
            { x: 1400, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách báo" },
            { x: 1645, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cửa cổ" },
            { x: 2380, y: 470, w: 55, h: 50, type: "arch",  label: "Hành lang Paris" },
            { x: 2880, y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng quận 13" },
            { x: 3750, y: 470, w: 55, h: 50, type: "arch",  label: "Cổng vòm Versailles" }
        ],

        // Kẻ địch: 8 mật thám tuần tra bến cảng, đại lộ & ban công Paris
        guards: [
            { x: 480,  y: 472, minX: 360,  maxX: 640,  speed: 0.95, dir: 1,  range: 118 },
            { x: 1350, y: 472, minX: 1180, maxX: 1560, speed: 1.0,  dir: -1, range: 122 },
            { x: 1500, y: 302, minX: 1445, maxX: 1575, speed: 0.9,  dir: 1,  range: 115 }, // Gác ban công Paris
            { x: 2050, y: 472, minX: 1900, maxX: 2280, speed: 1.0,  dir: -1, range: 122 },
            { x: 2300, y: 302, minX: 2245, maxX: 2375, speed: 0.9,  dir: -1, range: 115 }, // Gác ban công đại lộ
            { x: 2820, y: 472, minX: 2690, maxX: 3040, speed: 1.02, dir: 1,  range: 125 },
            { x: 3720, y: 472, minX: 3580, maxX: 3950, speed: 1.05, dir: 1,  range: 125 },
            { x: 3940, y: 292, minX: 3885, maxX: 4025, speed: 0.92, dir: -1, range: 118 }  // Gác lầu Versailles
        ],

        // Bẫy cạm: 4 lạch nước hiểm trở
        hazards: [
            { x: 860,  y: 540, w: 140, h: 60, type: "water", label: "Lạch nước bến cảng" },
            { x: 1720, y: 540, w: 100, h: 60, type: "water", label: "Hố nước Paris" },
            { x: 2540, y: 540, w: 110, h: 60, type: "water", label: "Kênh nước Seine" },
            { x: 3400, y: 540, w: 120, h: 60, type: "water", label: "Hào nước Versailles" }
        ],

        // Điểm lưu vị trí (4 cột mốc)
        checkpoints: [
            { x: 1040, y: 460, id: "cp1_1", reached: false },
            { x: 1850, y: 460, id: "cp1_2", reached: false },
            { x: 2680, y: 460, id: "cp1_3", reached: false },
            { x: 3560, y: 460, id: "cp1_4", reached: false }
        ],

        // 5 Di sản Văn kiện trải đều suốt màn chơi
        documents: [
            { docId: "truoc_1911",    x: 350,  y: 280 },
            { docId: "ben_nha_rong",  x: 550,  y: 290 },
            { docId: "hoi_yeu_nuoc",  x: 1500, y: 280 },
            { docId: "nam_chau_1917", x: 3040, y: 270 },
            { docId: "yeu_sach_1919", x: 3940, y: 270 }
        ],

        // Sao thưởng (16 sao)
        stars: [
            { x: 160,  y: 470 }, { x: 300,  y: 380 }, { x: 500,  y: 310 },
            { x: 720,  y: 370 }, { x: 1150, y: 470 }, { x: 1300, y: 380 },
            { x: 1520, y: 300 }, { x: 1950, y: 470 }, { x: 2080, y: 380 },
            { x: 2300, y: 300 }, { x: 2740, y: 470 }, { x: 2840, y: 380 },
            { x: 3260, y: 360 }, { x: 3680, y: 470 }, { x: 3920, y: 290 }, { x: 4180, y: 370 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 380,  y: 485, type: "shield" },   // Áo Trấn Thủ ở bến cảng
            { x: 1250, y: 485, type: "heal" },     // Lương khô ở ngõ Paris
            { x: 1600, y: 315, type: "speed" },    // Dép Cao Su trên ban công Paris
            { x: 2750, y: 485, type: "disguise" }, // Hòm cải trang trước Versailles
            { x: 3820, y: 485, type: "heal" }      // Lương khô Versailles
        ],

        // Đồng chí liên lạc bí mật (cần 4 Sao Vàng để đổi mật hiệu tiếp tế & mở lối tắt)
        npcs: [
            {
                x: 750, y: 472,
                name: "Đồng chí Thợ Thuyền Ba Son",
                quote: "Anh Ba! Tàu sắp nhổ neo, tôi đã hạ sẵn chiếc cầu bí mật giúp anh vượt qua lạch nước an toàn!",
                giftType: "shield",
                shortcutId: "shortcut_harbor",
                starCost: 4
            }
        ],

        // Lối tắt bí mật (ngang mặt bến cảng y=520 để đi thẳng qua lạch nước 850..1010)
        shortcuts: [
            { id: "shortcut_harbor", x: 850, y: 520, w: 160, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 2: MÙA ĐÔNG MOSKVA & ĐƯỜNG KÁCH MỆNH (1920 - 1927)
    // [MỨC ĐỘ: KHÓ] - Mở rộng lên 5000px, 5 Văn kiện lịch sử
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
        levelWidth: 5000,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4720, y: 460 },
        exitType: "train", // Chuyến tàu cách mạng

        // Bục phủ tuyết trắng trơn trượt (snow_brick) & Gạch Quảng Châu
        platforms: [
            { x: 0,    y: 520, w: 800,  h: 80, type: "snow_brick" },
            // Vực băng 1 giữa x=800 và x=950 (150px)
            { x: 950,  y: 520, w: 900,  h: 80, type: "snow_brick" },
            // Vực băng 2 giữa x=1850 và x=2020 (170px)
            { x: 2020, y: 520, w: 760,  h: 80, type: "snow_brick" },
            // Vực băng 3 giữa x=2780 và x=2930 (150px)
            { x: 2930, y: 520, w: 870,  h: 80, type: "brick" },
            // Vực băng 4 giữa x=3800 và x=3960 (160px)
            { x: 3960, y: 520, w: 1040, h: 80, type: "brick" },

            // Giàn bục tuyết nhảy qua vực 1
            { x: 220,  y: 420, w: 150, h: 20, type: "snow_brick" },
            { x: 440,  y: 330, w: 160, h: 20, type: "snow_brick" },
            { x: 680,  y: 250, w: 170, h: 20, type: "snow_brick" },
            { x: 840,  y: 430, w: 70,  h: 18, type: "snow_brick" }, // Bục băng trơn nhỏ

            // Khu tòa soạn Báo Le Paria
            { x: 1140, y: 420, w: 160, h: 20, type: "snow_brick" },
            { x: 1370, y: 330, w: 180, h: 20, type: "snow_brick" },
            { x: 1620, y: 250, w: 180, h: 20, type: "snow_brick" },
            { x: 1880, y: 420, w: 80,  h: 18, type: "wood" }, // Cầu gỗ nhỏ qua vực 2

            // Khu Đại hội Quốc tế Cộng sản Moskva
            { x: 2140, y: 420, w: 160, h: 20, type: "snow_brick" },
            { x: 2360, y: 330, w: 180, h: 20, type: "snow_brick" },
            { x: 2580, y: 250, w: 170, h: 20, type: "snow_brick" },
            { x: 2810, y: 420, w: 80,  h: 18, type: "wood" }, // Cầu gỗ qua vực 3

            // Khu Hội Liên Hiệp Các Dân Tộc Bị Áp Bức
            { x: 3040, y: 410, w: 160, h: 20, type: "brick" },
            { x: 3260, y: 320, w: 180, h: 20, type: "brick" },
            { x: 3480, y: 240, w: 170, h: 20, type: "brick" },
            { x: 3840, y: 420, w: 80,  h: 18, type: "wood" }, // Cầu gỗ qua vực 4

            // Lớp huấn luyện chính trị Quảng Châu & Nhà in sách
            { x: 4080, y: 420, w: 170, h: 20, type: "brick" },
            { x: 4300, y: 330, w: 180, h: 20, type: "brick" },
            { x: 4520, y: 250, w: 180, h: 20, type: "brick" }
        ],

        hidingSpots: [
            { x: 320,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng in báo" },
            { x: 1200, y: 470, w: 55, h: 50, type: "arch",  label: "Cửa hầm Moskva" },
            { x: 1520, y: 470, w: 50, h: 50, type: "crate", label: "Thùng phủ tuyết" },
            { x: 1720, y: 200, w: 50, h: 50, type: "crate", label: "Kiện sách tầng cao" },
            { x: 2220, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cổng Kremlin" },
            { x: 2520, y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ mùa đông" },
            { x: 3120, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách Quảng Châu" },
            { x: 4160, y: 470, w: 50, h: 50, type: "crate", label: "Hòm tài liệu cách mạng" }
        ],

        // 10 lính tuần tra tuyết mật vụ dày đặc
        guards: [
            { x: 420,  y: 472, minX: 300,  maxX: 600,  speed: 1.02, dir: 1,  range: 125, angle: 0.34 },
            { x: 1280, y: 472, minX: 1130, maxX: 1460, speed: 1.05, dir: -1, range: 128, angle: 0.34 },
            { x: 1450, y: 282, minX: 1375, maxX: 1515, speed: 0.95, dir: 1,  range: 120, angle: 0.34 }, // Canh gác tầng cao
            { x: 1650, y: 472, minX: 1560, maxX: 1800, speed: 1.05, dir: -1, range: 125, angle: 0.34 },
            { x: 2320, y: 472, minX: 2140, maxX: 2580, speed: 1.08, dir: 1,  range: 130, angle: 0.34 },
            { x: 2420, y: 282, minX: 2365, maxX: 2505, speed: 0.95, dir: -1, range: 120, angle: 0.34 }, // Gác Kremlin tầng cao
            { x: 3180, y: 472, minX: 3020, maxX: 3400, speed: 1.08, dir: -1, range: 130, angle: 0.34 },
            { x: 3320, y: 272, minX: 3265, maxX: 3405, speed: 0.95, dir: 1,  range: 120, angle: 0.34 }, // Gác lớp học Quảng Châu
            { x: 4220, y: 472, minX: 4050, maxX: 4420, speed: 1.08, dir: 1,  range: 128, angle: 0.34 },
            { x: 4400, y: 282, minX: 4335, maxX: 4475, speed: 0.95, dir: -1, range: 120, angle: 0.34 }
        ],

        // 4 Vực băng giá sâu
        hazards: [
            { x: 800,  y: 530, w: 150, h: 70, type: "ice_pit", label: "Vực băng tuyết sâu" },
            { x: 1850, y: 530, w: 170, h: 70, type: "ice_pit", label: "Hố băng trơn trượt" },
            { x: 2780, y: 530, w: 150, h: 70, type: "ice_pit", label: "Khe băng lạnh giá" },
            { x: 3800, y: 530, w: 160, h: 70, type: "ice_pit", label: "Vực sâu Quảng Châu" }
        ],

        checkpoints: [
            { x: 1020, y: 460, id: "cp2_1", reached: false },
            { x: 2070, y: 460, id: "cp2_2", reached: false },
            { x: 2980, y: 460, id: "cp2_3", reached: false },
            { x: 4020, y: 460, id: "cp2_4", reached: false }
        ],

        // 5 Di sản Văn kiện trải đều suốt màn chơi
        documents: [
            { docId: "luan_cuong_lenin",    x: 730,  y: 190 },
            { docId: "dai_hoi_tours_1920",  x: 1420, y: 270 },
            { docId: "le_paria",            x: 2420, y: 270 },
            { docId: "ban_an_thuc_dan",     x: 3320, y: 260 },
            { docId: "duong_kach_menh",     x: 4570, y: 190 }
        ],

        stars: [
            { x: 150,  y: 470 }, { x: 260,  y: 360 }, { x: 490,  y: 270 }, { x: 620,  y: 470 },
            { x: 870,  y: 370 }, { x: 1200, y: 360 }, { x: 1430, y: 270 },
            { x: 1910, y: 360 }, { x: 2200, y: 360 }, { x: 2420, y: 270 },
            { x: 2840, y: 360 }, { x: 3100, y: 350 }, { x: 3320, y: 260 },
            { x: 4120, y: 360 }, { x: 4350, y: 270 }, { x: 4620, y: 470 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 380,  y: 485, type: "speed" },    // Dép Cao Su chạy băng tuyết
            { x: 1320, y: 485, type: "shield" },   // Áo Trấn Thủ chống lạnh & đỡ đòn
            { x: 1750, y: 215, type: "heal" },     // Lương khô tầng cao
            { x: 3330, y: 285, type: "disguise" }, // Hòm cải trang tại Quảng Châu
            { x: 4250, y: 485, type: "heal" }      // Lương khô chặng cuối
        ],

        // Đồng chí liên lạc bí mật (cần 4 Sao Vàng để đổi mật hiệu tiếp tế & mở lối tắt)
        npcs: [
            {
                x: 720, y: 472,
                name: "Đồng chí Quốc Tế Cộng Sản",
                quote: "Đồng chí Nguyễn! Luận cương của Lênin là ngọn đuốc soi đường. Cây cầu bí mật vượt vực tuyết đã mở!",
                giftType: "speed",
                shortcutId: "shortcut_moscow",
                starCost: 4
            }
        ],

        // Lối tắt bí mật (bắc ngang vực băng 800..950 ở cao độ y=520)
        shortcuts: [
            { id: "shortcut_moscow", x: 800, y: 520, w: 150, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 3: RỪNG NÚI PÁC BÓ & TIẾNG GỌI TỔ QUỐC (1930 - 1941)
    // [MỨC ĐỘ: RẤT KHÓ] - Mở rộng lên 5200px, 5 Văn kiện lịch sử
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
        levelWidth: 5200,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4940, y: 490 },
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

            // Cầu tre mỏng qua thác ghềnh 1
            { x: 1060, y: 270, w: 95,  h: 18, type: "bamboo" },
            { x: 1200, y: 360, w: 105, h: 18, type: "bamboo" },
            { x: 1350, y: 450, w: 115, h: 18, type: "bamboo" },

            // Đảo đá giữa suối Lê-nin 1
            { x: 1500, y: 520, w: 550,  h: 80, type: "moss_rock" },

            // Leo vách núi đợt 2 dẫn về Cột mốc 108
            { x: 1650, y: 420, w: 140, h: 20, type: "rock" },
            { x: 1840, y: 330, w: 195, h: 20, type: "rock" },
            { x: 2040, y: 240, w: 160, h: 20, type: "rock" },
            { x: 2240, y: 170, w: 220, h: 25, type: "moss_rock" }, // Đỉnh núi cao 2

            // Cầu dây rừng rậm qua thác ghềnh 2
            { x: 2500, y: 260, w: 95,  h: 18, type: "bamboo" },
            { x: 2640, y: 350, w: 105, h: 18, type: "bamboo" },
            { x: 2780, y: 440, w: 120, h: 18, type: "bamboo" },

            // Lán Khuổi Nặm - Nơi họp TW 8
            { x: 2940, y: 520, w: 540,  h: 80, type: "moss_rock" },
            { x: 3060, y: 420, w: 150, h: 20, type: "rock" },
            { x: 3250, y: 320, w: 180, h: 20, type: "rock" },
            { x: 3460, y: 220, w: 200, h: 25, type: "moss_rock" }, // Đỉnh núi cao 3

            // Cầu treo vượt hẻm núi Pác Bó 3
            { x: 3700, y: 280, w: 100, h: 18, type: "bamboo" },
            { x: 3840, y: 360, w: 110, h: 18, type: "bamboo" },
            { x: 3980, y: 450, w: 120, h: 18, type: "bamboo" },

            // Rừng đại ngàn Trần Hưng Đạo & Lễ Tuyên Thệ
            { x: 4140, y: 520, w: 520,  h: 80, type: "moss_rock" },
            { x: 4260, y: 420, w: 160, h: 20, type: "rock" },
            { x: 4460, y: 320, w: 180, h: 20, type: "rock" },
            { x: 4680, y: 220, w: 200, h: 25, type: "moss_rock" }, // Đỉnh đồi cờ đỏ
            { x: 4900, y: 350, w: 120, h: 18, type: "bamboo" },

            // Thềm đá cửa Hang Pác Bó thiêng liêng
            { x: 4880, y: 520, w: 320,  h: 80, type: "moss_rock" }
        ],

        // Ẩn nấp: Bụi rậm và hốc đá tự nhiên
        hidingSpots: [
            { x: 180,  y: 470, w: 55, h: 50, type: "bush",      label: "Bụi trúc Cao Bằng" },
            { x: 920,  y: 140, w: 55, h: 50, type: "rock_hide", label: "Hốc đá đỉnh núi" },
            { x: 1580, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây rừng" },
            { x: 1980, y: 280, w: 45, h: 50, type: "bush",      label: "Lùm cây vách đá" },
            { x: 2320, y: 120, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá che chắn" },
            { x: 3020, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây thung lũng" },
            { x: 3530, y: 170, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá rừng già" },
            { x: 4220, y: 470, w: 55, h: 50, type: "bush",      label: "Rừng vầu Pác Bó" },
            { x: 4920, y: 470, w: 55, h: 50, type: "bush",      label: "Lùm cây cửa hang" }
        ],

        // 10 lính tuần tra biên giới phong tỏa nghiêm ngặt
        guards: [
            { x: 400,  y: 472, minX: 240,  maxX: 600,  speed: 1.1,  dir: 1,  range: 132, angle: 0.36, aimDelay: 12 },
            { x: 880,  y: 142, minX: 830,  maxX: 985,  speed: 1.0,  dir: -1, range: 125, angle: 0.36, aimDelay: 12 }, // Gác trên đỉnh cao 1
            { x: 1750, y: 472, minX: 1560, maxX: 1990, speed: 1.12, dir: 1,  range: 135, angle: 0.36, aimDelay: 12 },
            { x: 1880, y: 282, minX: 1845, maxX: 2000, speed: 1.0,  dir: 1,  range: 128, angle: 0.36, aimDelay: 12 }, // Canh giữ vách núi 2
            { x: 2300, y: 122, minX: 2250, maxX: 2425, speed: 1.0,  dir: -1, range: 128, angle: 0.36, aimDelay: 12 }, // Gác trên mỏm đá 2
            { x: 3180, y: 472, minX: 3000, maxX: 3440, speed: 1.12, dir: -1, range: 135, angle: 0.36, aimDelay: 12 }, // Tuần tra thung lũng giữa
            { x: 3320, y: 272, minX: 3255, maxX: 3395, speed: 1.0,  dir: 1,  range: 125, angle: 0.36, aimDelay: 12 }, // Gác vách thung lũng
            { x: 3560, y: 172, minX: 3465, maxX: 3625, speed: 1.0,  dir: -1, range: 128, angle: 0.36, aimDelay: 12 }, // Gác đỉnh núi 3
            { x: 4320, y: 472, minX: 4180, maxX: 4580, speed: 1.14, dir: 1,  range: 135, angle: 0.36, aimDelay: 12 },
            { x: 4540, y: 272, minX: 4475, maxX: 4615, speed: 1.0,  dir: -1, range: 126, angle: 0.36, aimDelay: 12 }
        ],

        // Thác ghềnh cuộn sóng sâu
        hazards: [
            { x: 650,  y: 530, w: 850, h: 70, type: "water", label: "Thác ghềnh cuộn sóng" },
            { x: 2050, y: 530, w: 890, h: 70, type: "water", label: "Dòng suối nước sâu" },
            { x: 3480, y: 530, w: 660, h: 70, type: "water", label: "Hẻm vực Pác Bó" },
            { x: 4660, y: 530, w: 220, h: 70, type: "water", label: "Suối Lê-nin cửa hang" }
        ],

        checkpoints: [
            { x: 640,  y: 205, id: "cp3_1", reached: false },
            { x: 1520, y: 460, id: "cp3_2", reached: false },
            { x: 2060, y: 185, id: "cp3_3", reached: false },
            { x: 2960, y: 460, id: "cp3_4", reached: false },
            { x: 4160, y: 460, id: "cp3_5", reached: false }
        ],

        documents: [
            { docId: "cuong_linh_1930",      x: 870,  y: 130 },
            { docId: "cot_moc_108",          x: 1890, y: 270 },
            { docId: "mat_tran_viet_minh",   x: 3280, y: 260 },
            { docId: "doi_tuyentruyen_1944", x: 4500, y: 260 },
            { docId: "nen_tang_tu_tuong",    x: 4740, y: 160 }
        ],

        stars: [
            { x: 120,  y: 470 }, { x: 230,  y: 470 }, { x: 300,  y: 370 }, { x: 490,  y: 280 },
            { x: 1100, y: 210 }, { x: 1250, y: 300 }, { x: 1700, y: 360 },
            { x: 2090, y: 180 }, { x: 2540, y: 200 }, { x: 2690, y: 290 },
            { x: 3120, y: 360 }, { x: 3320, y: 260 }, { x: 3720, y: 220 },
            { x: 4280, y: 360 }, { x: 4520, y: 260 }, { x: 4740, y: 470 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 350,  y: 485, type: "shield" },   // Áo Trấn Thủ du kích
            { x: 950,  y: 155, type: "heal" },     // Lương khô đỉnh núi 1
            { x: 1600, y: 485, type: "speed" },    // Dép Cao Su vượt suối Lê-nin
            { x: 2360, y: 135, type: "disguise" }, // Hòm cải trang đỉnh núi 2
            { x: 4360, y: 485, type: "heal" }      // Lương khô rừng Pác Bó
        ],

        // Đồng chí liên lạc bí mật (cần 4 Sao Vàng để đổi mật hiệu tiếp tế & mở lối tắt)
        npcs: [
            {
                x: 550, y: 472,
                name: "Đồng chí Dân Tộc Pác Bó",
                quote: "Bác đã về với núi rừng quê hương! Đồng bào đã dựng cầu tre bí mật đưa Bác qua dòng thác ghềnh!",
                giftType: "shield",
                shortcutId: "shortcut_pacbo",
                starCost: 4
            }
        ],

        // Lối tắt bí mật (cầu tre bắc trọn qua thác ghềnh 650..1500 nối liền tới đảo suối Lê-nin)
        shortcuts: [
            { id: "shortcut_pacbo", x: 650, y: 520, w: 850, h: 18 }
        ]
    },

    // =========================================================================
    // MÀN 4: MÙA THU ĐỘC LẬP - BA ĐÌNH LỊCH SỬ (1945)
    // [MỨC ĐỘ: CỰC KHÓ / CAO TRÀO] - Mở rộng lên 5600px, 5 Văn kiện lịch sử
    // Đặc trưng: Chạy mái ngói phố cổ, rào thép gai dày đặc, tiến về Quảng trường Ba Đình
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

        // Dưới lòng đường bị rào chắn thép gai chiếm đóng, người chơi phải leo lên các mái ngói
        platforms: [
            { x: 0,    y: 520, w: 450,  h: 80, type: "red_brick" },

            // Dãy mái ngói phố cổ Thăng Long đợt 1
            { x: 220,  y: 430, w: 160, h: 20, type: "tile" },
            { x: 420,  y: 340, w: 180, h: 20, type: "tile" },
            { x: 650,  y: 260, w: 180, h: 20, type: "tile" },
            { x: 880,  y: 350, w: 170, h: 20, type: "tile" },

            // Cầu mái nhà nối nhịp 1
            { x: 1090, y: 420, w: 90,  h: 18, type: "wood" },

            // Khu phố cổ Hà Nội nổi dậy đợt 2
            { x: 1220, y: 400, w: 180, h: 20, type: "tile" },
            { x: 1450, y: 310, w: 190, h: 20, type: "tile" },
            { x: 1700, y: 230, w: 190, h: 20, type: "tile" },
            { x: 1940, y: 330, w: 170, h: 20, type: "tile" },

            // Nhịp cầu nối khu phố Bắc Bộ Phủ
            { x: 2150, y: 410, w: 90,  h: 18, type: "wood" },

            // Quảng trường Bắc Bộ Phủ & Dãy mái ngói đợt 3
            { x: 2280, y: 520, w: 380,  h: 80, type: "marble" },
            { x: 2450, y: 420, w: 170, h: 20, type: "tile" },
            { x: 2670, y: 330, w: 180, h: 20, type: "tile" },
            { x: 2900, y: 250, w: 190, h: 20, type: "tile" },
            { x: 3130, y: 350, w: 160, h: 20, type: "wood" },

            // Khu phố Hàng Ngang - Hàng Đào đợt 4 (Mới mở rộng)
            { x: 3280, y: 520, w: 360,  h: 80, type: "marble" },
            { x: 3460, y: 420, w: 170, h: 20, type: "tile" },
            { x: 3680, y: 330, w: 190, h: 20, type: "tile" },
            { x: 3910, y: 240, w: 190, h: 20, type: "tile" },
            { x: 4140, y: 340, w: 170, h: 20, type: "wood" },

            // Đại lộ Ba Đình và bậc thang hoa cương tiến vào Lễ đài
            { x: 4320, y: 520, w: 380,  h: 80, type: "marble" },
            { x: 4520, y: 420, w: 180, h: 20, type: "marble" },
            { x: 4740, y: 330, w: 190, h: 20, type: "marble" },
            { x: 4980, y: 240, w: 200, h: 20, type: "marble" },
            { x: 5260, y: 390, w: 340, h: 30, type: "marble_gold" }
        ],

        hidingSpots: [
            { x: 280,  y: 380, w: 50, h: 50, type: "crate", label: "Kiện cờ hoa trên mái" },
            { x: 720,  y: 210, w: 55, h: 50, type: "arch",  label: "Mái hiên phố cổ" },
            { x: 1510, y: 260, w: 50, h: 50, type: "crate", label: "Thùng loa phát thanh" },
            { x: 2340, y: 470, w: 55, h: 50, type: "bush",  label: "Cây cảnh Bắc Bộ Phủ" },
            { x: 2730, y: 280, w: 55, h: 50, type: "arch",  label: "Vòm cửa sổ cổ" },
            { x: 3320, y: 470, w: 55, h: 50, type: "bush",  label: "Cửa hiệu Hàng Ngang" },
            { x: 3740, y: 280, w: 55, h: 50, type: "arch",  label: "Ban công phố cổ" },
            { x: 4360, y: 470, w: 55, h: 50, type: "bush",  label: "Vườn hoa Ba Đình" },
            { x: 5040, y: 190, w: 55, h: 50, type: "bush",  label: "Cột hoa lễ đài" }
        ],

        // 12 lính tuần tra tàn quân bảo vệ nghiêm ngặt
        guards: [
            { x: 500,  y: 292, minX: 425,  maxX: 565,  speed: 1.15, dir: 1,  range: 135, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 920,  y: 302, minX: 885,  maxX: 1015, speed: 1.18, dir: -1, range: 138, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 1500, y: 262, minX: 1455, maxX: 1605, speed: 1.18, dir: 1,  range: 138, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 1780, y: 182, minX: 1705, maxX: 1855, speed: 1.1,  dir: -1, range: 135, angle: 0.38, aimDelay: 10, fireRate: 34 }, // Gác mái cao phố cổ
            { x: 1980, y: 282, minX: 1945, maxX: 2075, speed: 1.2,  dir: -1, range: 138, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 2480, y: 472, minX: 2300, maxX: 2620, speed: 1.2,  dir: 1,  range: 140, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 2980, y: 202, minX: 2905, maxX: 3055, speed: 1.1,  dir: 1,  range: 135, angle: 0.38, aimDelay: 10, fireRate: 34 }, // Gác mái ngói đợt 3
            { x: 3520, y: 372, minX: 3465, maxX: 3595, speed: 1.15, dir: -1, range: 136, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 3960, y: 192, minX: 3915, maxX: 4065, speed: 1.12, dir: 1,  range: 136, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 4440, y: 472, minX: 4330, maxX: 4660, speed: 1.2,  dir: -1, range: 140, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 4800, y: 282, minX: 4745, maxX: 4895, speed: 1.15, dir: 1,  range: 138, angle: 0.38, aimDelay: 10, fireRate: 34 },
            { x: 5080, y: 192, minX: 4985, maxX: 5145, speed: 1.1,  dir: -1, range: 135, angle: 0.38, aimDelay: 10, fireRate: 34 }  // Cận vệ trước lễ đài
        ],

        // Rào thép gai dày đặc của tàn quân dưới đất (Bắt buộc phải chạy trên mái)
        hazards: [
            { x: 450,  y: 530, w: 750,  h: 70, type: "spikes", label: "Rào thép gai công sự" },
            { x: 1200, y: 530, w: 1080, h: 70, type: "spikes", label: "Hàng rào chướng ngại" },
            { x: 2660, y: 530, w: 620,  h: 70, type: "spikes", label: "Chướng ngại Bắc Bộ Phủ" },
            { x: 3640, y: 530, w: 680,  h: 70, type: "spikes", label: "Rào thép phố cổ" },
            { x: 4700, y: 530, w: 560,  h: 70, type: "spikes", label: "Cọc thép phòng thủ Ba Đình" }
        ],

        checkpoints: [
            { x: 670,  y: 200, id: "cp4_1", reached: false },
            { x: 1720, y: 170, id: "cp4_2", reached: false },
            { x: 2920, y: 190, id: "cp4_3", reached: false },
            { x: 3940, y: 180, id: "cp4_4", reached: false },
            { x: 4990, y: 180, id: "cp4_5", reached: false }
        ],

        documents: [
            { docId: "nhat_phap_1945",   x: 710,  y: 200 },
            { docId: "dai_hoi_tan_trao", x: 1760, y: 170 },
            { docId: "tong_khoi_nghia",  x: 2960, y: 190 },
            { docId: "so_48_hang_ngang", x: 3960, y: 180 },
            { docId: "tuyen_ngon_1945",  x: 5040, y: 180 }
        ],

        stars: [
            { x: 160,  y: 470 }, { x: 240,  y: 380 }, { x: 330,  y: 380 }, { x: 500,  y: 290 },
            { x: 950,  y: 300 }, { x: 1300, y: 350 }, { x: 1580, y: 250 },
            { x: 2020, y: 270 }, { x: 2520, y: 360 }, { x: 2960, y: 190 },
            { x: 3520, y: 370 }, { x: 3740, y: 280 }, { x: 4000, y: 190 },
            { x: 4580, y: 360 }, { x: 4820, y: 270 }, { x: 5120, y: 340 }
        ],

        // Vật phẩm tiếp tế cách mạng
        supplies: [
            { x: 350,  y: 395, type: "disguise" }, // Cải trang đi trên mái phố cổ
            { x: 1350, y: 365, type: "heal" },     // Lương khô
            { x: 1800, y: 195, type: "shield" },   // Áo Trấn Thủ tự vệ đỏ
            { x: 3520, y: 375, type: "speed" },    // Dép Cao Su chạy mái phố
            { x: 4420, y: 485, type: "heal" }      // Lương khô Ba Đình
        ],

        // Đồng chí liên lạc bí mật (cần 5 Sao Vàng để đổi mật hiệu tiếp tế & mở lối tắt)
        npcs: [
            {
                x: 360, y: 472,
                name: "Nữ Tự Vệ Cứu Quốc Ba Đình",
                quote: "Thưa Bác! Toàn thể đồng bào đang reo hò đón Bác. Chúng cháu đã mở lối cầu ván vượt qua rào thép gai!",
                giftType: "disguise",
                shortcutId: "shortcut_badinh",
                starCost: 5
            }
        ],

        // Lối tắt bí mật (cầu ván vượt bãi rào thép gai thứ nhất 450..1220, nơi có thể bật nhảy lên nhịp cầu x=1090, y=420)
        shortcuts: [
            { id: "shortcut_badinh", x: 450, y: 520, w: 770, h: 18 }
        ]
    }
];
