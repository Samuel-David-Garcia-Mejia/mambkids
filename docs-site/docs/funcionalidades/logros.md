---
id: logros
title: Sistema de logros
sidebar_position: 3
---

# Sistema de logros

## Descripción

El sistema de logros premia las acciones del usuario dentro de la aplicación. Los logros se definen en la tabla `logros` y el progreso de cada usuario se almacena en `usuario_logros`.

## Acciones que disparan logros

| Acción | Función JS | Logros relacionados |
|--------|-----------|---------------------|
| Publicar una obra | `saveObra()` | Primer publicación, Artista constante, Colección en crecimiento, logros por estilo |
| Guardar/quitar favorito | `addObraFavorite()` | Favoritos iniciales, Coleccionista |

## Lógica de actualización (`actualizarLogros`)

Cada vez que se dispara una acción, se ejecuta `actualizarLogros(userId)`:

```javascript
async function actualizarLogros(userId) {
  // 1. Leer todos los logros del catálogo
  const { data: logros } = await supabaseClient.from('logros')
    .select('id, nombre, condicion, requisito');

  // 2. Calcular conteos actuales del usuario
  const { data: obras } = await supabaseClient
    .from('obras').select('estilo').eq('user_id', userId);
  const { count: favCount } = await supabaseClient
    .from('obras_favoritas').select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 3. Para cada logro, determinar el conteo según su condición
  for (const logro of logros) {
    const cond = logro.condicion.toLowerCase();
    let conteo = 0;
    if (cond.includes('estilos distintos')) conteo = distinctStyles.size;
    else if (cond.includes('favoritos'))    conteo = totalFavs;
    else if (cond.includes('cubismo'))      conteo = styleCount['cubismo'] || 0;
    else if (cond.includes('remolinos'))    conteo = styleCount['vangogh'] || 0;
    else if (cond.includes('impresionismo'))conteo = styleCount['impresionismo'] || 0;
    else if (cond.includes('acuarela'))     conteo = styleCount['acuarela'] || 0;
    else if (cond.includes('publica'))      conteo = totalObras;
    // ...
  }

  // 4. INSERT para nuevos registros, UPDATE para existentes
  // cumple_requisito es permanente (no baja de true a false)
}
```

## Visualización

Los logros aparecen en dos lugares:

### Strip en pantalla de inicio (`s-home`)
Muestra los primeros 4 logros del catálogo con su estado actual. El botón "Ver todos" navega a la sección de logros en el perfil con un highlight visual.

### Grilla en perfil (`s-profile`)
Muestra todos los logros en una cuadrícula 3×N:
- **Ganado** (`ach-earned`): fondo ámbar, ícono en color
- **Bloqueado** (`ach-locked`): borde punteado, ícono gris, progreso `conteo/requisito`

```javascript
async function loadLogros() {
  const { data: logros } = await supabaseClient.from('logros')
    .select('id, nombre, icon_name, requisito')
    .order('created_at', { ascending: true });

  const { data: usuarioLogros } = await supabaseClient
    .from('usuario_logros').select('logro_id, conteo, cumple_requisito')
    .eq('user_id', APP.currentUserId);

  // Renderizar con Bootstrap Icons según icon_name
}
```

## Iconos

Los logros usan **Bootstrap Icons** (`bi-*`). El mapa de nombres es:

```javascript
const LOGRO_ICON_MAP = {
  'sparkles':           'bi-stars',
  'heart':              'bi-heart-fill',
  'bookmark':           'bi-bookmark-fill',
  'gallery-horizontal': 'bi-images',
  'compass':            'bi-compass',
  'palette':            'bi-palette-fill',
  'brush':              'bi-brush-fill',
  'box':                'bi-box',
  'wind':               'bi-wind',
  'droplets':           'bi-droplet-half',
};
```
