---
id: galeria
title: Galería del museo
sidebar_position: 2
---

# Galería del museo

## Descripción

La galería muestra todas las obras creadas por los usuarios del museo, cargadas dinámicamente desde Supabase. Incluye filtros por estilo, soporte para favoritos y un visor de detalle.

## Carga de obras

```javascript
async function loadObras() {
  const { data: obras } = await supabaseClient
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false });

  // Carga nombres de autores desde perfiles
  const userIds = [...new Set(obras.map(o => o.user_id))];
  const { data: perfiles } = await supabaseClient
    .from('perfiles').select('id, nombre').in('id', userIds);
}
```

## Filtros disponibles

| Filtro | Descripción |
|--------|-------------|
| Todas | Muestra todas las obras |
| Mis obras | Filtra por `user_id` del usuario actual |
| Favoritos | Muestra solo obras marcadas como favoritas |
| Impresionismo / Remolinos / Acuarela / Cubismo | Filtra por estilo artístico |

## Sistema de favoritos

Al marcar una obra como favorita, se inserta un registro en `obras_favoritas`. Al desmarcarla, se elimina. La acción también dispara `actualizarLogros()` para evaluar logros relacionados.

```javascript
async function addObraFavorite(e, btn, obraId) {
  const isFav = btn.classList.toggle('is-fav');
  if (isFav) {
    await supabaseClient.from('obras_favoritas')
      .insert([{ user_id: APP.currentUserId, obra_id: obraId }]);
  } else {
    await supabaseClient.from('obras_favoritas')
      .delete().eq('user_id', APP.currentUserId).eq('obra_id', obraId);
  }
  actualizarLogros(APP.currentUserId);
}
```

## Visor de obra (`s-gallery-viewer`)

Al hacer clic en una obra se abre el visor completo que muestra:
- Imagen a pantalla completa
- Título, estilo y fecha
- Nombre del autor y colegio/grado
- Botones: Favorito, Descargar, Compartir

### Descargar obra

```javascript
async function downloadGvObra() {
  const response = await fetch(APP.currentObra.imagen_url, { mode: 'cors' });
  const blob = await response.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = APP.currentObra.nombre + '.jpg';
  a.click();
}
```

### Compartir obra

```javascript
async function shareGvObra() {
  if (navigator.share) {
    // Web Share API — abre selector nativo (WhatsApp, correo, etc.)
    const file = new File([blob], titulo + '.jpg', { type: 'image/jpeg' });
    await navigator.share({ title: titulo, files: [file] });
  } else {
    // Fallback: WhatsApp Web
    window.open('https://wa.me/?text=' + encodeURIComponent(texto + url), '_blank');
  }
}
```
