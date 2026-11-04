# HƯỚNG DẪN THÊM HÌNH ẢNH NHÂN VẬT TỰ CHỌN (CUSTOM SPRITE)

Thư mục này cho phép bạn thay thế đồ họa nhân vật mặc định bằng bất kỳ hình ảnh nào tải từ trên mạng về.

---

## 1. Các file ảnh cần chuẩn bị (Định dạng .PNG nền trong suốt)

Bạn chỉ cần lưu các file ảnh với đúng tên sau vào thư mục này (`assets/player/`):

1. **`idle.png`** *(Bắt buộc)*: Tư thế nhân vật đứng yên.
2. **`run.png`** *(Tùy chọn)*: Tư thế nhân vật đang chạy.
3. **`jump.png`** *(Tùy chọn)*: Tư thế nhân vật đang nhảy lên không trung.
4. **`crouch.png`** *(Tùy chọn)*: Tư thế nhân vật đang cúi mình / trượt.

> **Lưu ý:** Nếu bạn chỉ có 1 tấm ảnh duy nhất, chỉ cần đặt tên nó là **`idle.png`**, game sẽ tự động dùng ảnh đó cho mọi hành động!

---

## 2. Kích thước khuyến nghị

* Kích thước lý tưởng: **32x48 pixel** hoặc **64x96 pixel** (hoặc bất kỳ tỷ lệ dọc nào xấp xỉ 1 : 1.5).
* Định dạng: **PNG trong suốt (Transparent background)** để không bị lộ viền trắng khi di chuyển.

---

## 3. Các trang web tải Sprite nhân vật 2D miễn phí chất lượng cao

1. **Itch.io (Miễn phí & nhiều nhất):**
   * Truy cập: [https://itch.io/game-assets/free/tag-pixel-art](https://itch.io/game-assets/free/tag-pixel-art)
   * Từ khóa tìm kiếm: `2d character sprite`, `historical character`, `platformer hero`.
2. **OpenGameArt:**
   * Truy cập: [https://opengameart.org/](https://opengameart.org/)
   * Tìm kiếm: `2d character platformer`.
3. **Kenney.nl (Đồ họa hoạt hình phẳng rất đẹp):**
   * Truy cập: [https://kenney.nl/assets/category:2D](https://kenney.nl/assets/category:2D)
4. **Tự vẽ nhanh bằng công cụ online Piskel:**
   * Truy cập: [https://www.piskelapp.com/](https://www.piskelapp.com/)
   * Vẽ nhân vật pixel theo ý thích và bấm Export PNG.

