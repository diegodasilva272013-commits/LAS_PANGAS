/* Visor de platillos: al tocar una foto se abre la ficha del plato.
   - Plato en 3D que se gira con el dedo/mouse (y con el giroscopio del celular), con zoom para ver la porción.
   - Si existe un modelo real  assets/3d/<slug>.glb  se muestra en 3D verdadero (y en realidad aumentada en el celular).
   - Si existe un video  assets/videos/<slug>.mp4  se reproduce sobre el plato.
   - Muestra lo que trae el plato, tal como está impreso en la carta. */
(function () {
  'use strict';
  var LP = window.LP; if (!LP) return;
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
      items: q('.dv__items'), order: q('.dv__order'), count: q('.dv__count'), info: q('.dv__info') };
    wire();
  }

  function head(url) {
    return fetch(url, { method: 'HEAD', cache: 'no-cache' }).then(function (r) {
      var ct = r.headers.get('content-type') || '';
      return r.ok && !/text\/html/i.test(ct);
    }).catch(function () { return false; });
  }

  function show(i) {
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

    /* video / modelo 3D reales, si los subieron */
    var token = ++modelState.t;
    head('assets/videos/' + slug + '.mp4').then(function (ok) {
      if (!ok || token !== modelState.t) return;
      var v = document.createElement('video');
      v.src = 'assets/videos/' + slug + '.mp4'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
      v.setAttribute('playsinline', ''); r.media.appendChild(v); v.play().catch(function () {});
    });
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
    r.prev.addEventListener('click', function () { show(idx - 1); });
    r.next.addEventListener('click', function () { show(idx + 1); });
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
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
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

  function open(slug) {
    if (!root) build();
    collect();
    var i = list.indexOf(slug); if (i < 0) { list.push(slug); i = list.length - 1; }
    lastFocus = document.activeElement;
    show(i);
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
    var v = root.querySelector('video'); if (v) v.pause();
    if (window.__lenis && window.__lenis.start) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- disparadores ---------- */
  document.addEventListener('click', function (e) {
    if (document.documentElement.classList.contains('dv-open')) return;
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', markA11y); else markA11y();
  window.LPDish = { open: open, close: close };
})();
