'use strict';

/* ═══════════════════════════════════════════════════
   MAMB · script.js
   Navigation · Interactions · State management
═══════════════════════════════════════════════════ */

// ── STATE ─────────────────────────────────────────
const APP = {
  currentScreen: 's-login',
  history: [],
  processingTimer: null,
  progressValue: 20,
  selectedStyle: 'impresionismo',
  tutStep: 0,
  favActive: false,
  flashActive: false,
  autosaveTimer: null,
  currentUserId: null,
};

// ── TUTORIAL DATA ─────────────────────────────────
const TUT_STEPS = [
  { title: 'Hola, soy Pinto', body: 'Tu guía de arte en el MAMB. Te voy a mostrar cómo funciona todo.' },
  { title: 'Captura tu dibujo', body: 'Usa la cámara para tomar una foto de tu dibujo. Asegúrate de que haya buena luz.' },
  { title: 'Elige el estilo', body: 'La inteligencia artificial va a convertir tu dibujo en una obra de arte única.' },
  { title: 'Comparte tu arte', body: 'Cuando tu obra esté lista, guárdala en el museo y que todo el mundo la vea.' },
];

// ── ARTIST DATA ───────────────────────────────────
const ARTISTS = {
  obregon: {
    name: 'Alejandro Obregón',
    origin: 'Colombia · 1920 – 1992',
    bio: 'El gran pintor del Caribe colombiano. Sus cuadros muestran condores, tormentas y el mar con colores intensos que parecen moverse y vivir.',
    fact: 'Pintaba el vuelo del cóndor desde los acantilados de Barranquilla y le encantaba navegar.',
    avClass: 'av-obregon',
    artworks: [
      { title: 'Pez Dorado', date: '1947', desc: 'Marcó el inicio del modernismo en Colombia al experimentar con planos y la bidimensionalidad de la tela.', img: 'https://www.mcarts.com/obregon/arte/1/photos/470014.jpg' },
      { title: 'El Cóndor', date: '1959', desc: 'Representación majestuosa del ave andina, símbolo de libertad y fuerza.', img: 'https://galeriaduquearango.com/wp-content/uploads/2023/02/Condor-ca-1976.webp' },
      { title: 'Barracuda', date: '1968', desc: 'Muestra el dinamismo de la fauna marina con colores vibrantes y contrastantes.', img: 'https://d7hftxdivxxvm.cloudfront.net/?height=654&quality=85&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F1m90UTyBRoYeF-2RMbMBRw%2Fnormalized.jpg&width=800' }
    ]
  },
  botero: {
    name: 'Fernando Botero',
    origin: 'Colombia · 1932 – 2023',
    bio: 'El más famoso artista colombiano en el mundo. Creó un estilo único: todas sus figuras son gordas y redondas, llenas de alegría y fuerza.',
    fact: 'Sus esculturas gorditas están en las principales ciudades del mundo, como Nueva York y París.',
    avClass: 'av-botero',
    artworks: [
      { title: 'Monalisa a los 12 años', date: '1959', desc: 'Una reinterpretación del clásico de Da Vinci con su característico estilo volumétrico.', img: 'https://www.singulart.com/blog/wp-content/uploads/2024/02/Mona-Lisa-Age-Twelve-856x1024.jpg' },
      { title: 'La Familia Presidencial', date: '1967', desc: 'Sátira política donde exagera las formas de las figuras de poder.', img: 'https://blocdejavier.wordpress.com/wp-content/uploads/2020/02/botero-la-familia-presidencial-1957.jpg?w=584&h=607' },
      { title: 'Pájaro', date: '1990', desc: 'Escultura icónica que representa la paz, ubicada en Medellín y otras ciudades.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Fernando_Botero%2C_Bird_%281990%29%2C_Singapore_-_20040616.jpg' }
    ]
  },
  grau: {
    name: 'Enrique Grau',
    origin: 'Colombia · 1920 – 2004',
    bio: 'Pintó mujeres elegantes del Caribe con colores tropicales brillantes. También fue escultor, diseñador de moda y actor de teatro.',
    fact: 'Además de pintar, actuó en obras de teatro y diseñó vestuarios para el cine colombiano.',
    avClass: 'av-grau',
    artworks: [
      { title: 'La mulata cartagenera', date: '1954', desc: 'Una representación de la belleza y herencia cultural afrocolombiana del Caribe.', img: 'https://www.museonacional.gov.co/Inicio/SiteAssets/inbox/files/images/piemesmar011.jpg' },
      { title: 'Tranvía en llamas', date: '1948', desc: 'Obra inspirada en los sucesos históricos del Bogotazo.', img: 'https://i0.wp.com/esferapublica.org/nfblog/wp-content/uploads/2013/04/pad08grau.png' },
      { title: 'Rita', date: '1989', desc: 'Escultura de bronce que muestra a una mujer con la volumetría típica del artista.', img: 'https://www.bogotaauctions.com/img/thumbs/500/001/731/001-731-1.jpg?a=1690871814' }
    ]
  },
  cepeda: {
    name: 'Álvaro Cepeda Samudio',
    origin: 'Colombia · 1926 – 1972',
    bio: 'Escritor y periodista barranquillero que también exploró el arte visual. Era parte del grupo de intelectuales más importante del Caribe.',
    fact: 'Era amigo cercano de Gabriel García Márquez. Juntos cambiaron la literatura latinoamericana.',
    avClass: 'av-cepeda',
    artworks: [
      { title: 'La casa grande', date: '1962', desc: 'Su obra literaria cumbre, considerada una de las grandes novelas de Colombia.', img: 'https://www.penguinlibros.com/co/288869/la-casa-grande.jpg' },
      { title: 'Todos estábamos a la espera', date: '1954', desc: 'Colección de cuentos que revolucionó la literatura colombiana.', img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQPX5HXPI8pQpwZd8XQQp1oHsbLkIgThS5NzcUHW2deLon6wED9' },
      { title: 'La langosta azul', date: '1954', desc: 'Un cortometraje considerado pieza pionera del cine independiente en el país.', img: 'https://m.media-amazon.com/images/M/MV5BNGNiY2Q2ZGUtNDdlOC00YWU3LThhYTktMjI4Yjg1ODZjZjY4XkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg' }
    ]
  },
  barrios: {
    name: 'Álvaro Barrios',
    origin: 'Colombia · 1945',
    bio: 'Pionero del arte conceptual en Colombia. Mezcla imágenes de cómics, postales y objetos del día a día para crear obras que te hacen pensar.',
    fact: 'Fue el primer artista colombiano en usar cómics como material artístico serio y reconocido.',
    avClass: 'av-barrios',
    artworks: [
      { title: 'El mar de Cristóbal Colón', date: '1970', desc: 'Grabado conceptual que explora la historia y la geografía.', img: 'https://live.staticflickr.com/65535/52796903606_85891a27d6_b.jpg' },
      { title: 'Sueños con Marcel Duchamp', date: '1978', desc: 'Una de sus obras más famosas que vincula el cómic y el surrealismo.', img: 'https://images.artnet.com/gallery-images/423903146/1503377.jpg?x=340%40%21420xiaD0zNDAmdz00MjAmZj1jb3ZlciZ0PWw%3D' },
      { title: 'Grabados populares', date: '1980', desc: 'Serie publicada en periódicos para democratizar el acceso al arte.', img: 'https://www.banrepcultural.org/alvaro-barrios/images/internas/obras/grabados-populares-2.jpg' }
    ]
  },
  loochkartt: {
    name: 'Ángel Loochkartt',
    origin: 'Colombia · 1933 - 2019',
    bio: 'Artista barranquillero que pintó la identidad caribeña con colores vibrantes. Sus obras celebran el Carnaval y la alegría del Caribe colombiano.',
    fact: 'Sus colores están directamente inspirados en los trajes y disfraces del Carnaval de Barranquilla.',
    avClass: 'av-loochkartt',
    artworks: [
      { title: 'Carnaval de Barranquilla', date: '1985', desc: 'Pintura vibrante que captura la esencia y el caos del carnaval.', img: 'https://www.elnuevosiglo.com.co/sites/default/files/2016-09/14m%20expo%20carnaval.jpg' },
      { title: 'Congo ronda', date: '1978', desc: 'Pintada al óleo sobre lienzo, permite texturas más densas y una vibración del color más orgánica.', img: 'https://static.arteinformado.com/resources/app/docs/organizacion/32/113132/obras/congo_ronda_noturna_angel_loochkart.jpg' },
      { title: 'Presencia del ángel', date: '1980', desc: 'Utiliza un expresionismo figurativo donde el color es el protagonista. La figura del ángel parece emerger de un fondo caótico de pinceladas rápidas, sugiriendo movimiento y una presencia casi fantasmagórica.', img: 'https://static.wixstatic.com/media/a5a9b8_6c0d70e550f247e4be92de51dafd01de~mv2.jpg/v1/fill/w_367,h_367,fp_0.48_0.15,q_90,enc_avif,quality_auto/a5a9b8_6c0d70e550f247e4be92de51dafd01de~mv2.jpg' }
    ]
  },
  dali: {
    name: 'Salvador Dalí',
    origin: 'España · 1904 – 1989',
    bio: 'El maestro del surrealismo. Pintaba sueños imposibles: relojes que se derriten, elefantes con patas de araña, mundos que solo existen en la imaginación.',
    fact: 'Tenía un ocelote (gato salvaje) de mascota llamado Babou con quien viajaba por el mundo.',
    avClass: 'av-dali',
    artworks: [
      { title: 'La persistencia de la memoria', date: '1931', desc: 'Famosa por sus relojes blandos, representa la relatividad del tiempo.', img: 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvbnljLTItMjY4LmpwZyIsInJlc2l6ZSwyMDAwLDIwMDAiXX0.kyLjy8saXwwv-oGbJBh7X0tgXbgo4aN-d5IcAxw7A2w.jpg' },
      { title: 'Cisnes reflejando elefantes', date: '1937', desc: 'Una ilusión óptica que juega con la percepción y la realidad.', img: 'https://historia-arte.com/_/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpbSI6WyJcL2FydHdvcmtcL2ltYWdlRmlsZVwvZGFsaS1jaXNuZXMtcXVlLXNlLXJlZmxlamFuLmpwZyIsInJlc2l6ZSwyMDAwLDIwMDAiXX0.iGHsxMD2xETrLuz9YW8yq0sJkI714uumnx4mtGFwWqc.jpg' },
      { title: 'La metamorfosis de Narciso', date: '1937', desc: 'Interpretación del mito griego donde transforma a la figura de Narciso en una mano que sostiene un huevo.', img: 'https://www.cafeconvertes.com/wp-content/uploads/2021/01/092-Salvador-Dali-La-Metamorfosis-de-Narciso-1937.jpg' }
    ]
  },
  appel: {
    name: 'Karel Appel',
    origin: 'Holanda · 1921 – 2006',
    bio: 'Pintaba con la energía y libertad de un niño. Colores gritones, trazos fuertes y figuras que parecen monstruos amigables y llenos de vida.',
    fact: '"Pinto como un bárbaro" era su frase favorita. Creía que los niños pintan mejor que los adultos.',
    avClass: 'av-appel',
    artworks: [
      { title: 'Cuestionando a los niños', date: '1949', desc: 'Obra de estilo infantil que critica la educación tradicional.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7cbAVnVKr0zUEKOIp14cD4hizrpaIj0U_Xw&s' },
      { title: 'Hip, hip, hurra', date: '1949', desc: 'Pintura expresionista abstracta con colores intensos y pinceladas violentas.', img: 'https://www.singulart.com/blog/wp-content/uploads/2024/03/Hip-Hip-Hoorah.jpg' },
      { title: 'El gato', date: '1961', desc: 'Representación colorida y salvaje de un felino, típica del movimiento CoBrA.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLNep999-h_rL_LFOMkYJw_Ys8Sd19PlHmMQ&s' }
    ]
  }
};

// ── NAVIGATION ────────────────────────────────────
function nav(targetId, skipHistory) {
  const current = document.querySelector('.screen.active');
  const target = document.getElementById(targetId);
  if (!target || !current || current.id === targetId) return;

  // History
  if (!skipHistory && APP.currentScreen !== targetId) {
    APP.history.push(APP.currentScreen);
  }

  current.classList.remove('active');
  target.classList.add('active', 'entering');
  target.addEventListener('animationend', () => target.classList.remove('entering'), { once: true });

  APP.currentScreen = targetId;
  onScreenEnter(targetId);

  // Close dev panel
  document.getElementById('dev-panel')?.classList.remove('open');
}

function goBack() {
  const prev = APP.history.pop();
  if (prev) nav(prev, true);
}

function onScreenEnter(id) {
  switch (id) {
    case 's-processing': startProcessingAnim(); break;
    case 's-result': resetResultDrawer(); break;
    case 's-tutorial': resetTutorial(); break;
    case 's-camera': setTimeout(initCamera, 300); break;
    case 's-home': loadHomeLogros(); break;
    case 's-gallery': loadObras(); break;
    case 's-profile': loadProfileData(); break;
    case 's-edit-profile': loadEditProfileData(); break;
  }

  if (id !== 's-camera') {
    stopCamera();
  }
  if (id !== 's-game') {
    if (typeof stopGame === 'function') stopGame();
  }
}

// ── CAMERA LOGIC ──────────────────────────────────
let cameraStream = null;
let capturedImageData = null;

async function initCamera() {
  const video = document.getElementById('camera-video');
  if (!video) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    cameraStream = stream;
    video.srcObject = stream;
    video.setAttribute('playsinline', '');
    video.play();
  } catch (err) {
    console.error("Camera error:", err);
    // Fallback: open native camera via file input on mobile
    const fileInput = document.getElementById('camera-file-input');
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

function takePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  if (!video || !canvas) return;

  // Set canvas to video size
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  capturedImageData = canvas.toDataURL('image/jpeg', 0.8);

  const previewImg = document.getElementById('preview-img');
  if (previewImg) {
    previewImg.src = capturedImageData;
  }

  nav('s-preview');
}

function handleFileCapture(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    capturedImageData = ev.target.result;
    const previewImg = document.getElementById('preview-img');
    if (previewImg) previewImg.src = capturedImageData;
    nav('s-preview');
  };
  reader.readAsDataURL(file);
}

// ── PROCESSING SIMULATION ─────────────────────────
function startAIProcessing() {
  const nombre = document.getElementById('obra-nombre').value;
  if (!nombre) {
    showToast("Por favor dale un nombre a tu obra");
    return;
  }
  if (!capturedImageData) {
    showToast("Por favor toma una foto primero");
    return;
  }
  nav('s-processing');
}

function startProcessingAnim() {
  clearInterval(APP.processingTimer);
  APP.progressValue = 20;
  updateProgressUI(20);

  APP.processingTimer = setInterval(() => {
    APP.progressValue += (Math.random() * 9 + 2);
    if (APP.progressValue >= 100) {
      APP.progressValue = 100;
      clearInterval(APP.processingTimer);
      updateProgressUI(100);
      updateStepsUI(100);
      applyAIFilter();
      setTimeout(() => nav('s-result'), 900);
    } else {
      updateProgressUI(Math.min(APP.progressValue, 98));
      updateStepsUI(APP.progressValue);
    }
  }, 420);
}

function applyAIFilter() {
  const resultCanvas = document.getElementById('result-canvas');
  if (!resultCanvas || !capturedImageData) return;

  const ctx = resultCanvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    resultCanvas.width = img.width;
    resultCanvas.height = img.height;

    // Configurar filtros según estilo
    const styleEl = document.querySelector('.style-card.selected');
    const styleId = styleEl ? styleEl.dataset.style : 'impresionismo';
    const styleName = styleEl ? styleEl.querySelector('strong').textContent : 'Impresionismo';

    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    // Filtros IA simulados usando CSS context filters
    if (styleId === 'impresionismo') {
      ctx.filter = 'saturate(1.5) contrast(1.2) brightness(1.1) blur(1px)';
    } else if (styleId === 'vangogh') {
      ctx.filter = 'saturate(2) contrast(1.5) hue-rotate(15deg)';
    } else if (styleId === 'acuarela') {
      ctx.filter = 'opacity(0.8) saturate(1.8) blur(2px)';
    } else if (styleId === 'cubismo') {
      ctx.filter = 'contrast(2) saturate(0.8) sepia(0.3)';
    } else if (styleId === 'puntillismo') {
      ctx.filter = 'contrast(1.3) saturate(1.5)';
      // Efecto granular
    } else if (styleId === 'fantasia') {
      ctx.filter = 'hue-rotate(90deg) saturate(3) contrast(1.2)';
    }

    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none'; // reset

    // Pixelación manual para puntillismo o cubismo si se quiere
    if (styleId === 'cubismo' || styleId === 'puntillismo') {
      const size = styleId === 'cubismo' ? 0.1 : 0.05;
      const w = resultCanvas.width * size;
      const h = resultCanvas.height * size;
      ctx.drawImage(resultCanvas, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(resultCanvas, 0, 0, w, h, 0, 0, resultCanvas.width, resultCanvas.height);
    }

    // Actualizar Textos
    const nombre = document.getElementById('obra-nombre').value;
    document.getElementById('result-nombre').textContent = nombre;
    document.getElementById('result-detalle').textContent = `Estilo ${styleName}`;
  };
  img.src = capturedImageData;
}

function updateProgressUI(val) {
  const fill = document.getElementById('prog-fill');
  const pct = document.getElementById('prog-pct');
  if (!fill || !pct) return;
  const p = Math.round(val);
  fill.style.width = p + '%';
  pct.textContent = p + '%';
}

function updateStepsUI(val) {
  const steps = document.querySelectorAll('.proc-step');
  if (val >= 70 && steps[2]) {
    if (!steps[2].classList.contains('done')) {
      steps[2].innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" fill="var(--green)"/><path d="M8 12l3 3 5-5" stroke="white"/></svg><span>Aplicando el arte</span>`;
      steps[2].className = 'proc-step done';
      if (steps[3]) steps[3].className = 'proc-step active';
    }
  }
}

// ── RESULT DRAWER ─────────────────────────────────
function openDrawer() {
  document.getElementById('result-drawer')?.classList.add('open');
  document.getElementById('result-drawer-backdrop')?.classList.add('open');
  document.getElementById('tap-hint')?.style && (document.getElementById('tap-hint').style.display = 'none');
}
function closeDrawer() {
  document.getElementById('result-drawer')?.classList.remove('open');
  document.getElementById('result-drawer-backdrop')?.classList.remove('open');
  document.getElementById('tap-hint') && (document.getElementById('tap-hint').style.display = '');
}
function resetResultDrawer() {
  closeDrawer();
  APP.favActive = false;
  const fb = document.getElementById('fav-btn');
  if (fb) fb.classList.remove('active');
}
function toggleFav() {
  APP.favActive = !APP.favActive;
  const fb = document.getElementById('fav-btn');
  if (!fb) return;
  fb.classList.toggle('active', APP.favActive);
  showToast(APP.favActive ? 'Guardado en favoritos' : 'Eliminado de favoritos');
}

// ── MODALS ────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  if (id === 'm-welcome') spawnConfetti();
  el.addEventListener('click', (e) => {
    if (e.target === el) closeModal(id);
  }, { once: true });
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ── TOAST ─────────────────────────────────────────
let _toastTimer;
function showToast(msg, ms = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('visible'), ms);
}

// ── CONFETTI ──────────────────────────────────────
function spawnConfetti() {
  const host = document.getElementById('confetti-host');
  if (!host) return;
  host.innerHTML = '';
  const cols = ['#F5A623', '#E94560', '#4A90E2', '#27AE60', '#7B3F8C'];
  for (let i = 0; i < 28; i++) {
    const d = document.createElement('div');
    const col = cols[i % cols.length];
    const size = 4 + Math.random() * 8;
    const delay = Math.random() * 0.5;
    const dur = 0.8 + Math.random() * 1.0;
    d.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:${col};
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      left:${Math.random() * 100}%;top:0;
      animation:cf-fall ${dur}s ease-out ${delay}s both;
    `;
    host.appendChild(d);
  }
}
const _cfStyle = document.createElement('style');
_cfStyle.textContent = `
  @keyframes cf-fall {
    from{transform:translateY(0) rotate(0deg);opacity:1;}
    to{transform:translateY(60px) rotate(360deg);opacity:0;}
  }
`;
document.head.appendChild(_cfStyle);

// ── STYLE CAROUSEL ────────────────────────────────
function selectStyle(card) {
  document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  APP.selectedStyle = card.dataset.style;
  // Sync dot
  const cards = Array.from(document.querySelectorAll('.style-card'));
  updateCarouselDot(cards.indexOf(card));
}

function initCarousel() {
  const car = document.getElementById('style-carousel');
  const cards = car?.querySelectorAll('.style-card');
  if (!car || !cards) return;
  car.addEventListener('scroll', () => {
    const cw = (cards[0]?.offsetWidth || 215) + 12;
    const idx = Math.round(car.scrollLeft / cw);
    updateCarouselDot(idx);
  }, { passive: true });
}
function updateCarouselDot(idx) {
  document.querySelectorAll('.cdot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ── GRADE SELECTOR ────────────────────────────────
function selectGrade(btn, grade) {
  btn.closest('.grade-grid').querySelectorAll('.grade-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// ── AVATAR SELECTOR ───────────────────────────────
function selectAvatar(btn, seed) {
  btn.closest('.avatar-grid').querySelectorAll('.avatar-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// ── FILTER CHIPS ──────────────────────────────────
function activateFilter(chip) {
  chip.closest('.filter-strip').querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  filterGallery(chip.textContent.trim());
}

function filterGallery(filter) {
  const galleryGrid = document.querySelector('#s-gallery .gallery-grid');
  if (!galleryGrid) return;

  const cards = galleryGrid.querySelectorAll('.gal-card');
  const emptyEl = document.getElementById('gallery-empty');

  const styleFilterMap = {
    'Impresionismo': ['impresionismo'],
    'Remolinos': ['remolinos', 'vangogh'],
    'Acuarela': ['acuarela'],
    'Cubismo': ['cubismo'],
    'Puntillismo': ['puntillismo'],
    'Fantasía': ['fantasía', 'fantasia'],
  };

  let visibleCount = 0;

  cards.forEach(card => {
    if (filter === 'Todas') {
      card.style.display = '';
      visibleCount++;
      return;
    }

    if (filter === 'Mis obras') {
      const uid = card.getAttribute('data-user-id');
      const show = uid && uid === APP.currentUserId;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
      return;
    }

    if (filter === 'Favoritos') {
      const show = card.classList.contains('is-fav');
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
      return;
    }

    const styleTag = card.querySelector('.style-tag');
    if (!styleTag) { card.style.display = 'none'; return; }
    const cardStyle = styleTag.textContent.trim().toLowerCase();
    const matches = styleFilterMap[filter] || [filter.toLowerCase()];
    const show = matches.includes(cardStyle);
    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  if (emptyEl) {
    if (filter === 'Mis obras' && visibleCount === 0) {
      emptyEl.style.display = '';
    } else {
      emptyEl.style.display = 'none';
    }
  }
}

// ── FLASH TOGGLE ──────────────────────────────────
function toggleFlash() {
  APP.flashActive = !APP.flashActive;
  document.getElementById('flash-btn')?.classList.toggle('active', APP.flashActive);
}

// ── PASSWORD TOGGLE ───────────────────────────────
function togglePw(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
}

// ── AUTOSAVE ──────────────────────────────────────
function triggerAutosave() {
  const ind = document.getElementById('autosave-ind');
  if (!ind) return;
  ind.classList.remove('visible');
  clearTimeout(APP.autosaveTimer);
  APP.autosaveTimer = setTimeout(() => {
    ind.classList.add('visible');
    setTimeout(() => ind.classList.remove('visible'), 2500);
  }, 1800);
}

// ── TUTORIAL ──────────────────────────────────────
function resetTutorial() { APP.tutStep = 0; renderTutStep(); }
function nextTutStep() {
  APP.tutStep++;
  if (APP.tutStep >= TUT_STEPS.length) {
    nav('s-home');
    return;
  }
  renderTutStep();
}
function renderTutStep() {
  const s = TUT_STEPS[APP.tutStep];
  const title = document.getElementById('tut-title');
  const body = document.getElementById('tut-body');
  const dots = document.querySelectorAll('.tdot');
  const btn = document.querySelector('.tut-actions .btn-primary');
  if (title) title.textContent = s.title;
  if (body) body.textContent = s.body;
  dots.forEach((d, i) => d.classList.toggle('active', i === APP.tutStep));
  if (btn) btn.textContent = APP.tutStep === TUT_STEPS.length - 1 ? 'Empezar a crear' : 'Siguiente';
}

// ── ARTIST DETAIL SCREEN ──────────────────────────
function openArtist(key) {
  const d = ARTISTS[key];
  if (!d) return;
  const el = document.getElementById('s-artist-detail');
  if (!el) return;
  el.querySelector('#sad-name').textContent = d.name;
  el.querySelector('#sad-origin').textContent = d.origin;
  el.querySelector('#sad-bio').textContent = d.bio;
  el.querySelector('#sad-fact').textContent = d.fact;
  const av = el.querySelector('#sad-av');
  if (av) {
    av.className = 'mad-av ' + d.avClass;
  }

  // Populate carousel
  const carousel = el.querySelector('#sad-carousel');
  if (carousel) {
    carousel.innerHTML = ''; // clear
    if (d.artworks && d.artworks.length) {
      d.artworks.forEach(work => {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.innerHTML = `
          <div class="artwork-img-container" style="background-image: url('${work.img}')"></div>
          <div class="artwork-info">
            <h4>${work.title}</h4>
            <span class="artwork-date">${work.date}</span>
            <p>${work.desc}</p>
          </div>
        `;
        carousel.appendChild(card);
      });
    }
  }

  nav('s-artist-detail');
}

// ── DEV NAV ───────────────────────────────────────
function toggleDevNav() {
  document.getElementById('dev-panel')?.classList.toggle('open');
}

// ── SHUTTER FLASH ─────────────────────────────────
function initShutter() {
  document.querySelector('.shutter')?.addEventListener('click', () => {
    const vf = document.getElementById('vf');
    if (!vf) return;
    const fl = document.createElement('div');
    fl.style.cssText = `
      position:absolute;inset:0;background:white;opacity:.85;
      pointer-events:none;z-index:40;
      animation:flash-out .22s ease-out both;
    `;
    vf.appendChild(fl);
    fl.addEventListener('animationend', () => fl.remove());
  });
  const flashS = document.createElement('style');
  flashS.textContent = `@keyframes flash-out{from{opacity:.85}to{opacity:0}}`;
  document.head.appendChild(flashS);
}

// ── SWIPE BACK ────────────────────────────────────
function initSwipe() {
  const app = document.getElementById('app');
  let startX = 0;
  app.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  app.addEventListener('touchend', e => {
    if (startX < 28 && e.changedTouches[0].clientX - startX > 60) goBack();
  }, { passive: true });
}

// ── DRAG TO SCROLL ────────────────────────────────
function initDragToScroll() {
  const horizontalSliders = document.querySelectorAll('.scroll-row, .ach-strip, .style-carousel, .filter-strip, .ach-grid');
  horizontalSliders.forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'auto';
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'auto';
    });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  });
}

// ── GALLERY VIEWER ────────────────────────────────
async function openGalleryArtwork(data) {
  APP.currentObra = data;
  closeGvDrawer(); // Ensure the drawer starts closed
  const gvImg = document.getElementById('gv-img');
  const gvTitle = document.getElementById('gv-title');
  const gvAuthor = document.getElementById('gv-author');
  const gvStyleDate = document.getElementById('gv-style-date');
  const gvSchoolGrade = document.getElementById('gv-school-grade');
  if (!gvImg) return;

  const gvFavBtn = document.getElementById('gv-fav-btn');
  if (gvFavBtn) gvFavBtn.classList.remove('active', 'is-fav');

  if (APP.currentUserId && data && data.id) {
    window.supabaseClient.from('obras_favoritas')
      .select('obra_id')
      .eq('user_id', APP.currentUserId)
      .eq('obra_id', data.id)
      .then(({ data: fData }) => {
        if (fData && fData.length > 0) {
          if (gvFavBtn) gvFavBtn.classList.add('active', 'is-fav');
        }
      }).catch(err => console.error(err));
  }

  if (typeof data === 'object' && data.querySelector) {
    // Called from static HTML card with `this`
    const thumb = data.querySelector('.gal-thumb');
    const title = data.querySelector('strong')?.textContent || '';
    const author = data.querySelector('span')?.textContent || '';
    const styleTag = data.querySelector('.style-tag')?.textContent || '';
    if (thumb) {
      const cs = window.getComputedStyle(thumb);
      gvImg.style.backgroundImage = cs.backgroundImage;
      gvImg.style.backgroundColor = cs.backgroundColor;
    }
    if (gvTitle) gvTitle.textContent = title;
    if (gvAuthor) gvAuthor.textContent = author;
    if (gvStyleDate) gvStyleDate.textContent = styleTag || '';
    if (gvSchoolGrade) gvSchoolGrade.textContent = '';
  } else {
    // Called from dynamic card with data object
    gvImg.style.backgroundImage = "url('" + data.imagen_url + "')";
    gvImg.style.backgroundColor = 'transparent';
    if (gvTitle) gvTitle.textContent = data.nombre || '';

    // Format date
    let dateStr = '';
    if (data.created_at) {
      try {
        const d = new Date(data.created_at);
        dateStr = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (_) { }
    }

    // Fetch perfil data
    let colegio = '', grado = '', autor = 'Anónimo';
    if (data.user_id) {
      try {
        const { data: perfil } = await window.supabaseClient.from('perfiles')
          .select('nombre, colegio, grado')
          .eq('id', data.user_id)
          .single();
        if (perfil) {
          autor = perfil.nombre || 'Anónimo';
          colegio = perfil.colegio || '';
          grado = perfil.grado || '';
        }
      } catch (e) {
        console.error('Error fetching perfil for gallery viewer:', e);
      }
    }

    if (gvStyleDate) gvStyleDate.textContent = (data.estilo || '') + (dateStr ? ' · ' + dateStr : '');
    if (gvSchoolGrade) gvSchoolGrade.textContent = [grado, colegio].filter(Boolean).join(' · ');
    if (gvAuthor) gvAuthor.textContent = autor;
  }

  nav('s-gallery-viewer');
}

function openGvDrawer() {
  const drawer = document.getElementById('gv-drawer');
  if (drawer) drawer.classList.add('open');
}

function closeGvDrawer() {
  const drawer = document.getElementById('gv-drawer');
  if (drawer) drawer.classList.remove('open');
}

// ── GALLERY FAVORITES ─────────────────────────────
function toggleGalOptions(e, btn) {
  e.stopPropagation(); // prevent opening the artwork
  const dropdown = btn.nextElementSibling;

  // Close any other open dropdowns
  document.querySelectorAll('.gal-dropdown.show').forEach(el => {
    if (el !== dropdown) el.classList.remove('show');
  });

  dropdown.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.gal-options')) {
    document.querySelectorAll('.gal-dropdown.show').forEach(el => el.classList.remove('show'));
  }
});

async function addObraFavorite(e, btn, obraId) {
  e.stopPropagation(); // prevent opening artwork
  if (!APP.currentUserId) {
    showToast("Debes iniciar sesión para añadir a favoritos");
    return;
  }

  // Toggle UI immediately for better UX
  const isFav = btn.classList.toggle('is-fav');
  const dropdown = btn.closest('.gal-dropdown');
  if (dropdown) dropdown.classList.remove('show');

  const card = btn.closest('.gal-card');
  if (card) card.classList.toggle('is-fav', isFav);

  // Also toggle the active class if it's the gallery viewer button
  if (btn.id === 'gv-fav-btn') {
    btn.classList.toggle('active', isFav);

    // Sync the state with the corresponding card in the gallery grid
    const gridCard = document.querySelector(`.gal-card[data-obra-id="${obraId}"]`);
    if (gridCard) {
      gridCard.classList.toggle('is-fav', isFav);
      const dropItem = gridCard.querySelector('.gal-dropdown-item');
      if (dropItem) dropItem.classList.toggle('is-fav', isFav);
    }
  } else {
    // If clicked from the grid, sync with the gallery viewer if the artwork is open
    if (APP.currentObra && String(APP.currentObra.id) === String(obraId)) {
      const gvBtn = document.getElementById('gv-fav-btn');
      if (gvBtn) {
        gvBtn.classList.toggle('is-fav', isFav);
        gvBtn.classList.toggle('active', isFav);
      }
    }
  }

  showToast(isFav ? "Añadida a favoritos" : "Eliminada de favoritos");

  if (String(obraId).startsWith('mock')) return; // static HTML mock

  try {
    if (isFav) {
      const { error } = await window.supabaseClient
        .from('obras_favoritas')
        .insert([{ user_id: APP.currentUserId, obra_id: obraId }]);
      if (error && error.code !== '23505') throw error; // ignore duplicate key (23505)
    } else {
      const { error } = await window.supabaseClient
        .from('obras_favoritas')
        .delete()
        .eq('user_id', APP.currentUserId)
        .eq('obra_id', obraId);
      if (error) throw error;
    }
    actualizarLogros(APP.currentUserId).catch(console.error);
  } catch (err) {
    console.error("Error toggling favorite:", err);
    showToast("Error al actualizar favoritos");
    // revert UI on error
    btn.classList.toggle('is-fav', !isFav);
    if (btn.id === 'gv-fav-btn') btn.classList.toggle('active', !isFav);
  }
}

async function toggleGalleryViewerFav() {
  if (!APP.currentObra || !APP.currentObra.id) {
    showToast("No se puede añadir a favoritos (obra de prueba)");
    return;
  }
  const btn = document.getElementById('gv-fav-btn');
  const obraId = APP.currentObra.id;
  await addObraFavorite({ stopPropagation: () => { } }, btn, obraId);
}

// ── GALLERY VIEWER — DESCARGAR Y COMPARTIR ────────
async function downloadGvObra() {
  const url = APP.currentObra?.imagen_url;
  if (!url) { showToast('No hay imagen disponible'); return; }

  showToast('Descargando...', 8000);
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = (APP.currentObra.nombre || 'obra-mamb') + '.jpg';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
    showToast('¡Imagen guardada en tu dispositivo!');
  } catch (err) {
    // Fallback: abrir en pestaña nueva para guardar manualmente
    console.warn('Download fetch failed, fallback a nueva pestaña:', err);
    window.open(url, '_blank');
    showToast('Mantén presionada la imagen para guardarla');
  }
}

async function shareGvObra() {
  const url = APP.currentObra?.imagen_url;
  const titulo = APP.currentObra?.nombre || 'Mi obra en el MAMB';
  if (!url) { showToast('No hay imagen para compartir'); return; }

  const texto = `¡Mira mi obra "${titulo}" creada en el Museo de Arte Moderno de Barranquilla!`;

  if (navigator.share) {
    try {
      // Intentar compartir como archivo (soportado en móvil para WhatsApp, etc.)
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const file = new File([blob], titulo + '.jpg', { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: titulo, text: texto, files: [file] });
      } else {
        await navigator.share({ title: titulo, text: texto, url: url });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        _shareGvFallback(url, texto);
      }
    }
  } else {
    _shareGvFallback(url, texto);
  }
}

function _shareGvFallback(url, texto) {
  // Fallback en escritorio: abrir WhatsApp web con el link
  const waUrl = 'https://wa.me/?text=' + encodeURIComponent(texto + '\n' + url);
  window.open(waUrl, '_blank');
}

// ── KEYBOARD ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    closeDrawer();
  }
  if (e.altKey && e.key === 'ArrowLeft') goBack();
});

// ── SCREEN BADGE (dev feedback) ───────────────────
const _SCREEN_NAMES = {
  's-home': 'Inicio', 's-camera': 'Camara', 's-preview': 'Vista previa',
  's-form': 'Formulario', 's-processing': 'Procesando IA', 's-result': 'Resultado',
  's-gallery': 'Galeria', 's-artists': 'Artistas', 's-programs': 'Programas',
  's-about': 'Acerca del MAMB', 's-events': 'Eventos', 's-profile': 'Perfil',
  's-login': 'Login', 's-signup': 'Crear cuenta', 's-tutorial': 'Tutorial',
  's-states': 'Estados UI', 's-game': 'Jugar',
};
function showScreenBadge(id) {
  const name = _SCREEN_NAMES[id];
  if (!name) return;
  const b = document.createElement('div');
  b.textContent = name;
  b.style.cssText = `
    position:fixed;top:5.5rem;left:50%;
    transform:translateX(-50%);
    background:rgba(28,27,46,.82);color:#fff;
    padding:.28rem .75rem;border-radius:99rem;
    font-size:.7rem;font-weight:700;
    opacity:0;animation:badge-pop 2s ease both;
    z-index:5000;pointer-events:none;white-space:nowrap;
    font-family:'Quicksand',sans-serif;
  `;
  document.body.appendChild(b);
  b.addEventListener('animationend', () => b.remove());
}
const _badgeS = document.createElement('style');
_badgeS.textContent = `@keyframes badge-pop{0%{opacity:0}15%{opacity:1}75%{opacity:1}100%{opacity:0}}`;
document.head.appendChild(_badgeS);

// ── OVERRIDE nav() TO ADD BADGE ───────────────────
const _origNav = nav;
window.nav = function (id) {
  _origNav(id);
  showScreenBadge(id);
};

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Start on initial screen
  const initialScreen = document.getElementById(APP.currentScreen);
  if (initialScreen) initialScreen.classList.add('active');

  // Init carousel
  initCarousel();

  // Drag to scroll
  initDragToScroll();

  // Shutter feedback
  initShutter();

  // Swipe gesture
  initSwipe();

  // File input capture fallback
  document.getElementById('camera-file-input')?.addEventListener('change', handleFileCapture);

  // Gallery card press feedback
  document.querySelectorAll('.gal-card,.artist-card,.ev-card,.event-mini').forEach(el => {
    el.addEventListener('touchstart', () => el.style.transform = 'scale(.97)', { passive: true });
    el.addEventListener('touchend', () => el.style.transform = '', { passive: true });
    el.addEventListener('touchcancel', () => el.style.transform = '', { passive: true });
  });

  // Supabase Auth State Listener
  window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      updateUserUI(session.user);
    }
  });

  // Explicitly check session on load in case onAuthStateChange misses INITIAL_SESSION
  window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) {
      updateUserUI(session.user);
    }
  });

  console.log('%c MAMB Wireframe cargado ', 'background:#F5A623;color:#1C1B2E;font-weight:bold;font-size:13px;border-radius:4px;padding:2px 6px;');
  console.log('%c Usa el boton menu (abajo derecha) para navegar entre pantallas ', 'color:#888;font-size:11px;');
});

// ── GAME LOGIC (TEACHABLE MACHINE) ────────────────
const GAME_URL = "https://teachablemachine.withgoogle.com/models/WOCXLX73G/";
let gameModel, gameWebcam, gameCtx, gameMaxPredictions;
let isGameRunning = false;

async function initGame() {
  if (isGameRunning) return;

  document.getElementById("btn-init-game").style.display = "none";
  document.getElementById("game-video-container").style.display = "flex";
  document.getElementById("game-resultado").textContent = "Cargando modelo de IA...";

  try {
    const modelURL = GAME_URL + "model.json";
    const metadataURL = GAME_URL + "metadata.json";

    gameModel = await tmPose.load(modelURL, metadataURL);
    gameMaxPredictions = gameModel.getTotalClasses();

    const size = 300;
    const flip = true;
    gameWebcam = new tmPose.Webcam(size, size, flip);

    await gameWebcam.setup();
    await gameWebcam.play();

    isGameRunning = true;
    window.requestAnimationFrame(loopGame);

    const canvas = document.getElementById("game-canvas");
    canvas.width = size;
    canvas.height = size;
    gameCtx = canvas.getContext("2d");

    document.getElementById("game-resultado").textContent = "¡Muestra Piedra, Papel o Tijera a la cámara!";
  } catch (e) {
    console.error("Error al iniciar el juego", e);
    document.getElementById("game-resultado").textContent = "Error al acceder a la cámara";
    document.getElementById("btn-init-game").style.display = "inline-flex";
  }
}

async function loopGame() {
  if (!isGameRunning) return;
  gameWebcam.update();
  await predictGame();
  window.requestAnimationFrame(loopGame);
}

async function predictGame() {
  if (!gameModel || !gameWebcam || !gameWebcam.canvas) return;
  const { pose, posenetOutput } = await gameModel.estimatePose(gameWebcam.canvas);
  const prediction = await gameModel.predict(posenetOutput);

  let maxProb = 0;
  let bestClass = "";

  for (let i = 0; i < gameMaxPredictions; i++) {
    if (prediction[i].probability > maxProb) {
      maxProb = prediction[i].probability;
      bestClass = prediction[i].className;
    }
  }

  if (maxProb > 0.8) {
    document.getElementById("game-resultado").textContent = `Has elegido: ${bestClass}`;
  } else {
    document.getElementById("game-resultado").textContent = "Moviendo...";
  }

  drawPoseGame(pose);
}

function drawPoseGame(pose) {
  if (gameWebcam.canvas) {
    gameCtx.drawImage(gameWebcam.canvas, 0, 0);
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, gameCtx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, gameCtx);
    }
  }
}

function stopGame() {
  isGameRunning = false;
  if (gameWebcam) {
    gameWebcam.stop();
    gameWebcam = null;
  }
  const btn = document.getElementById("btn-init-game");
  if (btn) btn.style.display = "inline-flex";
  const container = document.getElementById("game-video-container");
  if (container) container.style.display = "none";
  const res = document.getElementById("game-resultado");
  if (res) res.textContent = "";
}


// ── SUPABASE UI UPDATES ───────────────────────────
async function updateUserUI(user) {
  console.log("Updating UI for user:", user);
  if (!user) return;
  APP.currentUserId = user.id;

  // Extraer datos del metadata (Supabase usa user_metadata en v2)
  const meta = user.user_metadata || user.user_meta_data || {};
  const nombre = meta.nombre || user.email.split('@')[0]; // Fallback al email

  // Si la cuenta es antigua y no tiene avatar guardado, le generamos uno automáticamente con su nombre
  const avatar = meta.avatar || `https://api.dicebear.com/9.x/micah/svg?seed=${nombre}&backgroundColor=bde0fe`;

  // 1. Actualizar el recuadro rojo en la pantalla de inicio (top right badge)
  const homeAuthArea = document.getElementById('home-auth-area');
  if (homeAuthArea) {
    homeAuthArea.innerHTML = `
      <div class="home-user-badge" onclick="nav('s-profile')">
        <span class="home-user-badge-name">${nombre.split(' ')[0]}</span>
        <div class="home-user-badge-av">
          <img src="${avatar}" alt="Avatar">
        </div>
      </div>
    `;
  }

  // 2. Actualizar todos los botones "Perfil" en las barras inferiores (tab-bar)
  document.querySelectorAll("button[onclick=\"nav('s-profile')\"]").forEach(btn => {
    const svg = btn.querySelector('svg');
    const existingImg = btn.querySelector('img');
    if (svg) {
      const img = document.createElement('img');
      img.src = avatar;
      img.style.width = '22px';
      img.style.height = '22px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
      img.style.border = '2px solid var(--ink)';
      svg.replaceWith(img);
    } else if (existingImg) {
      existingImg.src = avatar;
    }
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = nombre.split(' ')[0]; // Mostrar solo el primer nombre
    }
  });

  // 3. Actualizar la pantalla de Perfil (s-profile) principal
  const profileName = document.querySelector('#s-profile .profile-name');
  if (profileName) profileName.textContent = nombre;

  const profileAvatarWrap = document.querySelector('#s-profile .profile-av');
  if (profileAvatarWrap) {
    profileAvatarWrap.innerHTML = `<img src="${avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    profileAvatarWrap.style.border = 'none';
  }

  // 4. Cargar datos dinámicos del perfil y home
  await loadProfileData();
  loadHomeLogros();
}

// ── PROFILE DATA ──────────────────────────────────
async function loadProfileData() {
  if (!APP.currentUserId) return;

  try {
    // 1. Fetch perfil (colegio, grado)
    const { data: perfil } = await window.supabaseClient.from('perfiles')
      .select('colegio, grado')
      .eq('id', APP.currentUserId)
      .single();

    const profileGrade = document.querySelector('#s-profile .profile-grade');
    if (profileGrade && perfil) {
      profileGrade.textContent = [perfil.grado, perfil.colegio].filter(Boolean).join(' · ');
    }

    // 2. Count obras
    const { count: obrasCount } = await window.supabaseClient.from('obras')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', APP.currentUserId);

    // 3. Count favoritas
    const { count: favCount } = await window.supabaseClient.from('obras_favoritas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', APP.currentUserId);

    // 4. Update profile-stats
    const statObras = document.querySelector('#s-profile .pstat:nth-child(1) strong');
    const statFav = document.querySelector('#s-profile .pstat:nth-child(3) strong');
    if (statObras) statObras.textContent = obrasCount || 0;
    if (statFav) statFav.textContent = favCount || 0;

    // 5. Load first 5 obras for scroll-row
    await loadProfileObras();

    // 6. Load logros grid
    await loadLogros();

  } catch (err) {
    console.error("Error loading profile data:", err);
  }
}

async function loadProfileObras() {
  const scrollRow = document.getElementById('profile-obras-row');
  if (!scrollRow) return;

  scrollRow.innerHTML = '';

  try {
    const { data: obras } = await window.supabaseClient.from('obras')
      .select('*')
      .eq('user_id', APP.currentUserId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!obras || obras.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.cssText = 'font-size:0.8rem;color:var(--ink-faint);padding:0.5rem 0;';
      emptyMsg.textContent = 'No has creado ninguna obra';
      scrollRow.appendChild(emptyMsg);
      return;
    }

    obras.forEach(obra => {
      const thumb = document.createElement('div');
      thumb.className = 'pw-thumb';
      thumb.style.cssText = 'background-image:url(\'' + obra.imagen_url + '\');background-size:cover;background-position:center;cursor:pointer;';
      thumb.onclick = () => openGalleryArtwork(obra);
      scrollRow.appendChild(thumb);
    });
  } catch (err) {
    console.error('Error loading profile obras:', err);
  }
}

function goToMyObras() {
  nav('s-gallery');
  setTimeout(() => {
    const chips = document.querySelectorAll('#s-gallery .filter-strip .fchip');
    for (const chip of chips) {
      if (chip.textContent.trim() === 'Mis obras') {
        activateFilter(chip);
        break;
      }
    }
  }, 150);
}



// ── SUPABASE AUTH ─────────────────────────────────
async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('pw-login').value;

  if (!email || !password) {
    showToast('Por favor ingresa tu correo y contraseña');
    return;
  }

  showToast('Iniciando sesión...', 10000);
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Login error:', error.message);
    showToast('Error: Verifica tus credenciales');
  } else {
    showToast('¡Hola de nuevo!');
    nav('s-home');
  }
}

async function handleSignup() {
  const nombre = document.getElementById('signup-nombre').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('pw-signup').value;
  const colegio = document.getElementById('signup-colegio').value;
  const gradoEl = document.querySelector('#s-signup .grade-chip.active');
  const grado = gradoEl ? gradoEl.textContent : '';
  const avatarEl = document.querySelector('#signup-avatar-grid .avatar-chip.active img');
  const avatar = avatarEl ? avatarEl.src : '';

  if (!nombre || !email || !password || !colegio || !grado || !avatar) {
    showToast('Por favor completa todos los campos (incluyendo el avatar)');
    return;
  }

  showToast('Creando cuenta...', 10000);
  const { data, error } = await window.supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        nombre: nombre,
        colegio: colegio,
        grado: grado,
        avatar: avatar
      }
    }
  });

  if (error) {
    console.error('Signup error:', error);
    if (error.status === 429) {
      showToast('Error: Demasiados intentos. Intenta más tarde.');
    } else if (error.status === 400 && error.message.includes('already registered')) {
      showToast('Error: Este correo ya está registrado.');
    } else if (error.message.includes('password')) {
      showToast('Error: La contraseña es muy débil (mínimo 6 caracteres).');
    } else {
      showToast('Error al crear la cuenta: ' + error.message);
    }
  } else if (data.user) {
    // Create profile in perfiles table
    const { error: perfilError } = await window.supabaseClient.from('perfiles')
      .insert([
        {
          id: data.user.id,
          nombre: nombre,
          colegio: colegio,
          grado: grado,
          avatar: avatar
        }
      ]);
    if (perfilError) console.error('Error creating profile:', perfilError);
    const greeting = document.getElementById('welcome-greeting');
    if (greeting) greeting.textContent = `Bienvenido/a, ${nombre}`;
    showToast('¡Cuenta creada con éxito!');
    openModal('m-welcome');
  }
}

// ── EDIT PROFILE ──────────────────────────────────
async function loadEditProfileData() {
  if (!APP.currentUserId) return;

  try {
    const { data: perfil } = await window.supabaseClient.from('perfiles')
      .select('nombre, colegio, grado, avatar')
      .eq('id', APP.currentUserId)
      .single();

    if (!perfil) return;

    // Pre-fill name
    const nombreInput = document.getElementById('edit-nombre');
    if (nombreInput) nombreInput.value = perfil.nombre || '';

    // Pre-fill school
    const colegioInput = document.getElementById('edit-colegio');
    if (colegioInput) colegioInput.value = perfil.colegio || '';

    // Pre-select grade
    if (perfil.grado) {
      const gradeChips = document.querySelectorAll('#s-edit-profile .grade-chip');
      gradeChips.forEach(chip => {
        if (chip.textContent.trim() === perfil.grado) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }

    // Pre-select avatar
    if (perfil.avatar) {
      const avatarChips = document.querySelectorAll('#s-edit-profile .avatar-chip');
      avatarChips.forEach(chip => {
        const img = chip.querySelector('img');
        if (img && img.src === perfil.avatar) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }
  } catch (err) {
    console.error('Error loading edit profile data:', err);
  }
}

async function handleEditProfile() {
  if (!APP.currentUserId) {
    showToast('Debes iniciar sesión para editar tu perfil');
    return;
  }

  const nombre = document.getElementById('edit-nombre').value;
  const colegio = document.getElementById('edit-colegio').value;
  const gradoEl = document.querySelector('#s-edit-profile .grade-chip.active');
  const grado = gradoEl ? gradoEl.textContent : '';
  const avatarEl = document.querySelector('#s-edit-profile .avatar-chip.active img');
  const avatar = avatarEl ? avatarEl.src : '';

  if (!nombre || !colegio || !grado || !avatar) {
    showToast('Por favor completa todos los campos');
    return;
  }

  showToast('Guardando cambios...', 5000);

  try {
    // Update perfiles table
    const { error: perfilError } = await window.supabaseClient.from('perfiles')
      .update({
        nombre: nombre,
        colegio: colegio,
        grado: grado,
        avatar: avatar
      })
      .eq('id', APP.currentUserId);

    if (perfilError) throw perfilError;

    // Update auth metadata
    const { error: metaError } = await window.supabaseClient.auth.updateUser({
      data: {
        nombre: nombre,
        colegio: colegio,
        grado: grado,
        avatar: avatar
      }
    });

    if (metaError) throw metaError;

    showToast('Perfil actualizado con éxito');

    // Refresh UI and go back to profile
    await updateUserUI((await window.supabaseClient.auth.getSession()).data.session?.user);
    goBack();

  } catch (err) {
    console.error('Error updating profile:', err);
    showToast('Error al actualizar el perfil: ' + err.message);
  }
}

// ── SUPABASE OBRAS (GUARDAR Y GALERIA) ─────────────
async function saveObra() {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    showToast("Debes iniciar sesión para guardar");
    return;
  }

  const resultCanvas = document.getElementById('result-canvas');
  if (!resultCanvas) return;

  showToast("Guardando tu obra...", 10000);

  try {
    // 1. Obtener imagen base64
    const base64Data = resultCanvas.toDataURL('image/jpeg', 0.85);
    // Convertir a blob
    const res = await fetch(base64Data);
    const blob = await res.blob();

    // 2. Subir a Storage
    const fileName = `${session.user.id}/${Date.now()}.jpg`;
    const { data: storageData, error: uploadError } = await window.supabaseClient.storage
      .from('obras_bucket')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: { publicUrl } } = window.supabaseClient.storage
      .from('obras_bucket')
      .getPublicUrl(fileName);

    // 3. Guardar en tabla obras
    const nombre = document.getElementById('obra-nombre').value || 'Sin nombre';
    const desc = document.getElementById('obra-descripcion').value || '';
    const styleEl = document.querySelector('.style-card.selected');
    const estilo = styleEl ? styleEl.dataset.style : 'impresionismo';

    const { error: dbError } = await window.supabaseClient.from('obras')
      .insert([
        {
          user_id: session.user.id,
          nombre: nombre,
          descripcion: desc,
          estilo: estilo,
          imagen_url: publicUrl
        }
      ]);

    if (dbError) throw dbError;

    await actualizarLogros(session.user.id);
    showToast("¡Obra guardada con éxito!");
    closeDrawer();
    nav('s-gallery');
  } catch (err) {
    console.error("Error saving obra:", err);
    showToast("Hubo un error al guardar: " + err.message);
  }
}

async function loadObras() {
  const galleryGrid = document.querySelector('#s-gallery .gallery-grid');
  if (!galleryGrid) return;

  // Remove previously loaded dynamic cards (identified by data-dynamic)
  galleryGrid.querySelectorAll('[data-dynamic]').forEach(el => el.remove());

  try {
    const { data: obras, error } = await window.supabaseClient.from('obras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!obras || obras.length === 0) return;

    // Fetch user display names from perfiles table
    const userIds = [...new Set(obras.map(o => o.user_id).filter(Boolean))];
    const userMap = {};
    if (userIds.length > 0) {
      const { data: perfiles } = await window.supabaseClient.from('perfiles')
        .select('id, nombre')
        .in('id', userIds);
      if (perfiles) perfiles.forEach(p => userMap[p.id] = p.nombre);
    }

    // Fetch user favorites to set initial state
    const userFavs = new Set();
    if (APP.currentUserId) {
      const { data: favs } = await window.supabaseClient.from('obras_favoritas')
        .select('obra_id')
        .eq('user_id', APP.currentUserId);
      if (favs) favs.forEach(f => userFavs.add(String(f.obra_id)));
    }

    const styleMap = {
      'impresionismo': 'st-imp',
      'remolinos': 'st-vg',
      'acuarela': 'st-wc',
      'cubismo': 'st-cb',
      'fantasía': 'st-fa',
      'fantasia': 'st-fa',
    };

    obras.forEach(obra => {
      const card = document.createElement('div');
      const isFav = userFavs.has(String(obra.id));
      card.className = 'gal-card' + (isFav ? ' is-fav' : '');
      card.setAttribute('data-dynamic', '');
      card.setAttribute('data-user-id', obra.user_id || '');
      card.setAttribute('data-obra-id', obra.id || '');
      card.onclick = () => openGalleryArtwork(obra);

      const estilo = (obra.estilo || '').toLowerCase();
      const stClass = styleMap[estilo] || 'st-imp';
      const autor = userMap[obra.user_id] || 'Anónimo';

      card.innerHTML = `
        <div class="gal-thumb" style="background-image:url('${obra.imagen_url}');background-size:cover;background-position:center;">
          <div class="gal-fav"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-8.5-8.5a5 5 0 0 1 7.07-7.07L12 7l1.43-1.57a5 5 0 0 1 7.07 7.07L12 21z"/></svg></div>
        </div>
        <div class="gal-info">
          <div class="gal-info-text">
            <strong>${obra.nombre}</strong>
            <span>${autor}</span>
            <div class="style-tag ${stClass}">${obra.estilo || ''}</div>
          </div>
          <div class="gal-options">
            <button class="gal-opt-btn" onclick="toggleGalOptions(event, this)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </button>
            <div class="gal-dropdown">
              <button class="gal-dropdown-item ${isFav ? 'is-fav' : ''}" onclick="addObraFavorite(event, this, '${obra.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> <span class="fav-text-add">Añadir a Favoritos</span><span class="fav-text-remove">Quitar de favoritos</span>
              </button>
            </div>
          </div>
        </div>
      `;
      galleryGrid.appendChild(card);
    });

    // Re-apply active filter
    const activeChip = document.querySelector('.filter-strip .fchip.active');
    if (activeChip) filterGallery(activeChip.textContent.trim());

  } catch (err) {
    console.error("Error loading obras:", err);
  }
}

// ── LOGROS (HOME STRIP) ───────────────────────────
async function loadHomeLogros() {
  const strip = document.getElementById('home-ach-strip');
  if (!strip) return;

  try {
    const { data: logros } = await window.supabaseClient
      .from('logros')
      .select('id, nombre, icon_name')
      .order('created_at', { ascending: true })
      .limit(4);

    if (!logros || logros.length === 0) { strip.innerHTML = ''; return; }

    const logroMap = {};
    if (APP.currentUserId) {
      const ids = logros.map(l => l.id);
      const { data: userLogros } = await window.supabaseClient
        .from('usuario_logros')
        .select('logro_id, cumple_requisito')
        .eq('user_id', APP.currentUserId)
        .in('logro_id', ids);
      (userLogros || []).forEach(ul => { logroMap[ul.logro_id] = ul.cumple_requisito; });
    }

    strip.innerHTML = '';
    logros.forEach(logro => {
      const earned = logroMap[logro.id] === true;
      const biIcon = LOGRO_ICON_MAP[logro.icon_name] || 'bi-trophy';
      const item = document.createElement('div');
      item.className = `ach-item ${earned ? 'ach-earned' : 'ach-locked'}`;
      item.title = logro.nombre;
      item.innerHTML = `
        <div class="ach-medal"><i class="bi ${biIcon}" style="font-size:1.3rem;line-height:1;"></i></div>
        <span>${logro.nombre}</span>
      `;
      strip.appendChild(item);
    });

  } catch (err) {
    console.error('[loadHomeLogros] Error:', err);
  }
}

function verTodosLogros() {
  nav('s-profile');
  setTimeout(() => {
    const logrosSection = document.querySelector('#s-profile .profile-section:has(#profile-ach-grid)');
    if (!logrosSection) return;
    logrosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    logrosSection.classList.add('logros-highlight');
    logrosSection.addEventListener('animationend', () => logrosSection.classList.remove('logros-highlight'), { once: true });
  }, 420);
}

// ── LOGROS (PERFIL) ───────────────────────────────
const LOGRO_ICON_MAP = {
  'box':                'bi-box',
  'sparkles':           'bi-stars',
  'wind':               'bi-wind',
  'bookmark':           'bi-bookmark-fill',
  'gallery-horizontal': 'bi-images',
  'heart':              'bi-heart-fill',
  'compass':            'bi-compass',
  'palette':            'bi-palette-fill',
  'brush':              'bi-brush-fill',
  'droplets':           'bi-droplet-half',
};

async function loadLogros() {
  const grid = document.getElementById('profile-ach-grid');
  if (!grid) return;

  try {
    const { data: logros, error } = await window.supabaseClient
      .from('logros')
      .select('id, nombre, condicion, icon_name, requisito')
      .order('created_at', { ascending: true });

    if (error || !logros) { grid.innerHTML = ''; return; }

    const logroMap = {};
    let earnedCount = 0;

    if (APP.currentUserId) {
      const { data: usuarioLogros } = await window.supabaseClient
        .from('usuario_logros')
        .select('logro_id, conteo, cumple_requisito')
        .eq('user_id', APP.currentUserId);

      (usuarioLogros || []).forEach(ul => {
        logroMap[ul.logro_id] = ul;
        if (ul.cumple_requisito) earnedCount++;
      });
    }

    const statLogros = document.getElementById('stat-logros');
    if (statLogros) statLogros.textContent = earnedCount;

    grid.innerHTML = '';
    logros.forEach(logro => {
      const ul = logroMap[logro.id];
      const earned = ul && ul.cumple_requisito;
      const conteo = ul ? ul.conteo : 0;
      const biIcon = LOGRO_ICON_MAP[logro.icon_name] || 'bi-trophy';

      const cell = document.createElement('div');
      cell.className = `ach-cell ${earned ? 'ach-earned' : 'ach-locked'}`;
      cell.title = logro.condicion;
      cell.innerHTML = `
        <div class="ach-m ${earned ? 'ach-m-earned' : 'ach-m-locked'}">
          <i class="bi ${biIcon}"></i>
        </div>
        <span>${logro.nombre}</span>
        <small>${earned ? 'Ganado' : `${conteo}/${logro.requisito}`}</small>
      `;
      grid.appendChild(cell);
    });

  } catch (err) {
    console.error('[loadLogros] Error:', err);
    grid.innerHTML = '';
  }
}

// ── LOGROS ────────────────────────────────────────
async function actualizarLogros(userId) {
  if (!userId) return;
  try {
    const { data: logros, error: logrosError } = await window.supabaseClient
      .from('logros')
      .select('id, nombre, condicion, requisito');
    if (logrosError) { console.error('[logros] Error al leer logros:', logrosError); return; }
    if (!logros || logros.length === 0) { console.warn('[logros] La tabla logros está vacía o sin acceso'); return; }

    const { data: obras, error: obrasError } = await window.supabaseClient
      .from('obras').select('estilo').eq('user_id', userId);
    if (obrasError) console.warn('[logros] Error al leer obras:', obrasError);

    const { count: favCount, error: favError } = await window.supabaseClient
      .from('obras_favoritas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (favError) console.warn('[logros] Error al leer favoritas:', favError);

    const totalObras = obras ? obras.length : 0;
    const totalFavs = favCount || 0;
    const styleCount = {};
    const distinctStyles = new Set();
    (obras || []).forEach(o => {
      const e = (o.estilo || '').toLowerCase();
      styleCount[e] = (styleCount[e] || 0) + 1;
      if (e) distinctStyles.add(e);
    });

    const { data: existentes, error: existentesError } = await window.supabaseClient
      .from('usuario_logros')
      .select('logro_id, cumple_requisito')
      .eq('user_id', userId);
    if (existentesError) console.warn('[logros] Error al leer usuario_logros:', existentesError);
    const existentesMap = {};
    (existentes || []).forEach(ul => { existentesMap[ul.logro_id] = ul.cumple_requisito; });

    const upserts = [];
    const nuevosLogros = [];

    for (const logro of logros) {
      const cond = logro.condicion.toLowerCase();
      let conteo = 0;

      if (cond.includes('estilos distintos')) {
        conteo = distinctStyles.size;
      } else if (cond.includes('favoritos')) {
        conteo = totalFavs;
      } else if (cond.includes('cubismo')) {
        conteo = styleCount['cubismo'] || 0;
      } else if (cond.includes('remolinos')) {
        conteo = styleCount['vangogh'] || 0;
      } else if (cond.includes('impresionismo')) {
        conteo = styleCount['impresionismo'] || 0;
      } else if (cond.includes('acuarela')) {
        conteo = styleCount['acuarela'] || 0;
      } else if (cond.includes('publica')) {
        conteo = totalObras;
      }

      const yaCompletado = existentesMap[logro.id] === true;
      const cumpleRequisito = yaCompletado || conteo >= logro.requisito;

      if (!yaCompletado && conteo >= logro.requisito) {
        nuevosLogros.push(logro.nombre || 'Logro desbloqueado');
      }

      upserts.push({
        user_id: userId,
        logro_id: logro.id,
        conteo: conteo,
        cumple_requisito: cumpleRequisito,
        updated_at: new Date().toISOString()
      });
    }

    // Separar en INSERT (filas nuevas) y UPDATE (filas existentes)
    const porInsertar = upserts.filter(r => !Object.prototype.hasOwnProperty.call(existentesMap, r.logro_id));
    const porActualizar = upserts.filter(r => Object.prototype.hasOwnProperty.call(existentesMap, r.logro_id));

    if (porInsertar.length > 0) {
      const { error: insError } = await window.supabaseClient
        .from('usuario_logros')
        .insert(porInsertar);
      if (insError) console.error('[logros] Error en INSERT:', insError);
    }

    for (const row of porActualizar) {
      const { error: updError } = await window.supabaseClient
        .from('usuario_logros')
        .update({ conteo: row.conteo, cumple_requisito: row.cumple_requisito, updated_at: row.updated_at })
        .eq('user_id', row.user_id)
        .eq('logro_id', row.logro_id);
      if (updError) console.error('[logros] Error en UPDATE logro_id=' + row.logro_id + ':', updError);
    }

    nuevosLogros.forEach((nombre, i) => {
      setTimeout(() => showToast(`¡Logro desbloqueado: ${nombre}!`, 4000), i * 1500);
    });

  } catch (err) {
    console.error('[logros] Error inesperado:', err);
  }
}

// ── EXPOSE GLOBALS ────────────────────────────────
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.openArtist = openArtist;
window.selectAvatar = selectAvatar;
window.nextTutStep = nextTutStep;
window.selectStyle = selectStyle;
window.selectGrade = selectGrade;
window.activateFilter = activateFilter;
window.toggleFlash = toggleFlash;
window.togglePw = togglePw;
window.triggerAutosave = triggerAutosave;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.toggleFav = toggleFav;
window.handleFileCapture = handleFileCapture;
window.takePhoto = takePhoto;
window.startAIProcessing = startAIProcessing;
window.saveObra = saveObra;
window.toggleDevNav = toggleDevNav;
window.goBack = goBack;
window.openGalleryArtwork = openGalleryArtwork;
window.goToMyObras = goToMyObras;
window.loadProfileData = loadProfileData;
window.verTodosLogros = verTodosLogros;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleEditProfile = handleEditProfile;
window.downloadGvObra = downloadGvObra;
window.shareGvObra = shareGvObra;
