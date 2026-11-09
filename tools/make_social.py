"""Genera la imagen para compartir (WhatsApp / redes) y los iconos del sitio.
Salida en assets/img/: og-image.jpg (1200x630), favicon-32.png, favicon-192.png, apple-touch-icon.png"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

IMG = r'C:/Users/diego/OneDrive/Desktop/Las Pangas web/assets/img/'
BLUE, DEEP, NAVY, CORAL = (17, 91, 212), (1, 64, 161), (3, 21, 56), (245, 138, 132)

logo = Image.open(IMG + 'logo-blanco.png').convert('RGBA')
iso = Image.open(IMG + 'isotipo-blanco.png').convert('RGBA')
velas = Image.open(IMG + 'velas.webp').convert('RGB')

# ---------- imagen para compartir 1200 x 630 ----------
W, H = 1200, 630
bg = Image.new('RGB', (W, H), DEEP)
# degradado vertical azul -> azul profundo
g = Image.new('RGB', (1, H))
for y in range(H):
    t = y / (H - 1)
    g.putpixel((0, y), tuple(int(BLUE[i] * (1 - t) + NAVY[i] * t) for i in range(3)))
bg = g.resize((W, H))
# velas de la marca de fondo, suaves
v = velas.resize((W, int(velas.height * W / velas.width)), Image.LANCZOS)
v = v.crop((0, 60, W, 60 + H))
bg = Image.blend(bg, v, 0.38)
# vineta
vg = Image.new('L', (W, H), 0)
ImageDraw.Draw(vg).ellipse((-250, -200, W + 250, H + 220), fill=255)
vg = vg.filter(ImageFilter.GaussianBlur(160))
bg = Image.composite(bg, Image.new('RGB', (W, H), NAVY), vg)

card = bg.convert('RGBA')
# logo centrado (margen de seguridad para recortes cuadrados)
lw = 560
lg = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
card.alpha_composite(lg, ((W - lw) // 2, 92))

# lema en coral/blanco con Impact (la fuente condensada mas parecida a la de la carta)
try:
    f = ImageFont.truetype('C:/Windows/Fonts/impact.ttf', 58)
except OSError:
    f = ImageFont.load_default()
d = ImageDraw.Draw(card)
a, b = 'MIRA LO QUE TRAJO EL ', 'MAR'
wa, wb = d.textlength(a, font=f), d.textlength(b, font=f)
x0 = (W - (wa + wb)) / 2
y0 = 440
d.text((x0, y0), a, font=f, fill=(255, 255, 255))
d.text((x0 + wa, y0), b, font=f, fill=CORAL)
d.rectangle(((W - 90) // 2, 540, (W + 90) // 2, 545), fill=CORAL)

card.convert('RGB').save(IMG + 'og-image.jpg', 'JPEG', quality=86, optimize=True, progressive=True)

# ---------- iconos: cuadrado azul con las velas ----------
def icon(size, radius_ratio):
    base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=255)
    fill = Image.new('RGBA', (size, size), BLUE + (255,))
    base.paste(fill, (0, 0), m)
    w = int(size * 0.62)
    s = iso.resize((w, int(iso.height * w / iso.width)), Image.LANCZOS)
    base.alpha_composite(s, ((size - w) // 2, (size - s.height) // 2))
    return base

icon(32, .22).save(IMG + 'favicon-32.png', optimize=True)
icon(192, .22).save(IMG + 'favicon-192.png', optimize=True)
# apple-touch-icon: sin esquinas redondeadas (iOS las aplica solo)
icon(180, 0).convert('RGB').save(IMG + 'apple-touch-icon.png', optimize=True)
print('ok')
