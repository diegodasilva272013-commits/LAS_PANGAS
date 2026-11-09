# Las Pangas — sitio web

Sitio estático (HTML + CSS + JS). Sin build, sin dependencias.

## Ver el sitio
Doble clic en `index.html` o, mejor (para los videos), un servidor local:
`python -m http.server 4173` y abrir http://localhost:4173

## Qué editar
- **Carta, precios y textos:** `js/data.js` (todo sale del PDF "Menú Pangas 2026").
- **Teléfono, dirección, horario, WhatsApp:** bloque `SITE` al inicio de `js/data.js`.
  Solo se muestra lo que completes.
- **Videos:** carpeta `assets/videos/` (ver `LEEME.txt` ahí).
- **Fotos:** `assets/img/` (recortadas del PDF por `tools/extract_assets.py`;
  reemplazá cualquier `.webp` por la foto original en mejor calidad con el mismo nombre).

## Movimiento (capa visual)
- Librerías locales en `assets/vendor/` (GSAP + ScrollTrigger + SplitText + Lenis). No hace falta internet para el movimiento.
- Lógica en `js/motion.js` y estilos en `css/motion.css`.
- Incluye: pantalla de carga, agua animada en WebGL (portada), platos flotantes con parallax,
  marquesina que acelera con el scroll, foto que se expande, scroll horizontal 3D, cursor propio,
  inclinación 3D con brillo, revelado de titulares letra por letra.
- Si el usuario tiene activado "reducir movimiento" en su sistema, la página se muestra completa y estática.
- Saltar la pantalla de carga mientras editás: agregar `?nopre` a la dirección.
