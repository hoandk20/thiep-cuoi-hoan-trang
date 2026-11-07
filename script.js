(() => {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), W);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = (s) => encodeURI(s);

  /* ---- Bind text & images from config ---- */
  $$('[data-k]').forEach(el => { const v = get(el.dataset.k); if (v !== undefined) el.textContent = v; });
  $$('[data-src-k]').forEach(el => { el.src = url(get(el.dataset.srcK)); });
  ['#heroBg', '#footerBg', '#quoteBand'].forEach(s => { $(s).style.backgroundImage = `url('${url(W.coverPhoto)}')`; });

  /* ---- Two wedding days ---- */
  $('#days').innerHTML = W.days.map(d => `
    <div class="day-card reveal">
      <p class="wd">${esc(d.weekday)}</p>
      <p class="dn">${esc(d.day)}</p>
      <p class="mo">${esc(d.month)}</p>
      <p class="lu">${esc(d.lunar)}</p>
    </div>`).join('');

  /* ---- Story ---- */
  $('#timeline').innerHTML = W.story.map(s => `
    <div class="tl-item reveal">
      <div class="tl-photo"><img loading="lazy" src="${esc(url(s.photo))}" alt="${esc(s.title)}"></div>
      <div class="tl-dot">❤</div>
      <div class="tl-text">
        <p class="tl-date">${esc(s.date)}</p>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>
    </div>`).join('');

  /* ---- Events grouped by day ---- */
  $('#eventDays').innerHTML = W.events.map(day => `
    <div class="ev-day">
      <p class="ev-day-label reveal">${esc(day.dayLabel)}</p>
      <div class="event-grid">
        ${day.items.map(e => `
        <article class="event-card reveal">
          <div class="event-icon">${e.icon || '💍'}</div>
          <h3 class="gold-text">${esc(e.title)}</h3>
          <p class="event-side">${esc(e.side)}</p>
          <p class="event-time">${esc(e.time)}</p>
          <p class="event-addr">${esc(e.address)}</p>
          <a class="btn-gold" href="${esc(e.map)}" target="_blank" rel="noopener">📍 Chỉ đường</a>
        </article>`).join('')}
      </div>
    </div>`).join('');

  /* ---- Album + lightbox ---- */
  $('#masonry').innerHTML = W.album.map((src, i) =>
    `<figure class="reveal" data-i="${i}"><img loading="lazy" src="${esc(url(src))}" alt="Ảnh cưới ${i + 1}"></figure>`).join('');
  const lb = $('#lightbox'), lbImg = $('img', lb);
  let cur = 0;
  const show = i => { cur = (i + W.album.length) % W.album.length; lbImg.src = url(W.album[cur]); };
  $('#masonry').addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; show(+f.dataset.i); lb.hidden = false; });
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
      <img loading="lazy" src="${esc(url(g.qr))}" alt="QR ${esc(g.who)}">
      <p>${esc(g.bank)}</p>
      <p class="acc">${esc(g.account)}</p>
      <p>${esc(g.holder)}</p>
      <button class="copy-btn" data-acc="${esc(g.account)}">Sao chép số tài khoản</button>
    </div>`).join('');
  $('#giftGrid').addEventListener('click', e => {
    const b = e.target.closest('.copy-btn'); if (!b) return;
    navigator.clipboard?.writeText(b.dataset.acc).then(() => toast('Đã sao chép số tài khoản 💝'), () => toast(b.dataset.acc));
  });

  const toastEl = $('#toast');
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 2600); }

  /* ---- Countdown ---- */
  const target = new Date(W.countdownTo).getTime();
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    let d = Math.max(0, target - Date.now()) / 1000;
    $('#cd-d').textContent = Math.floor(d / 86400); d %= 86400;
    $('#cd-h').textContent = pad(Math.floor(d / 3600));
    $('#cd-m').textContent = pad(Math.floor((d % 3600) / 60));
    $('#cd-s').textContent = pad(Math.floor(d % 60));
  }
  tick(); setInterval(tick, 1000);

  /* ---- Google Calendar (cả 2 ngày) ---- */
  $('#calBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(`Đám cưới ${W.groom.shortName} & ${W.bride.shortName}`)
    + '&dates=20261227/20261229'
    + '&details=' + encodeURIComponent(W.events.map(d => d.dayLabel + '\n' + d.items.map(e => `• ${e.time} ${e.title} (${e.side}): ${e.map}`).join('\n')).join('\n\n'));

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---- Active nav ---- */
  const links = $$('.topnav a');
  const navIo = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => navIo.observe(s));

  /* ---- Music ---- */
  const audio = $('#bgm'), mBtn = $('#musicBtn');
  audio.src = url(W.music);
  audio.volume = 0.7;
  let userPaused = false;
  const sync = () => mBtn.classList.toggle('playing', !audio.paused);
  audio.addEventListener('play', sync); audio.addEventListener('pause', sync);
  const tryPlay = () => audio.play().catch(() => {});
  mBtn.onclick = (e) => { e.stopPropagation(); if (audio.paused) { userPaused = false; tryPlay(); } else { userPaused = true; audio.pause(); } };
  // Trình duyệt chặn tự phát nhạc: phát ở lần chạm/click đầu tiên nếu chưa phát
  ['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if (audio.paused && !userPaused) tryPlay(); }, { passive: true }));

  /* ---- Opening: phong bì → cô dâu chú rể hôn nhau → cổng mở + pháo hoa ---- */
  const op = $('#opening'), env = $('#envelope');
  let opened = false;
  function openCard() {
    if (opened) return; opened = true;
    userPaused = false; tryPlay();              // nhạc chạy ngay khi chạm phong bì
    op.classList.add('kiss');                   // nắp phong bì mở, hiện cảnh hôn nhau
    setTimeout(() => explodeAt(.5, .38), 2000); // tim nổ đúng lúc hôn
    setTimeout(() => {
      op.classList.add('open');                 // 2 cánh cổng mở
      fireworks();
      document.body.classList.remove('locked');
    }, 4200);
    setTimeout(() => op.classList.add('gone'), 6600);
  }
  env.addEventListener('click', openCard);
  env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } });

  /* ---- FX: petals, gold sparkles, fireworks ---- */
  const cv = $('#fx'), ctx = cv.getContext('2d');
  let w, h, dpr;
  const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; };
  resize(); addEventListener('resize', resize);
  const R = (a, b) => a + Math.random() * (b - a);
  const petalColors = ['#f7c6cf', '#f2a7b5', '#fde2e4', '#e8b4a0', '#ffd6dc'];
  const mkPetal = (y) => ({ x: R(0, w), y: y ?? -20, r: R(6, 13) * dpr, vy: R(.5, 1.4) * dpr, vx: R(-.4, .4) * dpr, a: R(0, 6.28), va: R(-.03, .03), c: petalColors[Math.random() * 5 | 0], sw: R(0, 6.28) });
  const mkSpark = () => ({ x: R(0, w), y: R(0, h), r: R(.6, 1.8) * dpr, t: R(0, 6.28), vt: R(.02, .06), vy: R(-.25, -.05) * dpr });
  const petals = Array.from({ length: innerWidth < 700 ? 16 : 28 }, () => mkPetal(R(0, h)));
  const sparks = Array.from({ length: innerWidth < 700 ? 30 : 60 }, mkSpark);
  let parts = [];

  function star(x, y, r, alpha) {
    ctx.globalAlpha = alpha; ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.moveTo(x, y - r * 3); ctx.lineTo(x + r * .6, y - r * .6); ctx.lineTo(x + r * 3, y); ctx.lineTo(x + r * .6, y + r * .6);
    ctx.lineTo(x, y + r * 3); ctx.lineTo(x - r * .6, y + r * .6); ctx.lineTo(x - r * 3, y); ctx.lineTo(x - r * .6, y - r * .6); ctx.fill();
  }
  function heart(x, y, s, c, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 3); ctx.bezierCurveTo(-5, -2, -2, -6, 0, -3); ctx.bezierCurveTo(2, -6, 5, -2, 0, 3); ctx.fill(); ctx.restore();
  }
  function explode(x, y, n, palette) {
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + R(-.1, .1), sp = R(1.5, 8) * dpr;
      parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, decay: R(.007, .013), c: palette[i % palette.length], heart: Math.random() < .3, s: R(1.4, 2.6) * dpr });
    }
  }
  const pals = [['#f7e3a8', '#d4a548', '#fff6d8'], ['#e04a66', '#f7c6cf', '#d4a548'], ['#ffffff', '#f2d58a', '#e8b4a0'], ['#ff8fa3', '#ffd6dc', '#f7e3a8']];
  let rockets = [];
  function launch(fx, fy, pal) {
    rockets.push({ x: w * fx, y: h + 10, ty: h * fy, vx: R(-.6, .6) * dpr, vy: -R(11, 14) * dpr, pal, trail: [] });
  }
  // Bắn pháo hoa: 3 đợt trong ~6 giây
  function fireworks() {
    const shots = [[.5, .3], [.2, .25], [.8, .25], [.35, .4], [.65, .4], [.5, .18], [.15, .45], [.85, .45]];
    for (let wave = 0; wave < 3; wave++)
      shots.forEach(([fx, fy], i) => setTimeout(() => launch(fx + R(-.05, .05), fy + R(-.05, .05), pals[(i + wave) % pals.length]), wave * 2000 + i * 220));
  }
  function explodeAt(fx, fy) { explode(w * fx, h * fy, 50, pals[1]); }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.sw += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * .6 * dpr; p.a += p.va;
      if (p.y > h + 20) Object.assign(p, mkPetal());
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = .85; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.28); ctx.fill(); ctx.restore();
    }
    for (const s of sparks) {
      s.t += s.vt; s.y += s.vy; if (s.y < -10) { s.y = h + 10; s.x = R(0, w); }
      star(s.x, s.y, s.r, Math.max(0, Math.sin(s.t)) * .9);
    }
    ctx.globalAlpha = 1;
    rockets = rockets.filter(r => {
      r.trail.push([r.x, r.y]); if (r.trail.length > 10) r.trail.shift();
      r.x += r.vx; r.y += r.vy; r.vy *= .985;
      r.trail.forEach(([x, y], i) => { ctx.globalAlpha = i / r.trail.length * .8; ctx.fillStyle = '#ffe9b0'; ctx.beginPath(); ctx.arc(x, y, 2.2 * dpr * i / r.trail.length, 0, 6.28); ctx.fill(); });
      if (r.y <= r.ty || r.vy > -2 * dpr) { explode(r.x, r.y, 80, r.pal); return false; }
      return true;
    });
    ctx.globalAlpha = 1;
    parts = parts.filter(k => k.life > 0);
    for (const k of parts) {
      k.x += k.vx; k.y += k.vy; k.vx *= .985; k.vy = k.vy * .985 + .06 * dpr; k.life -= k.decay;
      if (k.heart) heart(k.x, k.y, k.s, k.c, k.life);
      else { ctx.globalAlpha = k.life; ctx.fillStyle = k.c; ctx.beginPath(); ctx.arc(k.x, k.y, k.s, 0, 6.28); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();
