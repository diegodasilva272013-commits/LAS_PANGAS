/* Visor de platillos: al tocar una foto se abre la ficha del plato.
   - Plato en 3D que se gira con el dedo/mouse (y con el giroscopio del celular), con zoom para ver la porción.
   - Si existe un modelo real  assets/3d/<slug>.glb  se muestra en 3D verdadero (y en realidad aumentada en el celular).
   - Si existe un video  assets/videos/<slug>.mp4  se reproduce sobre el plato.
   - Muestra lo que trae el plato, tal como está impreso en la carta. */
(function () {
  'use strict';
  var LP = window.LP; if (!LP) return;
  var VIDEOS = LP.VIDEOS || [];
  var MENU = LP.MENU, PHOTOS = LP.PHOTOS, FEATURED = LP.FEATURED;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* foto -> renglones de la carta que la describen (categoria + nombres exactos) */
  var DISH = {
    'mini-tostadas-atun': ['arrancar', ['Mini tostadas de atún']],
    'pina-de-mariscos': ['arrancar', ['Piña de mariscos']],
    'taco-de-pulpo': ['tacos', ['Taco de pulpo']],
    'tostada-mamalona': ['tostadas', ['Mamalona']],
    'torre-sinaloense': ['tostadas', ['Torre Sinaloense']],
    'aguacate-relleno': ['cuidarse', ['Aguacate relleno de atún']],
    'caldo-paisa': ['caldito', ['Paisa']],
    'caldo-camaron': ['caldito', ['Camarón']],
    'parrillada': ['asador', ['Parrillada 1', 'Parrillada 2', 'Parrillada 3']],
    'asador': ['asador', ['Pulpo zarandeado']],
    'camarones-coco': ['camarones', ['Al coco']],
    'camarones-empanizados': ['camarones', ['Empanizados']],
    'molcajete': ['molcajete', ['Mar y Tierra']],
    'mojarra': ['filetes', ['Mojarra']],
    'ceviche-mitotero': ['ceviches', ['Mitotero']],
    'aguachile-mango-habanero': ['aguachiles', ['Camarón']],
    'aguachile-verde': ['aguachiles', ['Camarón']],
    'aguachile-rojo': ['aguachiles', ['Camarón']],
    'coctel-camaron': ['cocteles', ['Clásico camarón']],
    'campechana': ['cocteles', ['Clásica']],
    'rollo-tempura': ['rollos', ['Tempura']],
    'rib-eye-camarones': ['no-marisco', ['Rib eye con camarones']],
    'postre': ['dulce', ['Cheesecake de fresa', 'Brownie de chocolate', 'Pan de elote']],
    'plebes': ['plebes', ['Nuggets', 'Camarones empanizados', 'Tiras de pescado']]
  };

  function lookup(slug) {
    var f = FEATURED.filter(function (x) { return x.slug === slug; })[0];
    var d = DISH[slug], out = { slug: slug, title: PHOTOS[slug] || '', kicker: '', items: [] };
    if (d) {
      var cat = MENU.filter(function (c) { return c.id === d[0]; })[0];
      if (cat) {
        out.kicker = cat.title;
        cat.groups.forEach(function (g) {
          g.items.forEach(function (it) { if (d[1].indexOf(it.n) > -1) out.items.push(it); });
        });
      }
    }
    if (f) { out.kicker = f.kicker || out.kicker; out.title = f.name; if (!out.items.length) out.items.push({ n: f.name, d: f.line, p: f.price }); }
    return out;
  }
  function priceHTML(p) {
    if (typeof p === 'string') return '<span class="dv__pr">' + esc(p) + '</span>';
    if (Array.isArray(p)) return p.map(function (x) { return '<span class="dv__pr"><small>' + esc(x[0]) + '</small>' + money(x[1]) + '</span>'; }).join('');
    return '<span class="dv__pr">' + money(p) + '</span>';
  }

  var root, list = [], idx = 0, rafId = 0, st = { rx: 0, ry: 0, tx: 0, ty: 0, zoom: false, drag: false, lx: 0, ly: 0, gyro: false };
  var lastFocus = null, modelState = {};

  function build() {
    root = document.createElement('div');
    root.className = 'dv'; root.id = 'dv'; root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-lenis-prevent', '');
    root.innerHTML =
      '<div class="dv__scrim"></div>' +
      '<div class="dv__win" role="dialog" aria-modal="true" aria-label="Ficha del platillo">' +
        '<button class="dv__x" type="button" aria-label="Cerrar">' +
          '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '<div class="dv__stage">' +
          '<div class="dv__scene"><div class="dv__floor"></div><div class="dv__plate"><div class="dv__face"><div class="dv__media"></div><i class="dv__glare"></i></div></div></div>' +
          '<div class="dv__model" hidden></div>' +
          '<div class="dv__player"><div class="dv__vwrap"><video playsinline preload="metadata" loop></video>' +
            '<button class="dv__big" type="button" aria-label="Reproducir"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="#fff"/></svg></button>' +
            '<div class="dv__ctl"><button class="dv__pp" type="button" aria-label="Pausar"><svg viewBox="0 0 24 24"></svg></button>' +
              '<div class="dv__bar" role="slider" aria-label="Avance del video"><i></i></div>' +
              '<button class="dv__mu" type="button" aria-label="Sonido"><svg viewBox="0 0 24 24"></svg></button>' +
              '<button class="dv__fs" type="button" aria-label="Pantalla completa"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div></div></div>' +
          '<div class="dv__tabs" hidden><button type="button" data-m="video"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>Video</button><button type="button" data-m="plato">Plato</button></div>' +
          '<div class="dv__tools">' +
            '<span class="dv__hint"><b></b></span>' +
            '<button type="button" class="dv__zoom" aria-pressed="false"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg><span>Ver de cerca</span></button>' +
          '</div>' +
          '<button class="dv__nav dv__nav--p" type="button" aria-label="Plato anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
          '<button class="dv__nav dv__nav--n" type="button" aria-label="Plato siguiente"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
        '</div>' +
        '<div class="dv__info" data-lenis-prevent>' +
          '<span class="dv__k"></span><h2 class="dv__t"></h2>' +
          '<div class="dv__items"></div>' +
          '<div class="dv__cta">' +
            '<button class="btn btn--solid dv__order" type="button"><span>Pedir este plato</span><i class="btn__dot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></i></button>' +
            '<span class="dv__count"></span>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    var q = function (s) { return root.querySelector(s); };
    root._ = { scrim: q('.dv__scrim'), x: q('.dv__x'), plate: q('.dv__plate'), face: q('.dv__face'), media: q('.dv__media'),
      glare: q('.dv__glare'), stage: q('.dv__stage'), scene: q('.dv__scene'), model: q('.dv__model'), hint: q('.dv__hint b'),
      zoom: q('.dv__zoom'), prev: q('.dv__nav--p'), next: q('.dv__nav--n'), k: q('.dv__k'), t: q('.dv__t'),
      player: q('.dv__player'), vid: q('.dv__player video'), big: q('.dv__big'), pp: q('.dv__pp'), bar: q('.dv__bar'), mu: q('.dv__mu'), fs: q('.dv__fs'),
      tabs: q('.dv__tabs'), items: q('.dv__items'), order: q('.dv__order'), count: q('.dv__count'), info: q('.dv__info') };
    wire(); wirePlayer();
  }

  function head(url) {
    return fetch(url, { method: 'HEAD', cache: 'no-cache' }).then(function (r) {
      var ct = r.headers.get('content-type') || '';
      return r.ok && !/text\/html/i.test(ct);
    }).catch(function () { return false; });
  }

  function show(i, mode) {
    idx = (i + list.length) % list.length;
    var slug = list[idx], d = lookup(slug), r = root._;
    st.zoom = false; r.zoom.setAttribute('aria-pressed', 'false'); root.classList.remove('is-zoom');
    st.rx = st.ry = st.tx = st.ty = 0;
    r.media.innerHTML = '<img src="assets/img/' + slug + '.webp" alt="' + esc(d.title) + '" draggable="false">';
    r.model.hidden = true; r.model.innerHTML = ''; root.classList.remove('has-model');
    r.k.textContent = d.kicker;
    r.t.textContent = d.title;
    r.items.innerHTML = d.items.map(function (it) {
      return '<article class="dv__it"><div class="dv__itop"><h3>' + esc(it.n) + '</h3>' + (it.p != null ? priceHTML(it.p) : '') + '</div>' +
        (it.note ? '<p class="dv__note">' + esc(it.note) + '</p>' : '') +
        (it.d ? '<p>' + esc(it.d) + '</p>' : '') + '</article>';
    }).join('');
    r.info.scrollTop = 0;
    r.count.textContent = (idx + 1) + ' / ' + list.length;
    r.hint.textContent = matchMedia('(pointer:coarse)').matches ? 'Arrastrá para girar el plato' : 'Arrastrá para girar el plato';
    r.order._name = d.items.length === 1 ? d.items[0].n : d.title;
    r.order._full = d.title;

    /* video real del plato */
    var token = ++modelState.t;
    var vid = r.vid; vid.pause(); vid.removeAttribute('src'); vid.load();
    r.tabs.hidden = true; root.classList.remove('is-video', 'dv--vid'); root._.mode = 'plato';
    var setVideo = function () {
      vid.poster = 'assets/img/' + slug + '.webp'; vid.src = 'assets/videos/' + slug + '.mp4';
      r.tabs.hidden = false; root.classList.add('dv--vid');
      setMode(mode === 'plato' ? 'plato' : 'video');
    };
    if (VIDEOS.indexOf(slug) > -1) setVideo();
    else head('assets/videos/' + slug + '.mp4').then(function (ok) { if (ok && token === modelState.t) setVideo(); });
    head('assets/3d/' + slug + '.glb').then(function (ok) {
      if (!ok || token !== modelState.t) return;
      loadModelViewer().then(function () {
        if (token !== modelState.t) return;
        r.model.innerHTML = '<model-viewer src="assets/3d/' + slug + '.glb" alt="' + esc(d.title) + '" camera-controls auto-rotate ar ar-modes="webxr scene-viewer quick-look" shadow-intensity="1.1" exposure="1.05" interaction-prompt="none"></model-viewer>';
        r.model.hidden = false; root.classList.add('has-model');
        r.hint.textContent = 'Girá y acercá el plato en 3D';
      });
    });
  }
  modelState.t = 0;
  var mvP;
  function loadModelViewer() {
    if (mvP) return mvP;
    mvP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
    return mvP;
  }

  var ICO = {
    play: '<path d="M8 5.5v13l11-6.5z" fill="#fff" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    vol: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="#fff"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="#fff"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'
  };
  Object.keys(ICO).forEach(function (k) { ICO[k] = '<svg viewBox="0 0 24 24">' + ICO[k] + '</svg>'; });
  function setMode(m) {
    var r = root._, vid = r.vid;
    root._.mode = m;
    root.classList.toggle('is-video', m === 'video');
    r.tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === m); });
    if (m === 'video') {
      vid.currentTime = 0; vid.muted = false; r.mu.innerHTML = ICO.vol;
      var pr = vid.play();
      if (pr && pr.catch) pr.catch(function () { vid.muted = true; r.mu.innerHTML = ICO.mute; vid.play().catch(function () {}); });
    } else { vid.pause(); }
    syncPP();
  }
  function syncPP() {
    var r = root._, playing = !r.vid.paused && !r.vid.ended;
    r.pp.innerHTML = playing ? ICO.pause : ICO.play;
    r.pp.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
    root.classList.toggle('is-paused', !playing);
  }
  function wirePlayer() {
    var r = root._, v = r.vid;
    var toggle = function () { if (v.paused) v.play().catch(function () {}); else v.pause(); };
    r.pp.addEventListener('click', toggle); r.big.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    v.addEventListener('play', syncPP); v.addEventListener('pause', syncPP); v.addEventListener('ended', syncPP);
    v.addEventListener('timeupdate', function () { r.bar.firstChild.style.transform = 'scaleX(' + (v.duration ? v.currentTime / v.duration : 0) + ')'; });
    r.mu.addEventListener('click', function () { v.muted = !v.muted; r.mu.innerHTML = v.muted ? ICO.mute : ICO.vol; });
    r.bar.addEventListener('click', function (e) { var b = r.bar.getBoundingClientRect(); if (v.duration) v.currentTime = v.duration * Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)); });
    r.fs.addEventListener('click', function () {
      var w = v.parentNode;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (w.requestFullscreen) w.requestFullscreen().catch(function () {});
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    });
    r.tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setMode(b.dataset.m); });
    r.pp.innerHTML = ICO.play; r.mu.innerHTML = ICO.vol;
  }

  /* ---------- plato 3D ---------- */
  function loop() {
    var r = root._;
    st.rx += (st.tx - st.rx) * 0.12; st.ry += (st.ty - st.ry) * 0.12;
    var z = st.zoom ? 1.55 : 1;
    r.plate.style.transform = 'rotateX(' + st.rx.toFixed(2) + 'deg) rotateY(' + st.ry.toFixed(2) + 'deg) scale(' + z + ')';
    r.glare.style.background = 'radial-gradient(circle at ' + (50 + st.ry * 2.2).toFixed(1) + '% ' + (50 - st.rx * 2.2).toFixed(1) + '%, rgba(255,255,255,.32), transparent 55%)';
    r.scene.style.setProperty('--sx', (-st.ry * 1.2).toFixed(1) + 'px');
    rafId = requestAnimationFrame(loop);
  }
  function clamp(v, m) { return Math.max(-m, Math.min(m, v)); }

  function wire() {
    var r = root._;
    r.x.addEventListener('click', close);
    r.scrim.addEventListener('click', close);
    r.prev.addEventListener('click', function () { show(idx - 1, root._.mode); });
    r.next.addEventListener('click', function () { show(idx + 1, root._.mode); });
    r.zoom.addEventListener('click', function () {
      st.zoom = !st.zoom; r.zoom.setAttribute('aria-pressed', st.zoom); root.classList.toggle('is-zoom', st.zoom);
      r.zoom.querySelector('span').textContent = st.zoom ? 'Ver completo' : 'Ver de cerca';
    });
    r.order.addEventListener('click', function () {
      var name = r.order._name, a = window.LPAssistant;
      close();
      if (a) a.ask('Hola, quiero pedir: ' + name + '.');
    });
    r.stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button,model-viewer')) return;
      st.drag = true; st.lx = e.clientX; st.ly = e.clientY; r.stage.setPointerCapture(e.pointerId); r.stage.classList.add('is-drag');
    });
    r.stage.addEventListener('pointermove', function (e) {
      if (st.drag) {
        st.ty = clamp(st.ty + (e.clientX - st.lx) * 0.35, 38); st.tx = clamp(st.tx - (e.clientY - st.ly) * 0.35, 30);
        st.lx = e.clientX; st.ly = e.clientY;
      } else if (e.pointerType === 'mouse') {
        var b = r.stage.getBoundingClientRect();
        st.ty = ((e.clientX - b.left) / b.width - .5) * 26; st.tx = -((e.clientY - b.top) / b.height - .5) * 20;
      }
    });
    var end = function () { st.drag = false; r.stage.classList.remove('is-drag'); };
    r.stage.addEventListener('pointerup', end); r.stage.addEventListener('pointercancel', end);
    r.stage.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !st.drag) { st.tx = 0; st.ty = 0; } });
    document.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1, root._.mode);
      else if (e.key === 'ArrowLeft') show(idx - 1, root._.mode);
    });
    /* giroscopio en el celular: inclinas el telefono y el plato se mueve */
    window.addEventListener('deviceorientation', function (e) {
      if (!root.classList.contains('is-open') || st.drag || e.gamma == null) return;
      st.ty = clamp(e.gamma * 0.6, 26); st.tx = clamp(-(e.beta - 45) * 0.5, 22);
    });
  }

  function collect() {
    var seen = {}; list = [];
    document.querySelectorAll('.media[data-slug]').forEach(function (m) {
      var s = m.getAttribute('data-slug');
      if (!seen[s] && PHOTOS[s]) { seen[s] = 1; list.push(s); }
    });
    FEATURED.forEach(function (f) { if (!seen[f.slug]) { seen[f.slug] = 1; list.push(f.slug); } });
  }

  function open(slug, mode) {
    if (!root) build();
    collect();
    var i = list.indexOf(slug); if (i < 0) { list.push(slug); i = list.length - 1; }
    lastFocus = document.activeElement;
    show(i, mode);
    root.classList.add('is-open'); root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('dv-open');
    if (window.__lenis && window.__lenis.stop) window.__lenis.stop();
    cancelAnimationFrame(rafId); if (!reduce) loop(); else loop();
    root._.x.focus({ preventScroll: true });
  }
  function close() {
    if (!root || !root.classList.contains('is-open')) return;
    root.classList.remove('is-open'); root.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('dv-open');
    cancelAnimationFrame(rafId);
    root._.vid.pause(); root._.vid.muted = true;
    if (window.__lenis && window.__lenis.start) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- disparadores ---------- */
  document.addEventListener('click', function (e) {
    if (document.documentElement.classList.contains('dv-open')) return;
    var vb = e.target.closest && e.target.closest('.vbtn');
    if (vb) { e.preventDefault(); open(vb.getAttribute('data-slug'), 'video'); return; }
    var m = e.target.closest && e.target.closest('.media[data-slug], .card[data-i]');
    if (!m) return;
    var slug = m.getAttribute('data-slug');
    if (!slug) { var f = FEATURED[+m.getAttribute('data-i')]; slug = f && f.slug; }
    if (slug && (PHOTOS[slug] || DISH[slug])) { e.preventDefault(); open(slug); }
  });
  /* teclado: las fotos se pueden abrir con Enter */
  function markA11y() {
    document.querySelectorAll('.media[data-slug]').forEach(function (m) {
      if (m.hasAttribute('data-dv')) return;
      m.setAttribute('data-dv', ''); m.setAttribute('tabindex', '0'); m.setAttribute('role', 'button');
      m.setAttribute('aria-label', 'Ver el plato: ' + (PHOTOS[m.getAttribute('data-slug')] || ''));
      m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(m.getAttribute('data-slug')); } });
    });
  }
  function videoButtons() {
    VIDEOS.forEach(function (slug) {
      var d = DISH[slug]; if (!d) return;
      var cat = document.getElementById('cat-' + d[0]); if (!cat) return;
      cat.querySelectorAll('.item').forEach(function (li) {
        var h = li.querySelector('.item__name');
        if (!h || h.textContent.trim() !== d[1][0] || li.querySelector('.vbtn')) return;
        li.insertAdjacentHTML('beforeend', '<button class="vbtn" type="button" data-slug="' + slug + '"><i><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></i><span>Ver video del plato</span></button>');
      });
    });
  }
  function init() { markA11y(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.LPDish = { open: open, close: close };
})();
