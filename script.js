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
function nav(targetId) {
  const current = document.querySelector('.screen.active');
  const target = document.getElementById(targetId);
  if (!target || !current || current.id === targetId) return;

  // History
  if (APP.currentScreen !== targetId) {
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
  if (prev) nav(prev);
}

function onScreenEnter(id) {
  switch (id) {
    case 's-processing': startProcessingAnim(); break;
    case 's-result': resetResultDrawer(); break;
    case 's-tutorial': resetTutorial(); break;
    case 's-camera': initCamera(); break;
    case 's-gallery': loadObras(); break;
  }

  if (id !== 's-camera') {
    stopCamera();
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
  document.getElementById('tap-hint')?.style && (document.getElementById('tap-hint').style.display = 'none');
}
function closeDrawer() {
  document.getElementById('result-drawer')?.classList.remove('open');
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
function openGalleryArtwork(el) {
  const thumb = el.querySelector('.gal-thumb');
  const title = el.querySelector('strong').textContent;
  const author = el.querySelector('span').textContent;
  const styleTag = el.querySelector('.style-tag').textContent;

  const gvImg = document.getElementById('gv-img');
  if (gvImg) {
    const computedStyle = window.getComputedStyle(thumb);
    gvImg.style.backgroundImage = computedStyle.backgroundImage;
    gvImg.style.backgroundColor = computedStyle.backgroundColor;
  }
  document.getElementById('gv-title').textContent = title;
  document.getElementById('gv-author').textContent = author + ' · ' + styleTag;

  nav('s-gallery-viewer');
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
  's-states': 'Estados UI',
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

// ── SUPABASE UI UPDATES ───────────────────────────
function updateUserUI(user) {
  console.log("Updating UI for user:", user);
  if (!user) return;

  // Extraer datos del metadata, con valores por defecto si no existen
  const meta = user.user_meta_data || {};
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
    if (svg) {
      const img = document.createElement('img');
      img.src = avatar;
      img.style.width = '22px';
      img.style.height = '22px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
      img.style.border = '2px solid var(--ink)';
      svg.replaceWith(img);
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
  } else {
    showToast('¡Cuenta creada con éxito!');
    openModal('m-welcome');
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

  galleryGrid.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--ink-faint); grid-column: 1/-1;">Cargando obras...</div>';

  try {
    const { data: obras, error } = await window.supabaseClient.from('obras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!obras || obras.length === 0) {
      galleryGrid.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--ink-faint); grid-column: 1/-1;">Aún no hay obras. ¡Crea la tuya!</div>';
      return;
    }

    galleryGrid.innerHTML = '';

    obras.forEach(obra => {
      // Simular altura para efecto masonry
      const height = 140 + Math.random() * 80;

      const card = document.createElement('div');
      card.className = 'gal-card';
      card.style.height = height + 'px';
      card.onclick = () => openGalleryArtwork(obra.nombre, 'Autor', obra.estilo);

      card.innerHTML = `
        <div style="position:absolute;inset:0;width:100%;height:100%;background-image:url('${obra.imagen_url}');background-size:cover;background-position:center;border-radius:var(--r-md);"></div>
        <div class="gal-card-overlay">
          <strong>${obra.nombre}</strong>
        </div>
      `;
      galleryGrid.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading obras:", err);
    galleryGrid.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--coral); grid-column: 1/-1;">Error al cargar las obras</div>';
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
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
