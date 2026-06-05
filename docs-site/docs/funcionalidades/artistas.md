---
id: artistas
title: Artistas del MAMB
sidebar_position: 5
---

# Artistas del MAMB

## Descripción

La sección de artistas (`s-artists`) presenta el catálogo de artistas colombianos e internacionales vinculados al MAMB. Los datos están definidos estáticamente en el objeto `ARTISTS` en `script.js`.

## Artistas incluidos

| Artista | Origen | Estilo |
|---------|--------|--------|
| Alejandro Obregón | Colombia · 1920–1992 | Expresionismo colombiano |
| Fernando Botero | Colombia · 1932–2023 | Boterismo (figuras volumétricas) |
| Enrique Grau | Colombia · 1920–2004 | Figurativismo tropical |
| Álvaro Cepeda Samudio | Colombia · 1926–1972 | Literatura y artes visuales |
| Álvaro Barrios | Colombia · 1945 | Arte conceptual, cómic |
| Ángel Loochkartt | Colombia · 1933–2019 | Carnaval, color caribeño |
| Salvador Dalí | España · 1904–1989 | Surrealismo |
| Karel Appel | Holanda · 1921–2006 | Movimiento CoBrA |

## Estructura de datos

Cada artista tiene la siguiente estructura:

```javascript
const ARTISTS = {
  obregon: {
    name: 'Alejandro Obregón',
    origin: 'Colombia · 1920 – 1992',
    bio: 'El gran pintor del Caribe colombiano...',
    fact: 'Dato curioso sobre el artista...',
    avClass: 'av-obregon',   // clase CSS del avatar
    artworks: [
      {
        title: 'Pez Dorado',
        date: '1947',
        desc: 'Descripción de la obra...',
        img: 'URL de la imagen'
      },
      // ...
    ]
  },
  // ...
};
```

## Pantalla de detalle (`s-artist-detail`)

Al hacer clic en un artista, se abre su pantalla de detalle con:
- Avatar del artista
- Nombre y origen
- Biografía
- Dato curioso
- Carrusel de obras destacadas (3 obras por artista)

```javascript
function openArtist(key) {
  const d = ARTISTS[key];
  // Poblar datos en el DOM
  el.querySelector('#sad-name').textContent = d.name;
  // Generar tarjetas de obras en el carrusel
  d.artworks.forEach(work => {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    // ...
    carousel.appendChild(card);
  });
  nav('s-artist-detail');
}
```
