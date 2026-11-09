/* ============================================================
   LAS PANGAS — comportamiento
   ============================================================ */
(() => {
  'use strict';
  const { SITE, PHOTOS, FEATURED, MENU, DRINKS, MESA } = window.LP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '$' + Number(n).toLocaleString('en-US');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  /* ---------- piezas ---------- */
  const img = (slug, eager) =>
    `<img src="assets/img/${slug}.webp" alt="${esc(PHOTOS[slug] || '')}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
  const media = (slug, pos = '') =>
    `<div class="media" data-slug="${slug}">${img(slug).replace('<img ', pos ? `<img style="object-position:${pos}" ` : '<img ')}</div>`;

  const priceHTML = p => Array.isArray(p)
    ? p.map(([l, v]) => `<span class="price"><small>${esc(l)}</small>${money(v)}</span>`).join('')
    : `<span class="price">${money(p)}</span>`;

  const itemHTML = it => `
    <li class="item">
      <div class="item__top">
        <h4 class="item__name">${esc(it.n)}</h4><i class="leader" aria-hidden="true"></i>
        <div class="prices">${priceHTML(it.p)}</div>
      </div>
      ${it.note ? `<p class="item__note">${esc(it.note)}</p>` : ''}
      ${it.d ? `<p class="item__desc">${esc(it.d)}</p>` : ''}
    </li>`;

  const tileHTML = (m, i) => {
    const d = `style="--d:${i * 0.1}s"`;
    if (typeof m === 'string')
      return `<figure class="tile reveal" ${d}>${media(m)}<figcaption>${esc(PHOTOS[m] || '')}</figcaption></figure>`;
    const c = m.card;
    return `<div class="tile reveal" ${d}><div class="tile__card tone-${c.tone}">
      <span class="k">${esc(c.kicker)}</span><span class="t">${esc(c.title)}</span><p class="x">${esc(c.text)}</p></div></div>`;
  };

  const catHTML = c => `
    <section class="cat" id="cat-${c.id}" data-chip="${esc(c.chip)}">
      <header class="cat__head">
        ${c.kicker ? `<span class="cat__kicker reveal">${esc(c.kicker)}</span>` : ''}
        <h3 class="cat__title reveal" style="--d:.06s">${esc(c.title)}</h3>
        ${c.brush ? `<p class="cat__brush reveal" style="--d:.14s">${esc(c.brush)}</p>` : ''}
      </header>
      ${c.media ? `<div class="tiles" data-n="${c.media.length}" style="--n:${c.media.length}">${c.media.map(tileHTML).join('')}</div>` : ''}
      <div class="bezel reveal"><div class="bezel__in">
        ${c.intro ? `<p class="intro">${esc(c.intro)}</p>` : ''}
        ${c.groups.map(g => `
          <div class="group">
            ${g.title ? `<h5 class="group__title">${esc(g.title)}</h5>` : ''}
            <ul class="items ${g.compact ? 'items--compact' : ''}">${g.items.map(itemHTML).join('')}</ul>
          </div>`).join('')}
      </div></div>
      ${c.callout ? `<aside class="callout reveal"><div class="callout__in">
        <h5 class="callout__title">${esc(c.callout.title)}</h5>
        ${c.callout.chips ? `<div class="callout__chips">${c.callout.chips.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
        <p class="callout__text">${esc(c.callout.text)}</p></div></aside>` : ''}
    </section>`;

  /* ---------- borde rasgado (como la carta impresa) ---------- */
  const tornSVG = (() => {
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const pts = ['0,100'];
    for (let x = 0; x <= 100.01; x += 1.6) pts.push(`${x.toFixed(1)},${(18 + rnd() * 62).toFixed(1)}`);
    pts.push('100,100');
    return fill => `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon fill="${fill}" points="${pts.join(' ')}"/></svg>`;
  })();
  $$('[data-torn]').forEach(el => {
    el.innerHTML = tornSVG(el.dataset.torn === 'paper' ? 'var(--paper)' : 'var(--blue-deep)');
  });

  /* ---------- imprescindibles ---------- */
  const rail = $('#rail');
  rail.innerHTML = FEATURED.map((f, i) => `
    <article class="card" aria-label="${esc(f.name)}" data-i="${i}">
      <div class="card__in">
        ${media(f.slug)}
        <div class="card__over">
          <span class="card__kicker">${esc(f.kicker)}</span>
          <h3 class="card__name">${esc(f.name)}</h3>
          <p class="card__line">${esc(f.line)}</p>
          <span class="card__price">${esc(f.price)}</span>
        </div>
      </div>
    </article>`).join('');
  $('#railCount').textContent = `01 / ${String(FEATURED.length).padStart(2, '0')}`;

  /* ---------- carta + chips ---------- */
  $('#cartaBody').innerHTML = MENU.map(catHTML).join('');
  $('#chipsRow').innerHTML = MENU.map(c => `<a class="chip" href="#cat-${c.id}" data-for="cat-${c.id}">${esc(c.chip)}</a>`).join('')
    + `<a class="chip" href="#bebidas">Bebidas</a>`;

  /* ---------- bebidas ---------- */
  (() => {
    const row = ([n, p, x]) => `<div class="drow"><span class="drow__n">${esc(n)}</span>${x ? `<span class="drow__x">${esc(x)}</span>` : ''}<i class="leader"></i><span class="drow__p">${money(p)}</span></div>`;
    const sub = (t, items) => `<h5 class="panel__sub">${esc(t)}</h5>${items.map(row).join('')}`;
    const tiles = DRINKS.photos.map((s, i) => `<figure class="tile reveal" style="--d:${i * .1}s">${media(s)}</figure>`).join('');
    const a = DRINKS.acompanar;
    $('#drinksBody').innerHTML = `
      <div class="drinks-tiles">${tiles}</div>
      <div class="drinks-grid">
        <div class="drinks-col">
          <div class="panel reveal"><div class="panel__in"><h3 class="panel__title">Cervezas</h3>
            <div class="two-col">${DRINKS.cervezas.map(row).join('')}</div>
            <h5 class="panel__sub">Pa’ acompañar</h5>
            <div class="ptable">${a.head.map(h => `<span class="h">${esc(h)}</span>`).join('')}
              ${a.rows.map(r => `<span class="n">${esc(r[0])}</span><span class="v">${money(r[1])}</span><span class="v">${money(r[2])}</span>`).join('')}</div>
          </div></div>
          <div class="panel reveal"><div class="panel__in"><h3 class="panel__title">Básicos</h3>${DRINKS.basicos.map(row).join('')}</div></div>
        </div>
        <div class="drinks-col">
          <div class="panel reveal"><div class="panel__in"><h3 class="panel__title">Coctelería</h3>
            ${DRINKS.cocteleria.map(g => sub(g.t, g.i)).join('')}</div></div>
          <div class="panel reveal"><div class="panel__in"><h3 class="panel__title">Destilados</h3>
            <div class="two-col">${DRINKS.destilados.map(g => sub(g.t, g.i)).join('')}</div></div></div>
        </div>
      </div>`;
  })();

  /* ---------- la mesa ---------- */
  $('#mesaGrid').innerHTML = MESA.map((m, i) => `
    <a class="pillar reveal" href="${m.to}" style="--d:${i * .08}s">
      <div class="pillar__in">${media(m.img, m.pos)}
        <div class="pillar__over"><span class="pillar__n">${m.n}</span><h3 class="pillar__t">${esc(m.t)}</h3><p class="pillar__d">${esc(m.d)}</p></div>
      </div>
    </a>`).join('');

  /* ---------- contacto (solo lo configurado) ---------- */
  (() => {
    const cta = [];
    if (SITE.whatsapp) cta.push(`<a class="btn btn--solid magnetic" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener"><span>Reservar por WhatsApp</span><i class="btn__dot">${ARROW}</i></a>`);
    if (SITE.instagram) cta.push(`<a class="btn ${SITE.whatsapp ? 'btn--ghost' : 'btn--solid'} magnetic" href="https://instagram.com/${SITE.instagram}" target="_blank" rel="noopener"><span>@${esc(SITE.instagram)}</span><i class="btn__dot">${ARROW}</i></a>`);
    if (SITE.facebook) cta.push(`<a class="btn btn--ghost magnetic" href="https://facebook.com/${SITE.facebook}" target="_blank" rel="noopener"><span>Facebook</span><i class="btn__dot">${ARROW}</i></a>`);
    $('#contactCta').innerHTML = cta.join('');
    const li = [];
    if (SITE.address) li.push(`<li><small>Dirección</small>${SITE.mapsUrl ? `<a href="${esc(SITE.mapsUrl)}" target="_blank" rel="noopener">${esc(SITE.address)}</a>` : esc(SITE.address)}</li>`);
    if (SITE.hours) li.push(`<li><small>Horario</small>${esc(SITE.hours)}</li>`);
    if (SITE.phone) li.push(`<li><small>Teléfono</small><a href="tel:${esc(SITE.phone.replace(/[^\d+]/g, ''))}">${esc(SITE.phone)}</a></li>`);
    $('#contactList').innerHTML = li.join('');
    if (!li.length) $('#contactList').remove();
  })();

  /* ---------- declaración: palabra por palabra ---------- */
  $$('[data-words]').forEach(p => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  });

  /* ============================================================
     VIDEOS — cada foto puede tener su video:
       assets/videos/<slug>.mp4   (o .webm)
     El slug es el nombre del archivo de la foto (ej: torre-sinaloense)
     y "hero" para el video de portada.
     ============================================================ */
  const studio = new URLSearchParams(location.search).has('studio');
  const idbOpen = () => new Promise((res, rej) => {
    const r = indexedDB.open('lp-studio', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('v');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const getBlob = async slug => {
    try { const db = await idbOpen(); return await new Promise(r => { const q = db.transaction('v').objectStore('v').get(slug); q.onsuccess = () => r(q.result || null); q.onerror = () => r(null); }); }
    catch { return null; }
  };
  const putBlob = async (slug, blob) => {
    try { const db = await idbOpen(); await new Promise(r => { const t = db.transaction('v', 'readwrite'); t.objectStore('v').put(blob, slug); t.oncomplete = r; t.onerror = r; }); } catch { /* sin almacenamiento */ }
  };

  const playVideo = el => { const v = el._video; if (v && el._inView) v.play().catch(() => {}); };
  function attachVideo(el, srcs) {
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.disablePictureInPicture = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    let i = 0;
    const next = () => { if (i >= srcs.length) { v.remove(); return; } v.src = srcs[i++]; };
    v.addEventListener('error', next);
    v.addEventListener('loadeddata', () => { el._video = v; el.classList.add('has-video'); playVideo(el); });
    el.appendChild(v); next();
  }
  async function probe(el) {
    const slug = el.dataset.slug; if (!slug || el._probed) return; el._probed = true;
    if (studio) { const b = await getBlob(slug); if (b) return attachVideo(el, [URL.createObjectURL(b)]); }
    attachVideo(el, [`assets/videos/${slug}.mp4`, `assets/videos/${slug}.webm`]);
  }
  const near = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { probe(e.target); near.unobserve(e.target); } }), { rootMargin: '400px 0px' });
  const playing = new IntersectionObserver(es => es.forEach(e => {
    const el = e.target; el._inView = e.isIntersecting;
    if (!el._video) return;
    if (e.isIntersecting) playVideo(el); else el._video.pause();
  }), { threshold: .35 });
  $$('.media[data-slug]').forEach(el => { near.observe(el); playing.observe(el); });

  if (studio) {
    document.body.classList.add('studio');
    document.body.insertAdjacentHTML('beforeend', '<div class="studio-banner">Modo estudio · los videos subidos aquí solo se ven en este navegador. Para publicarlos, guárdalos en assets/videos/&lt;nombre&gt;.mp4</div>');
    $$('.media[data-slug]').forEach(el => {
      const slug = el.dataset.slug;
      el.insertAdjacentHTML('beforeend', `<label class="studio-btn">+ Video · ${slug}<input type="file" accept="video/*"></label>`);
      $('input', el).addEventListener('change', async e => {
        const f = e.target.files[0]; if (!f) return;
        await putBlob(slug, f);
        el._video?.remove(); el._video = null; el.classList.remove('has-video'); el._probed = false;
        probe(el);
      });
    });
  }

  /* ============================================================
     MOVIMIENTO
     ============================================================ */
  // aparición al entrar en pantalla
  const reveal = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { const t = e.target; t.classList.add('in'); reveal.unobserve(t); setTimeout(() => t.classList.add('done'), 2000); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => reveal.observe(el));

  // contadores
  const count = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; count.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 1600;
    const tick = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(2, -10 * k))); if (k < 1) requestAnimationFrame(tick); else el.textContent = to; };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => count.observe(el));

  // carrusel
  const cards = $$('.card', rail);
  const pad = n => String(n).padStart(2, '0');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $('#railCount').textContent = `${pad(+e.target.dataset.i + 1)} / ${pad(cards.length)}`;
  }), { root: rail, threshold: .6 });
  cards.forEach(c => spy.observe(c));
  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 20);
  $('#prev').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#next').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
  // arranca centrado en la primera tarjeta
  rail.scrollLeft = 0;

  // chips: sección activa
  const chipsRow = $('#chipsRow');
  const chipOf = id => $(`.chip[data-for="${id}"]`, chipsRow);
  const spyCat = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$('.chip.on', chipsRow).forEach(c => c.classList.remove('on'));
    const c = chipOf(e.target.id); if (!c) return;
    c.classList.add('on');
    document.dispatchEvent(new CustomEvent('chip:on', { detail: c }));
    chipsRow.scrollTo({ left: c.offsetLeft - chipsRow.clientWidth / 2 + c.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
  }), { rootMargin: '-35% 0px -60% 0px' });
  $$('.cat').forEach(c => spyCat.observe(c));

  // menú móvil
  const burger = $('#burger'), sheet = $('#sheet');
  const setSheet = open => {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    sheet.classList.toggle('open', open); sheet.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.__lenis) window.__lenis[open ? 'stop' : 'start']();
  };
  burger.addEventListener('click', () => setSheet(!sheet.classList.contains('open')));
  $$('a', sheet).forEach(a => a.addEventListener('click', () => setSheet(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setSheet(false); });

  // botones magnéticos (solo con mouse)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + 'px');
        b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }
})();
