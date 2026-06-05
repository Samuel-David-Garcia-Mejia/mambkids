---
id: arquitectura
title: Arquitectura del sistema
sidebar_position: 3
---

# Arquitectura del sistema

## Visión general

MAMB Kids es una **Single Page Application (SPA)** construida con HTML, CSS y JavaScript puro (sin frameworks). El estado de la aplicación se gestiona mediante un objeto global `APP`, y la navegación entre pantallas se realiza ocultando/mostrando secciones `<section class="screen">`.

```
┌─────────────────────────────────────────────────────┐
│              Navegador (Cliente)                    │
│                                                     │
│  app.html ──► script.js ──► config.js               │
│     │              │                                │
│     │         Supabase JS Client                    │
│     │              │                                │
└─────┼──────────────┼─────────────────────────────────┘
      │              │
      │    ┌─────────▼──────────┐
      │    │     Supabase       │
      │    │  ┌─────────────┐  │
      │    │  │ PostgreSQL  │  │
      │    │  │    Auth     │  │
      │    │  │   Storage   │  │
      │    │  └─────────────┘  │
      │    └────────────────────┘
      │
      ▼
Azure Static Web Apps (Hosting)
```

## Archivos principales

| Archivo | Responsabilidad |
|---------|----------------|
| `app.html` | Toda la interfaz de usuario — 15+ pantallas como secciones `<section>` |
| `script.js` | Lógica de navegación, eventos, cámara, galería, logros, auth |
| `styles.css` | Sistema de diseño completo — variables CSS, componentes, animaciones |
| `config.js` | Inicialización del cliente de Supabase |
| `index.html` | Redirección a `app.html` |

## Estado global (`APP`)

Toda la app comparte un objeto de estado único:

```javascript
const APP = {
  currentScreen: 's-login',   // pantalla activa
  history: [],                // historial de navegación (para goBack())
  currentUserId: null,        // UUID del usuario autenticado
  selectedStyle: 'impresionismo', // estilo artístico seleccionado
  currentObra: null,          // obra abierta en el visor de galería
  favActive: false,
  flashActive: false,
  tutStep: 0,
  processingTimer: null,
  autosaveTimer: null,
  progressValue: 20,
};
```

## Sistema de pantallas

La navegación funciona activando/desactivando la clase `active` en elementos `<section class="screen">`:

```javascript
function nav(targetId, skipHistory) {
  const current = document.querySelector('.screen.active');
  const target = document.getElementById(targetId);
  current.classList.remove('active');
  target.classList.add('active', 'entering');
  APP.currentScreen = targetId;
  onScreenEnter(targetId); // hook para cargar datos de cada pantalla
}
```

### Pantallas de la aplicación

| ID | Nombre | Descripción |
|----|--------|-------------|
| `s-login` | Login | Inicio de sesión |
| `s-signup` | Crear cuenta | Registro de nuevo usuario |
| `s-tutorial` | Tutorial | Onboarding guiado por Pinto |
| `s-home` | Inicio | Pantalla principal con logros y accesos rápidos |
| `s-camera` | Cámara | Captura de dibujos |
| `s-preview` | Vista previa | Revisión antes de procesar |
| `s-form` | Formulario | Nombre y estilo de la obra |
| `s-processing` | Procesando IA | Animación de procesamiento |
| `s-result` | Resultado | Obra transformada con opciones de guardado |
| `s-gallery` | Galería | Todas las obras del museo |
| `s-gallery-viewer` | Visor | Detalle de una obra |
| `s-artists` | Artistas | Catálogo de artistas |
| `s-artist-detail` | Detalle artista | Obras y biografía |
| `s-programs` | Programas | Programas académicos Unisimón |
| `s-about` | Acerca del MAMB | Historia, misión y ubicación |
| `s-events` | Eventos | Talleres y actividades |
| `s-profile` | Perfil | Datos del usuario y logros |
| `s-edit-profile` | Editar perfil | Modificar datos personales |
| `s-game` | Juego | Piedra, papel o tijera con IA |

## Flujo principal del usuario

```
Login/Registro
     │
     ▼
  Inicio (s-home)
     │
     ├──► Cámara → Vista Previa → Formulario → Procesando → Resultado → Guardar
     │
     ├──► Galería → Visor de obra → Descargar / Compartir / Favoritos
     │
     ├──► Artistas → Detalle del artista
     │
     ├──► Perfil → Logros / Mis obras / Editar perfil
     │
     └──► Eventos / Programas / Acerca del MAMB
```
