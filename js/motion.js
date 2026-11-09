/* ============================================================
   LAS PANGAS — capa de movimiento
   GSAP + ScrollTrigger + SplitText + Lenis + WebGL (agua)
   Si falta una librería o el usuario pidió "menos movimiento",
   la página queda completa y estática (html.nogsap).
   ============================================================ */
(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const libs = window.gsap && window.ScrollTrigger && window.SplitText;

  /* ---------- 1. Estructuras que existen con o sin animación ---------- */

  // marquesina: palabras + pastillas de foto
  const MQ = [
    [['Ceviches', 'o', 'aguachile-mango-habanero'], ['Aguachiles', 'f', 'callo-de-hacha'], ['Tostadas', 'o', 'tostada-mamalona'],
     ['Parrilladas', 'f', 'parrillada'], ['Caldos', 'o', 'caldo-camaron']],
    [['Pulpo', 'f', 'taco-de-pulpo'], ['Camarón', 'o', 'camarones-coco'], ['Atún', 'f', 'mini-tostadas-atun'],
     ['Mojarra', 'o', 'mojarra'], ['Mariscada', 'f', 'torre-sinaloense']]
  ];
  const mqSet = items => '<div class="mq__set">' + items.map(([w, k, img]) =>
    `<span class="mq__w ${k === 'f' ? 'mq__w--f' : ''}">${w}</span><span class="mq__pill" style="background-image:url(assets/img/${img}.webp)"></span><i class="mq__dot"></i>`).join('') + '</div>';
  $('#mq1').innerHTML = mqSet(MQ[0]) + mqSet(MQ[0]);
  $('#mq2').innerHTML = mqSet(MQ[1]) + mqSet(MQ[1]);

  // olas (como el estampado de la carta impresa)
  (() => {
    const wave = (y, off) => {
      let d = `M${-160 + off} ${y}`;
      for (let x = -160 + off; x < 3400; x += 160) d += ` q40 -24 80 0 t80 0`;
      return `<path d="${d}" fill="none" stroke="#0140A1" stroke-width="15" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    };
    $('#waves').innerHTML = `<svg viewBox="0 0 3200 120" preserveAspectRatio="none">${wave(26, 0)}${wave(60, 40)}${wave(94, 0)}</svg>`;
  })();

  // platos flotantes de la portada
  const FLOATS = [
    { s: 'aguachile-mango-habanero', w: 14, l: '4%', t: '14%', r: -6, d: .85 },
    { s: 'mini-tostadas-atun', w: 9, l: '2%', t: '56%', r: 5, d: 1.35 },
    { s: 'torre-sinaloense', w: 10.5, l: '17%', t: '64%', r: -4, d: 1.1 },
    { s: 'parrillada', w: 13, r_: '4%', t: '16%', r: 6, d: .8 },
    { s: 'pina-de-mariscos', w: 9, r_: '2%', t: '52%', r: -5, d: 1.4 },
    { s: 'ceviche-mitotero', w: 10.5, r_: '16%', t: '62%', r: 4, d: 1.05 }
  ];
  const PH = window.LP.PHOTOS;
  $('#floats').innerHTML = FLOATS.map(f => `
    <div class="float" style="width:${f.w}vw;top:${f.t};${f.l ? 'left:' + f.l : 'right:' + f.r_}">
      <div class="float__s"><div class="media"><img src="assets/img/${f.s}.webp" alt="" decoding="async"></div></div>
    </div>`).join('');

  /* ---------- 2. Sin librerías o movimiento reducido: página estática ---------- */
  if (!libs || reduce) {
    root.classList.add('nogsap');
    $('#pre')?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('gsap');
  const EASE = 'expo.out';

  /* ---------- 3. Scroll suave (Lenis) sincronizado con ScrollTrigger ---------- */
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  window.__lenis = lenis;
  let vel = 0;
  lenis.on('scroll', e => { vel = e.velocity; ScrollTrigger.update(); });
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  // anclas con scroll suave
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = id === '#top' ? 0 : $(id); if (t === null) return;
    e.preventDefault();
    const off = t instanceof Element && t.classList.contains('cat') ? -130 : 0;
    lenis.scrollTo(t, { offset: off, duration: 1.8, easing: x => 1 - Math.pow(1 - x, 4) });
  });

  /* ---------- 4. Agua (WebGL) en la portada ---------- */
  const gl = (() => {
    const cv = $('#gl'); if (!cv) return null;
    const g = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!g) return null;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec2 m;
#define TAU 6.28318530718
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 q = uv; q.x *= asp;
  vec2 mm = m; mm.x *= asp;
  float d = length(q - mm);
  vec2 dir = (q - mm) / (d + 1e-4);
  q += dir * sin(d * 36. - t * 3.0) * exp(-d * 5.2) * .02;
  vec2 p = mod(q * TAU * .85, TAU) - 250.;
  vec2 i = p; float c = 1.; float inten = .005;
  float tm = t * .45 + 23.;
  for (int n = 0; n < 4; n++) {
    float tt = tm * (1. - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.; c = 1.17 - pow(c, 1.4);
  float k = pow(abs(c), 8.);
  vec3 deep = vec3(.010, .075, .21);
  vec3 hi = vec3(.07, .37, .84);
  vec3 col = mix(deep, hi, pow(uv.y, 1.25));
  col += vec3(.36, .62, 1.) * k * (.30 + .70 * uv.y);
  col += vec3(.96, .54, .52) * exp(-d * 6.5) * .11;
  col *= 1. - .38 * pow(length(uv - .5) * 1.15, 2.);
  gl_FragColor = vec4(col, 1.);
}`;
    const sh = (type, src) => { const s = g.createShader(type); g.shaderSource(s, src); g.compileShader(s); return g.getShaderParameter(s, g.COMPILE_STATUS) ? s : null; };
    const v = sh(g.VERTEX_SHADER, vs), f = sh(g.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const pr = g.createProgram(); g.attachShader(pr, v); g.attachShader(pr, f); g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
    g.useProgram(pr);
    const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const U = { r: g.getUniformLocation(pr, 'r'), t: g.getUniformLocation(pr, 't'), m: g.getUniformLocation(pr, 'm') };
    const heroMedia = $('.hero__media');
    const mouse = { x: .5, y: .6, tx: .5, ty: .6 };
    let on = true, w = 0, h = 0;
    const size = () => {
      const k = Math.min(devicePixelRatio || 1, 1.5) * .55;
      w = Math.max(2, Math.floor(cv.clientWidth * k)); h = Math.max(2, Math.floor(cv.clientHeight * k));
      cv.width = w; cv.height = h; g.viewport(0, 0, w, h);
    };
    size(); new ResizeObserver(size).observe(cv);
    new IntersectionObserver(es => { on = es[0].isIntersecting; }).observe($('.hero'));
    const t0 = performance.now();
    gsap.ticker.add(() => {
      if (!on || heroMedia.classList.contains('has-video')) return;
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;
      g.uniform2f(U.r, w, h); g.uniform1f(U.t, (performance.now() - t0) / 1000); g.uniform2f(U.m, mouse.x, mouse.y);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    });
    return { mouse };
  })();

  /* ---------- 5. Portada: preparar estados iniciales ---------- */
  const heroSplit = SplitText.create('.hero__title .in-line', { type: 'chars', charsClass: 'xc' });
  gsap.set(heroSplit.chars, { yPercent: 125, rotateX: -80, transformOrigin: '50% 100%', transformPerspective: 700 });
  gsap.set('.float__s', { scale: .4, opacity: 0, y: 120 });
  gsap.set('.hero__gl', { opacity: 0 });
  gsap.set('.nav', { xPercent: -50, yPercent: -170, opacity: 0 });

  const intro = () => {
    root.classList.add('go');
    const tl = gsap.timeline();
    tl.to('.hero__gl', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .to('.nav', { xPercent: -50, yPercent: 0, opacity: 1, duration: 1.2, ease: EASE }, .2)
      .to(heroSplit.chars, { yPercent: 0, rotateX: 0, duration: 1.3, ease: EASE, stagger: { each: .032 } }, .15)
      .to('.float__s', { scale: 1, opacity: 1, y: 0, rotation: i => FLOATS[i].r, duration: 1.6, ease: EASE, stagger: .1 }, .35);
  };

  /* ---------- 6. Pantalla de carga ---------- */
  const pre = $('#pre');
  const finishPre = () => {
    gsap.timeline({ onComplete: () => { pre.remove(); lenis.start(); ScrollTrigger.refresh(); } })
      .to('.pre__center', { scale: 1.12, opacity: 0, duration: .7, ease: 'power3.in' }, 0)
      .to('.pre__half--t', { yPercent: -101, duration: 1.25, ease: 'expo.inOut' }, .4)
      .to('.pre__half--b', { yPercent: 101, duration: 1.25, ease: 'expo.inOut' }, .4)
      .add(intro, .75);
  };
  if (location.search.includes('nopre')) { pre.remove(); lenis.start(); intro(); }
  else {
    const num = $('#preNum'), o = { v: 0 };
    const paint = () => { num.textContent = Math.round(o.v); };
    gsap.to('.pre__mark', { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: EASE });
    gsap.fromTo('.pre__brush', { y: 14 }, { y: 0, opacity: 1, duration: .9, ease: EASE, delay: .35 });
    gsap.to(o, { v: 88, duration: 1.6, ease: 'power2.out', onUpdate: paint });
    const loaded = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
    Promise.race([Promise.all([document.fonts.ready, loaded, new Promise(r => setTimeout(r, 1800))]), new Promise(r => setTimeout(r, 5000))])
      .then(() => gsap.to(o, { v: 100, duration: .4, ease: 'none', onUpdate: paint, onComplete: finishPre }));
  }

  /* ---------- 7. Portada: mouse y scroll ---------- */
  if (fine) {
    const q = $$('.float').map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 1.3, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3' }), d: FLOATS[i].d
    }));
    $('.hero').addEventListener('pointermove', e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      q.forEach(o => { o.x(-nx * 70 * o.d); o.y(-ny * 46 * o.d); });
      if (gl) { gl.mouse.tx = e.clientX / innerWidth; gl.mouse.ty = 1 - e.clientY / innerHeight; }
    });
  }
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__inner', { yPercent: -16, opacity: 0, scale: .94, ease: 'none' }, 0)
    .to('.hero__velas', { yPercent: 18, scale: 1.12, ease: 'none' }, 0)
    .to('.hero__gl', { opacity: .25, ease: 'none' }, 0)
    .to('.float__s', { y: i => -160 * FLOATS[i].d, rotation: i => FLOATS[i].r * 3, scale: 1.18, ease: 'none' }, 0)
    .to('.hero__scroll', { opacity: 0, ease: 'none' }, 0);

  /* ---------- 8. Marquesina que reacciona a la velocidad del scroll ---------- */
  const t1 = gsap.fromTo('#mq1', { xPercent: 0 }, { xPercent: -50, ease: 'none', duration: 70, repeat: -1 });
  const t2 = gsap.fromTo('#mq2', { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 80, repeat: -1 });
  let sm = 0;
  gsap.ticker.add(() => {
    sm += (vel - sm) * .08;
    const k = 1 + Math.min(14, Math.abs(sm) * .8);
    t1.timeScale(k); t2.timeScale(k);
    const sk = gsap.utils.clamp(-9, 9, -sm * .9);
    gsap.set('.mq__row', { skewX: sk });
  });

  /* ---------- 9. Declaración palabra por palabra ---------- */
  gsap.fromTo('.statement__text .w', { opacity: .13 }, {
    opacity: 1, stagger: .12, ease: 'none',
    scrollTrigger: { trigger: '.statement__text', start: 'top 80%', end: 'bottom 42%', scrub: .6 }
  });

  /* ---------- 10. Foto que se expande a pantalla completa ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '#xp', start: 'top top', end: '+=160%', pin: true, scrub: .7, anticipatePin: 1 } })
    .fromTo('.xp__frame', { clipPath: 'inset(22% 34% 22% 34% round 56px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: .85 }, 0)
    .fromTo('.xp__frame .media img, .xp__frame .media video', { scale: 1.4 }, { scale: 1, ease: 'none', duration: .85 }, 0)
    .fromTo('.xp__shade', { opacity: 0 }, { opacity: 1, ease: 'none', duration: .85 }, 0)
    .fromTo('.xp__title .xl span', { yPercent: 115 }, { yPercent: 0, stagger: .12, ease: 'power3.out' }, .35)
    .fromTo('.xp__brush', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power3.out' }, .75);

  /* ---------- 11. Olas ---------- */
  gsap.to('#waves svg', { xPercent: -50, duration: 16, ease: 'none', repeat: -1 });

  /* ---------- 12. Titulares: máscara de líneas + letras ---------- */
  $$('.display, .cat__title').forEach(el => {
    el.classList.remove('reveal'); el.setAttribute('data-split', '');
    SplitText.create(el, {
      type: 'lines,chars', mask: 'lines', autoSplit: true, charsClass: 'xc',
      onSplit: self => gsap.from(self.chars, {
        yPercent: 118, rotate: 5, duration: 1.15, ease: EASE, stagger: { each: .022 },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      })
    });
  });
  $$('.cat__brush').forEach(el => gsap.from(el, { scale: .55, rotate: -14, opacity: 0, duration: 1.1, ease: 'back.out(2.2)',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

  /* ---------- 13. Imprescindibles: scroll horizontal fijo + 3D ---------- */
  const mmH = gsap.matchMedia();
  mmH.add('(min-width: 901px)', () => {
    root.classList.add('js-h');
    const rail = $('#rail'), stage = $('#hstage'), cards = $$('.card', rail), n = cards.length;
    const getX = () => -(rail.scrollWidth - innerWidth);
    const count = $('#railCount'), bar = $('#railBar');
    const paint = p => {
      const x = gsap.getProperty(rail, 'x') || 0, base = cards[0].offsetLeft;
      cards.forEach(c => {
        const d = ((c.offsetLeft - base) + x) / innerWidth;
        const a = Math.min(1, Math.abs(d) * 2.1);
        gsap.set(c, { scale: 1 - a * .15, rotationY: -d * 36, z: -a * 160, opacity: 1 - a * .5 });
        gsap.set($$('.media img, .media video', c), { xPercent: -d * 9 });
      });
      gsap.set(bar, { scaleX: p });
      count.textContent = `${String(Math.min(n, Math.round(p * (n - 1)) + 1)).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    };
    gsap.to(rail, {
      x: getX, ease: 'none',
      onUpdate() { paint(this.progress()); },
      scrollTrigger: {
        trigger: stage, start: 'top top', end: () => '+=' + Math.abs(getX()), pin: true, scrub: .6,
        invalidateOnRefresh: true, anticipatePin: 1, onRefresh: s => paint(s.progress)
      }
    });
    return () => {
      root.classList.remove('js-h');
      gsap.set([rail, ...cards, bar], { clearProps: 'all' });
      $$('.media img, .media video', rail).forEach(m => gsap.set(m, { clearProps: 'transform' }));
    };
  });

  /* ---------- 14. Fotos: revelado con máscara + parallax interno ---------- */
  $$('.tile').forEach(t => {
    const inner = $('.media, .tile__card', t); if (!inner) return;
    gsap.fromTo(inner, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: EASE, clearProps: 'clipPath',
      scrollTrigger: { trigger: t, start: 'top 90%', once: true }
    });
    if (t.querySelector('.media')) {
      t.classList.add('px');
      gsap.fromTo($('.media', t), { '--py': '-6.5%' }, { '--py': '6.5%', ease: 'none',
        scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });
  $$('.pillar').forEach(p => {
    p.classList.add('px');
    gsap.fromTo($('.media', p), { '--py': '-6.5%' }, { '--py': '6.5%', ease: 'none',
      scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- 15. Platos de la carta: entrada escalonada ---------- */
  gsap.set('.item', { opacity: 0, y: 30 });
  ScrollTrigger.batch('.item', {
    start: 'top 94%', once: true, interval: .08, batchMax: 6,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: .07, overwrite: true })
  });

  /* ---------- 16. Chips: indicador que desliza ---------- */
  (() => {
    const row = $('#chipsRow'); const ind = document.createElement('i'); ind.className = 'chips__ind';
    row.prepend(ind); let first = true;
    document.addEventListener('chip:on', e => {
      const c = e.detail, to = { x: c.offsetLeft, width: c.offsetWidth };
      if (first) { gsap.set(ind, to); first = false; } else gsap.to(ind, { ...to, duration: .7, ease: EASE });
    });
  })();

  /* ---------- 17. Inclinación 3D con brillo ---------- */
  if (fine) {
    $$('.tile, .pillar').forEach(el => {
      el.classList.add('tilt');
      gsap.set(el, { transformPerspective: 900 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: .7, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: .7, ease: 'power3' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 11); rx(-(py - .5) * 11);
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- 18. Cursor propio ---------- */
  if (fine) {
    root.classList.add('cursor-on');
    const c = $('#cursor'), dot = $('.cursor__dot', c), ring = $('.cursor__ring', c), lab = $('b', c);
    const dx = gsap.quickTo(dot, 'x', { duration: .12, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: .12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    gsap.set(c, { opacity: 0 });
    addEventListener('pointermove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); gsap.to(c, { opacity: 1, duration: .3, overwrite: 'auto' }); });
    document.documentElement.addEventListener('pointerleave', () => gsap.to(c, { opacity: 0, duration: .3 }));
    addEventListener('pointerdown', () => c.classList.add('is-down'));
    addEventListener('pointerup', () => c.classList.remove('is-down'));
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const label = t.closest('.card') ? 'Ver' : t.closest('.pillar') ? 'Ir' : '';
      const hot = !!t.closest('a,button,.chip,.circle');
      c.classList.toggle('has-label', !!label); c.classList.toggle('is-hot', hot && !label);
      lab.textContent = label;
    });
  }

  /* ---------- 19. Cierre ---------- */
  gsap.fromTo('.closing__big span', { xPercent: 10 }, { xPercent: -22, ease: 'none',
    scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.closing__mark', { y: 70, scale: .6, opacity: 0, duration: 1.4, ease: EASE,
    scrollTrigger: { trigger: '.closing', start: 'top 70%', once: true } });

  /* ---------- 20. Progreso de lectura ---------- */
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });

  /* ---------- 21. Recalcular cuando cargan fuentes e imágenes ---------- */
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
