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
                question: "Vì sao người thanh niên Nguyễn Tất Thành không đi sang Nhật Bản như phong trào Đông Du mà lại quyết định sang phương Tây năm 1911?",
                options: [
                    "Vì muốn tìm hiểu bản chất của khẩu hiệu 'Tự do - Bình đẳng - Bác ái' tại chính mẫu quốc rồi trở về giúp đồng bào",
                    "Vì được sự tài trợ chi phí học tập của chính quyền thực dân Pháp",
                    "Vì Nhật Bản lúc bấy giờ từ chối nhận du học sinh người Việt Nam",
                    "Vì muốn tìm một công việc ổn định để định cư lâu dài ở châu Âu"
                ],
                correctIndex: 0,
                explanation: "Nguyễn Tất Thành khâm phục các bậc tiền bối nhưng không hoàn toàn tán thành đường lối của họ. Người muốn tận mắt thấy điều gì ẩn giấu sau những từ 'Tự do - Bình đẳng - Bác ái' của Pháp để tìm ra con đường cứu nước đúng đắn."
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
                question: "Hoạt động của Nguyễn Ái Quốc trong tổ chức người Việt yêu nước tại Pháp thể hiện tư tưởng nào sau đây?",
                options: [
                    "Tư tưởng ỷ lại vào sự can thiệp của các cường quốc phương Tây",
                    "Tư tưởng đại đoàn kết kiều bào và ý thức tổ chức lực lượng cách mạng",
                    "Tư tưởng cải lương, thỏa hiệp với chính sách khai thác thuộc địa",
                    "Tư tưởng phát triển thương mại đơn thuần cho người Việt ở nước ngoài"
                ],
                correctIndex: 1,
                explanation: "Đây là tiền đề quan trọng hình thành tư tưởng Đại đoàn kết toàn dân tộc của Hồ Chí Minh: tập hợp mọi lực lượng yêu nước, đoàn kết trong và ngoài nước thành một khối thống nhất."
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
                question: "Bài học lịch sử sâu sắc nhất Nguyễn Ái Quốc rút ra sau khi Bản Yêu sách 8 điểm bị bác bỏ tại Versailles là gì?",
                options: [
                    "Cần tiếp tục chờ đợi sự khoan hồng và ban ơn từ các nước đế quốc thắng trận",
                    "Muốn được giải phóng, dân tộc bị áp bức chỉ có thể dựa vào chính lực lượng của bản thân mình",
                    "Từ bỏ con đường đấu tranh chính trị để chuyển hoàn toàn sang kinh tế",
                    "Hợp tác toàn diện với chính quyền thực dân để xin cải cách từng bước"
                ],
                correctIndex: 1,
                explanation: "Hội nghị Versailles dạy cho Nguyễn Ái Quốc bài học: các cường quốc đế quốc chỉ bảo vệ lợi ích thực dân của họ. Độc lập, tự do không thể van xin mà phải tự giành lấy bằng sức mạnh của toàn dân."
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
                question: "Sự kiện đọc Luận cương của Lênin (7/1920) có ý nghĩa quyết định như thế nào đối với tư tưởng của Nguyễn Ái Quốc?",
                options: [
                    "Đánh dấu bước chuyển biến từ người yêu nước trở thành chiến sĩ cộng sản, tìm thấy con đường cứu nước đúng đắn",
                    "Giúp Người quyết định ở lại Pháp hoạt động công đoàn lâu dài",
                    "Làm cho Người từ bỏ hoàn toàn phương pháp đấu tranh cách mạng",
                    "Đưa Người trở thành lãnh đạo cao nhất của Quốc tế Cộng sản"
                ],
                correctIndex: 0,
                explanation: "Luận cương Lênin đã chỉ rõ mối quan hệ mật thiết giữa cách mạng giải phóng dân tộc ở thuộc địa với cách mạng vô sản ở chính quốc, giúp Nguyễn Ái Quốc tìm thấy kim chỉ nam cho sự nghiệp cứu nước."
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
                question: "Tờ báo 'Le Paria' (Người cùng khổ) do Nguyễn Ái Quốc làm chủ nhiệm kiêm chủ bút nhằm mục đích chính gì?",
                options: [
                    "Kêu gọi các nước đế quốc tài trợ cho người nghèo ở thuộc địa",
                    "Vạch trần tội ác thực dân, đoàn kết các dân tộc thuộc địa và truyền bá tư tưởng cách mạng",
                    "Đăng tải các tác phẩm văn học lãng mạn phương Tây",
                    "Báo cáo tình hình thương mại giữa Pháp và các nước Đông Dương"
                ],
                correctIndex: 1,
                explanation: "Le Paria là diễn đàn đấu tranh trực diện, kết nối những người cùng khổ khắp châu Á, châu Phi, Mỹ Latinh dưới ngọn cờ chống đế quốc thực dân."
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
                question: "Theo tác phẩm 'Đường Kách Mệnh' (1927), điều kiện tiên quyết hàng đầu để cách mạng thắng lợi là gì?",
                options: [
                    "Phải có nhiều tiền bạc và vũ khí tối tân từ nước ngoài",
                    "Cách mệnh trước hết phải có Đảng cách mệnh để trong thì vận động và tổ chức dân chúng, ngoài thì liên lạc với vô sản quốc tế",
                    "Chỉ cần lòng dũng cảm của các cá nhân anh hùng mà không cần tổ chức",
                    "Chờ đợi các cuộc khủng hoảng kinh tế tự phá vỡ chủ nghĩa tư bản"
                ],
                correctIndex: 1,
                explanation: "Nguyễn Ái Quốc nhấn mạnh vai trò quyết định của Đảng Cộng sản với tư cách là đội tiên phong của giai cấp công nhân và nhân dân lao động, lấy chủ nghĩa Mác - Lênin làm kim chỉ nam."
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
                question: "Cương lĩnh chính trị đầu tiên của Đảng (2/1930) do Nguyễn Ái Quốc soạn thảo đã giải quyết đúng đắn mối quan hệ nào?",
                options: [
                    "Giải quyết sáng tạo mối quan hệ giữa nhiệm vụ Dân tộc và Giai cấp, đặt giải phóng dân tộc lên hàng đầu",
                    "Ưu tiên tuyệt đối đấu tranh giai cấp, xem nhẹ nhiệm vụ chống đế quốc",
                    "Chỉ vận động công nhân nhà máy, loại trừ hoàn toàn các tầng lớp trí thức và nông dân",
                    "Chủ trương liên minh quân sự với các cường quốc đế quốc"
                ],
                correctIndex: 0,
                explanation: "Đây là sự vận dụng sáng tạo chủ nghĩa Mác - Lênin vào hoàn cảnh thuộc địa nửa phong kiến: kẻ thù lớn nhất là đế quốc thực dân, vì vậy độc lập dân tộc là nhiệm vụ cấp bách số một của toàn thể đồng bào."
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
                question: "Sự kiện Nguyễn Ái Quốc về nước tại Pác Bó (28/1/1941) mang ý nghĩa lịch sử gì đối với phong trào cách mạng Việt Nam?",
                options: [
                    "Chấm dứt thời kỳ hoạt động bí mật của các chiến sĩ cộng sản",
                    "Đánh dấu sự lãnh đạo trực tiếp của Lãnh tụ Hồ Chí Minh đối với cách mạng trong nước, chuẩn bị cho Tổng khởi nghĩa",
                    "Thực hiện ký kết hiệp ước hòa bình với chính phủ thực dân Pháp",
                    "Bắt đầu công cuộc cải cách ruộng đất trên quy mô toàn quốc"
                ],
                correctIndex: 1,
                explanation: "Việc Người trực tiếp về nước lãnh đạo giúp phong trào cách mạng Việt Nam có người cầm lái vĩ đại, kịp thời đón thời cơ quốc tế và trong nước để tiến tới thắng lợi Cách mạng Tháng Tám."
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
                question: "Trong bản chỉ thị thành lập Đội VN Tuyên truyền Giải phóng quân (1944), Bác Hồ đã nhấn mạnh nguyên tắc căn bản nào?",
                options: [
                    "Chính trị trọng hơn quân sự, coi trọng công tác tuyên truyền vận động quần chúng nhân dân",
                    "Tập trung mua sắm vũ khí hạng nặng trước khi xây dựng cơ sở lòng dân",
                    "Chỉ tuyển chọn quân nhân chuyên nghiệp, không tiếp nhận du kích địa phương",
                    "Chỉ tiến hành chiến tranh quy ước, không áp dụng lối đánh du kích"
                ],
                correctIndex: 0,
                explanation: "Bác khẳng định quân đội cách mạng phải dựa vào dân, giác ngộ dân, 'chính trị trọng hơn quân sự'. Khi lòng dân đã hướng về cách mạng thì sức mạnh quân sự sẽ nhân lên gấp bội."
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
                question: "Câu nói bất hủ 'Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập' được Bác Hồ căn dặn trong thời điểm lịch sử nào?",
                options: [
                    "Hội nghị Tân Trào chuẩn bị Tổng khởi nghĩa Tháng Tám năm 1945",
                    "Chiến dịch Điện Biên Phủ năm 1954",
                    "Hiệp định Genève năm 1954",
                    "Kháng chiến chống Mỹ cứu nước năm 1968"
                ],
                correctIndex: 0,
                explanation: "Khi Bác ốm nặng tại lán Nà Nưa (Tân Trào), Người đã dặn dò đồng chí Võ Nguyên Giáp thể hiện ý chí gang thép và quyết tâm sắt đá giành độc lập cho Tổ quốc khi thời cơ ngàn năm có một đã tới."
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
                question: "Khẩu hiệu 'Đem sức ta mà tự giải phóng cho ta' trong thư kêu gọi Tổng khởi nghĩa của Bác thể hiện sâu sắc quan điểm nào?",
                options: [
                    "Tinh thần độc lập, tự chủ, tự lực cánh sinh dựa trên sức mạnh đại đoàn kết toàn dân tộc",
                    "Sự cô lập hoàn toàn phong trào cách mạng trong nước với thế giới",
                    "Lời cảnh báo trước nguy cơ thất bại của cách mạng",
                    "Đề cao chủ nghĩa cá nhân trong chiến đấu"
                ],
                correctIndex: 0,
                explanation: "Hồ Chí Minh luôn quán triệt nguyên lý: sức mạnh nội lực của dân tộc là nhân tố quyết định nhất. Ngoại viện chỉ phát huy tác dụng khi nội lực tự thân đủ mạnh mẽ."
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
                question: "Điểm cống hiến lý luận vĩ đại của Chủ tịch Hồ Chí Minh trong phần mở đầu bản Tuyên ngôn Độc lập 2/9/1945 là gì?",
                options: [
                    "Trích dẫn các bản Tuyên ngôn của Mỹ và Pháp để phát triển sáng tạo từ 'Quyền con người' thành 'Quyền dân tộc thiêng liêng'",
                    "Tuyên bố xóa bỏ hoàn toàn quyền sở hữu tư nhân về tư liệu sản xuất",
                    "Đề nghị các cường quốc quốc tế đến giám sát nền độc lập Việt Nam",
                    "Phủ nhận sạch trơn các giá trị văn minh phương Tây tiến bộ"
                ],
                correctIndex: 0,
                explanation: "Hồ Chí Minh đã phát triển sáng tạo: Tất cả mọi người sinh ra đều có quyền bình đẳng -> suy rộng ra là Tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do."
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

