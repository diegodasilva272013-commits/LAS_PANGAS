"""Recorta fotos de platos, logo y fondo de velas desde el PDF de la carta.
Coordenadas en una grilla de 1000 x 1293 por pagina (x0,y0,x1,y1)."""
import io, sys, fitz
from PIL import Image, ImageFilter

PDF = r'C:/Users/diego/Downloads/Menú Pangas 2026.pdf'
OUT = r'C:/Users/diego/OneDrive/Desktop/Las Pangas web/assets/img/'
d = fitz.open(PDF)
cache = {}

def page(i):
    if i not in cache:
        pm = d[i].get_pixmap(dpi=72)  # nativo 1275 x 1650
        cache[i] = Image.open(io.BytesIO(pm.tobytes('png'))).convert('RGB')
    return cache[i]

def crop(i, box):
    im = page(i)
    sx, sy = im.width / 1000, im.height / 1293
    x0, y0, x1, y1 = box
    return im.crop((int(x0*sx), int(y0*sy), int(x1*sx), int(y1*sy)))

# slug: (pagina, caja)
PHOTOS = {
 'mini-tostadas-atun': (1, (0,0,500,570)),
 'pina-de-mariscos':   (1, (0,730,500,1293)),
 'taco-de-pulpo':      (2, (500,230,1000,1205)),
 'callo-de-hacha':     (3, (0,330,1000,1293)),
 'tostada-mamalona':   (4, (500,0,1000,560)),
 'torre-sinaloense':   (4, (0,650,500,1200)),
 'aguacate-relleno':   (5, (290,515,1000,870)),
 'caldo-paisa':        (6, (0,610,500,1293)),
 'caldo-camaron':      (6, (500,610,1000,1293)),
 'asador':             (7, (0,615,1000,1293)),
 'parrillada':         (8, (0,0,1000,1040)),
 'camarones-coco':     (9, (0,335,470,600)),
 'camarones-empanizados': (9, (0,690,470,975)),
 'molcajete':          (10,(0,740,1000,1190)),
 'mojarra':            (11,(0,735,1000,1190)),
 'ceviche-mitotero':   (12,(500,570,1000,1180)),
 'aguachile-mango-habanero': (13,(0,0,1000,1040)),
 'aguachile-verde':    (14,(0,700,500,1215)),
 'aguachile-rojo':     (14,(500,700,1000,1215)),
 'coctel-camaron':     (15,(500,0,1000,570)),
 'campechana':         (15,(0,665,500,1200)),
 'rollo-tempura':      (16,(500,0,1000,545)),
 'rib-eye-camarones':  (16,(0,640,500,1215)),
 'postre':             (18,(600,0,1000,860)),
 'plebes':             (17,(0,945,1000,1293)),
 'mojito-maracuya':    (20,(0,60,575,690)),
 'margarita-fresa':    (20,(578,330,1000,785)),
 'clericot':           (20,(45,860,345,1290)),
}
for slug,(p,box) in PHOTOS.items():
    im = crop(p, box)
    if im.width < 1200:
        f = 2
        im = im.resize((im.width*f, im.height*f), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    im.save(OUT+slug+'.webp', 'WEBP', quality=84, method=6)
    print(slug, im.size)

# Fondo de velas (pagina 21, sin logos)
bg = crop(21, (0,0,1000,1120))
bg = bg.resize((bg.width*2, bg.height*2), Image.LANCZOS)
bg.save(OUT+'velas.webp','WEBP',quality=85, method=6)

# Logo blanco transparente desde la portada (pagina 0)
lg = crop(0, (280,535,720,770)).convert('RGB')
lg = lg.resize((lg.width*4, lg.height*4), Image.LANCZOS)
px = lg.load()
out = Image.new('RGBA', lg.size)
op = out.load()
for y in range(lg.height):
    for x in range(lg.width):
        r,g,b = px[x,y]
        a = max(0, min(255, int((r-45)*255/(255-45)*1.0)))
        op[x,y] = (255,255,255,a)
bbox = out.getchannel('A').point(lambda v: 255 if v>20 else 0).getbbox()
out = out.crop(bbox)
out.save(OUT+'logo-blanco.png', optimize=True)
print('logo', out.size)
iw,ih = out.size
out.crop((int(iw*0.30),0,int(iw*0.70),int(ih*0.55))).save(OUT+'isotipo-blanco.png', optimize=True)
