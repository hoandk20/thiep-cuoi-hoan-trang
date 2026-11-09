# 💍 Thiệp cưới Đình Hoàn & Thu Trang — 27 & 28.12.2026

Web thiệp cưới tĩnh (HTML/CSS/JS thuần), chạy trên GitHub Pages.

## Thay ảnh cưới
Tất cả ảnh nằm trong thư mục **`images/`**. Chỉ cần chép ảnh thật **đè lên đúng tên file**:

| File | Dùng ở đâu | Gợi ý |
|---|---|---|
| `cover.jpg` | Ảnh nền đầu trang | nên dùng ảnh **ngang** để đẹp trên máy tính |
| `couple.jpg` | Ảnh chung ở mục "Cô Dâu & Chú Rể" | dọc 4:5 |
| `album-01.jpg` … `album-08.jpg` | Album, chuyện tình, nền trích dẫn & cuối trang | tuỳ ý |
| `qr-groom.png` / `qr-bride.png` | Mã QR mừng cưới | vuông, cắt sát mã QR |

Muốn thêm ảnh album: bỏ ảnh vào `images/` rồi thêm đường dẫn vào mảng `album` trong `config.js`.
Nên nén ảnh (~100–250KB/ảnh, cạnh dài ~1200px) để khách dùng 4G tải nhanh.

## Sửa nội dung
Mọi chữ (tên, giờ làm lễ, tên bố mẹ, số tài khoản, chuyện tình…) nằm trong **`config.js`**.

## Nhạc nền
Bỏ file nhạc vào thư mục `music/` và đặt tên **`nhac-nen.mp3`** (không dấu, không khoảng trắng). Muốn dùng tên khác thì sửa dòng `music:` trong `config.js`. Nhạc phát khi khách bấm "Mở thiệp".

## Xem thử trên máy
```bash
python3 -m http.server 8000
```
Mở http://localhost:8000

## Ảnh hiện khi chia sẻ link (Messenger, Zalo, Facebook)
Ảnh xem trước là `images/share.jpg` (1200×630). Khi có ảnh cưới, thay file này bằng ảnh **ngang 1200×630**, giữ nguyên tên.
Facebook lưu tạm ảnh cũ: sau khi thay, vào https://developers.facebook.com/tools/debug/ dán link thiệp và bấm **Scrape Again** để cập nhật.
