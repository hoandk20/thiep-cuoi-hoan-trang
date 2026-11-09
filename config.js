/* =========================================================
   CẤU HÌNH THIỆP CƯỚI — chỉ cần sửa file này + thay ảnh
   trong thư mục /images là xong.
   ========================================================= */
window.WEDDING = {
  groom: {
    shortName: "Đình Hoàn",
    fullName: "Kiều Đình Hoàn",
    born: 2000,
    intro: "Một chàng trai hiền lành, chân thành, luôn mang lại tiếng cười cho mọi người xung quanh. Và rồi anh đã tìm thấy nửa kia của đời mình.",
    parents: "Con trai của Ông … & Bà …" // sửa tên bố mẹ chú rể
  },
  bride: {
    shortName: "Thu Trang",
    fullName: "Từ Nữ Thu Trang",
    born: 2005,
    intro: "Một cô gái dịu dàng, tinh tế và đáng yêu. Nụ cười của cô là điều khiến anh muốn được nhìn thấy mỗi ngày.",
    parents: "Con gái của Ông … & Bà …" // sửa tên bố mẹ cô dâu
  },

  // Bộ đếm ngược đếm tới thời điểm này (giờ Việt Nam)
  countdownTo: "2026-12-27T11:00:00+07:00",
  dateText: "27 & 28 . 12 . 2026",

  // Hai ngày cưới (hiện ở phần "Lời mời")
  days: [
    { weekday: "Chủ Nhật", day: "27", month: "Tháng 12 · 2026", lunar: "Ngày 19 tháng 11 năm Bính Ngọ" },
    { weekday: "Thứ Hai", day: "28", month: "Tháng 12 · 2026", lunar: "Ngày 20 tháng 11 năm Bính Ngọ" }
  ],

  // Ảnh: chỉ dùng ảnh chung của hai người
  coverPhoto: "images/cover.jpg",     // ảnh nền đầu trang
  couplePhoto: "images/couple.jpg",   // ảnh ở mục "Cô Dâu & Chú Rể"
  quotePhoto: "images/album-07.jpg",  // ảnh nền dải trích dẫn
  footerPhoto: "images/album-08.jpg", // ảnh nền cuối trang
  quote: "Hai trái tim, một nhịp đập — từ hôm nay, chúng ta là một nhà.",

  // Sự kiện — gộp theo địa điểm: mỗi nhà 1 ô, 1 bản đồ chỉ đường.
  // Sửa giờ / tên lễ cho đúng thực tế; thêm/bớt dòng trong "schedule" tuỳ ý.
  venues: [
    {
      name: "Nhà Trai", side: "groom", icon: "💍",
      address: "Tư gia nhà trai",
      map: "https://maps.app.goo.gl/q8WVG9ErECqNRzEM6",
      schedule: [
        { day: "Chủ Nhật", date: "27/12", time: "11:00", title: "Tiệc Mừng Thành Hôn" },
        { day: "Thứ Hai", date: "28/12", time: "10:00", title: "Lễ Thành Hôn" }
      ]
    },
    {
      name: "Nhà Gái", side: "bride", icon: "🌸",
      address: "Tư gia nhà gái",
      map: "https://maps.app.goo.gl/mYDa8UV86XMmxG7z8",
      schedule: [
        { day: "Chủ Nhật", date: "27/12", time: "11:00", title: "Tiệc Mừng Vu Quy" },
        { day: "Thứ Hai", date: "28/12", time: "08:00", title: "Lễ Vu Quy" }
      ]
    }
  ],

  // Chuyện tình yêu (sửa nội dung, thêm/bớt tuỳ ý)
  story: [
    { date: "Lần đầu gặp gỡ", title: "Duyên phận bắt đầu", text: "Giữa bao nhiêu người, chúng mình đã tìm thấy nhau — một khởi đầu thật giản dị mà đáng nhớ.", photo: "images/album-02.jpg" },
    { date: "Thương nhau", title: "Những ngày bên nhau", text: "Cùng nhau đi qua bao kỷ niệm, những niềm vui nhỏ bé mỗi ngày khiến tình yêu thêm lớn dần.", photo: "images/album-03.jpg" },
    { date: "Lời hứa", title: "Em đồng ý", text: "Một lời hỏi, một cái gật đầu — và chúng mình quyết định cùng nhau viết tiếp câu chuyện.", photo: "images/album-05.jpg" },
    { date: "27 & 28 . 12 . 2026", title: "Về chung một nhà", text: "Ngày chúng mình chính thức nắm tay nhau trước hai họ, hứa hẹn yêu thương trọn đời.", photo: "images/album-01.jpg" }
  ],

  // (Tuỳ chọn) Toạ độ để hiện bản đồ Google thật trong thẻ sự kiện.
  // Cách lấy: mở link Google Maps → nhấn giữ vào điểm ghim → copy dãy số dạng "21.0285, 105.8542".
  // Để trống "" thì hiện bản đồ minh hoạ.
  mapCoords: { groom: "", bride: "" },

  // Album ảnh — thêm bao nhiêu ảnh cũng được, chỉ cần đúng đường dẫn
  album: [
    "images/album-04.jpg", "images/album-06.jpg", "images/album-02.jpg", "images/album-03.jpg",
    "images/album-05.jpg", "images/album-07.jpg", "images/album-08.jpg", "images/album-01.jpg"
  ],

  // Hộp mừng cưới (sửa số tài khoản, thay ảnh QR trong /images)
  gifts: [
    { who: "Mừng cưới Chú rể", bank: "TPBank", account: "2663 0102 000", holder: "KIEU DINH HOAN", qr: "images/qr-groom.png" },
    { who: "Mừng cưới Cô dâu", bank: "Techcombank", account: "1509 2533 33", holder: "TU NU THU TRANG", qr: "images/qr-bride.png" }
  ],

  // Nhạc nền: file trong thư mục /music. Tên file nên viết không dấu, không khoảng trắng.
  music: "music/nhac-nen.mp3"
};
