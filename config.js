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
    fullName: "Thu Trang", // sửa thành họ tên đầy đủ của cô dâu
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

  // Sự kiện — chia theo ngày. Sửa giờ / tên lễ cho đúng thực tế.
  events: [
    {
      dayLabel: "Chủ Nhật · 27 tháng 12 năm 2026",
      items: [
        { title: "Tiệc Mừng Vu Quy", side: "Tại Nhà Gái", time: "11:00", address: "Tư gia nhà gái",
          map: "https://maps.app.goo.gl/mYDa8UV86XMmxG7z8", icon: "🥂" },
        { title: "Tiệc Mừng Thành Hôn", side: "Tại Nhà Trai", time: "11:00", address: "Tư gia nhà trai",
          map: "https://maps.app.goo.gl/q8WVG9ErECqNRzEM6", icon: "🥂" }
      ]
    },
    {
      dayLabel: "Thứ Hai · 28 tháng 12 năm 2026",
      items: [
        { title: "Lễ Vu Quy", side: "Tại Nhà Gái", time: "08:00", address: "Tư gia nhà gái",
          map: "https://maps.app.goo.gl/mYDa8UV86XMmxG7z8", icon: "🌸" },
        { title: "Lễ Thành Hôn", side: "Tại Nhà Trai", time: "10:00", address: "Tư gia nhà trai",
          map: "https://maps.app.goo.gl/q8WVG9ErECqNRzEM6", icon: "💍" }
      ]
    }
  ],

  // Chuyện tình yêu (sửa nội dung, thêm/bớt tuỳ ý)
  story: [
    { date: "Những chuyến đi", title: "Cùng nhau khám phá", text: "Từ sân ga Hải Phòng, chúng mình bắt đầu những hành trình đầu tiên bên nhau.", photo: "images/album-02.jpg" },
    { date: "Hẹn hò", title: "Những điều nhỏ bé", text: "Cùng nhau vẽ chiếc cốc gốm, cùng nhau tạo nên những kỷ niệm thật giản dị mà ngọt ngào.", photo: "images/album-03.jpg" },
    { date: "Lời cầu hôn", title: "Em đồng ý", text: "Bên bờ biển lộng gió, một chiếc nhẫn, một cái gật đầu — và hành trình mới chính thức bắt đầu.", photo: "images/album-05.jpg" },
    { date: "27 & 28 . 12 . 2026", title: "Về chung một nhà", text: "Ngày chúng mình chính thức nắm tay nhau trước hai họ, hứa hẹn yêu thương trọn đời.", photo: "images/album-01.jpg" }
  ],

  // Album ảnh — thêm bao nhiêu ảnh cũng được, chỉ cần đúng đường dẫn
  album: [
    "images/album-04.jpg", "images/album-06.jpg", "images/album-02.jpg", "images/album-03.jpg",
    "images/album-05.jpg", "images/album-07.jpg", "images/album-08.jpg", "images/album-01.jpg"
  ],

  // Hộp mừng cưới (sửa số tài khoản, thay ảnh QR trong /images)
  gifts: [
    { who: "Mừng cưới Chú rể", bank: "Ngân hàng …", account: "0000000000", holder: "KIEU DINH HOAN", qr: "images/qr-groom.jpg" },
    { who: "Mừng cưới Cô dâu", bank: "Ngân hàng …", account: "0000000000", holder: "THU TRANG", qr: "images/qr-bride.jpg" }
  ],

  // Nhạc nền: file trong thư mục /music. Tên file nên viết không dấu, không khoảng trắng.
  music: "music/nhac-nen.mp3"
};
