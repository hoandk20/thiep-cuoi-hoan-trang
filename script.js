(() => {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), W);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---- Bind text & images from config ---- */
  $$('[data-k]').forEach(el => { const v = get(el.dataset.k); if (v !== undefined) el.textContent = v; });
  $$('[data-src-k]').forEach(el => { el.src = get(el.dataset.srcK); });
  $('#heroBg').style.backgroundImage = `url('${W.coverPhoto}')`;
  $('#footerBg').style.backgroundImage = `url('${W.coverPhoto}')`;

  /* ---- Story ---- */
  $('#timeline').innerHTML = W.story.map(s => `
    <div class="tl-item reveal">
      <div class="tl-photo"><img loading="lazy" src="${esc(s.photo)}" alt="${esc(s.title)}"></div>
      <div class="tl-dot"></div>
      <div class="tl-text">
        <p class="tl-date">${esc(s.date)}</p>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>
    </div>`).join('');

  /* ---- Events ---- */
  $('#eventGrid').innerHTML = W.events.map(e => `
    <article class="event-card reveal">
      <div class="event-icon">${e.icon}</div>
      <h3>${esc(e.title)}</h3>
      <p class="event-side">${esc(e.side)}</p>
      <p class="event-time">${esc(e.time)}</p>
      <p class="event-date">${esc(e.date)}</p>
      <p class="event-addr">${esc(e.address)}</p>
      <a class="btn-gold" href="${esc(e.map)}" target="_blank" rel="noopener">📍 Xem bản đồ</a>
    </article>`).join('');

  /* ---- Album + lightbox ---- */
  $('#masonry').innerHTML = W.album.map((src, i) =>
    `<figure class="reveal" data-i="${i}"><img loading="lazy" src="${esc(src)}" alt="Ảnh cưới ${i + 1}"></figure>`).join('');
  const lb = $('#lightbox'), lbImg = $('img', lb);
  let cur = 0;
  const show = i => { cur = (i + W.album.length) % W.album.length; lbImg.src = W.album[cur]; };
  $('#masonry').addEventListener('click', e => {
    const f = e.target.closest('figure'); if (!f) return;
    show(+f.dataset.i); lb.hidden = false;
  });
  $('.lb-close', lb).onclick = () => (lb.hidden = true);
  $('.lb-prev', lb).onclick = () => show(cur - 1);
  $('.lb-next', lb).onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) lb.hidden = true; });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lb.hidden = true;
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', e => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

  /* ---- Gifts ---- */
  $('#giftGrid').innerHTML = W.gifts.map(g => `
    <div class="gift-card reveal">
      <h3>${esc(g.who)}</h3>
      <img loading="lazy" src="${esc(g.qr)}" alt="QR ${esc(g.who)}">
      <p>${esc(g.bank)}</p>
      <p class="acc">${esc(g.account)}</p>
      <p>${esc(g.holder)}</p>
      <button class="copy-btn" data-acc="${esc(g.account)}">Sao chép số tài khoản</button>
    </div>`).join('');
  $('#giftGrid').addEventListener('click', e => {
    const b = e.target.closest('.copy-btn'); if (!b) return;
    navigator.clipboard?.writeText(b.dataset.acc).then(() => toast('Đã sao chép số tài khoản 💝'), () => toast(b.dataset.acc));
  });

  /* ---- Toast ---- */
  const toastEl = $('#toast');
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 2600); }

  /* ---- Countdown ---- */
  const target = new Date(W.weddingDateTime).getTime();
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    let d = Math.max(0, target - Date.now()) / 1000;
    const days = Math.floor(d / 86400); d %= 86400;
    $('#cd-d').textContent = days;
    $('#cd-h').textContent = pad(Math.floor(d / 3600));
    $('#cd-m').textContent = pad(Math.floor((d % 3600) / 60));
    $('#cd-s').textContent = pad(Math.floor(d % 60));
  }
  tick(); setInterval(tick, 1000);

  /* ---- Add to Google Calendar ---- */
  const start = new Date(target), end = new Date(target + 4 * 3600e3);
  const gfmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  $('#calBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(`Đám cưới ${W.groom.shortName} & ${W.bride.shortName}`)
    + '&dates=' + gfmt(start) + '/' + gfmt(end)
    + '&details=' + encodeURIComponent(W.events.map(e => `${e.title} (${e.side}) – ${e.time}: ${e.map}`).join('\n'));
  $('#calBtn').target = '_blank';

  /* ---- RSVP (lưu trên trình duyệt của khách) ---- */
  const KEY = 'wedding-wishes';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const renderWishes = () => {
    $('#wishes').innerHTML = load().filter(w => w.wish).map(w => `<div class="wish"><b>${esc(w.name)}</b>: ${esc(w.wish)}</div>`).join('');
  };
  renderWishes();
  $('#rsvpForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try { localStorage.setItem(KEY, JSON.stringify([data, ...load()].slice(0, 30))); } catch {}
    renderWishes(); e.target.reset();
    toast(`Cảm ơn ${data.name} đã gửi xác nhận! ❤`);
    burst();
  });

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---- Active nav ---- */
  const links = $$('.topnav a');
  const navIo = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => navIo.observe(s));

  /* ---- Music ---- */
  const audio = $('#bgm'), mBtn = $('#musicBtn');
  audio.src = W.music;
  audio.addEventListener('canplay', () => (mBtn.hidden = false), { once: true });
  const setPlaying = p => mBtn.classList.toggle('playing', p);
  mBtn.onclick = () => audio.paused ? audio.play().then(() => setPlaying(true)).catch(() => {}) : (audio.pause(), setPlaying(false));

  /* ---- Opening ---- */
  $('#openBtn').addEventListener('click', () => {
    const op = $('#opening');
    op.classList.add('open');
    audio.play().then(() => { setPlaying(true); mBtn.hidden = false; }).catch(() => {});
    setTimeout(() => { op.classList.add('gone'); document.body.classList.remove('locked'); burst(); }, 1100);
  });

  /* ---- Falling petals + heart burst ---- */
  const cv = $('#petals'), ctx = cv.getContext('2d');
  let w, h, petals = [], hearts = [];
  const resize = () => { w = cv.width = innerWidth * devicePixelRatio; h = cv.height = innerHeight * devicePixelRatio; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; };
  resize(); addEventListener('resize', resize);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = innerWidth < 700 ? 18 : 32;
  const colors = ['#f7c6cf', '#f2a7b5', '#fde2e4', '#e8b4a0', '#f1dcae'];
  const mk = (y) => ({ x: Math.random() * w, y: y ?? Math.random() * -h, r: (6 + Math.random() * 8) * devicePixelRatio, vy: (.5 + Math.random()) * devicePixelRatio, vx: (Math.random() - .5) * devicePixelRatio, a: Math.random() * 6.28, va: (Math.random() - .5) * .04, c: colors[Math.random() * colors.length | 0], sw: Math.random() * 6.28 });
  for (let i = 0; i < N; i++) petals.push(mk(Math.random() * h));
  function drawHeart(x, y, s, c, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 3); ctx.bezierCurveTo(-5, -2, -2, -6, 0, -3); ctx.bezierCurveTo(2, -6, 5, -2, 0, 3); ctx.fill(); ctx.restore();
  }
  function burst() {
    if (reduce) return;
    for (let i = 0; i < 40; i++) hearts.push({ x: w / 2, y: h / 2, vx: (Math.random() - .5) * 14 * devicePixelRatio, vy: (Math.random() - .8) * 14 * devicePixelRatio, s: (1.5 + Math.random() * 2.5) * devicePixelRatio, life: 1, c: ['#c33a55', '#e85d75', '#c9a15b', '#f2a7b5'][i % 4] });
  }
  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.sw += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * .6; p.a += p.va;
      if (p.y > h + 20) Object.assign(p, mk(-20));
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = .8; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.28); ctx.fill(); ctx.restore();
    }
    hearts = hearts.filter(k => k.life > 0);
    for (const k of hearts) { k.x += k.vx; k.y += k.vy; k.vy += .25 * devicePixelRatio; k.life -= .012; drawHeart(k.x, k.y, k.s, k.c, k.life); }
    requestAnimationFrame(loop);
  }
  if (!reduce) loop();
})();
