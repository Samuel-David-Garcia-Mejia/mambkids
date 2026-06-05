---
id: supabase
title: Configuración de Supabase
sidebar_position: 6
---

# Configuración de Supabase

## Inicialización del cliente

El cliente de Supabase se inicializa en `config.js` y queda disponible globalmente como `window.supabaseClient`:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

El SDK de Supabase se carga desde CDN en `app.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
```

## Autenticación

Se usa **Supabase Auth** con email y contraseña.

### Escuchar cambios de sesión

```javascript
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session?.user) updateUserUI(session.user);
});
```

### Verificar sesión al cargar

```javascript
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) updateUserUI(session.user);
});
```

## Storage

Las imágenes se suben al bucket `obras_bucket`. El proceso de guardado de una obra:

```javascript
// 1. Convertir canvas a Blob
const base64 = resultCanvas.toDataURL('image/jpeg', 0.85);
const blob = await (await fetch(base64)).blob();

// 2. Subir a Storage
const fileName = `${userId}/${Date.now()}.jpg`;
await supabaseClient.storage.from('obras_bucket')
  .upload(fileName, blob, { contentType: 'image/jpeg' });

// 3. Obtener URL pública
const { data: { publicUrl } } = supabaseClient.storage
  .from('obras_bucket').getPublicUrl(fileName);

// 4. Guardar en tabla obras
await supabaseClient.from('obras').insert([{
  user_id: userId, nombre, estilo, imagen_url: publicUrl
}]);
```

## Patrones de consulta comunes

### Consulta con JOIN manual (perfiles + obras)

```javascript
const { data: obras } = await supabaseClient
  .from('obras').select('*').order('created_at', { ascending: false });

const userIds = [...new Set(obras.map(o => o.user_id))];
const { data: perfiles } = await supabaseClient
  .from('perfiles').select('id, nombre').in('id', userIds);

const userMap = {};
perfiles.forEach(p => userMap[p.id] = p.nombre);
```

### Upsert de logros

Para evitar problemas con RLS en operaciones de upsert, la app separa las operaciones en INSERT (filas nuevas) y UPDATE (filas existentes):

```javascript
// INSERT para registros nuevos
await supabaseClient.from('usuario_logros').insert(porInsertar);

// UPDATE individual para registros existentes
for (const row of porActualizar) {
  await supabaseClient.from('usuario_logros')
    .update({ conteo: row.conteo, cumple_requisito: row.cumple_requisito })
    .eq('user_id', row.user_id).eq('logro_id', row.logro_id);
}
```

## Políticas RLS requeridas

Ver la sección [Base de datos → Políticas RLS](/docs/base-de-datos#políticas-rls-row-level-security) para el SQL completo de las políticas necesarias.
