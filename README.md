# 💍 Thiệp cưới Đình Hoàn & Thu Trang — 28.12.2026

Web thiệp cưới tĩnh (HTML/CSS/JS thuần), chạy trên GitHub Pages.

## Thay ảnh cưới
Tất cả ảnh nằm trong thư mục **`images/`**. Chỉ cần chép ảnh thật **đè lên đúng tên file**:

| File | Dùng ở đâu | Tỉ lệ gợi ý |
|---|---|---|
| `cover.jpg` | Ảnh nền đầu trang + chân trang | ngang 3:2 |
| `groom.jpg` / `bride.jpg` | Ảnh chú rể / cô dâu | dọc 4:5 |
| `couple-1.jpg`, `couple-2.jpg` | Chuyện tình yêu | ngang/dọc đều được |
| `album-01.jpg` … `album-09.jpg` | Album ảnh | tuỳ ý |
| `qr-groom.jpg` / `qr-bride.jpg` | Mã QR mừng cưới | vuông |

Muốn thêm ảnh album: bỏ ảnh vào `images/` rồi thêm đường dẫn vào mảng `album` trong `config.js`.
Nên nén ảnh (< 500KB/ảnh, cạnh dài ~1600px) để trang tải nhanh.

## Sửa nội dung
Mọi chữ (tên, giờ làm lễ, tên bố mẹ, số tài khoản, chuyện tình…) nằm trong **`config.js`**.

## Nhạc nền
Bỏ file nhạc vào `music/nhac-nen.mp3` — nút nhạc sẽ tự hiện.

## Xem thử trên máy
```bash
python3 -m http.server 8000
```
Mở http://localhost:8000
