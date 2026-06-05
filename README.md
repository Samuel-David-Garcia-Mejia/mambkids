# MAMB Kids

Aplicación web interactiva del **Museo de Arte Moderno de Barranquilla (MAMB)** para niños y jóvenes, desarrollada en colaboración con la **Universidad Simón Bolívar**.

Los usuarios pueden fotografiar sus obras, aplicarles filtros artísticos simulados por IA, compartirlas en una galería comunitaria y ganar logros mientras exploran el arte moderno.

**App en producción:** [calm-desert-027745d10.7.azurestaticapps.net](https://calm-desert-027745d10.7.azurestaticapps.net/)  
**Documentación:** [Samuel-David-Garcia-Mejia.github.io/mambkids](https://Samuel-David-Garcia-Mejia.github.io/mambkids/)  
**Repositorio:** [github.com/Samuel-David-Garcia-Mejia/mambkids](https://github.com/Samuel-David-Garcia-Mejia/mambkids)

---

## Funcionalidades

| Módulo | Descripción |
|---|---|
| **Cámara** | Captura fotos con `getUserMedia`, flash visual, cuadrícula de encuadre, personaje guía "Pinto" |
| **Filtros IA** | 6 estilos artísticos (Impresionismo, Van Gogh, Acuarela, Cubismo, Puntillismo, Fantasía) aplicados con Canvas API |
| **Galería** | Galería comunitaria y personal; visor con descarga de imagen y compartir por WhatsApp/email |
| **Logros** | Sistema de achievements con 8 logros desbloqueables según la actividad del usuario |
| **Perfil** | Estadísticas personales, obras publicadas, logros ganados |
| **Artistas** | Sección educativa con artistas destacados vinculados al MAMB |
| **Juego RPS** | Piedra, papel o tijera con detección de poses en tiempo real usando TensorFlow.js + Teachable Machine |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) — SPA sin frameworks |
| Autenticación | Supabase Auth (email/contraseña) |
| Base de datos | Supabase PostgreSQL |
| Almacenamiento | Supabase Storage (`obras_bucket`) |
| IA — filtros | Canvas API (`ctx.filter`, `drawImage`) |
| IA — poses | TensorFlow.js 1.3.1 + Teachable Machine Pose |
| Iconos | Bootstrap Icons 1.11.3 |
| Hosting | Microsoft Azure Static Web Apps |
| Documentación | Docusaurus 3.6.3 → GitHub Pages |

---

## Estructura del proyecto

```
mamb_prueba/
├── app.html                   # SPA principal (18 pantallas)
├── script.js                  # Lógica de la aplicación
├── styles.css                 # Estilos (mobile-first)
├── config.js                  # Inicialización de Supabase
├── index.html                 # Página de entrada
├── docs-site/                 # Sitio de documentación (Docusaurus)
│   ├── docs/                  # Páginas de documentación en Markdown
│   │   └── funcionalidades/   # Submódulos documentados
│   ├── src/                   # Componentes y estilos del sitio
│   └── static/                # Recursos estáticos (logo, favicon)
└── .github/
    └── workflows/
        └── deploy-docs.yml    # CI/CD automático → GitHub Pages
```

---

## Base de datos (Supabase)

| Tabla | Descripción |
|---|---|
| `perfiles` | Datos del usuario: nombre, colegio, grado, avatar |
| `obras` | Obras publicadas: imagen, estilo, descripción, visibilidad |
| `favoritos` | Relación usuario ↔ obra favorita |
| `logros` | Catálogo de logros con condición y requisito numérico |
| `usuario_logros` | Progreso por usuario: conteo y `cumple_requisito` |

---

## Instalación local

```bash
# 1. Clona el repositorio
git clone https://github.com/Samuel-David-Garcia-Mejia/mambkids.git

# 2. Configura Supabase en config.js
#    (reemplaza SUPABASE_URL y SUPABASE_ANON_KEY con tus credenciales)

# 3. Abre app.html en un servidor local
#    (XAMPP, Live Server de VS Code, etc.)
```

Para levantar el sitio de documentación localmente:

```bash
cd docs-site
npm install
npm run start    # servidor en http://localhost:3000
```

---

## Equipo

| Nombre | Rol |
|---|---|
| Samuel David García Mejía | Líder del proyecto y Desarrollador |
| Nadín Elías Cantillo Gómez | Desarrollador |
| Valeria Melissa Patrón García | Desarrolladora |

---

## Institución

Proyecto académico desarrollado para el **Museo de Arte Moderno de Barranquilla (MAMB)** en colaboración con la **Universidad Simón Bolívar** — Barranquilla, Colombia.
