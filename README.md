# Theo Dấu Chân Người - Game 2D Sáng Tạo Môn Tư Tưởng Hồ Chí Minh

> **Tên dự án:** Theo Dấu Chân Người (In the Footsteps of the Leader)  
> **Thể loại:** 2D Platformer / Phiêu lưu Lịch sử & Tư tưởng Hồ Chí Minh  
> **Nền tảng:** Web Game (HTML5 Canvas + Vanilla JavaScript) - Chạy trực tiếp trên mọi trình duyệt, không cần cài đặt.

---

## 🌟 Giới thiệu dự án

Game được thiết kế đặc biệt dành riêng cho **Bài tập sáng tạo môn Tư tưởng Hồ Chí Minh** tại các trường Đại học/Cao đẳng.  
Người chơi hóa thân vào nhân vật người thanh niên yêu nước **Nguyễn Tất Thành - Nguyễn Ái Quốc - Hồ Chí Minh**, trải qua 4 chặng đường lịch sử quan trọng trong hành trình 30 năm tìm đường cứu nước và lãnh đạo cách mạng Việt Nam.

Trong suốt cuộc hành trình, người chơi phải vượt qua địa hình hiểm trở, khéo léo né tránh sự bủa vây của mật thám và cảnh sát thực dân, thu thập các di sản văn kiện lịch sử quý giá, giải các câu đố trắc nghiệm tri thức để hiểu sâu sắc về hệ thống Tư tưởng Hồ Chí Minh.

---

## 🎮 Các Màn Chơi (4 Chương Lịch Sử)

1. **Chương 1: Bến Cảng Sài Gòn & Paris (1911 - 1919)**
   - *Bối cảnh:* Đêm bến cảng Nhà Rồng (1911), con tàu Amiral Latouche-Tréville, Paris hoa lệ nhưng đầy mật thám bủa vây.
   - *Văn kiện thu thập:* 
     - Vé tàu bến Nhà Rồng (1911) - Khởi đầu cuộc hành trình vĩ đại.
     - Thẻ Hội những người An Nam yêu nước tại Pháp.
     - Bản "Yêu sách của nhân dân An Nam" (1919 - 8 điểm gửi Hội nghị Versailles).

2. **Chương 2: Luận Cương Lênin & Ngọn Lửa Báo Chí (1920 - 1927)**
   - *Bối cảnh:* Đại hội Tours (Pháp 1920), mùa đông Moskva tuyết trắng (1923), lớp học cách mạng tại Quảng Châu (1925).
   - *Văn kiện thu thập:*
     - Sơ thảo Luận cương Lênin (7/1920) - Tìm thấy con đường giải phóng dân tộc.
     - Báo *Le Paria* (Người cùng khổ - 1922) & Tác phẩm *Bản án chế độ thực dân Pháp* (1925).
     - Cuốn sách *Đường Kách Mệnh* (1927) - Chuẩn bị lý luận cho sự ra đời của Đảng.

3. **Chương 3: Hội Nghị Hương Cảng & Trở Về Pác Bó (1930 - 1941)**
   - *Bối cảnh:* Hong Kong mưa gió (1930), Vượt qua sự truy lùng của cảnh sát, trở về cột mốc 108 rừng núi Pác Bó (Cao Bằng), suối Lê-nin và núi Các Mác.
   - *Văn kiện thu thập:*
     - Cương lĩnh chính trị đầu tiên của Đảng (3/2/1930).
     - Cột mốc 108 - Bác trở về Tổ quốc (28/1/1941) sau 30 năm bôn ba.
     - Chỉ thị thành lập Đội VN Tuyên truyền Giải phóng quân (1944).

4. **Chương 4: Mùa Thu Độc Lập - Ba Đình Rực Rỡ (1945)**
   - *Bối cảnh:* Hà Nội những ngày sục sôi Cách mạng Tháng Tám và Lễ Độc lập 2/9 tại Quảng trường Ba Đình.
   - *Văn kiện thu thập:*
     - Lời kêu gọi Tổng khởi nghĩa Cách mạng Tháng Tám.
     - Bản Tuyên ngôn Độc lập (2/9/1945) - Khai sinh nước Việt Nam Dân chủ Cộng hòa.
     - Chân lý tối thượng: "Không có gì quý hơn độc lập, tự do!"

---

## 🕹️ Cách điều khiển (Controls)

- **A / D** hoặc **Phím mũi tên Trái / Phải**: Di chuyển nhân vật.
- **W / Phím mũi tên Lên / Phím Space (Cách)**: Nhảy (Hỗ trợ **Nhảy đúp / Double Jump**).
- **S / Phím mũi tên Xuống**: Cúi / Trượt người để né tầm nhìn nón đèn tuần tra của mật thám.
- **Thùng gỗ / Bụi cây**: Vị trí nấp an toàn (Khi nấp, mật thám không thể phát hiện bạn).
- **Trên điện thoại / Tablet**: Tự động hỗ trợ phím điều khiển cảm ứng ảo trên màn hình.

---

## 🚀 Hướng dẫn khởi chạy

Chỉ cần mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).  
Hoặc chạy máy chủ phát triển nội bộ bằng lệnh:
```bash
# Bằng Python (nếu có):
python server.py

# Hoặc dùng Node.js:
npx serve .
```
Truy cập: `http://localhost:8000`

---

## ✨ Điểm sáng tạo & Giá trị học thuật cho bài tập

1. **Gắn liền bài học với thực tế tương tác:** Thay vì chỉ đọc tài liệu khô khan, sinh viên tương tác trực tiếp với từng văn kiện, hiểu rõ bối cảnh và ý nghĩa cốt lõi của môn Tư tưởng Hồ Chí Minh.
2. **Hệ thống Bảo tàng Di sản số (In-game Museum):** Có thể tra cứu lại toàn bộ kiến thức, trích dẫn bất kỳ lúc nào để thuyết trình trước lớp.
3. **m thanh Procedural Synthesizer:** m thanh hào hùng và hiệu ứng 8-bit sống động tự sinh qua Web Audio API, không lo thiếu file hoặc lỗi CORS khi nộp bài.
4. **Tùy biến thông tin nhóm:** Có sẵn bảng điền Thông tin Sinh viên, Lớp, Giảng viên hướng dẫn trực tiếp trong game.

