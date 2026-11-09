/* ============================================================
   LAS PANGAS — datos del sitio
   Todo el contenido sale de "Menú Pangas 2026.pdf".
   Para cambiar un precio o un platillo, editá solo este archivo.
   ============================================================ */
window.LP = (() => {

  /* ---------- Contacto (se muestra SOLO lo que completes) ---------- */
  const SITE = {
    instagram: 'laspangasmx',
    facebook: 'laspangasmx',
    whatsapp: '',   // ej: '5216671234567'  -> activa el botón "Reservar por WhatsApp"
    phone: '',      // ej: '+52 667 123 4567'
    address: '',    // ej: 'Calle y número, Colonia, Ciudad'
    mapsUrl: '',    // link de Google Maps
    hours: ''       // ej: 'Lun a Dom · 12:00 a 20:00'
  };

  /* ---------- Pies de foto / alt de cada foto (slug = nombre del archivo) ---------- */
  const PHOTOS = {
    'mini-tostadas-atun': 'Mini tostadas de atún',
    'pina-de-mariscos': 'Piña de mariscos',
    'taco-de-pulpo': 'Taco de pulpo',
    'callo-de-hacha': 'Callo de hacha',
    'tostada-mamalona': 'Tostada Mamalona',
    'torre-sinaloense': 'Torre Sinaloense',
    'aguacate-relleno': 'Aguacate relleno de atún',
    'caldo-paisa': 'Caldo Paisa',
    'caldo-camaron': 'Caldo de camarón',
    'asador': 'Del asador',
    'parrillada': 'Parrillada',
    'camarones-coco': 'Camarones al coco',
    'camarones-empanizados': 'Camarones empanizados',
    'molcajete': 'Molcajete Mar y Tierra',
    'mojarra': 'Mojarra',
    'ceviche-mitotero': 'Ceviche Mitotero',
    'aguachile-mango-habanero': 'Aguachile mango habanero',
    'aguachile-verde': 'Aguachile en salsa verde',
    'aguachile-rojo': 'Aguachile en salsa roja',
    'coctel-camaron': 'Coctel de camarón',
    'campechana': 'Campechana clásica',
    'rollo-tempura': 'Rollo Tempura',
    'rib-eye-camarones': 'Rib eye con camarones',
    'postre': 'Postre con nieve',
    'plebes': 'Pa’ los plebes',
    'mojito-maracuya': 'Mojito maracuyá',
    'margarita-fresa': 'Margarita de fresa',
    'clericot': 'Clericot'
  };

  /* ---------- Platos con video (archivo assets/videos/<slug>.mp4) ---------- */
  const VIDEOS = ['mini-tostadas-atun', 'pina-de-mariscos', 'taco-de-pulpo'];

  /* ---------- Los imprescindibles (carrusel con video) ---------- */
  const FEATURED = [
    { slug: 'torre-sinaloense', kicker: 'Torres', name: 'Torre Sinaloense', price: '$500',
      line: 'Ceviche Culichi, callo de róbalo, camarón, pulpo y atún fresco, con espejo de aguachile rojo y chiltepín.' },
    { slug: 'aguachile-mango-habanero', kicker: 'Aguachiles', name: 'Aguachile mango habanero', price: 'Desde $330',
      line: 'Camarón fresco en corte mariposa, bañado en tu salsa favorita: verde, roja, negra, mango habanero o tatemada.' },
    { slug: 'parrillada', kicker: 'El asador', name: 'Parrillada', price: 'Desde $1,400',
      line: 'Pulpo, camarón y pescado zarandeado, rib eye a la parrilla y quesadillas de maíz. Para compartir.' },
    { slug: 'pina-de-mariscos', kicker: 'Pa’ arrancar', name: 'Piña de mariscos', price: '$420',
      line: 'Piña fresca rellena de ceviche de camarón, pulpo y camarón cocido, en salsas negras.' },
    { slug: 'mini-tostadas-atun', kicker: 'Pa’ arrancar', name: 'Mini tostadas de atún', price: '$250',
      line: 'Atún fresco marinado en ponzul con aderezo de chipotle, cebollita frita y zanahoria fresca.' },
    { slug: 'taco-de-pulpo', kicker: 'Tacos', name: 'Taco de pulpo', price: '$125',
      line: 'Tentáculo de pulpo frito sobre queso manchego, en doble tortilla de maíz.' },
    { slug: 'ceviche-mitotero', kicker: 'Ceviches', name: 'Ceviche Mitotero', price: '$440',
      line: 'La especialidad del chef: camarón, atún, pulpo, callo de róbalo y aguacate sobre espejo de aguachile rojo.' },
    { slug: 'callo-de-hacha', kicker: 'Aguachiles', name: 'Callo de hacha', price: '$740',
      line: '200 gr de callo de hacha fresco, bañado en la salsa de tu preferencia, con corona de aguacate.' },
    { slug: 'mojarra', kicker: 'Filetes', name: 'Mojarra', price: '$400 / kilo',
      line: 'Sazonada y frita al punto perfecto: al mojo de ajo, al ajillo o a la diabla.' }
  ];

  /* ---------- La carta ----------
     p: número            -> "$350"
     p: [['Orden',600],…] -> varios precios
     note: texto chico junto al precio                                  */
  const MENU = [
    { id: 'arrancar', chip: 'Pa’ arrancar', kicker: 'Mira lo que trajo el mar…', title: 'Pa’ arrancar', brush: '¡puro marisco sabroso!',
      media: ['mini-tostadas-atun', 'pina-de-mariscos'],
      groups: [{ items: [
        { n: 'Camarones para pelar', p: 350, d: 'Camarones grandes con cáscara, con cebolla morada y pepino, en salsa “pal jefe” fresca, dulce y ligeramente picante… ¡perfectos para abrir el antojo!' },
        { n: 'Camarones cucaracha', p: 390, d: 'Camarones fritos con cáscara, salteados con cebolla y ajo bañados en salsa ponzul ¡crujientes y llenos de sabor!' },
        { n: 'Toritos de camarón', p: 350, d: 'Chiles caribes rellenos de camarón, marinados en salsas negras de la casa y bien dorados al punto, acompañados de tortillas ¡perfectos para compartir!' },
        { n: 'Mini tostadas de atún', p: 250, d: '3 mini tostadas de atún fresco marinado en salsa ponzul, acompañado de un toque de aderezo de chipotle, cebollita frita, pepino y zanahoria fresca. ¡Ligeras, frescas y adictivas!' },
        { n: 'Sashimi de atún', p: 260, d: 'Láminas de atún en salsa ponzul con cebolla morada, chile serrano, cilantro y aguacate… ¡ligero, fresco y lleno de sabor!' },
        { n: 'Piña de mariscos', p: 420, d: 'Piña fresca rellena de ceviche de camarón, pulpo y camarón cocido con pepino y cebolla morada, chile serrano y cilantro, todo bañado en salsas negras y una salsa dulce, fresca y ligeramente picante, coronada con zanahoria rallada y un camarón grande.' }
      ] }] },

    { id: 'ostiones', chip: 'Ostiones', title: 'Ostiones',
      groups: [{ items: [
        { n: 'Ostiones Rockefeller', p: [['Orden', 600], ['½ orden', 350]], d: 'Ostiones frescos gratinados a la parrilla con nuestra receta especial Rockefeller: una mezcla cremosa de espinacas, mantequilla y queso fundido que se derrite sobre cada concha.' },
        { n: 'Ostiones', p: [['Orden', 500], ['½ orden', 300]], d: 'Ostiones frescos en su concha, servidos sobre una cama de hielo, acompañados de salsa rasurada de cinco chiles y salsas negras.' }
      ] }] },

    { id: 'tacos', chip: 'Tacos', title: 'Tacos', brush: '¡échame otro taco!',
      media: ['taco-de-pulpo', { card: { tone: 'blue', kicker: 'Hazlo gordo', title: '+$15', text: 'Agrega aguacate, champiñones y tocino a tu taco.' } }],
      groups: [{ items: [
        { n: 'Taco camarón enchilado', p: 95, d: 'Camarón a la plancha con morrón y cebolla sazonado con chile quebrado, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado… ¡perfecto para quitarte el antojo desde el primer bocado!' },
        { n: 'Taco fajita', p: 95, d: 'Camarón a la plancha, champiñón, cebolla blanca y morrón, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco chipotle', p: 95, d: 'Camarón a la plancha en salsa chipotle, cebolla blanca y morrón, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco gobernador', p: 115, d: 'Machaca de camarón con una receta especial de la casa, sobre queso manchego en tortilla de maíz dorada a la parrilla. Acompañado con repollo preparado.' },
        { n: 'Taco de pulpo', p: 125, d: 'Tentáculo de pulpo frito, con cebolla blanca y morrón, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco de chicharrón de pescado o camarón', p: 95, d: 'Pescado o camarón rebozados, sazonados, bien fritos y crujientes, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco marlín', p: 95, d: 'Guiso de marlín con cebolla blanca, pimiento verde sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco chilaca de camarón o marlín', p: 160, d: 'Chile chilaca relleno de machaca de camarón o marlín, envuelto en tocino, doble tortilla y cubierto con costra de queso manchego, con un toque de tomate picado y cilantro.' },
        { n: 'Taco baja', p: 95, d: 'Tiras de pescado o camarón capeado estilo baja, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' },
        { n: 'Taco de pulpo / camarón', p: 125, d: 'Camarón a la plancha y pulpo frito con cebolla blanca y morrón, sobre queso manchego en doble tortilla de maíz, acompañado de repollo preparado.' }
      ] }] },

    { id: 'tostadas', chip: 'Tostadas y torres', title: 'Tostadas y torres',
      media: ['tostada-mamalona', 'torre-sinaloense'],
      groups: [
        { title: 'Tostadas', items: [
          { n: 'Mamalona', p: 395, d: '¡Ya la conoces! Camarón grande cocido y camarón aguachile, ceviche de camarón, montados sobre doble tostada con mayonesa, coronado con aguacate, cebolla y ralladura de una mezcla de salsas de aguachiles y chiles secos, para un sabor intenso y delicioso.' },
          { n: 'Pangas', p: 395, d: 'La favorita del chef: atún, callo de almeja, camarón fresco y camarón cocido, con aguacate, pepino, mango, piña, cilantro y cebolla morada, todo mezclado en una salsa negra y de catsup con un ligero toque de habanero, coronado con aguacate, cebolla morada, ralladura de pepino, zanahoria y poro frito.' }
        ] },
        { title: 'Torres', items: [
          { n: 'Torre Sinaloense', p: 500, d: 'Base de nuestro ceviche Culichi, con aguacate, callo de róbalo, camarón cocido, pulpo, atún fresco, pepino y cebolla morada, coronado con un camarón grande servida de un espejo de salsa de aguachile rojo y chiltepín espolvoreado.' }
        ] }
      ] },

    { id: 'dejarse-caer', chip: 'Pa’ dejarse caer', title: 'Pa’ dejarse caer', brush: 'para compartir',
      groups: [{ items: [
        { n: 'Mariscada fría', p: 2050, d: 'Ostiones frescos, orden de ceviche de atún, orden de ceviche Culichi, camarones para pelar, camarón en aguachile, pulpo, callo de róbalo y callo de hacha, acompañados de aguacate, cebolla, pepino, chile serrano y cilantro, listos para disfrutar en su máxima frescura. Pídela en la salsa que más te guste: salsa negra, roja o verde.' },
        { n: 'Mariscada caliente', p: 1100, d: 'Camarones y filete empanizado, chicharrón de atún, chicharrón de camarón, tiras de pescado estilo baja y camarones envueltos acompañada de papas a la francesa, una buena porción de ensalada y arroz frito… ¡El plato ideal para los amantes de los mariscos, irresistible y súper completo!' },
        { n: 'Mariscada individual', p: 380, d: 'Camarones empanizados, camarones envueltos y chicharrón de pescado acompañada de papas a la francesa, ensalada y arroz frito… ¡Crujiente, jugosa y llena de sabor… imposible resistirse!' },
        { n: 'Arroz con mariscos', p: 310, d: 'Nuestro delicioso arroz frito a la plancha con apio, camarón, pulpo, surimi, tocino crujiente, todo salteado con mantequilla y un toque de salsa siracha, acompañado de aguacate y ajonjolí.' }
      ] }] },

    { id: 'cuidarse', chip: 'Pa’ cuidarse', title: 'Pa’ cuidarse', media: ['aguacate-relleno'],
      groups: [{ items: [
        { n: 'Aguacate relleno de atún', p: 320, d: '2 medias piezas de aguacate rellenas de atún, pepino, cebolla morada picada aderezados con vinagreta de kiwi en una cama de lechugas mixtas, tomate cherry y ajonjolí negro tostado.' },
        { n: 'Salmón', p: 395, d: 'Filete de salmón fresco sellado a la plancha, jugoso y de sabor delicado, acompañado de arroz blanco, brócoli, coliflor y zanahoria. Lo puedes pedir como tú quieras: al mojo de ajo, al ajillo o a la plancha. Equilibrio perfecto entre lo ligero y lo delicioso.' }
      ] }] },

    { id: 'caldito', chip: 'Caldos', title: '¿Un caldito?', media: ['caldo-paisa', 'caldo-camaron'],
      groups: [{ items: [
        { n: 'Camarón', p: [['1 litro', 240], ['Medio', 185]], d: 'Caldo de camarón, con deliciosos camarones, con un toque de apio fresco y cilantro que resalta su sabor.' },
        { n: 'Mixto', p: [['1 litro', 240], ['Medio', 175]], d: 'Deliciosos trozos de pescado combinados con camarón y cilantro en un solo caldo.' },
        { n: 'Pescado', p: [['1 litro', 210], ['Medio', 150]], d: 'Caldo con trozos de pescado, con cilantro y un toque de apio fresco que le da un sabor especial delicioso.' },
        { n: '7 Mares', p: 320, d: 'De lo mejor de nuestro menú: una exquisita sopa de mariscos preparada con pescado, camarón, pulpo, surimi, mejillón, almejas y cilantro, todo en nuestro caldo especial que resalta cada sabor del mar en cada cucharada.' },
        { n: 'Paisa', p: 310, d: 'Disfruta de nuestro caldo lleno de sabor casero, con un toque picosito de chipotle, acompañado de pescado, camarón, cilantro, albóndigas de camarón con pescado y suaves trozos de pulpo que lo convierten en una experiencia irresistible.' }
      ] }] },

    { id: 'asador', chip: 'El asador', kicker: 'Pa’ no extrañar', title: 'El asador', media: ['parrillada', 'asador'],
      groups: [{ items: [
        { n: 'Parrillada 1', p: 1450, d: '300 gr de pulpo, 6 piezas de camarón zarandeado y 300 gr de pescado zarandeado, acompañados de arroz frito, ensalada familiar, aguacate, papas fritas y 4 quesadillas en maíz, creando un festín del mar perfecto para compartir.' },
        { n: 'Parrillada 2', p: 1680, d: '300 gr de rib eye jugoso a la parrilla, 200 gr de pulpo zarandeado y 250 gr de pescado zarandeado a las brasas, acompañados de 4 quesadillas en maíz, arroz frito, papas a la francesa y ensalada familiar, creando una combinación irresistible de mar y tierra en cada bocado.' },
        { n: 'Parrillada 3', p: 1400, d: '300 gr de pescado, 8 piezas de camarón zarandeado y 300 gr de rib eye jugoso a la parrilla, acompañados de 4 quesadillas en maíz, arroz frito, papas a la francesa y ensalada familiar en una combinación perfecta de sabores del mar y la parrilla.' },
        { n: 'Parrillada 4', p: 2500, d: '500 gr de pulpo, 10 piezas de camarón y 600 gr de pescado, todo preparado al estilo zarandeado, acompañado de 4 quesadillas en maíz, arroz frito, papas a la francesa y ensalada familiar, ideal para compartir.' },
        { n: 'Parrillada 5', p: 2300, d: '600 gr de rib eye, 300 gr de pulpo y 500 gr de pescado, todo preparado al estilo zarandeado, acompañado de 4 quesadillas en maíz, arroz frito, papas a la francesa y ensalada familiar, ideal para compartir.' },
        { n: 'Parrillada 6', p: 2300, d: '500 gr de pescado y 12 camarones zarandeados al punto, acompañados de 600 gr de jugoso rib eye a la parrilla. Acompañada con 4 quesadillas de maíz, arroz frito, papas a la francesa y ensalada.' },
        { n: 'Pulpo zarandeado', p: 550, d: 'Pulpo a las brasas, marinado en nuestro zarandeado y sellado con el adobo especial de la casa. Acompañado de un salteado de cebollita, champiñón y tomate cherry que se sirve sobre el pulpo, resaltando su sabor. Acompañado con ensalada, arroz frito y papas fritas.' }
      ] }] },

    { id: 'camarones', chip: 'Camarones', kicker: 'Puro marisco…', title: 'Camarones', brush: '¡bien hecho!',
      media: ['camarones-coco', 'camarones-empanizados'],
      groups: [{ items: [
        { n: 'Empanizados', p: 310, d: 'Camarones grandes empanizados y fritos con una textura crujiente. Acompañados de arroz frito, papas a la francesa y su porción de ensalada.' },
        { n: 'Al mojo de ajo', p: 310, d: 'Camarones a la plancha, salteados con ajo, pimiento morrón y cebolla blanca, resaltando su sabor natural. Acompañados de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Al ajillo', p: 310, d: 'Camarones a la plancha, salteados con ajo y chile guajillo, junto con pimiento morrón y cebolla blanca que intensifican su sabor. Servidos con arroz frito, papas a la francesa y ensalada.' },
        { n: 'Mantequilla', p: 310, d: 'Camarones salteados en mantequilla con pimiento morrón y cebolla blanca, que realzan su sabor suave y jugoso. Servidos con arroz frito, papas a la francesa y ensalada.' },
        { n: 'Diabla', p: 310, d: 'Camarones a la plancha, bañados en salsa picosa a base de chile chipotle, salteados junto con pimiento morrón y cebolla blanca. Servidos con arroz blanco, papas a la francesa y ensalada fresca para un equilibrio perfecto.' },
        { n: 'Crema (poblana o chipotle)', p: 310, d: 'Camarones a la plancha, bañados en salsa a elección. Servidos con arroz blanco, vegetales salteados en mantequilla y papas a la francesa.' },
        { n: 'Al coco', p: 390, d: 'Camarones empanizados con coco, fritos, ligeramente dulce. Acompañados de arroz frito. Incluye un extra de aderezo de salsa mango-chipotle.' },
        { n: 'Envueltos', p: 395, d: 'Camarones rellenos de queso manchego, envueltos en tocino. Acompañados de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Rellenos queso crema', p: 395, d: 'Camarones deliciosos rellenos de queso crema empanizados, acompañados de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Enchilados', p: 390, d: 'Camarones a la plancha, sazonados con chile de árbol molido y salteados con pimiento morrón y cebolla. Acompañados de arroz frito, papas a la francesa y ensalada.' }
      ] }] },

    { id: 'molcajete', chip: 'Molcajete', title: 'Molcajete', media: ['molcajete'],
      groups: [{ items: [
        { n: 'Mar y Tierra', p: 550, d: 'Rib eye de 220 gr a la parrilla, acompañado de camarón y queso panela dorado a la plancha. Se complementa con cebolla cambray, nopal asado y chile toreado, servido en un molcajete caliente con salsa ranchera y un abanico de aguacate.' },
        { n: 'Chicharrón de atún', p: 310, d: 'Atún sazonado y marinado en nuestras salsas negras de la casa, empanizado y frito, servido en un molcajete con guacamole, chile quebrado, cebolla morada y cilantro que realzan cada bocado.' },
        { n: 'Chicharrón de pescado', p: 250, d: 'Pescado sazonado, empanizado y frito. Acompañado de guacamole, chile quebrado, cebolla morada y cilantro, terminado con un toque de salsa Huichol que realza su sabor.' },
        { n: 'Chicharrón de rib eye', p: 550, d: 'Rib eye de 300 gr en cubos, bien sazonado y frito hasta lograr un exterior dorado y crujiente, conservando su jugosidad por dentro. Acompañado de guacamole, chile toreado, cebolla cambray y cebolla crocante que aportan contraste y sabor en cada bocado.' },
        { n: 'Pacífico', p: 495, d: 'Camarón en corte mariposa, camarón cocido, callo de almeja, callo de róbalo y pulpo, mezclados con pepino, tomate, cebolla y chile serrano en nuestra Clamato Pacífico. Coronado con aguacate, camarón grande cocido, un tentáculo de pulpo y chile chiltepín espolvoreado, para un sabor fresco y lleno de intensidad.' },
        { n: 'Clásico', p: 495, d: 'Camarón en corte mariposa, camarón cocido, callo de almeja, callo de róbalo y pulpo, mezclados con pepino, tomate, cebolla y chile serrano, en salsa tatemada con un toque de catsup. Coronado con aguacate, camarón grande cocido, un tentáculo de pulpo y chile chiltepín espolvoreado, para un sabor fresco y lleno de intensidad.' }
      ] }] },

    { id: 'filetes', chip: 'Filetes', title: 'Filetes', brush: 'sazón del bueno', media: ['mojarra'],
      groups: [{ items: [
        { n: 'A la plancha', p: 190, d: 'Filete de pescado sazonado y cocinado a la plancha, preparado al punto para resaltar su sabor natural. Acompañado de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Empanizados', p: 190, d: 'Filete de pescado sazonado, empanizado y frito hasta lograr un dorado crujiente. Acompañado de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Al mojo de ajo', p: 190, d: 'Filete de pescado sazonado y cocinado a la plancha, preparado en tradicional mojo de ajo. Acompañado de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Al ajillo', p: 190, d: 'Filete de pescado a la plancha sazonado y preparado con ajo y chile guajillo que realzan su sabor. Acompañado de arroz frito, papas a la francesa y ensalada.' },
        { n: 'A la diabla', p: 190, d: 'Filete de pescado a la plancha, bien sazonado, bañado en una salsa picosa a base de chile chipotle que realza su sabor. Acompañado de arroz blanco, papas a la francesa y ensalada.' },
        { n: 'Empapelado', p: 310, d: 'Filete de pescado a vapor sazonado, montado sobre una cama de tomate, apio, cebolla blanca, pimiento morrón, jalapeño y cilantro con mantequilla y un toque de salsas negras. Coronado con pulpo y camarón. Se sirve con arroz blanco.' },
        { n: 'Mazatlán', p: 270, d: 'Filete de pescado sazonado y cocinado a la plancha, bañado en una cremosa salsa poblana. Acompañado de camarón, pulpo y surimi. Se sirve con arroz blanco, verduras salteadas en mantequilla y papas fritas.' },
        { n: 'Huachinango', p: 795, note: 'Precio por kilo', d: 'Al gusto. Frito al mojo de ajo, al ajillo, o a la diabla. Acompañado de arroz frito, papas a la francesa y ensalada.' },
        { n: 'Mojarra', p: 400, note: 'Precio por kilo', d: 'Mojarra sazonada y bien frita al punto perfecto, preparada a elección: al mojo de ajo, al ajillo o a la diabla. Acompañada de arroz frito, papas a la francesa y ensalada.' }
      ] }] },

    { id: 'lonjas', chip: 'Lonjas', title: 'Lonjas',
      intro: 'Lonjas de 300 gr, sazonadas y preparadas a elección: empanizada, a la plancha, zarandeada, al mojo de ajo, al ajillo o a la diabla. Acompañadas de arroz frito, papas a la francesa y ensalada.',
      groups: [{ compact: true, items: [
        { n: 'Pargo', p: 420 }, { n: 'Róbalo', p: 420 }, { n: 'Huachinango', p: 420 },
        { n: 'Dorado', p: 345 }, { n: 'Curvina', p: 345 }
      ] }] },

    { id: 'ceviches', chip: 'Ceviches', title: 'Ceviches',
      media: ['ceviche-mitotero', { card: { tone: 'coral', kicker: 'Especialidad del chef', title: 'Mitotero', text: 'Camarón fresco con atún, pulpo, callo de róbalo y aguacate, sobre un espejo de aguachile rojo.' } }],
      groups: [{ items: [
        { n: 'Camarón', p: [['Orden', 310], ['Tostada', 125]], d: 'Ceviche de camarón fresco, preparado al momento, acompañado de aguacate y servido sobre un espejo de clamato preparado que resalta su frescura y sabor inigualable.' },
        { n: 'Pescado', p: [['Orden', 260], ['Tostada', 100]], d: 'Ceviche de pescado fresco, preparado al momento, acompañado de aguacate y servido sobre un espejo de clamato preparado que resalta su frescura y sabor inigualable.' },
        { n: 'Culichi', p: [['Orden', 385], ['Tostada', 150]], d: 'El de la casa: camarón fresco picado, mezclado con cebolla morada y chile quebrado, perfectamente sazonado en nuestras salsas negras, acompañado de aguacate, pepino, cilantro y chile serrano, logrando un equilibrio intenso y lleno de sabor.' },
        { n: 'Atún', p: [['Orden', 310], ['Tostada', 140]], d: 'Atún en cubos, sazonado y marinado en salsas negras, sobre una base de aguacate y servido en su propia salsa, acompañado de pepino, cebolla morada y cilantro, creando un balance intenso y lleno de sabor.' },
        { n: 'Mitotero', p: 440, d: 'Una especialidad del chef. Ceviche de camarón fresco, bañado en salsa pal jefe y salsas negras, acompañado de atún, pulpo, callo de róbalo fresco, camarón grande, aguacate y rodajas de cebolla, con un toque de chiltepín, servido sobre un espejo de aguachile rojo, creando una explosión de sabores en un ceviche único.' },
        { n: 'Mixto', p: [['Orden', 310], ['Tostada', 120]], d: 'Ceviche mixto de camarón y pescado fresco, preparado al momento, acompañado de aguacate y servido sobre un espejo de clamato preparado, que resalta su frescura y crea una combinación equilibrada y llena de sabor.' }
      ] }] },

    { id: 'aguachiles', chip: 'Aguachiles', title: 'Aguachiles', brush: '¡chela fría y cero culpa!',
      media: ['aguachile-mango-habanero', 'aguachile-verde', 'aguachile-rojo'],
      callout: { title: 'Báñalo en tu salsa favorita', chips: ['Verde', 'Roja', 'Negra', 'Mango habanero', 'Tatemada'], text: 'Agrega 200 gr de camarón grande cocido a tu aguachile favorito por $200.' },
      groups: [{ items: [
        { n: 'Camarón', p: 330, d: 'Camarón fresco en corte mariposa condimentado con sal, pimienta y limón, acompañado de una corona de aguacate, cebolla, cilantro, pepino y chile serrano.' },
        { n: 'Callo de hacha', p: 740, d: '200 gr de callo de hacha fresco, condimentado con sal, pimienta y limón, bañado en la salsa de su preferencia, acompañado de una corona de aguacate, cebolla morada, cilantro, pepino, decorado con hojas de cilantro y rodajas de chile serrano.' },
        { n: 'Callo de róbalo 200 gr', p: 410, d: '200 gr de callo de róbalo, condimentado con sal, pimienta y limón, incluye un toque de chiltepín.' },
        { n: 'Mixto de camarón y callo de hacha', p: 650, d: 'Aguachile mixto de callo de hacha (100 gr) y camarón (8 piezas de camarón) preparado al momento, acompañado de cebolla, pepino, aguacate, cilantro y chile serrano, logrando un contraste de texturas y un sabor fresco, intenso y perfectamente equilibrado.' }
      ] }] },

    { id: 'cocteles', chip: 'Cocteles', title: 'Cocteles y campechanas', media: ['coctel-camaron', 'campechana'],
      groups: [
        { title: 'Cocteles', items: [
          { n: 'Clásico camarón', p: [['Grande', 295], ['Mediana', 215]], d: 'Camarón cocido con tomate, cebolla, cilantro y aguacate, bañado en nuestra salsa clásica a base de catsup. Fresco y tradicional.' },
          { n: 'Clásico camarón · pulpo', p: [['Grande', 360], ['Mediana', 240]], d: 'Camarón y pulpo con tomate, cebolla, cilantro y aguacate en salsa clásica. Sabor fresco y con carácter.' },
          { n: 'Pacífico camarón', p: [['Grande', 295], ['Mediana', 215]], d: 'Camarón cocido con tomate, cebolla, cilantro, pepino decorado con una mano de aguacate, una rodaja de limón y pepino en nuestra clamato Pacífico. Refrescante y lleno de sabor.' },
          { n: 'Pacífico camarón · pulpo', p: [['Grande', 360], ['Mediana', 295]], d: 'Camarón y pulpo con tomate, cebolla, cilantro, pepino y aguacate en nuestra clamato Pacífico. Equilibrio perfecto entre frescura y tradición.' }
        ] },
        { title: 'Campechanas', items: [
          { n: 'Clásica', p: [['Grande', 330], ['Mediana', 220]], d: 'Camarón cocido y fresco, callo perla, pulpo, ostiones y pescado, acompañado de tomate, cebolla, cilantro y aguacate, todo bañado en nuestra salsa clásica base de catsup, logrando una mezcla abundante, fresca y llena de sabor del mar.' },
          { n: 'Pacífica', p: [['Grande', 330], ['Mediana', 220]], d: 'Camarón cocido y fresco, callo perla, pulpo, ostiones y pescado, acompañado de tomate, cebolla, cilantro, pepino y aguacate, todo bañado en nuestro clamato Pacífico especial, logrando una mezcla abundante, fresca y llena de sabor del mar.' }
        ] }
      ] },

    { id: 'rollos', chip: 'Puro rollo', title: 'Puro rollo',
      media: ['rollo-tempura', { card: { tone: 'blue', kicker: 'Crujiente o tempura', title: 'Puro rollo', text: 'Servidos con salsa de anguila y chiles en salsa ponzul.' } }],
      groups: [{ items: [
        { n: 'Crunchy', p: 230, d: 'Crujiente rollo empanizado en panko, relleno de camarón tempura, pepino y queso crema, coronado con kanikama y una deliciosa pasta tampico con un toque cítrico y de salsa siracha. Acompañado de salsa de anguila y chiles en salsa ponzul.' },
        { n: 'Tempura', p: 290, d: 'Fresco y cremoso por dentro relleno de pepino y queso crema coronado con guacamole, atún marinado en aceite de ajonjolí y camarón cocido. Acompañado de salsa de anguila y chiles en salsa ponzul.' }
      ] }] },

    { id: 'no-marisco', chip: '¿Algo que no sea marisco?', title: '¿Algo que no sea marisco?',
      media: ['rib-eye-camarones'],
      groups: [{ items: [
        { n: 'Rib eye', p: 490, d: 'Rib Eye de 300 gr cocinado a la parrilla al punto perfecto del cliente. Acompañado de guacamole, pico de gallo, papas fritas, chile toreado y salsa molcajeteada que complementan cada bocado.' },
        { n: 'Rib eye con camarones', p: 550, d: 'Rib Eye de 220 gr sazonado y cocinado a la parrilla, acompañado de camarones a la plancha con pimiento morrón, cebolla y champiñón que aportan un toque jugoso y lleno de sabor. Servido con guacamole, pico de gallo, papas fritas, chile toreado y salsa molcajeteada.' },
        { n: 'Tacos de sirloin', p: 280, d: 'Sirloin picado, sazonado y cocinado al punto. Acompañado de guacamole, pico de gallo y salsa molcajeteada.' },
        { n: 'Hamburguesa de res', p: 200, d: 'Jugosa carne de res acompañada de mayonesa, lechuga, tomate y cebolla, coronada con una generosa porción de aguacate y una crujiente costra de queso. Servida con papas fritas.' }
      ] }] },

    { id: 'plebes', chip: 'Pa’ los plebes', title: 'Pa’ los plebes', media: ['plebes'], wide: true,
      groups: [{ items: [
        { n: 'Nuggets', p: 120, d: '5 nuggets de pollo acompañados de papas fritas.' },
        { n: 'Camarones empanizados', p: 190, d: '5 camarones empanizados acompañados de papas fritas.' },
        { n: 'Tiras de pescado', p: 120, d: 'Tiras de pescado empanizadas acompañadas de papas fritas.' }
      ] }] },

    { id: 'dulce', chip: 'Dulce', title: 'El momento dulce', brush: '¡pa’ que se te antoje volver!',
      media: ['postre', { card: { tone: 'coral', kicker: 'Agrega bola de nieve', title: '+$50', text: 'Sabor vainilla a tu postre favorito.' } }],
      groups: [{ compact: true, items: [
        { n: 'Nieve artesanal', p: 145, d: 'Coco, mango o elote.' },
        { n: 'Cheesecake de fresa', p: 165 },
        { n: 'Brownie de chocolate', p: 165 },
        { n: 'Pan de elote', p: 165 },
        { n: 'Trufa de chocolate', p: 165 },
        { n: 'Cheesecake tortuga', p: 165 }
      ] }] },

    { id: 'extras', chip: 'Extras', title: 'Extras',
      groups: [{ compact: true, items: [
        { n: 'Orden de papas', p: 60 }, { n: 'Aros de cebolla', p: 70 },
        { n: 'Mojo de ajo (5 oz)', p: 50 }, { n: 'Chiles toreados (2 pz)', p: 40 },
        { n: 'Salsa cebolla habanero (2 oz)', p: 30 }, { n: 'Quesadillas (4 pz)', p: 90 },
        { n: 'Orden de verdura', p: 45 }, { n: 'Salsa diabla (5 oz)', p: 35 },
        { n: 'Tártara (2 oz)', p: 25 }, { n: 'Aderezo chipotle (2 oz)', p: 25 },
        { n: 'Orden de arroz', p: 50 }, { n: 'Guacamole (200 gr)', p: 90 }
      ] }] }
  ];

  /* ---------- Bebidas ---------- */
  const DRINKS = {
    photos: ['mojito-maracuya', 'margarita-fresa', 'clericot'],
    basicos: [
      ['Saludo extra', 25], ['Saludo perrón', 100], ['Refresco', 45], ['Agua natural', 30],
      ['Limonada natural', 45, 'Mineral 50'], ['Naranjada natural', 50, 'Mineral 55'],
      ['Aguas frescas', 45], ['Café', 65]
    ],
    cervezas: [
      ['Tecate Light', 50], ['Tecate Roja', 50], ['Indio', 50], ['XX Lager', 50], ['XX Ámbar', 50],
      ['Bohemia Clara', 65], ['Bohemia Oscura', 65], ['Bohemia Cristal', 65], ['Carta Blanca', 50],
      ['Heineken', 55], ['Heineken Cero', 55], ['Amstel Ultra', 65], ['Stella', 60], ['Corona', 50],
      ['Victoria', 50], ['Pacífico Clara', 50], ['Pacífico Suave', 50], ['Modelo Especial', 65],
      ['Negra Modelo', 65], ['Michelob Ultra', 50]
    ],
    acompanar: { head: ['', 'Litro', '+ Camarón'], rows: [['Clamato', 115, 160], ['Chelada', 115, 160], ['Michelada', 115, 160]] },
    cocteleria: [
      { t: 'Clásicos', i: [['Mojito', 145], ['Margarita', 165]] },
      { t: 'Especiales', i: [['Gin frutos rojos', 135], ['Rojo mezcal', 125], ['Clericot', 85]] },
      { t: 'Tropicales', i: [['Piña colada', 125], ['Paloma', 95]] }
    ],
    destilados: [
      { t: 'Whisky', i: [['Black Label', 150], ['Red Label', 150], ['Buchanan’s', 150]] },
      { t: 'Mezcal', i: [['400 Conejos', 130]] },
      { t: 'Ron', i: [['Cuba Bacardí', 95], ['Cuba Zacapa', 175]] },
      { t: 'Digestivos', i: [['Baileys', 115], ['Licor 43', 115], ['Carajillo', 145]] },
      { t: 'Tequila', i: [['1800 Cristalino', 160], ['Don Julio 70', 160], ['Herradura', 135], ['Tradicional', 110], ['Maestro Dobel', 150]] },
      { t: 'Vinos', i: [['Casa Madero 3V', 150], ['Casa Madero Rosado', 100], ['Casa Madero Chardón', 100]] }
    ]
  };

  /* ---------- La mesa (servicio) ---------- */
  const MESA = [
    { n: '01', t: 'Para compartir', d: 'Mariscadas frías y calientes, torres y botanas pensadas para el centro de la mesa.', img: 'torre-sinaloense', to: '#cat-dejarse-caer' },
    { n: '02', t: 'El asador', d: 'Seis parrilladas al zarandeado con pulpo, camarón, pescado y rib eye, más pulpo zarandeado.', img: 'parrillada', to: '#cat-asador' },
    { n: '03', t: 'La barra', d: 'Cervezas, coctelería de autor, tequila, mezcal, whisky y vinos Casa Madero.', img: 'mojito-maracuya', to: '#bebidas' },
    { n: '04', t: 'Pa’ los plebes', d: 'Menú infantil con nuggets, camarones empanizados y tiras de pescado.', img: 'plebes', pos: '20% 60%', to: '#cat-plebes' }
  ];

  return { SITE, PHOTOS, VIDEOS, FEATURED, MENU, DRINKS, MESA };
})();
