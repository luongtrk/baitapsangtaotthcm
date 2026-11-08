// Cấu hình dữ liệu 4 màn chơi

const LEVELS = [
    // Màn 1: Bến cảng Sài Gòn & Paris (1911 - 1919)
    {
        id: 1,
        name: "Chương 1: Ra Đi Tìm Đường Cứu Nước (1911 - 1919)",
        theme: "harbor_paris",
        bgColor: "#0f172a",
        skyColor: ["#020617", "#1e1b4b"],
        groundColor: "#334155",
        platformColor: "#475569",
        levelWidth: 3400,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 3150, y: 440 },
        exitType: "ship",

        platforms: [
            { x: 0,    y: 520, w: 850,  h: 80, type: "dock" },
            { x: 1010, y: 520, w: 710,  h: 80, type: "stone" },
            { x: 1820, y: 520, w: 720,  h: 80, type: "stone" },
            { x: 2650, y: 520, w: 750,  h: 80, type: "stone" },

            // Bục gỗ bến cảng
            { x: 250,  y: 430, w: 140, h: 20, type: "wood" },
            { x: 450,  y: 360, w: 160, h: 20, type: "wood" },
            { x: 670,  y: 420, w: 140, h: 20, type: "wood" },

            // Ban công Paris khu 1
            { x: 1220, y: 430, w: 160, h: 20, type: "stone" },
            { x: 1440, y: 350, w: 170, h: 20, type: "stone" },
            { x: 1680, y: 420, w: 160, h: 20, type: "stone" },

            // Ban công Paris khu 2
            { x: 2020, y: 430, w: 160, h: 20, type: "stone" },
            { x: 2240, y: 350, w: 170, h: 20, type: "stone" },
            { x: 2470, y: 420, w: 150, h: 20, type: "wood" },

            // Khu vực Versailles
            { x: 2780, y: 430, w: 160, h: 20, type: "stone" },
            { x: 2980, y: 350, w: 170, h: 20, type: "stone" }
        ],

        hidingSpots: [
            { x: 200,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng bến cảng" },
            { x: 580,  y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ" },
            { x: 1100, y: 470, w: 55, h: 50, type: "arch",  label: "Ngõ tối Paris" },
            { x: 1400, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách báo" },
            { x: 1645, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cửa cổ" },
            { x: 2120, y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ" },
            { x: 2380, y: 470, w: 55, h: 50, type: "arch",  label: "Hành lang Versailles" },
            { x: 2880, y: 470, w: 50, h: 50, type: "crate", label: "Thùng hàng cảng" }
        ],

        guards: [
            { x: 480,  y: 472, minX: 380,  maxX: 620,  speed: 0.78, dir: 1,  range: 98 },
            { x: 1350, y: 472, minX: 1200, maxX: 1540, speed: 0.82, dir: -1, range: 105 },
            { x: 2050, y: 472, minX: 1920, maxX: 2260, speed: 0.84, dir: -1, range: 105 },
            { x: 2820, y: 472, minX: 2700, maxX: 3020, speed: 0.85, dir: 1,  range: 105 }
        ],

        hazards: [
            { x: 860,  y: 540, w: 140, h: 60, type: "water", label: "Lạch nước bến cảng" },
            { x: 1720, y: 540, w: 100, h: 60, type: "water", label: "Hố nước Paris" },
            { x: 2540, y: 540, w: 110, h: 60, type: "water", label: "Kênh nước Seine" }
        ],

        checkpoints: [
            { x: 1040, y: 460, id: "cp1_1", reached: false },
            { x: 1850, y: 460, id: "cp1_2", reached: false },
            { x: 2680, y: 460, id: "cp1_3", reached: false }
        ],

        documents: [
            { docId: "ben_nha_rong",  x: 490,  y: 290 },
            { docId: "hoi_yeu_nuoc",  x: 1500, y: 280 },
            { docId: "yeu_sach_1919", x: 3030, y: 280 }
        ],

        stars: [
            { x: 160,  y: 470 }, { x: 300,  y: 380 }, { x: 500,  y: 310 },
            { x: 720,  y: 370 }, { x: 1150, y: 470 }, { x: 1300, y: 380 },
            { x: 1520, y: 300 }, { x: 1950, y: 470 }, { x: 2080, y: 380 },
            { x: 2300, y: 300 }, { x: 2740, y: 470 }, { x: 2840, y: 380 }
        ],

        supplies: [
            { x: 380,  y: 485, type: "shield" },
            { x: 1250, y: 485, type: "heal" },
            { x: 1600, y: 315, type: "speed" },
            { x: 2280, y: 315, type: "heal" },
            { x: 2750, y: 485, type: "disguise" }
        ],

        npcs: [
            {
                x: 750, y: 472,
                name: "Đồng chí Thợ Thuyền Ba Son",
                quote: "Anh Ba! Tàu sắp nhổ neo, tôi đã hạ sẵn chiếc cầu bí mật giúp anh vượt qua lạch nước an toàn!",
                giftType: "shield",
                shortcutId: "shortcut_harbor",
                starCost: 3
            }
        ],

        shortcuts: [
            { id: "shortcut_harbor", x: 850, y: 520, w: 160, h: 18 }
        ]
    },

    // Màn 2: Mùa đông Moskva & Quảng Châu (1920 - 1927)
    {
        id: 2,
        name: "Chương 2: Ánh Sáng Luận Cương & Đường Kách Mệnh (1920 - 1927)",
        theme: "moscow_guangzhou",
        bgColor: "#1c1917",
        skyColor: ["#0c0a09", "#292524"],
        groundColor: "#44403c",
        platformColor: "#57534e",
        levelWidth: 3800,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 3540, y: 460 },
        exitType: "train",

        platforms: [
            { x: 0,    y: 520, w: 800,  h: 80, type: "snow_brick" },
            { x: 950,  y: 520, w: 900,  h: 80, type: "snow_brick" },
            { x: 2020, y: 520, w: 760,  h: 80, type: "snow_brick" },
            { x: 2930, y: 520, w: 870,  h: 80, type: "brick" },

            // Khu vực đầu màn
            { x: 220,  y: 420, w: 150, h: 20, type: "snow_brick" },
            { x: 440,  y: 330, w: 160, h: 20, type: "snow_brick" },
            { x: 680,  y: 250, w: 170, h: 20, type: "snow_brick" },
            { x: 840,  y: 430, w: 70,  h: 18, type: "snow_brick" },

            // Khu tòa soạn báo Le Paria
            { x: 1140, y: 420, w: 160, h: 20, type: "snow_brick" },
            { x: 1370, y: 330, w: 180, h: 20, type: "snow_brick" },
            { x: 1620, y: 250, w: 180, h: 20, type: "snow_brick" },
            { x: 1880, y: 420, w: 80,  h: 18, type: "wood" },

            // Khu Moskva
            { x: 2140, y: 420, w: 160, h: 20, type: "snow_brick" },
            { x: 2360, y: 330, w: 180, h: 20, type: "snow_brick" },
            { x: 2580, y: 250, w: 170, h: 20, type: "snow_brick" },
            { x: 2810, y: 420, w: 80,  h: 18, type: "wood" },

            // Khu Quảng Châu
            { x: 3040, y: 410, w: 160, h: 20, type: "brick" },
            { x: 3260, y: 320, w: 180, h: 20, type: "brick" },
            { x: 3480, y: 240, w: 170, h: 20, type: "brick" }
        ],

        hidingSpots: [
            { x: 320,  y: 470, w: 50, h: 50, type: "crate", label: "Kiện hàng in báo" },
            { x: 1200, y: 470, w: 55, h: 50, type: "arch",  label: "Cửa hầm Moskva" },
            { x: 1520, y: 470, w: 50, h: 50, type: "crate", label: "Thùng phủ tuyết" },
            { x: 1720, y: 200, w: 50, h: 50, type: "crate", label: "Kiện sách tầng cao" },
            { x: 2220, y: 470, w: 55, h: 50, type: "arch",  label: "Vòm cổng Kremlin" },
            { x: 2520, y: 470, w: 50, h: 50, type: "crate", label: "Thùng gỗ mùa đông" },
            { x: 3120, y: 470, w: 50, h: 50, type: "crate", label: "Kiện sách Quảng Châu" }
        ],

        guards: [
            { x: 420,  y: 472, minX: 320,  maxX: 580,  speed: 0.82, dir: 1,  range: 102 },
            { x: 1280, y: 472, minX: 1150, maxX: 1450, speed: 0.85, dir: -1, range: 105 },
            { x: 1450, y: 282, minX: 1390, maxX: 1520, speed: 0.84, dir: 1,  range: 100 },
            { x: 2320, y: 472, minX: 2150, maxX: 2560, speed: 0.85, dir: 1,  range: 105 },
            { x: 3180, y: 472, minX: 3040, maxX: 3380, speed: 0.86, dir: -1, range: 105 }
        ],

        hazards: [
            { x: 800,  y: 530, w: 150, h: 70, type: "ice_pit", label: "Vực băng tuyết sâu" },
            { x: 1850, y: 530, w: 170, h: 70, type: "ice_pit", label: "Hố băng trơn trượt" },
            { x: 2780, y: 530, w: 150, h: 70, type: "ice_pit", label: "Khe băng lạnh giá" }
        ],

        checkpoints: [
            { x: 1020, y: 460, id: "cp2_1", reached: false },
            { x: 2070, y: 460, id: "cp2_2", reached: false },
            { x: 2980, y: 460, id: "cp2_3", reached: false }
        ],

        documents: [
            { docId: "luan_cuong_lenin", x: 730,  y: 190 },
            { docId: "le_paria",         x: 1680, y: 190 },
            { docId: "duong_kach_menh",  x: 3530, y: 180 }
        ],

        stars: [
            { x: 150,  y: 470 }, { x: 260,  y: 360 }, { x: 490,  y: 270 }, { x: 620,  y: 470 },
            { x: 870,  y: 370 }, { x: 1200, y: 360 }, { x: 1430, y: 270 },
            { x: 1910, y: 360 }, { x: 2200, y: 360 }, { x: 2420, y: 270 },
            { x: 2840, y: 360 }, { x: 3100, y: 350 }, { x: 3320, y: 260 }
        ],

        supplies: [
            { x: 380,  y: 485, type: "speed" },
            { x: 1320, y: 485, type: "shield" },
            { x: 1750, y: 215, type: "heal" },
            { x: 2450, y: 295, type: "speed" },
            { x: 3330, y: 285, type: "disguise" }
        ],

        npcs: [
            {
                x: 720, y: 472,
                name: "Đồng chí Quốc Tế Cộng Sản",
                quote: "Đồng chí Nguyễn! Luận cương của Lênin là ngọn đuốc soi đường. Cây cầu bí mật vượt vực tuyết đã mở!",
                giftType: "speed",
                shortcutId: "shortcut_moscow",
                starCost: 3
            }
        ],

        shortcuts: [
            { id: "shortcut_moscow", x: 800, y: 520, w: 150, h: 18 }
        ]
    },

    // Màn 3: Rừng núi Pác Bó (1930 - 1941)
    {
        id: 3,
        name: "Chương 3: Thành Lập Đảng & Tiếng Gọi Pác Bó (1930 - 1941)",
        theme: "jungle_pacbo",
        bgColor: "#064e3b",
        skyColor: ["#022c22", "#064e3b"],
        groundColor: "#14532d",
        platformColor: "#15803d",
        levelWidth: 4100,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 3860, y: 490 },
        exitType: "cave",

        platforms: [
            { x: 0,    y: 520, w: 650,  h: 80, type: "moss_rock" },

            // Vách núi đợt 1
            { x: 250,  y: 430, w: 140, h: 20, type: "rock" },
            { x: 430,  y: 340, w: 150, h: 20, type: "rock" },
            { x: 620,  y: 260, w: 160, h: 20, type: "rock" },
            { x: 820,  y: 190, w: 200, h: 25, type: "moss_rock" },

            // Cầu tre qua thác 1
            { x: 1060, y: 270, w: 95,  h: 18, type: "bamboo" },
            { x: 1200, y: 360, w: 105, h: 18, type: "bamboo" },
            { x: 1350, y: 450, w: 115, h: 18, type: "bamboo" },

            { x: 1500, y: 520, w: 550,  h: 80, type: "moss_rock" },

            // Vách núi đợt 2 (Cột mốc 108)
            { x: 1650, y: 420, w: 140, h: 20, type: "rock" },
            { x: 1840, y: 330, w: 195, h: 20, type: "rock" },
            { x: 2040, y: 240, w: 160, h: 20, type: "rock" },
            { x: 2240, y: 170, w: 220, h: 25, type: "moss_rock" },

            // Cầu tre qua thác 2
            { x: 2500, y: 260, w: 95,  h: 18, type: "bamboo" },
            { x: 2640, y: 350, w: 105, h: 18, type: "bamboo" },
            { x: 2780, y: 440, w: 120, h: 18, type: "bamboo" },

            // Khu rừng Trần Hưng Đạo
            { x: 2940, y: 520, w: 540,  h: 80, type: "moss_rock" },
            { x: 3060, y: 420, w: 150, h: 20, type: "rock" },
            { x: 3250, y: 320, w: 180, h: 20, type: "rock" },
            { x: 3460, y: 220, w: 200, h: 25, type: "moss_rock" },
            { x: 3680, y: 360, w: 110, h: 18, type: "bamboo" },

            // Cửa hang Pác Bó
            { x: 3800, y: 520, w: 300,  h: 80, type: "moss_rock" }
        ],

        hidingSpots: [
            { x: 180,  y: 470, w: 55, h: 50, type: "bush",      label: "Bụi trúc Cao Bằng" },
            { x: 920,  y: 140, w: 55, h: 50, type: "rock_hide", label: "Hốc đá đỉnh núi" },
            { x: 1580, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây rừng" },
            { x: 1980, y: 280, w: 45, h: 50, type: "bush",      label: "Lùm cây vách đá" },
            { x: 2320, y: 120, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá che chắn" },
            { x: 3020, y: 470, w: 55, h: 50, type: "bush",      label: "Bụi cây thung lũng" },
            { x: 3530, y: 170, w: 55, h: 50, type: "rock_hide", label: "Mỏm đá rừng già" },
            { x: 3840, y: 470, w: 55, h: 50, type: "bush",      label: "Lùm cây cửa hang" }
        ],

        guards: [
            { x: 400,  y: 472, minX: 300,  maxX: 550,  speed: 0.88, dir: 1,  range: 108 },
            { x: 880,  y: 142, minX: 840,  maxX: 980,  speed: 0.85, dir: -1, range: 102 },
            { x: 1750, y: 472, minX: 1600, maxX: 1950, speed: 0.9,  dir: 1,  range: 110 },
            { x: 1880, y: 282, minX: 1840, maxX: 1980, speed: 0.86, dir: 1,  range: 105 },
            { x: 2300, y: 122, minX: 2260, maxX: 2420, speed: 0.85, dir: -1, range: 105 },
            { x: 3180, y: 472, minX: 3020, maxX: 3400, speed: 0.88, dir: -1, range: 108 }
        ],

        hazards: [
            { x: 650,  y: 530, w: 850, h: 70, type: "water", label: "Thác ghềnh cuộn sóng" },
            { x: 2050, y: 530, w: 890, h: 70, type: "water", label: "Dòng suối nước sâu" },
            { x: 3480, y: 530, w: 320, h: 70, type: "water", label: "Suối sâu cửa hang" }
        ],

        checkpoints: [
            { x: 640,  y: 205, id: "cp3_1", reached: false },
            { x: 1520, y: 460, id: "cp3_2", reached: false },
            { x: 2060, y: 185, id: "cp3_3", reached: false },
            { x: 2960, y: 460, id: "cp3_4", reached: false }
        ],

        documents: [
            { docId: "cuong_linh_1930",      x: 870,  y: 130 },
            { docId: "cot_moc_108",          x: 1890, y: 270 },
            { docId: "doi_tuyentruyen_1944", x: 3560, y: 160 }
        ],

        stars: [
            { x: 120,  y: 470 }, { x: 230,  y: 470 }, { x: 300,  y: 370 }, { x: 490,  y: 280 },
            { x: 1100, y: 210 }, { x: 1250, y: 300 }, { x: 1700, y: 360 },
            { x: 2090, y: 180 }, { x: 2540, y: 200 }, { x: 2690, y: 290 },
            { x: 3120, y: 360 }, { x: 3320, y: 260 }, { x: 3720, y: 300 }
        ],

        supplies: [
            { x: 350,  y: 485, type: "shield" },
            { x: 950,  y: 155, type: "heal" },
            { x: 1600, y: 485, type: "speed" },
            { x: 2360, y: 135, type: "disguise" },
            { x: 3080, y: 485, type: "heal" }
        ],

        npcs: [
            {
                x: 550, y: 472,
                name: "Đồng chí Dân Tộc Pác Bó",
                quote: "Bác đã về với núi rừng quê hương! Đồng bào đã dựng cầu tre bí mật đưa Bác qua dòng thác ghềnh!",
                giftType: "shield",
                shortcutId: "shortcut_pacbo",
                starCost: 3
            }
        ],

        shortcuts: [
            { id: "shortcut_pacbo", x: 650, y: 520, w: 850, h: 18 }
        ]
    },

    // Màn 4: Mùa thu Độc Lập - Ba Đình (1945)
    {
        id: 4,
        name: "Chương 4: Mùa Thu Độc Lập - Ba Đình Lịch Sử (1945)",
        theme: "revolution_badinh",
        bgColor: "#262335",
        skyColor: ["#0b1021", "#182238"],
        groundColor: "#334155",
        platformColor: "#b45309",
        levelWidth: 4400,
        levelHeight: 600,
        startPos: { x: 80, y: 440 },
        exitPos: { x: 4160, y: 330 },
        exitType: "podium",

        platforms: [
            { x: 0,    y: 520, w: 450,  h: 80, type: "red_brick" },

            // Mái ngói phố cổ đợt 1
            { x: 220,  y: 430, w: 160, h: 20, type: "tile" },
            { x: 420,  y: 340, w: 180, h: 20, type: "tile" },
            { x: 650,  y: 260, w: 180, h: 20, type: "tile" },
            { x: 880,  y: 350, w: 170, h: 20, type: "tile" },

            { x: 1090, y: 420, w: 90,  h: 18, type: "wood" },

            // Mái ngói phố cổ đợt 2
            { x: 1220, y: 400, w: 180, h: 20, type: "tile" },
            { x: 1450, y: 310, w: 190, h: 20, type: "tile" },
            { x: 1700, y: 230, w: 190, h: 20, type: "tile" },
            { x: 1940, y: 330, w: 170, h: 20, type: "tile" },

            { x: 2150, y: 410, w: 90,  h: 18, type: "wood" },

            // Khu Bắc Bộ Phủ & mái ngói đợt 3
            { x: 2280, y: 520, w: 380,  h: 80, type: "marble" },
            { x: 2450, y: 420, w: 170, h: 20, type: "tile" },
            { x: 2670, y: 330, w: 180, h: 20, type: "tile" },
            { x: 2900, y: 250, w: 190, h: 20, type: "tile" },
            { x: 3130, y: 350, w: 160, h: 20, type: "wood" },

            // Quảng trường Ba Đình
            { x: 3260, y: 520, w: 350,  h: 80, type: "marble" },
            { x: 3400, y: 420, w: 170, h: 20, type: "marble" },
            { x: 3620, y: 330, w: 180, h: 20, type: "marble" },
            { x: 3850, y: 250, w: 200, h: 20, type: "marble" },
            { x: 4100, y: 390, w: 280, h: 30, type: "marble_gold" }
        ],

        hidingSpots: [
            { x: 280,  y: 380, w: 50, h: 50, type: "crate", label: "Kiện cờ hoa trên mái" },
            { x: 720,  y: 210, w: 55, h: 50, type: "arch",  label: "Mái hiên phố cổ" },
            { x: 1510, y: 260, w: 50, h: 50, type: "crate", label: "Thùng loa phát thanh" },
            { x: 2340, y: 470, w: 55, h: 50, type: "bush",  label: "Cây cảnh Bắc Bộ Phủ" },
            { x: 2730, y: 280, w: 55, h: 50, type: "arch",  label: "Vòm cửa sổ cổ" },
            { x: 3300, y: 470, w: 55, h: 50, type: "bush",  label: "Vườn hoa Ba Đình" },
            { x: 3510, y: 470, w: 50, h: 50, type: "bush",  label: "Hàng cây quảng trường" },
            { x: 3920, y: 200, w: 55, h: 50, type: "bush",  label: "Cột hoa lễ đài" }
        ],

        guards: [
            { x: 500,  y: 292, minX: 430,  maxX: 570,  speed: 0.92, dir: 1,  range: 105 },
            { x: 920,  y: 302, minX: 890,  maxX: 1020, speed: 0.94, dir: -1, range: 110 },
            { x: 1500, y: 262, minX: 1460, maxX: 1610, speed: 0.94, dir: 1,  range: 110 },
            { x: 1980, y: 282, minX: 1950, maxX: 2080, speed: 0.95, dir: -1, range: 110 },
            { x: 2480, y: 472, minX: 2320, maxX: 2600, speed: 0.94, dir: 1,  range: 110 },
            { x: 3400, y: 472, minX: 3280, maxX: 3540, speed: 0.94, dir: -1, range: 110 },
            { x: 3680, y: 282, minX: 3630, maxX: 3770, speed: 0.92, dir: 1,  range: 110 }
        ],

        hazards: [
            { x: 450,  y: 530, w: 750,  h: 70, type: "spikes", label: "Rào thép gai công sự" },
            { x: 1200, y: 530, w: 1080, h: 70, type: "spikes", label: "Hàng rào chướng ngại" },
            { x: 2660, y: 530, w: 600,  h: 70, type: "spikes", label: "Chướng ngại Bắc Bộ Phủ" },
            { x: 3610, y: 530, w: 490,  h: 70, type: "spikes", label: "Cọc thép phòng thủ" }
        ],

        checkpoints: [
            { x: 670,  y: 200, id: "cp4_1", reached: false },
            { x: 1720, y: 170, id: "cp4_2", reached: false },
            { x: 2920, y: 190, id: "cp4_3", reached: false },
            { x: 3870, y: 190, id: "cp4_4", reached: false }
        ],

        documents: [
            { docId: "nhat_phap_1945",  x: 710,  y: 200 },
            { docId: "tong_khoi_nghia", x: 1760, y: 170 },
            { docId: "tuyen_ngon_1945", x: 3910, y: 190 }
        ],

        stars: [
            { x: 160,  y: 470 }, { x: 240,  y: 380 }, { x: 330,  y: 380 }, { x: 500,  y: 290 },
            { x: 950,  y: 300 }, { x: 1300, y: 350 }, { x: 1580, y: 250 },
            { x: 2020, y: 270 }, { x: 2520, y: 360 }, { x: 2960, y: 190 },
            { x: 3480, y: 360 }, { x: 3720, y: 270 }
        ],

        supplies: [
            { x: 350,  y: 395, type: "disguise" },
            { x: 1350, y: 365, type: "heal" },
            { x: 1800, y: 195, type: "shield" },
            { x: 2740, y: 295, type: "heal" },
            { x: 3340, y: 485, type: "speed" }
        ],

        npcs: [
            {
                x: 360, y: 472,
                name: "Nữ Tự Vệ Cứu Quốc Ba Đình",
                quote: "Thưa Bác! Toàn thể đồng bào đang reo hò đón Bác. Chúng cháu đã mở lối cầu ván vượt qua rào thép gai!",
                giftType: "disguise",
                shortcutId: "shortcut_badinh",
                starCost: 3
            }
        ],

        shortcuts: [
            { id: "shortcut_badinh", x: 450, y: 520, w: 770, h: 18 }
        ]
    }
];
