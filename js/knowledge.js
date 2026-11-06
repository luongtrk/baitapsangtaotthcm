// Dữ liệu học thuật & Ngân hàng tri thức môn Tư tưởng Hồ Chí Minh

const TTHCM_KNOWLEDGE = {
    // 4 Chương Lịch Sử
    chapters: [
        {
            id: 1,
            title: "Chương 1: Ra Đi Tìm Đường Cứu Nước (1911 - 1919)",
            subtitle: "Từ Bến Cảng Sài Gòn Đến Diễn Đàn Versailles",
            desc: "Chàng thanh niên Nguyễn Tất Thành rời Tổ quốc, bôn ba qua nhiều châu lục, thấu hiểu nỗi khổ của các dân tộc bị áp bức và gửi Bản Yêu sách 8 điểm đến Hội nghị Versailles.",
            yearRange: "1911 - 1919",
            docIds: ["ben_nha_rong", "hoi_yeu_nuoc", "yeu_sach_1919"]
        },
        {
            id: 2,
            title: "Chương 2: Ánh Sáng Luận Cương & Đường Kách Mệnh (1920 - 1927)",
            subtitle: "Bước Ngoặt Tư Tưởng & Ngọn Lửa Lý Luận",
            desc: "Tiếp cận Luận cương Lênin, bỏ phiếu tán thành Quốc tế III, sáng lập Báo Le Paria và xuất bản tác phẩm lý luận kinh điển Đường Kách Mệnh.",
            yearRange: "1920 - 1927",
            docIds: ["luan_cuong_lenin", "le_paria", "duong_kach_menh"]
        },
        {
            id: 3,
            title: "Chương 3: Thành Lập Đảng & Tiếng Gọi Pác Bó (1930 - 1941)",
            subtitle: "Hợp Nhất Phong Trào & Trở Về Đất Mẹ",
            desc: "Chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam, vượt qua cảnh ngục tù và sự truy lùng ráo riết của đế quốc để trở về Pác Bó lãnh đạo cách mạng giải phóng dân tộc.",
            yearRange: "1930 - 1941",
            docIds: ["cuong_linh_1930", "cot_moc_108", "doi_tuyentruyen_1944"]
        },
        {
            id: 4,
            title: "Chương 4: Mùa Thu Độc Lập - Ba Đình Lịch Sử (1945)",
            subtitle: "Tổng Khởi Nghĩa & Khai Sinh Nước Việt Nam Mới",
            desc: "Chớp thời cơ ngàn năm có một, lãnh đạo Tổng khởi nghĩa Tháng Tám thắng lợi và soạn thảo Bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.",
            yearRange: "1945",
            docIds: ["nhat_phap_1945", "tong_khoi_nghia", "tuyen_ngon_1945"]
        }
    ],

    // Danh sách 12 Văn kiện & Di sản lịch sử quý giá
    documents: {
        "ben_nha_rong": {
            id: "ben_nha_rong",
            chapterId: 1,
            name: "Quyết Định Lịch Sử Tại Bến Nhà Rồng",
            year: "5/6/1911",
            location: "Sài Gòn - Tàu Amiral Latouche-Tréville",
            badge: "Khởi Đầu Hành Trình",
            historicalContext: "Trước cảnh nước mất nhà tan và sự bế tắc của các phong trào yêu nước đương thời (của cụ Phan Bội Châu, Phan Châu Trinh...), người thanh niên Nguyễn Tất Thành với lòng yêu nước nồng nàn và nhãn quan chính trị độc lập đã quyết định sang phương Tây để tìm hiểu ngọn nguồn tự do, bình đẳng, bác ái.",
            coreIdea: "Ý chí độc lập, tự chủ trong việc lựa chọn con đường cứu nước. Không rập khuôn theo các bậc tiền bối mà trực tiếp đến 'sào huyệt' của chủ nghĩa thực dân để nghiên cứu, tìm cách giúp đồng bào thoát ách nô lệ.",
            famousQuote: "Tôi muốn đi ra nước ngoài, xem nước Pháp và các nước khác. Sau khi xem xét họ làm như thế nào, tôi sẽ trở về giúp đồng bào chúng ta.",
            quiz: {
                question: "Ngày 5/6/1911 ghi dấu mốc sự kiện lịch sử quan trọng nào trong cuộc đời hoạt động cách mạng của Nguyễn Tất Thành?",
                options: [
                    "Người tham gia sáng lập Đảng Xã hội Pháp tại Paris",
                    "Người rời bến cảng Nhà Rồng trên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước",
                    "Người gửi bản Yêu sách của nhân dân An Nam tới Hội nghị Versailles",
                    "Người đọc bản Sơ thảo Luận cương về vấn đề dân tộc và thuộc địa của Lênin"
                ],
                correctIndex: 1,
                explanation: "Ngày 5/6/1911, từ bến cảng Nhà Rồng (Sài Gòn), người thanh niên yêu nước Nguyễn Tất Thành lấy tên Văn Ba, lên tàu buôn Pháp Amiral Latouche-Tréville rời Tổ quốc, mở đầu hành trình 30 năm bôn ba tìm con đường cứu nước, cứu dân."
            }
        },
        "hoi_yeu_nuoc": {
            id: "hoi_yeu_nuoc",
            chapterId: 1,
            name: "Hội Những Người Yêu Nước & Hoạt Động Tại Pháp",
            year: "1917 - 1918",
            location: "Paris, Pháp",
            badge: "Tập Hợp Lực Lượng",
            historicalContext: "Sau khi bôn ba qua Mỹ, Anh, năm 1917 Người trở lại Pháp, tham gia Đảng Xã hội Pháp và cùng các nhà cách mạng Phan Chu Trinh, Phan Văn Trường thành lập Hội những người Việt Nam yêu nước tại Pháp nhằm thức tỉnh kiều bào.",
            coreIdea: "Tư tưởng Hồ Chí Minh về tập hợp lực lượng, gắn kết đồng bào yêu nước ở hải ngoại, sử dụng quyền tự do báo chí, ngôn luận để đấu tranh đòi quyền lợi chính đáng cho dân tộc.",
            famousQuote: "Dù ở nơi đâu, hễ là người Việt Nam mang dòng máu Lạc Hồng thì đều phải đồng tâm hiệp lực vì nền độc lập của Tổ quốc.",
            quiz: {
                question: "Trong tiến trình hình thành và phát triển tư tưởng Hồ Chí Minh, giai đoạn 'Tìm tòi con đường cứu nước, giải phóng dân tộc' được xác định trong thời gian nào?",
                options: [
                    "Trước năm 1911",
                    "Thời kỳ 1911 - 1920",
                    "Thời kỳ 1921 - 1930",
                    "Thời kỳ 1930 - 1945"
                ],
                correctIndex: 1,
                explanation: "Giai đoạn 1911 - 1920 là thời kỳ Nguyễn Ái Quốc bôn ba qua nhiều nước tư bản và thuộc địa, tham gia các tổ chức yêu nước tiến bộ, tìm thấy con đường cứu nước đúng đắn qua Luận cương Lênin."
            }
        },
        "yeu_sach_1919": {
            id: "yeu_sach_1919",
            chapterId: 1,
            name: "Bản Yêu Sách Của Nhân Dân An Nam",
            year: "18/6/1919",
            location: "Hội nghị Versailles (Pháp)",
            badge: "Tiếng Chuông Thức Tỉnh",
            historicalContext: "Thay mặt Hội những người Việt Nam yêu nước, lấy tên là Nguyễn Ái Quốc, Người gửi Bản Yêu sách 8 điểm đến Hội nghị hòa bình Versailles đòi các quyền tự do, bình đẳng, ân xá tù chính trị cho nhân dân An Nam.",
            coreIdea: "Đánh dấu lần đầu tiên tiếng nói chính nghĩa của dân tộc Việt Nam vang dội trên trường quốc tế. Qua việc bản Yêu sách bị các cường quốc phớt lờ, Người rút ra bài học cốt lõi: 'Muốn được giải phóng, các dân tộc chỉ có thể trông cậy vào lực lượng của bản thân mình'.",
            famousQuote: "Chủ nghĩa Uyn-xơn chỉ là một trò bịp bợm lớn... Muốn giải phóng, chỉ có thể dựa vào chính sức mình!",
            quiz: {
                question: "Bản 'Yêu sách của nhân dân An Nam' do Nguyễn Ái Quốc thay mặt Hội những người Việt Nam yêu nước gửi tới Hội nghị Versailles (18/6/1919) gồm bao nhiêu điểm?",
                options: [
                    "6 điểm",
                    "10 điểm",
                    "8 điểm",
                    "12 điểm"
                ],
                correctIndex: 2,
                explanation: "Bản Yêu sách gồm 8 điểm đòi quyền tự do, dân chủ, bình đẳng cho nhân dân An Nam, đánh dấu sự xuất hiện chính thức lần đầu tiên của cái tên Nguyễn Ái Quốc trên trường quốc tế."
            }
        },
        "luan_cuong_lenin": {
            id: "luan_cuong_lenin",
            chapterId: 2,
            name: "Sơ Thảo Lần Thứ Nhất Luận Cương Của Lênin",
            year: "Tháng 7/1920",
            location: "Báo L'Humanité (Paris, Pháp)",
            badge: "Ánh Sáng Cứu Nước",
            historicalContext: "Nguyễn Ái Quốc đọc bản 'Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa' của V.I.Lênin đăng trên báo Nhân Đạo. Luận cương đã giải đáp trọn vẹn những băn khoăn trăn trở bao năm của Người.",
            coreIdea: "Khẳng định bước ngoặt quyết định trong tư tưởng Hồ Chí Minh: từ chủ nghĩa yêu nước đến với chủ nghĩa Mác - Lênin. Xác định con đường giải phóng dân tộc Việt Nam: 'Muốn cứu nước và giải phóng dân tộc không có con đường nào khác con đường cách mạng vô sản'.",
            famousQuote: "Luận cương của Lênin làm cho tôi rất cảm động, phấn khởi, sáng tỏ, tin tưởng biết bao! Tôi vui mừng đến phát khóc lên: Hỡi đồng bào bị đọa đày đau khổ! Đây là cái cần thiết cho chúng ta, đây là con đường giải phóng chúng ta!",
            quiz: {
                question: "Nguyễn Ái Quốc bắt gặp 'Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa' của V.I. Lênin vào thời gian nào và ở đâu?",
                options: [
                    "Tháng 7/1920 - đăng trên báo L'Humanité (Nhân đạo) tại Pháp",
                    "Tháng 12/1920 - tại Đại hội Tours (Pháp)",
                    "Tháng 6/1923 - tại Moskva (Liên Xô)",
                    "Tháng 7/1925 - tại Quảng Châu (Trung Quốc)"
                ],
                correctIndex: 0,
                explanation: "Tháng 7/1920, khi đọc Luận cương của Lênin trên báo L'Humanité, Nguyễn Ái Quốc tìm thấy con đường cứu nước chân chính: 'Muốn cứu nước và giải phóng dân tộc không có con đường nào khác con đường cách mạng vô sản'."
            }
        },
        "le_paria": {
            id: "le_paria",
            chapterId: 2,
            name: "Báo Le Paria & Bản Án Chế Độ Thực Dân",
            year: "1922 - 1925",
            location: "Paris (Pháp) - Moskva (Liên Xô)",
            badge: "Vũ Khí Báo Chí",
            historicalContext: "Nguyễn Ái Quốc cùng các nhà hoạt động thuộc địa sáng lập Hội Liên hiệp Thuộc địa và xuất bản báo Le Paria (Người cùng khổ). Năm 1925, tác phẩm 'Bản án chế độ thực dân Pháp' xuất bản tại Paris vạch trần tội ác dã man của chủ nghĩa thực dân.",
            coreIdea: "Tư tưởng về liên minh chiến đấu giữa các dân tộc thuộc địa và giai cấp vô sản quốc tế. Hồ Chí Minh coi báo chí cách mạng là vũ khí sắc bén để thức tỉnh quần chúng, truyền bá tư tưởng độc lập, tự do.",
            famousQuote: "Chủ nghĩa tư bản là một con đỉa hai vòi: một vòi cắm vào giai cấp vô sản ở chính quốc, một vòi cắm vào các dân tộc thuộc địa.",
            quiz: {
                question: "Tờ báo 'Le Paria' (Người cùng khổ) do Nguyễn Ái Quốc đồng sáng lập và làm chủ nhiệm kiêm chủ bút được xuất bản số đầu tiên tại đâu?",
                options: [
                    "Quảng Châu (Trung Quốc)",
                    "Moskva (Liên Xô)",
                    "Paris (Pháp)",
                    "Hương Cảng (Hồng Kông)"
                ],
                correctIndex: 2,
                explanation: "Báo Le Paria ra số đầu tiên ngày 1/4/1922 tại thủ đô Paris (Pháp), là cơ quan ngôn luận của Hội Liên hiệp thuộc địa nhằm vạch trần tội ác thực dân và thức tỉnh các dân tộc bị áp bức."
            }
        },
        "duong_kach_menh": {
            id: "duong_kach_menh",
            chapterId: 2,
            name: "Tác Phẩm 'Đường Kách Mệnh'",
            year: "1927",
            location: "Quảng Châu, Trung Quốc",
            badge: "Cẩm Nang Cách Mạng",
            historicalContext: "Tại Quảng Châu, Nguyễn Ái Quốc mở các lớp huấn luyện chính trị cho thanh niên Việt Nam yêu nước. Các bài giảng được Bộ Tuyên truyền của Hội Liên hiệp các dân tộc bị áp bức xuất bản thành cuốn 'Đường Kách Mệnh'.",
            coreIdea: "Chuẩn bị trực tiếp về tư tưởng, lý luận và tổ chức cho sự ra đời của Đảng Cộng sản Việt Nam. Khẳng định: Cách mệnh trước hết phải có Đảng lãnh đạo, phải lấy chủ nghĩa Mác - Lênin làm nòng cốt, và người cách mệnh phải rèn luyện đạo đức tiên phong.",
            famousQuote: "Đảng muốn vững thì phải có chủ nghĩa làm cốt, trong đảng ai ai cũng phải hiểu, ai ai cũng phải theo chủ nghĩa ấy. Đảng mà không có chủ nghĩa cũng như người không có trí khôn, tàu không có bàn chỉ nam.",
            quiz: {
                question: "Tác phẩm 'Đường Kách mệnh' tập hợp các bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện chính trị ở Quảng Châu được xuất bản lần đầu tiên vào năm nào?",
                options: [
                    "Năm 1925",
                    "Năm 1927",
                    "Năm 1930",
                    "Năm 1941"
                ],
                correctIndex: 1,
                explanation: "Đường Kách mệnh xuất bản năm 1927 tại Quảng Châu, là cuốn cẩm nang lý luận chuẩn bị trực tiếp về tư tưởng, chính trị và tổ chức cho sự ra đời của Đảng Cộng sản Việt Nam."
            }
        },
        "cuong_linh_1930": {
            id: "cuong_linh_1930",
            chapterId: 3,
            name: "Cương Lĩnh Chính Trị Đầu Tiên Của Đảng",
            year: "3/2/1930",
            location: "Hương Cảng (Cửu Long, Hong Kong)",
            badge: "Hợp Nhất Lịch Sử",
            historicalContext: "Đầu năm 1930, trước nguy cơ chia rẽ của 3 tổ chức cộng sản trong nước, Nguyễn Ái Quốc với tư cách phái viên Quốc tế Cộng sản đã triệu tập và chủ trì Hội nghị hợp nhất, sáng lập Đảng Cộng sản Việt Nam và soạn thảo Cương lĩnh chính trị đầu tiên.",
            coreIdea: "Xác định đường lối chiến lược: 'Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản'. Đặt nhiệm vụ chống đế quốc, giành độc lập dân tộc lên hàng đầu. Xác định lực lượng cách mạng là toàn thể nhân dân yêu nước (công nông là gốc).",
            famousQuote: "Đảng là đội tiên phong của vô sản giai cấp, phải thu phục cho được đại bộ phận giai cấp mình... và lôi kéo tiểu tư sản, trí thức, trung nông về phía vô sản.",
            quiz: {
                question: "Cương lĩnh chính trị đầu tiên của Đảng (đầu năm 1930) do Nguyễn Ái Quốc soạn thảo xác định đường lối chiến lược của cách mạng Việt Nam là gì?",
                options: [
                    "Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản",
                    "Tiến hành ngay cách mạng xã hội chủ nghĩa bỏ qua giai đoạn tư bản chủ nghĩa",
                    "Chỉ tập trung đấu tranh đòi cải cách dân sinh trong khuôn khổ pháp luật thực dân",
                    "Đánh đổ phong kiến địa chủ trước, đánh đổ đế quốc thực dân sau"
                ],
                correctIndex: 0,
                explanation: "Cương lĩnh chính trị đầu tiên do Nguyễn Ái Quốc soạn thảo đã xác định đúng đắn mục tiêu chiến lược: 'Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản'."
            }
        },
        "cot_moc_108": {
            id: "cot_moc_108",
            chapterId: 3,
            name: "Cột Mốc 108 & Trở Về Đất Mẹ Pác Bó",
            year: "28/1/1941",
            location: "Pác Bó, Hà Quảng, Cao Bằng",
            badge: "30 Năm Bôn Ba",
            historicalContext: "Sau 30 năm bôn ba khắp năm châu bốn biển, ngày 28/1/1941, Người vượt qua cột mốc 108 trên biên giới Việt - Trung trở về Tổ quốc. Tại hang Pác Bó, Người sống giản dị, dịch Lịch sử Đảng Cộng sản Liên Xô và chỉ đạo phong trào cách mạng cả nước.",
            coreIdea: "Tư tưởng chuyển hướng chiến lược: Đặt quyền lợi dân tộc lên trên hết, thành lập Mặt trận Việt Minh nhằm thực hiện đại đoàn kết toàn dân, chuẩn bị khởi nghĩa vũ trang giành chính quyền.",
            famousQuote: "Bác đã về đây, Tổ quốc ơi! / Nhớ thương hòn đất ấm hơi Người / Ba mươi năm ấy, chân không nghỉ / Mà đến bây giờ mới tới nơi! (Thơ Tố Hữu)",
            quiz: {
                question: "Ngày 28/1/1941, sau 30 năm bôn ba tìm đường cứu nước, lãnh tụ Nguyễn Ái Quốc đã trở về Tổ quốc trực tiếp lãnh đạo cách mạng qua cột mốc biên giới nào?",
                options: [
                    "Cột mốc số 0 (Hà Giang)",
                    "Cột mốc số 13 (Lạng Sơn)",
                    "Cột mốc số 108 (tại Pác Bó, Cao Bằng)",
                    "Cột mốc Tân Trào (Tuyên Quang)"
                ],
                correctIndex: 2,
                explanation: "Ngày 28/1/1941, Bác vượt qua cột mốc 108 trên biên giới Việt - Trung (xã Trường Hà, huyện Hà Quảng, tỉnh Cao Bằng) để trở về đất mẹ trực tiếp lãnh đạo cách mạng."
            }
        },
        "doi_tuyentruyen_1944": {
            id: "doi_tuyentruyen_1944",
            chapterId: 3,
            name: "Chỉ Thị Thành Lập Đội VN Tuyên Truyền Giải Phóng Quân",
            year: "22/12/1944",
            location: "Khu rừng Trần Hưng Đạo (Cao Bằng)",
            badge: "Lực Lượng Vũ Trang",
            historicalContext: "Hồ Chí Minh ra chỉ thị thành lập Đội Việt Nam Tuyên truyền Giải phóng quân (tiền thân của Quân đội nhân dân Việt Nam anh hùng), do đồng chí Võ Nguyên Giáp chỉ huy với 34 chiến sĩ ban đầu.",
            coreIdea: "Tư tưởng Hồ Chí Minh về xây dựng lực lượng vũ trang nhân dân: 'Chính trị trọng hơn quân sự', quân đội từ nhân dân mà ra, vì nhân dân mà chiến đấu; kết hợp đấu tranh chính trị với đấu tranh vũ trang.",
            famousQuote: "Tên nó là Đội Việt Nam Tuyên truyền Giải phóng quân, nghĩa là chính trị trọng hơn quân sự. Nó là đội tuyên truyền... Tuy lúc đầu quy mô nhỏ, nhưng tiền đồ của nó rất vẻ vang.",
            quiz: {
                question: "Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập ngày 22/12/1944 theo chỉ thị của ai, ban đầu có bao nhiêu đội viên?",
                options: [
                    "Theo chỉ thị của Trường Chinh, gồm 50 đội viên do đồng chí Hoàng Văn Thái chỉ huy",
                    "Theo chỉ thị của Hồ Chí Minh, gồm 34 đội viên do đồng chí Võ Nguyên Giáp chỉ huy",
                    "Theo chỉ thị của Tổng bộ Việt Minh, gồm 100 đội viên du kích",
                    "Theo chỉ thị của Trung ương Đảng, gồm 12 đội viên cứu quốc"
                ],
                correctIndex: 1,
                explanation: "Ngày 22/12/1944, tại rừng Trần Hưng Đạo (Cao Bằng), Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập theo chỉ thị của lãnh tụ Hồ Chí Minh gồm 34 chiến sĩ, do đồng chí Võ Nguyên Giáp chỉ huy."
            }
        },
        "nhat_phap_1945": {
            id: "nhat_phap_1945",
            chapterId: 4,
            name: "Dự Đoán Thời Cơ Cách Mạng 1945",
            year: "Tháng 3/1945",
            location: "Tân Trào, Tuyên Quang",
            badge: "Nắm Bắt Thời Cơ",
            historicalContext: "Ngày 9/3/1945, Nhật đảo chính Pháp. Đảng ta ban hành Chỉ thị lịch sử 'Nhật - Pháp bắn nhau và hành động của chúng ta', phát động cao trào kháng Nhật cứu nước làm tiền đề cho cuộc Tổng khởi nghĩa.",
            coreIdea: "Nghệ thuật dự báo và chớp thời cơ cách mạng của Hồ Chí Minh: Khi thời cơ đến thì dù phải hy sinh đến đâu cũng phải kiên quyết giành cho được độc lập.",
            famousQuote: "Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập!",
            quiz: {
                question: "Câu nói nổi tiếng: 'Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập' được Bác Hồ căn dặn đồng chí Võ Nguyên Giáp vào thời điểm lịch sử nào?",
                options: [
                    "Chiến dịch Điện Biên Phủ năm 1954",
                    "Trước khi ký Hiệp định Sơ bộ ngày 6/3/1946",
                    "Lời kêu gọi Toàn quốc kháng chiến tháng 12/1946",
                    "Hội nghị Tân Trào chuẩn bị Tổng khởi nghĩa Tháng Tám năm 1945"
                ],
                correctIndex: 3,
                explanation: "Tháng 8/1945, khi đang lâm bệnh nặng tại lán Nà Nưa (Tân Trào), Bác đã căn dặn đồng chí Võ Nguyên Giáp thể hiện quyết tâm sắt đá phải chớp thời cơ ngàn năm có một để giành độc lập."
            }
        },
        "tong_khoi_nghia": {
            id: "tong_khoi_nghia",
            chapterId: 4,
            name: "Thư Kêu Gọi Tổng Khởi Nghĩa Tháng Tám",
            year: "Tháng 8/1945",
            location: "Cả nước",
            badge: "Toàn Dân Đứng Lên",
            historicalContext: "Phát xít Nhật đầu hàng Đồng minh vô điều kiện. Hồ Chí Minh gửi thư kêu gọi đồng bào cả nước: 'Giờ quyết định cho vận mệnh dân tộc ta đã đến. Toàn quốc đồng bào hãy đứng dậy đem sức ta mà tự giải phóng cho ta!'.",
            coreIdea: "Tư tưởng phát huy sức mạnh khối Đại đoàn kết toàn dân tộc, kết hợp sức mạnh dân tộc với sức mạnh thời đại, kiên quyết tự lực cánh sinh để làm chủ vận mệnh của mình.",
            famousQuote: "Hỡi đồng bào yêu quý! Giờ quyết định cho vận mệnh dân tộc ta đã đến. Toàn quốc đồng bào hãy đứng dậy đem sức ta mà tự giải phóng cho ta!",
            quiz: {
                question: "Khẩu hiệu hành động nổi tiếng: 'Toàn quốc đồng bào hãy đứng dậy đem sức ta mà tự giải phóng cho ta!' được Chủ tịch Hồ Chí Minh nêu ra trong văn kiện nào?",
                options: [
                    "Thư kêu gọi Tổng khởi nghĩa Tháng Tám năm 1945",
                    "Bản Tuyên ngôn Độc lập ngày 2/9/1945",
                    "Lời kêu gọi đồng bào và chiến sĩ cả nước năm 1966",
                    "Báo cáo chính trị tại Đại hội II của Đảng năm 1951"
                ],
                correctIndex: 0,
                explanation: "Tháng 8/1945, trong Thư kêu gọi Tổng khởi nghĩa, Hồ Chí Minh kêu gọi toàn dân phát huy tinh thần độc lập tự chủ, dựa vào sức mạnh đại đoàn kết dân tộc để tự giải phóng cho mình."
            }
        },
        "tuyen_ngon_1945": {
            id: "tuyen_ngon_1945",
            chapterId: 4,
            name: "Bản Tuyên Ngôn Độc Lập 2/9/1945",
            year: "2/9/1945",
            location: "Quảng trường Ba Đình (Hà Nội)",
            badge: "Nước VN Dân Chủ Cộng Hòa",
            historicalContext: "Tại Quảng trường Ba Đình lịch sử, trước hàng chục vạn đồng bào, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc bản Tuyên ngôn Độc lập, tuyên bố với quốc dân và toàn thế giới về sự ra đời của nước Việt Nam Dân chủ Cộng hòa.",
            coreIdea: "Đỉnh cao của tư tưởng Hồ Chí Minh về quyền con người và quyền dân tộc: Khéo léo nâng quyền tự nhiên của con người (trong Tuyên ngôn Độc lập Mỹ 1776 và Tuyên ngôn Nhân quyền Pháp 1789) lên thành Quyền độc lập tự do của tất cả các dân tộc trên thế giới.",
            famousQuote: "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy!",
            quiz: {
                question: "Trong bản 'Tuyên ngôn Độc lập' ngày 2/9/1945, Chủ tịch Hồ Chí Minh đã trích dẫn những câu bất hủ từ các bản tuyên ngôn lịch sử nào của thế giới?",
                options: [
                    "Tuyên ngôn của Đảng Cộng sản năm 1848 của C.Mác và Ph.Ăngghen",
                    "Tuyên ngôn Độc lập năm 1776 của Mỹ và Tuyên ngôn Nhân quyền, Dân quyền năm 1789 của Pháp",
                    "Tuyên ngôn Quốc tế Nhân quyền năm 1948 của Liên Hợp Quốc",
                    "Tuyên ngôn Giải phóng Nô lệ năm 1863 của Tổng thống Abraham Lincoln"
                ],
                correctIndex: 1,
                explanation: "Chủ tịch Hồ Chí Minh đã trích dẫn Tuyên ngôn Độc lập 1776 của Mỹ và Tuyên ngôn Nhân quyền & Dân quyền 1789 của Pháp, khẳng định quyền bình đẳng và độc lập tự do thiêng liêng của mọi dân tộc trên thế giới."
            }
        }
    },

    // Hàm lấy danh sách tài liệu theo chương
    getDocsForChapter(chapterId) {
        return Object.values(this.documents).filter(doc => doc.chapterId === chapterId);
    },

    // Hàm lấy tài liệu theo id
    getDocument(docId) {
        return this.documents[docId] || null;
    }
};

