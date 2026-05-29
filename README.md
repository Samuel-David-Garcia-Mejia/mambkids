# MAMB Niños — Museo de Arte Moderno de Barranquilla

## Descripción
Aplicación web progresiva (PWA) mobile-first dirigida a niños, que combina **educación artística, fotografía interactiva e inteligencia artificial** para explorar el arte moderno. Los usuarios pueden tomar fotos de sus obras, aplicar filtros artísticos simulados por IA, jugar al piedra-papel-tijera con detección de poses, y compartir sus creaciones en una galería comunitaria. Diseñada para desplegarse en la nube mediante **Azure App Service** o **Azure Web Apps**.

---

## Funcionalidades principales

### Inicio de sesión

Autenticación gestionada completamente por **Supabase Auth** con correo electrónico y contraseña.

- Registro con datos adicionales: nombre, colegio, grado y avatar (generado por defecto con DiceBear API).
- Sesión persistente via `onAuthStateChange`.
- Sin JWT ni lógica del lado del servidor — todo se maneja desde el cliente mediante el SDK de Supabase.

### Modelos de IA integrados

1. **Filtros artísticos simulados** (client-side)
   - Seis estilos: Impresionismo, Van Gogh, Acuarela, Cubismo, Puntillismo y Fantasía.
   - Aplicados sobre el canvas del navegador combinando `ctx.filter` (saturación, contraste, blur, hue-rotate) y redimensionamiento con `imageSmoothingEnabled = false` para efectos de pixelado.
   - La "IA procesando" se simula con una barra de progreso animada.

2. **Teachable Machine + TensorFlow.js** — Juego Piedra, Papel o Tijera
   - Modelo de detección de poses cargado desde `https://teachablemachine.withgoogle.com/models/WOCXLX73G/`.
   - Reconoce gestos de la mano (piedra, papel, tijera) en tiempo real usando la cámara.
   - Dibuja el esqueleto de las keypoints de pose sobre un canvas.

### Funciones de cámara / fotos

- Captura nativa con `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })`.
- Fallback a `<input type="file" capture="environment">` para navegadores sin soporte directo.
- Funcionalidades: flash visual, cuadrícula de encuadre, animación de obturador, personaje "Pinto" como guía.

**Flujo completo:**

1. Abrir la cámara desde el botón central de la barra inferior (FAB).
2. Tomar la foto.
3. Vista previa.
4. Asignar nombre, descripción y estilo artístico.
5. "Procesar con IA" (barra de progreso + filtro visual).
6. Guardar en Supabase Storage + registro en tabla `obras`.
7. Visualizar en galería propia o comunitaria.

### Cómo acceder a estas funciones

| Función | Ruta / Sección |
|---|---|
| Cámara | Botón central `+` en la barra inferior |
| Galería comunitaria | Pestaña "Galería" en la barra inferior |
| Perfil y obras propias | Pestaña "Perfil" |
| Juego RPS | Pestaña "Inicio" → tarjeta del juego |
| Artistas destacados | Pestaña "Inicio" → sección de artistas |
| Tutorial | Botón flotante de ayuda o pantalla de inicio |

---

## Arquitectura del proyecto

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Cliente)                 │
│                                                     │
│  index.html     script.js       styles.css          │
│  ┌─────────┐   ┌───────────────────────────┐        │
│  │   SPA    │   │  Navegación por secciones │        │
│  │  18      │   │  Cámara (getUserMedia)    │        │
│  │  screens │   │  Filtros (Canvas API)     │        │
│  └─────────┘   │  TF.js + TM Pose          │        │
│                │  Supabase SDK (cliente)    │        │
│                └───────────────────────────┘        │
│               ┌────────────┐                        │
│               │  config.js │── Supabase init        │
│               └────────────┘                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│              SUPABASE (Backend as a Service)          │
│                                                      │
│  ┌───────────────┐  ┌───────────────┐               │
│  │  Auth         │  │  Storage      │               │
│  │  (email/pw)   │  │  obras_bucket │               │
│  └───────┬───────┘  └───────┬───────┘               │
│          │                  │                        │
│  ┌───────▼──────────────────▼───────┐               │
│  │     PostgreSQL (Base de datos)    │               │
│  │                                   │               │
│  │  ┌──────────┐  ┌──────────┐      │               │
│  │  │  obras   │  │ perfiles │      │               │
│  │  ├──────────┤  ├──────────┤      │               │
│  │  │ user_id  │  │ id       │      │               │
│  │  │ nombre   │  │ nombre   │      │               │
│  │  │ descrip. │  │ colegio  │      │               │
│  │  │ estilo   │  │ grado    │      │               │
│  │  │ imagen   │  │ avatar   │      │               │
│  │  │ created  │  │          │      │               │
│  │  └──────────┘  └──────────┘      │               │
│  └──────────────────────────────────┘               │
└──────────────────────────────────────────────────────┘
```

### Módulos

| Módulo | Tecnología | Responsabilidad |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + JavaScript vanilla | UI completa, SPA router, cámara, canvas filters, juego TF.js |
| **Backend** | No existe servidor propio — todo es **cliente → Supabase** | La capa backend la provee Supabase (Auth, Storage, PostgreSQL) |
| **Base de datos** | Supabase PostgreSQL | Tablas: `obras` (obras de arte), `perfiles` (usuarios) |
| **Almacenamiento** | Supabase Storage (S3-compatible) | Imágenes subidas en `obras_bucket/{user_id}/{timestamp}.jpg` |
| **Autenticación** | Supabase Auth | Registro, inicio de sesión, sesión persistente |

---

## Tecnologías principales

| Componente | Stack |
|---|---|
| Lenguaje | JavaScript (ES6+) |
| Frontend | HTML5, CSS3 (custom properties, mobile-first), Vanilla JS |
| Autenticación | Supabase Auth |
| Base de datos | Supabase PostgreSQL |
| Storage | Supabase Storage |
| IA (filtros) | Canvas API (`ctx.filter`, `drawImage`) |
| IA (poses) | TensorFlow.js 1.3.1 + Teachable Machine Pose |
| Despliegue | **Azure App Service** / Azure Web Apps (static site) |
| Animaciones | CSS transitions, confetti (canvas), requestAnimationFrame |
| Fuentes | Google Fonts: Baloo 2, Quicksand |

---

## Despliegue en Azure

La aplicación es un sitio estático sin dependencias de servidor. Para desplegar en **Azure App Service** o **Azure Web Apps**:

1. Crear un **App Service** con pila "PHP" o "Windows — Static HTML".
2. Configurar las variables de entorno en Azure App Settings (o mantener `config.js` con las claves de Supabase).
3. Subir los archivos via FTP, Git, o Azure DevOps.
4. Opcional: habilitar **HTTPS only**, **Always On**, y configurar un dominio personalizado.

También es compatible con despliegue directo en el servicio de **GitHub Pages** sin necesidad de configuración adicional.

---

## Repositorio

'https://github.com/Samuel-David-Garcia-Mejia/MAMB_Ninos_v2'

## GitHub Page

'https://samuel-david-garcia-mejia.github.io/MAMB_Ninos_v2/'
