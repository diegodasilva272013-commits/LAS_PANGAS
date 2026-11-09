/* Asistente Las Pangas: reservas y pedidos por voz o chat.
   Conecta con el agente de ElevenLabs usando su SDK (sin el widget de fabrica).
   El SDK (~620 KB) solo se descarga cuando el visitante abre una conversacion. */
(function () {
  'use strict';
  var AGENT_ID = 'agent_4701m70bxkw1f9xranvymke6ysgg';
  var SDK_SRC = 'assets/vendor/elevenlabs-client.js';

  var ICON = {
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2.5"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    table: '<svg viewBox="0 0 24 24"><path d="M4 9h16M7 9v10M17 9v10M3 9l1.5-4h15L21 9"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4a2 2 0 0 1-1-2V6z"/></svg>'
  };

  var root, el = {}, sdkPromise, conv = null, mode = null, raf = 0, typingEl = null;
  var state = { open: false, voice: false, started: false, busy: false };

  function $(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }

  function build() {
    root = $(
      '<div class="cg" id="cg" data-st="idle" data-lenis-prevent>' +
        '<button class="cg__call" type="button" aria-label="Llamar por voz al asistente">' + ICON.phone + '<span>Llamar</span></button>' +
        '<button class="cg__fab" type="button" aria-haspopup="dialog" aria-controls="cgPanel">' +
          '<span class="cg__fab-ico"><img src="assets/img/isotipo-blanco.png" alt="" width="26" height="18"></span>' +
          '<span class="cg__fab-t"><b>Reservar y pedir</b><small>Hablá o escribinos</small></span>' +
        '</button>' +
        '<section class="cg__panel" id="cgPanel" role="dialog" aria-label="Asistente de Las Pangas" aria-modal="false">' +
          '<header class="cg__head">' +
            '<div class="cg__avatar"><img src="assets/img/isotipo-blanco.png" alt="" width="24" height="17"></div>' +
            '<div class="cg__who"><b>Las Pangas</b><span><i class="cg__dot"></i><em class="cg__stt" style="font-style:normal">En línea · reservas y pedidos</em></span></div>' +
            '<button class="cg__x" type="button" aria-label="Cerrar asistente">' + ICON.close + '</button>' +
          '</header>' +
          '<div class="cg__body" data-lenis-prevent>' +
            '<div class="cg__hello">' +
              '<h3>¿Qué se te <em>antoja</em>?</h3>' +
              '<p>Reservá tu mesa o armá tu pedido hablando o escribiendo. Te atendemos al instante.</p>' +
              '<div class="cg__acts">' +
                '<button class="cg__act" type="button" data-go="reserva"><i>' + ICON.table + '</i><span><b>Reservar una mesa</b><small>Día, hora y cuántos son</small></span><em>→</em></button>' +
                '<button class="cg__act" type="button" data-go="pedido"><i>' + ICON.bag + '</i><span><b>Hacer un pedido</b><small>Para llevar o para comer acá</small></span><em>→</em></button>' +
                '<button class="cg__act" type="button" data-go="carta"><i>' + ICON.chat + '</i><span><b>Preguntar por la carta</b><small>Recomendaciones y dudas</small></span><em>→</em></button>' +
              '</div>' +
              '<p class="cg__note">Al hablar usamos tu micrófono solo durante la conversación. Podés cortar cuando quieras.</p>' +
            '</div>' +
            '<div class="cg__voice" aria-live="polite"><div class="cg__orb"><img src="assets/img/isotipo-blanco.png" alt="" width="46" height="32"></div><div class="cg__vlabel"></div></div>' +
            '<div class="cg__log" role="log" aria-live="polite"></div>' +
          '</div>' +
          '<footer class="cg__foot">' +
            '<div class="cg__chips" hidden>' +
              '<button type="button" data-q="Quiero reservar una mesa">Reservar mesa</button>' +
              '<button type="button" data-q="Quiero hacer un pedido">Hacer pedido</button>' +
              '<button type="button" data-q="¿Qué me recomiendan?">Recomendaciones</button>' +
              '<button type="button" data-q="¿Cuál es el horario?">Horario</button>' +
            '</div>' +
            '<form class="cg__form" autocomplete="off">' +
              '<input class="cg__in" type="text" placeholder="Escribí tu mensaje…" aria-label="Mensaje" enterkeyhint="send" maxlength="500">' +
              '<button class="cg__btn cg__mic" type="button" aria-label="Hablar con voz">' + ICON.mic + '</button>' +
              '<button class="cg__btn cg__send" type="submit" aria-label="Enviar" disabled>' + ICON.send + '</button>' +
            '</form>' +
          '</footer>' +
        '</section>' +
      '</div>'
    );
    document.body.appendChild(root);
    el.fab = root.querySelector('.cg__fab');
    el.call = root.querySelector('.cg__call');
    el.x = root.querySelector('.cg__x');
    el.body = root.querySelector('.cg__body');
    el.hello = root.querySelector('.cg__hello');
    el.log = root.querySelector('.cg__log');
    el.orb = root.querySelector('.cg__orb');
    el.vlabel = root.querySelector('.cg__vlabel');
    el.stt = root.querySelector('.cg__stt');
    el.chips = root.querySelector('.cg__chips');
    el.form = root.querySelector('.cg__form');
    el.in = root.querySelector('.cg__in');
    el.mic = root.querySelector('.cg__mic');
    el.send = root.querySelector('.cg__send');
  }

  /* ---------- UI helpers ---------- */
  function setStatus(st, txt) {
    root.dataset.st = st;
    el.stt.textContent = txt;
  }
  function scrollDown() { el.body.scrollTo({ top: el.body.scrollHeight, behavior: 'smooth' }); }
  function startUI() {
    if (state.started) return;
    state.started = true;
    el.hello.style.display = 'none';
    el.chips.hidden = false;
  }
  function addMsg(role, text) {
    if (!text || /^[.\s…]+$/.test(text)) return;
    hideTyping();
    var m = document.createElement('div');
    m.className = 'cg__m ' + (role === 'user' ? 'cg__m--u' : 'cg__m--a');
    m.textContent = text;
    el.log.appendChild(m);
    scrollDown();
  }
  function addSys(text) {
    var m = document.createElement('div');
    m.className = 'cg__sys';
    m.textContent = text;
    el.log.appendChild(m);
    scrollDown();
  }
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'cg__typing';
    typingEl.innerHTML = '<i></i><i></i><i></i>';
    el.log.appendChild(typingEl);
    scrollDown();
  }
  function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

  /* ---------- SDK ---------- */
  function loadSDK() {
    if (window.ElevenLabsClient) return Promise.resolve(window.ElevenLabsClient);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = SDK_SRC;
      s.onload = function () { window.ElevenLabsClient ? res(window.ElevenLabsClient) : rej(new Error('sdk')); };
      s.onerror = function () { sdkPromise = null; rej(new Error('sdk-load')); };
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  function endSession() {
    cancelAnimationFrame(raf);
    el.orb.style.setProperty('--lv', 1);
    root.classList.remove('is-voice', 'is-speaking');
    var c = conv; conv = null; mode = null;
    state.voice = false;
    el.mic.innerHTML = ICON.mic;
    el.mic.setAttribute('aria-label', 'Hablar con voz');
    if (c) { try { c.endSession(); } catch (e) {} }
  }

  function meter() {
    if (!conv || !state.voice) return;
    var v = 0;
    try { v = mode === 'speaking' ? conv.getOutputVolume() : conv.getInputVolume(); } catch (e) {}
    var cur = parseFloat(el.orb.style.getPropertyValue('--lv')) || 1;
    var tgt = 1 + Math.min(1, v * 1.6) * 0.32;
    el.orb.style.setProperty('--lv', (cur + (tgt - cur) * 0.35).toFixed(3));
    raf = requestAnimationFrame(meter);
  }

  function onModeChange(p) {
    mode = p.mode;
    var sp = p.mode === 'speaking';
    root.classList.toggle('is-speaking', sp);
    if (state.voice) el.vlabel.textContent = sp ? 'Hablando…' : 'Te escucho';
  }

  /* abre una sesion; voice=true usa micrófono; opener = primer mensaje del usuario (solo texto) */
  function connect(voice, opener) {
    if (state.busy) return Promise.resolve();
    state.busy = true;
    endSession();
    startUI();
    setStatus('connecting', 'Conectando…');
    if (voice) {
      root.classList.add('is-voice');
      el.vlabel.textContent = 'Conectando…';
    }
    return loadSDK().then(function (lib) {
      var opts = {
        agentId: AGENT_ID,
        connectionType: voice ? 'webrtc' : 'websocket',
        textOnly: !voice,
        stripAudioTags: true,
        onConnect: function () {
          setStatus('live', voice ? 'Escuchando · en vivo' : 'En línea · reservas y pedidos');
        },
        onDisconnect: function () {
          if (!conv) return;
          hideTyping();
          conv = null; endSession();
          setStatus('idle', 'En línea · reservas y pedidos');
          addSys('La conversación terminó. Escribí o tocá el micrófono para seguir.');
        },
        onError: function (m) {
          hideTyping();
          setStatus('error', 'Sin conexión');
          addSys('Hubo un problema de conexión. Probá de nuevo en un momento.');
          if (window.console) console.warn('[LasPangas asistente]', m);
        },
        onMessage: function (p) {
          addMsg(p.role === 'user' ? 'user' : 'agent', p.message);
        },
        onModeChange: onModeChange
      };
      return lib.Conversation.startSession(opts);
    }).then(function (c) {
      conv = c;
      state.voice = !!voice;
      if (voice) {
        el.mic.innerHTML = ICON.stop;
        el.mic.setAttribute('aria-label', 'Terminar llamada');
        el.vlabel.textContent = 'Te escucho';
        raf = requestAnimationFrame(meter);
      } else if (opener) {
        addMsg('user', opener);
        showTyping();
        try { c.sendUserMessage(opener); } catch (e) {}
      }
    }).catch(function (err) {
      endSession();
      setStatus('error', 'No disponible');
      var denied = err && /permission|denied|NotAllowed/i.test(String(err && (err.message || err.name)));
      addSys(denied
        ? 'Necesitamos permiso del micrófono para hablar. Mientras tanto, podés escribirnos.'
        : 'No pudimos conectar el asistente. Probá de nuevo o escribinos por redes.');
      if (window.console) console.warn('[LasPangas asistente]', err);
    }).then(function () { state.busy = false; });
  }

  /* ---------- acciones ---------- */
  var OPENERS = {
    reserva: 'Hola, quiero reservar una mesa.',
    pedido: 'Hola, quiero hacer un pedido.',
    carta: 'Hola, ¿qué me recomiendan de la carta?'
  };

  function sendText(t) {
    t = (t || '').trim();
    if (!t) return;
    startUI();
    if (conv && !state.voice) {
      addMsg('user', t); showTyping();
      try { conv.sendUserMessage(t); } catch (e) {}
    } else if (conv && state.voice) {
      try { conv.sendUserMessage(t); } catch (e) {}
    } else {
      connect(false, t);
    }
  }

  function open(intent) {
    if (!state.open) {
      state.open = true;
      root.classList.add('is-open');
      el.fab.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('cg-open');
    }
    if (intent && OPENERS[intent]) {
      if (!conv) connect(false, OPENERS[intent]);
      else sendText(OPENERS[intent]);
    } else {
      setTimeout(function () { if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) el.in.focus(); }, 500);
    }
  }
  function close() {
    state.open = false;
    root.classList.remove('is-open');
    el.fab.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('cg-open');
    if (state.voice) { endSession(); addSys('Llamada finalizada.'); setStatus('idle', 'En línea · reservas y pedidos'); }
    el.fab.focus({ preventScroll: true });
  }

  window.LPAssistant = { ask: function (t) { if (!root) return; open(); sendText(t); } };

  function bind() {
    el.fab.addEventListener('click', function () { open(); });
    el.call.addEventListener('click', function () { open(); if (!state.voice) connect(true); });
    el.x.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open) close(); });
    root.querySelectorAll('.cg__act').forEach(function (b) {
      b.addEventListener('click', function () { open(b.dataset.go); });
    });
    root.querySelectorAll('.cg__chips button').forEach(function (b) {
      b.addEventListener('click', function () { sendText(b.dataset.q); });
    });
    el.in.addEventListener('input', function () { el.send.disabled = !el.in.value.trim(); });
    el.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = el.in.value; el.in.value = ''; el.send.disabled = true;
      sendText(v);
    });
    el.mic.addEventListener('click', function () {
      if (state.voice) { endSession(); setStatus('idle', 'En línea · reservas y pedidos'); addSys('Llamada finalizada.'); }
      else connect(true);
    });
    window.addEventListener('pagehide', function () { if (conv) { try { conv.endSession(); } catch (e) {} } });

    /* cualquier boton de la web con data-cg="reserva|pedido|carta" abre el asistente */
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cg]');
      if (!t) return;
      e.preventDefault();
      var k = t.getAttribute('data-cg');
      if (k === 'llamar') { open(); if (!state.voice) connect(true); } else open(k || undefined);
    });
  }

  function addPageButtons() {
    var cta = document.getElementById('contactCta');
    if (!cta || cta.querySelector('[data-cg]')) return;
    var arrow = '<i class="btn__dot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></i>';
    cta.insertAdjacentHTML('afterbegin',
      '<a class="btn btn--solid magnetic" href="#" data-cg="llamar"><span>Llamar ahora</span>' + arrow + '</a>' +
      '<a class="btn btn--ghost magnetic" href="#" data-cg="reserva"><span>Reservar mesa</span>' + arrow + '</a>' +
      '');
  }

  function init() {
    build(); bind();
    root.classList.add('is-ready');
    addPageButtons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
