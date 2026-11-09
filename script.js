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
  $('#heroBg').style.backgroundImage = `url('${url(W.coverPhoto)}')`;
  // Ảnh nền phía dưới chỉ tải khi khách cuộn gần tới (tiết kiệm 4G)
  const lazyBg = [['#quoteBand', W.quotePhoto || W.coverPhoto], ['#footerBg', W.footerPhoto || W.coverPhoto]];
  const bgIo = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.style.backgroundImage = `url('${url(en.target.dataset.bg)}')`; bgIo.unobserve(en.target);
  }), { rootMargin: '600px 0px' });
  lazyBg.forEach(([s, src]) => { const el = $(s); el.dataset.bg = src; bgIo.observe(el); });

  /* ---- Two wedding days ---- */
  $('#days').innerHTML = `
    <div class="day-card day-combined reveal">
      <div class="dc-row">
        ${W.days.map((d, i) => `${i ? '<span class="dc-amp">&amp;</span>' : ''}
        <div class="dc-col">
          <p class="wd">${esc(d.weekday)}</p>
          <p class="dn">${esc(d.day)}</p>
          <p class="lu-s">${esc(d.lunar.replace(/^Ngày /, '').replace(/ năm .*/, ''))} ÂL</p>
        </div>`).join('')}
      </div>
      <p class="mo">${esc(W.days[0].month)}</p>
      <p class="lu">Năm ${esc((W.days[0].lunar.match(/năm (.*)$/) || [, ''])[1])}</p>
    </div>
`;

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

  /* ---- Bản đồ nhỏ cho từng địa điểm ----
     Có toạ độ (mapCoords: "21.0285,105.8542") → hiện bản đồ Google thật.
     Chưa có → bản đồ minh hoạ có ghim, bấm vào mở Google Maps. */
  function miniMap(e) {
    const isBride = e.side === 'bride';
    const label = isBride ? 'Nhà Gái' : 'Nhà Trai';
    const coords = W.mapCoords && W.mapCoords[isBride ? 'bride' : 'groom'];
    if (coords) {
      return `<a class="map-card real" href="${esc(e.map)}" target="_blank" rel="noopener" aria-label="Mở bản đồ ${label}">
        <iframe loading="lazy" tabindex="-1" src="https://maps.google.com/maps?q=${encodeURIComponent(coords)}&z=16&output=embed" title="Bản đồ ${label}"></iframe>
        <span class="map-chip">🗺️ Chạm để mở Google Maps</span></a>`;
    }
    const v = isBride ? 1 : 0;
    const roads = v
      ? 'M-10 120 Q90 100 160 112 T330 92 M70 -10 Q84 70 70 190 M200 -10 Q216 90 236 190 M-10 50 H330'
      : 'M-10 70 Q120 86 330 60 M110 -10 Q96 90 120 190 M240 -10 Q226 80 250 190 M-10 140 Q160 128 330 150';
    const route = v ? 'M30 160 Q60 118 92 112 T160 112 Q190 110 214 84' : 'M24 34 Q70 70 110 76 T170 82 Q196 86 214 84';
    return `<a class="map-card" href="${esc(e.map)}" target="_blank" rel="noopener" aria-label="Mở bản đồ chỉ đường tới ${label}">
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="320" height="180" fill="#f4ecdc"/>
        <path d="${v ? 'M-10 0 Q40 90 -10 180Z' : 'M330 0 Q270 100 330 180Z'}" fill="#cfe3ea"/>
        <ellipse cx="${v ? 270 : 50}" cy="${v ? 40 : 140}" rx="46" ry="28" fill="#d7e8c8"/>
        <g fill="#eadfc8"><rect x="130" y="18" width="40" height="26" rx="4"/><rect x="${v ? 100 : 150}" y="130" width="54" height="30" rx="4"/><rect x="${v ? 250 : 20}" y="${v ? 130 : 90}" width="44" height="28" rx="4"/></g>
        <path d="${roads}" fill="none" stroke="#e2cfa6" stroke-width="13" stroke-linecap="round"/>
        <path d="${roads}" fill="none" stroke="#fffaf0" stroke-width="9" stroke-linecap="round"/>
        <path class="route" d="${route}" fill="none" stroke="#c33a55" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9"/>
        <circle cx="${v ? 30 : 24}" cy="${v ? 160 : 34}" r="6" fill="#3b82c4" stroke="#fff" stroke-width="2.5"/>
        <g transform="translate(214 84)">
          <ellipse class="pin-pulse" cx="0" cy="0" rx="14" ry="5" fill="#c33a55"/>
          <g class="pin"><path d="M0 0C-4-10-16-18-16-30A16 16 0 1 1 16-30C16-18 4-10 0 0Z" fill="#7a1c30" stroke="#f2d58a" stroke-width="2"/>
            <text x="0" y="-24" text-anchor="middle" font-size="16" fill="#f7e3a8" font-family="serif">囍</text></g>
          <g transform="translate(0 -62)"><rect x="-38" y="-13" width="76" height="24" rx="12" fill="#fff" stroke="#d4a548"/>
            <text x="0" y="4" text-anchor="middle" font-size="12.5" font-weight="600" fill="#7a1c30" font-family="Be Vietnam Pro,sans-serif">${label}</text></g>
        </g>
      </svg>
      <span class="map-chip">🗺️ Chạm để mở bản đồ</span></a>`;
  }

  /* ---- Sự kiện: mỗi địa điểm 1 ô, lịch cả 2 ngày + 1 bản đồ ---- */
  $('#eventDays').innerHTML = `<div class="event-grid venues">${W.venues.map(v => `
    <article class="event-card venue reveal">
      <div class="event-icon">${v.icon || '💍'}</div>
      <h3 class="gold-text">${esc(v.name)}</h3>
      <p class="event-side">${esc(v.address)}</p>
      <ul class="schedule">
        ${v.schedule.map(s => `
        <li>
          <span class="sc-date"><b>${esc(s.date)}</b><small>${esc(s.day)}</small></span>
          <span class="sc-time">${esc(s.time)}</span>
          <span class="sc-title">${esc(s.title)}</span>
        </li>`).join('')}
      </ul>
      ${miniMap(v)}
      <a class="btn-gold" href="${esc(v.map)}" target="_blank" rel="noopener">📍 Chỉ đường đến ${esc(v.name)}</a>
    </article>`).join('')}</div>`;

  /* ---- Album + lightbox ---- */
  $('#masonry').innerHTML = W.album.map((src, i) =>
    `<figure class="reveal" data-i="${i}"><img loading="lazy" src="${esc(url(src))}" alt="Ảnh cưới ${i + 1}"></figure>`).join('');
  const lb = $('#lightbox'), lbImg = $('img', lb);
  let cur = 0;
  const lbCount = $('.lb-count', lb);
  const show = i => { cur = (i + W.album.length) % W.album.length; lbImg.src = url(W.album[cur]); lbCount.textContent = `${cur + 1} / ${W.album.length}`; };
  const openLb = i => { show(i); lb.hidden = false; document.body.classList.add('lb-open'); };
  const closeLb = () => { lb.hidden = true; document.body.classList.remove('lb-open'); };
  $('#masonry').addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; openLb(+f.dataset.i); });
  $('.lb-close', lb).onclick = closeLb;
  $('.lb-prev', lb).onclick = () => show(cur - 1);
  $('.lb-next', lb).onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
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
    navigator.clipboard?.writeText(b.dataset.acc.replace(/\s/g, '')).then(() => toast('Đã sao chép số tài khoản 💝'), () => toast(b.dataset.acc));
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
    + '&details=' + encodeURIComponent(W.venues.map(v => `${v.name}: ${v.map}\n` + v.schedule.map(s => `• ${s.day} ${s.date} – ${s.time} ${s.title}`).join('\n')).join('\n\n'));

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---- Cô dâu chú rể nắm tay đi phát thiệp (vòng 14s, chỉ chạy khi đang nhìn thấy) ----
     đi tới từng khách → cúi đầu, cô dâu trao thiệp → khách nhận, nhảy, nói, thả tim
     → cuối cùng quay ra cúi chào người xem, tấm thiệp lớn "Trân trọng kính mời Bạn & Gia đình" */
  (function inviteWalk() {
    const root = $('.invite-run'); if (!root) return;
    const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
    const scene = q('.ig-scene'), couple = q('.ig-couple'), fly = q('.ig-fly'), big = q('.ig-big');
    const G = { walk: q('.ig-groom .walk'), fl: q('.ig-groom .foot.l'), fr: q('.ig-groom .foot.r'), arm: q('.ig-groom .arm-o'), head: q('.ig-groom .head') };
    const B = { walk: q('.ig-bride .walk'), skirt: q('.ig-bride .skirt'), veil: q('.ig-bride .veil'), arm: q('.ig-bride .arm-o'), head: q('.ig-bride .head'),
      card: q('.ig-bride .held-card'), bouquet: q('.ig-bride .bouquet') };
    const guests = qa('.ig-guest').map(g => ({ x: +g.dataset.x, j: g.querySelector('.gj'), down: g.querySelector('.arms-down'), hold: g.querySelector('.arms-hold'),
      heart: g.querySelector('.g-heart'), bub: g.querySelector('.g-bubble') }));
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const seg = (t, a, b) => clamp((t - a) / (b - a));
    const io = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const outBack = p => { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
    const bump = p => Math.sin(Math.PI * clamp(p));
    const set = (el, v) => el && el.setAttribute('transform', v);
    const op = (el, v) => el && el.setAttribute('opacity', v);
    const L = 14;
    // lộ trình: [bắt đầu, kết thúc, từ x, tới x]
    const path = [[0, 1.4, -80, 62], [2.6, 3.5, 62, 192], [4.7, 5.6, 192, 322], [6.8, 8.0, 322, 545]];
    const stops = [1.4, 3.5, 5.6];                     // lúc dừng trước khách 1, 2, 3
    const xAt = t => { let x = -80, d = 0;
      for (const [a, b, x0, x1] of path) { if (t >= b) { x = x1; d += Math.abs(x1 - x0); } else if (t > a) { const p = io(seg(t, a, b)); x = x0 + (x1 - x0) * p; d += Math.abs(x1 - x0) * p; break; } else break; }
      return [x, d]; };
    let raf = 0, start = 0;
    function frame(now) {
      const t = ((now - start) / 1000) % L;
      const [cx, dist] = xAt(t), [cx2] = xAt(t + .05);
      const moving = Math.abs(cx2 - cx) > .3;
      const ph = dist / 26 * Math.PI;                 // nhịp bước theo quãng đường
      const amp = moving ? 1 : 0;
      const fade = 1 - seg(t, 12.7, 13.3) + seg(t, 13.6, 14);
      scene.setAttribute('opacity', t < 0.2 ? seg(t, 0, .2) : fade);
      set(couple, `translate(${cx} 0)`);
      // bước đi: nhún, lắc nhẹ, nhấc chân xen kẽ; váy đung đưa
      const bob = -2.5 * amp * Math.abs(Math.sin(ph)), tilt = 2.5 * amp * Math.sin(ph);
      set(G.walk, `translate(0 ${bob}) rotate(${tilt} 0 0)`);
      set(B.walk, `translate(0 ${bob}) rotate(${tilt} 0 0)`);
      set(G.fl, `translate(0 ${-3 * amp * Math.max(0, Math.sin(ph))})`);
      set(G.fr, `translate(0 ${-3 * amp * Math.max(0, -Math.sin(ph))})`);
      set(B.skirt, `skewX(${3 * Math.sin(ph * (amp ? 1 : 0) + t * 2)})`);
      set(B.veil, `skewX(${-3 - 3 * Math.sin(t * 2.4)})`);
      // trao thiệp ở mỗi điểm dừng
      let give = 0, bowHead = 0;
      stops.forEach((s, i) => {
        const g = guests[i];
        give = Math.max(give, io(seg(t, s, s + .3)) - io(seg(t, s + .55, s + .85)));
        bowHead = Math.max(bowHead, bump(seg(t, s + .05, s + .6)));
        const fp = seg(t, s + .35, s + .8);
        if (fp > 0 && fp < 1) {
          const x0 = cx + 49, y0 = -60, x1 = g.x, y1 = -46;
          op(fly, 1); set(fly, `translate(${x0 + (x1 - x0) * fp} ${y0 + (y1 - y0) * fp - 26 * bump(fp)}) rotate(${360 * fp})`);
        }
        const got = t >= s + .8 && t < 13.3;
        op(g.hold, got ? 1 : 0); op(g.down, got ? 0 : 1);
        const jump = 10 * bump(seg(t, s + .8, s + 1.15)) + 5 * bump(seg(t, s + 1.15, s + 1.4));
        set(g.j, `translate(0 ${-jump - 1.2 * Math.abs(Math.sin(t * 2.2 + i))})`);
        const bp = seg(t, s + .85, s + 1.05);
        op(g.bub, t > s + .85 && t < s + 2.9 ? clamp(bp * 2) * (1 - seg(t, s + 2.6, s + 2.9)) : 0);
        set(g.bub, `translate(0 -113) scale(${.5 + .5 * outBack(bp)}) translate(0 113)`);
        const hp = seg(t, s + 1.0, s + 2.0);
        op(g.heart, hp > 0 && hp < 1 ? 1 - hp : 0); set(g.heart, `translate(0 ${-24 * hp})`);
        // cuối vòng: khách vẫy tay theo
        if (t > 11.6 && t < 12.7) set(g.j, `translate(0 ${-4 * Math.abs(Math.sin(t * 8 + i))})`);
      });
      if (!stops.some(s => t > s + .35 && t < s + .8)) op(fly, 0);
      // mời người xem: cúi chào, trao thiệp lớn
      const bowV = bump(seg(t, 8.3, 9.0));
      const giveV = io(seg(t, 8.9, 9.2)) - io(seg(t, 9.6, 10));
      const wave = io(seg(t, 11.6, 11.9)) - io(seg(t, 12.5, 12.8));
      const ws = Math.sin(t * 12) * wave;
      set(B.arm, `rotate(${-70 * Math.max(give, giveV) - 140 * wave + 18 * ws} 12 -78)`);
      set(G.arm, `rotate(${140 * wave + 18 * ws} -19 -72)`);
      op(B.card, Math.max(give, giveV) > .2 ? 1 : 0); op(B.bouquet, Math.max(give, giveV) > .2 ? 0 : 1);
      const hd = 5 * Math.max(bowHead * .7, bowV);
      set(G.head, `translate(0 ${hd}) rotate(${-3 * bowV} 0 -90)`);
      set(B.head, `translate(0 ${hd}) rotate(${3 * bowV} 0 -90)`);
      // tấm thiệp lớn bay ra giữa
      const bp = seg(t, 9.15, 9.75), bo = seg(t, 11.2, 11.6);
      if (t > 9.15 && t < 11.6) {
        const sc = .12 + .88 * outBack(bp) - .5 * io(bo);
        const x = (cx + 49) + (320 - cx - 49) * io(bp), y = 144 + (102 - 144) * io(bp);
        op(big, 1 - bo); set(big, `translate(${x} ${y}) scale(${Math.max(.01, sc)}) rotate(${(1 - io(bp)) * -20 + Math.sin(t * 2) * 1.2})`);
      } else op(big, 0);
      if (t > 9.75 && t < 9.8 && !root._b) { root._b = 1; const r = root.getBoundingClientRect(); window.__burst && window.__burst(r.left + r.width / 2, r.top + r.height * .45); }
      if (t < 1) root._b = 0;
      raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting && !raf) { start = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    }), { threshold: .2 }).observe(root);
  })();

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

  /* ---- Opening: phong bì → cầu hôn → hôn → bồ câu → xoay vòng → tung hoa → cổng mở ---- */
  const op = $('#opening'), env = $('#envelope');
  let opened = false, finished = false;
  const timers = [];
  function finish() {                           // mở cổng (tự động hoặc khi bấm "Bỏ qua")
    if (finished) return; finished = true;
    timers.forEach(clearTimeout);
    op.classList.add('open');
    fireworks();
    document.body.classList.remove('locked');
    setTimeout(() => op.classList.add('gone'), 2400);
  }
  function openCard() {
    if (opened) return; opened = true;
    userPaused = false; tryPlay();              // nhạc chạy ngay khi chạm phong bì
    op.classList.add('kiss');
    coupleTimeline();
    timers.push(setTimeout(finish, 11200));
  }
  env.addEventListener('click', openCard);
  env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); } });
  $('#skipBtn').addEventListener('click', finish);
  // chạm vào màn hình trong lúc diễn hoạt → thả tim tại chỗ chạm
  let tapN = 0;
  op.addEventListener('pointerdown', e => {
    if (!op.classList.contains('kiss') || finished || e.target.closest('#skipBtn')) return;
    burstAt(e.clientX, e.clientY, 18, pals[tapN++ % pals.length], .55);
  });

  /* ---- Diễn hoạt cô dâu chú rể: mỗi khung hình tính lại tư thế từ thời gian t (giây) ----
     0.9–2.7 đi vào · 2.8–3.9 cầu hôn, cô dâu mắt tim nhảy cẫng · 3.9–4.4 tiến lại · 4.4 hôn
     4.9 bồ câu kéo băng rôn bay vào · 5.3–6.2 chú rể xoay cô dâu · 6.3–7.5 tung bó hoa */
  function coupleTimeline() {
    const svg = $('.kiss-svg');
    const q = (s) => svg.querySelector(s);
    const G = { root: q('.groom'), walk: q('.groom .walker'), lean: q('.groom .lean'), legF: q('.g-leg.front'), legB: q('.g-leg.back'),
      arm: q('.g-arm'), arm2: q('.g-arm2'), head: q('.g-head'), box: q('.ringbox'), lid: q('.ringbox .lid'), eyeO: q('.g-head .eye-open'), eyeC: q('.g-head .eye-closed'), blush: q('.g-head .blush') };
    const B = { root: q('.bride'), walk: q('.bride .walker'), lean: q('.bride .lean'), arm: q('.b-arm'), arm2: q('.b-arm2'), bouquet: q('.b-arm .bouquet'), head: q('.b-head'), foot: q('.b-foot'),
      eyeO: q('.b-head .eye-open'), eyeC: q('.b-head .eye-closed'), eyeH: q('.b-head .eye-heart'), blush: q('.b-head .blush') };
    const lips = [['.g-head', 0], ['.b-head', 1]].map(([c]) => ({ m: q(c + ' .mouth'), p: q(c + ' .pucker') }));
    const doves = q('.doves'), wings = [...svg.querySelectorAll('.doves .wing')];
    const cupid = q('.cupid'), cWing = q('.cupid .c-wing'), arrow = q('.arrow'), sweat = q('.g-head .sweat');
    const cd3 = $('#cd3'), flash = $('#flash'), pol = $('#polaroid');
    $('#polaroidImg').src = url(W.couplePhoto);
    const fly = B.bouquet.cloneNode(true); fly.style.opacity = 0; svg.appendChild(fly);
    let flyFrom = null;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const seg = (t, a, b) => clamp((t - a) / (b - a));
    const inOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const outQuad = p => 1 - (1 - p) * (1 - p);
    const outCubic = p => 1 - Math.pow(1 - p, 3);
    const outBack = p => { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
    const bump = p => Math.sin(Math.PI * clamp(p));          // 0 → 1 → 0 mượt
    const set = (el, v) => el && el.setAttribute('transform', v);
    const op_ = (el, v) => el && (el.style.opacity = v);
    const screenOf = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const toSvg = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; return p.matrixTransform(svg.getScreenCTM().inverse()); };
    const fired = {};
    const once = (k, t, at, fn) => { if (t >= at && !fired[k]) { fired[k] = 1; fn(); } };
    const t0 = performance.now();

    function frame(now) {
      const t = (now - t0) / 1000;
      const tl = t;
      // --- đi vào: giảm tốc dần, bước chân tính theo quãng đường nên không trượt chân ---
      const pw = seg(t, .9, 2.7), walkD = 170 * outQuad(pw);
      const pa = seg(t, 3.9, 4.4), appD = 40 * inOut(pa);
      const amp = (pw > 0 && pw < 1 ? Math.pow(1 - pw, .7) : 0) + .45 * bump(pa);
      const phase = (walkD + appD) / 44 * Math.PI * 2;
      const tw = seg(t, 5.3, 6.2), twE = inOut(tw);           // xoay vòng
      const wave = inOut(seg(tl, 7.6, 7.9)) - inOut(seg(tl, 8.7, 9.0));
      // cúi chào hai họ: quay sang trái chào nhà trai, quay sang phải chào nhà gái
      const sep = 0;
      const gTurn = 0, bTurn = 0;
      const bowL = 0, bowR = 0;
      const gx = -240 + walkD + appD - 30 * wave - 28 * sep, bx = 240 - walkD - appD + 20 * bump(tw) + 30 * wave + 28 * sep;
      const vis = clamp((t - .9) / .35);
      op_(G.root, vis); op_(B.root, vis);
      set(G.root, `translate(${gx} 0) scale(.86)`); set(B.root, `translate(${bx} 0) scale(.86)`);
      // nhún theo bước; cô dâu nhảy cẫng 2 lần khi thấy nhẫn, nhún nhẹ khi xoay
      const hop = (t > 3.15 && t < 3.85 ? 16 * Math.abs(Math.sin(2 * Math.PI * seg(t, 3.15, 3.85))) : 0) + 6 * bump(tw);
      set(G.walk, `translate(0 ${-4 * amp * Math.abs(Math.sin(phase))})`);
      set(B.walk, `translate(0 ${-2.5 * amp * Math.abs(Math.sin(phase)) - hop})`);
      set(G.legF, `rotate(${18 * amp * Math.sin(phase)} 11 -64)`);
      set(G.legB, `rotate(${-18 * amp * Math.sin(phase)} -11 -64)`);
      // tay chú rể: đánh khi đi → đưa hộp nhẫn → ôm eo → giơ cao nắm tay xoay cô dâu
      const offer = inOut(seg(t, 2.8, 3.2)) - inOut(seg(t, 3.75, 4.05));
      const hug = inOut(seg(t, 4.05, 4.5));
      const shake = (t > 2.95 && t < 3.3) ? 2.2 * Math.sin(t * 70) : 0;   // run tay hồi hộp
      const waveSw = Math.sin((tl - 7.6) * 11) * wave;
      const armA = -12 * amp * Math.sin(phase) - 75 * offer - 45 * hug * (1 - sep) - 105 * bump(tw) + shake - 100 * wave + 16 * waveSw;
      set(G.arm, `rotate(${armA} 7 -136)`);
      // tay sau chú rể: đánh ngược tay trước khi đi, giơ lên vẫy cùng lúc chào khách
      set(G.arm2, `rotate(${14 * amp * Math.sin(phase) + 150 * wave - 18 * waveSw} 2 -136)`);
      // tay trước cô dâu: đánh khi đi → che miệng bất ngờ khi thấy nhẫn → đặt lên vai chú rể khi hôn → vẫy chào
      const b2 = -10 * amp * Math.sin(phase) + 150 * bump(seg(t, 3.15, 3.95)) + 100 * (inOut(seg(t, 4.15, 4.45)) - inOut(seg(t, 5.1, 5.3))) + 120 * wave + 20 * waveSw;
      set(B.arm2, `rotate(${b2} -8 -133)`);
      op_(G.box, clamp(seg(t, 2.85, 3.0) - seg(t, 3.75, 3.95)));
      set(G.box, `rotate(${-armA} 35 -69) translate(35 -69) scale(${1.6 * (.6 + .4 * outBack(seg(t, 2.85, 3.1)))}) translate(-35 69)`);
      set(G.lid, `rotate(${-110 * outBack(seg(t, 3.05, 3.35))} 27 -71)`);
      set(B.head, `rotate(${-9 * bump(seg(t, 3.2, 3.9)) - 14 * (bowL + bowR)} -2 -148)`);
      // nghiêng người hôn, tách nhẹ khi xoay, thở nhẹ
      const lean = inOut(seg(t, 4.0, 4.45)) * (1 - .8 * bump(tw)) * (1 - wave) * (1 - sep), breathe = t > 4.6 ? Math.sin((t - 4.6) * 2.4) * .7 : 0;
      set(G.head, `rotate(${6 * bump(seg(t, 2.6, 3.2)) + 14 * (bowL + bowR)} 0 -150)`);
      set(G.lean, `rotate(${4 * lean + breathe - 18 * bowL + 18 * bowR} 0 0) scale(${Math.cos(Math.PI * gTurn)} 1)`);
      const spin = Math.cos(2 * Math.PI * twE), flare = 1 + .18 * bump(tw);
      set(B.lean, `translate(0 ${-4 * lean}) rotate(${-4 * lean - breathe - 18 * bowL + 18 * bowR} 0 0) scale(${spin * flare * Math.cos(Math.PI * bTurn)} 1)`);
      // tay cô dâu: giơ hoa bất ngờ → lấy đà → tung hoa → hạ tay
      const surprise = -40 * bump(seg(t, 3.1, 3.9));
      const windup = 35 * bump(seg(t, 6.15, 6.45));
      const toss = -165 * (outBack(seg(t, 6.45, 6.75)) - inOut(seg(t, 7.0, 7.5)));
      set(B.arm, `rotate(${surprise + windup + toss - 140 * wave - 22 * waveSw} 10 -133)`);
      // tung bó hoa: tách khỏi tay, bay vút lên xoay tròn
      once('release', t, 6.65, () => {
        const [x, y] = screenOf(B.bouquet); flyFrom = toSvg(x, y);
        B.bouquet.style.opacity = 0; fly.style.opacity = 1;
      });
      if (flyFrom) {
        const p = seg(t, 6.65, 7.6);
        set(fly, `translate(${flyFrom.x + 70 * p} ${flyFrom.y - 360 * outCubic(p)}) rotate(${600 * p}) scale(${1.1 + .3 * p}) translate(-8 104)`);
        fly.style.opacity = 1 - seg(t, 7.35, 7.6);
      }
      once('catch', t, 7.45, () => { const [x, y] = screenOf(fly); burstAt(x, y, 40, pals[0], .7); });
      // mắt: tim khi thấy nhẫn → nhắm khi hôn → mở khi xoay
      const heart = seg(t, 3.25, 3.35) - seg(t, 4.1, 4.2);
      const closed = Math.max(seg(t, 4.35, 4.5) - seg(t, 5.2, 5.3), clamp((bowL + bowR) * 2 - .6), clamp((lean - .55) / .3));
      op_(B.eyeH, heart);
      set(B.eyeH, `translate(-12 -168) scale(${1.25 + .3 * Math.abs(Math.sin(t * 9))}) translate(12 168)`);
      op_(B.eyeO, (1 - closed) * (1 - heart)); op_(B.eyeC, closed);
      op_(G.eyeO, 1 - closed); op_(G.eyeC, closed);
      // môi chu ra lúc hôn
      const kissLips = Math.max(seg(t, 4.3, 4.45) - seg(t, 5.2, 5.3), clamp((lean - .55) / .3));   // chu môi mọi lúc hai người kề sát hôn
      lips.forEach(L => { op_(L.m, 1 - kissLips); op_(L.p, kissLips); });
      op_(G.blush, seg(t, 4.45, 5)); op_(B.blush, Math.max(seg(t, 4.45, 5), heart * .8));
      // hất chân sau khi hôn (ẩn khi xoay)
      const fp = seg(t, 4.45, 5.0);
      op_(B.foot, clamp(fp * 3) * (1 - seg(t, 5.2, 5.35))); set(B.foot, `rotate(${50 * (1 - outBack(fp))} 30 -12)`);
      // đôi bồ câu kéo băng rôn bay vào, lượn nhẹ, vỗ cánh
      const dp = outCubic(seg(t, 4.9, 6.1));
      op_(doves, seg(t, 4.9, 5.1));
      const away = Math.pow(seg(tl, 9.9, 10.9), 2);
      set(doves, `translate(${-430 * (1 - dp) + 260 * away} ${-296 + 5 * Math.sin(t * 3) - 40 * (1 - dp) - 420 * away})`);
      const flap = Math.sin(t * (dp < 1 || away > 0 ? 18 : 11));
      wings.forEach((w, i) => set(w, `rotate(${(i % 2 ? 22 : -22) * flap} -2 -2)`));
      // Cupid bay ngang, giương cung bắn mũi tên vào giữa hai người
      const cp = seg(t, 1.0, 2.9);
      const cx = -300 + 600 * cp, cy = -235 + 14 * Math.sin(cp * Math.PI * 3);
      op_(cupid, clamp(seg(t, 1.0, 1.2) - seg(t, 2.7, 2.9)));
      set(cupid, `translate(${cx} ${cy}) rotate(${6 * Math.sin(t * 5)})`);
      set(cWing, `rotate(${28 * Math.sin(t * 20)} -4 -4)`);
      const ap = seg(t, 1.75, 2.15);
      if (ap > 0 && ap < 1) {
        const sx = -300 + 600 * seg(1.75, 1.0, 2.9) + 20, sy = -240, ex = 0, ey = -130;
        const ax = sx + (ex - sx) * ap, ay = sy + (ey - sy) * ap;
        op_(arrow, 1); set(arrow, `translate(${ax} ${ay}) rotate(${Math.atan2(ey - sy, ex - sx) * 180 / Math.PI})`);
      } else op_(arrow, 0);
      once('arrowHit', t, 2.15, () => { const r = svg.getBoundingClientRect(); const pt = svg.createSVGPoint(); pt.x = 0; pt.y = -130; const s = pt.matrixTransform(svg.getScreenCTM()); burstAt(s.x, s.y, 36, pals[1], .7); });
      // chú rể toát mồ hôi khi đưa nhẫn
      op_(sweat, clamp(seg(t, 2.85, 2.95) - seg(t, 3.45, 3.6)));
      set(sweat, `translate(0 ${8 * seg(t, 2.9, 3.55)})`);
      // hạt: nhẫn lấp lánh, tim vui trên đầu cô dâu, tim nổ khi hôn, sao khi xoay
      once('ring', t, 3.25, () => { const [x, y] = screenOf(q('.ringbox .ring')); burstAt(x, y, 26, pals[0], .5); });
      once('joy1', t, 3.3, () => { const [x, y] = screenOf(B.head); burstAt(x, y - 30, 14, pals[1], .45); });
      once('joy2', t, 3.65, () => { const [x, y] = screenOf(B.head); burstAt(x, y - 30, 14, pals[3], .45); });
      once('kiss', t, 4.5, () => { const [x1, y1] = screenOf(G.head), [x2, y2] = screenOf(B.head); burstAt((x1 + x2) / 2, Math.min(y1, y2) - 10, 60, pals[1], 1); });
      once('twirl', t, 5.75, () => { const [x, y] = screenOf(B.walk); burstAt(x, y + 40, 30, pals[2], .6); });
      // đếm 3-2-1 → flash máy ảnh → ảnh polaroid thật rơi xuống
      const ci = tl >= 8.0 && tl < 9.0 ? Math.floor((tl - 8.0) / .3333) : -1;
      if (ci >= 0) {
        const lp = ((tl - 8.0) % .3333) / .3333;
        cd3.textContent = 3 - ci;
        cd3.style.opacity = 1 - lp * .6;
        cd3.style.transform = `scale(${1.6 - .6 * outBack(clamp(lp * 2))})`;
      } else cd3.style.opacity = 0;
      flash.style.opacity = tl >= 9.0 ? Math.max(0, 1 - seg(tl, 9.0, 9.55)) : 0;
      svg.style.opacity = 1 - .55 * seg(tl, 9.0, 9.4);
      const pp = seg(tl, 9.05, 9.95);
      if (pp > 0) {
        pol.style.opacity = 1;
        const y = -160 * (1 - outBack(pp)), r = -25 + 19 * outBack(pp) + (tl > 10 ? Math.sin((tl - 10) * 2) * 1.2 : 0);
        pol.style.transform = `translate(-50%, calc(-50% + ${y}vh)) rotate(${r}deg)`;
      }
      once('snap', tl, 9.0, () => burstAt(innerWidth / 2, innerHeight / 2, 70, pals[2], 1.1));
      once('land', tl, 9.9, () => burstAt(innerWidth / 2, innerHeight / 2 + 40, 40, pals[1], .8));
      if (t < 13.5) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

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
  function explode(x, y, n, palette, speed = 1) {
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + R(-.1, .1), sp = R(1.5, 8) * dpr * speed;
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
    const shots = [[.5, .28], [.25, .35], [.75, .35], [.5, .2]];   // 1 đợt, 4 quả nhẹ nhàng
    shots.forEach(([fx, fy], i) => setTimeout(() => launch(fx + R(-.04, .04), fy + R(-.04, .04), pals[i % pals.length]), i * 350));
  }
  function burstAt(cx, cy, n, pal, speed = 1) { explode(cx * dpr, cy * dpr, n, pal, speed); }
  window.__burst = (x, y) => burstAt(x, y, 36, pals[1], .7);

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
      if (r.y <= r.ty || r.vy > -2 * dpr) { explode(r.x, r.y, 45, r.pal); return false; }
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
