---
id: perfil
title: Perfil de usuario
sidebar_position: 4
---

# Perfil de usuario

## Descripción

La pantalla de perfil (`s-profile`) centraliza la información del usuario: datos personales, estadísticas, logros y obras recientes. Los datos se cargan dinámicamente desde Supabase al entrar a la pantalla.

## Registro y autenticación

La app usa **Supabase Auth** para gestionar usuarios. Al registrarse, se crea automáticamente un registro en la tabla `perfiles`:

```javascript
async function handleSignup() {
  const { data } = await supabaseClient.auth.signUp({
    email, password,
    options: { data: { nombre, colegio, grado, avatar } }
  });

  // Crear perfil en tabla perfiles
  await supabaseClient.from('perfiles').insert([{
    id: data.user.id, nombre, colegio, grado, avatar
  }]);
}
```

## Carga del perfil

```javascript
async function loadProfileData() {
  // 1. Datos del perfil (colegio, grado)
  const { data: perfil } = await supabaseClient
    .from('perfiles').select('colegio, grado').eq('id', APP.currentUserId).single();

  // 2. Conteo de obras publicadas
  const { count: obrasCount } = await supabaseClient
    .from('obras').select('*', { count: 'exact', head: true })
    .eq('user_id', APP.currentUserId);

  // 3. Conteo de favoritas
  const { count: favCount } = await supabaseClient
    .from('obras_favoritas').select('*', { count: 'exact', head: true })
    .eq('user_id', APP.currentUserId);

  // 4. Últimas 5 obras (scroll horizontal)
  await loadProfileObras();

  // 5. Grilla de logros
  await loadLogros();
}
```

## Editar perfil

El usuario puede cambiar su nombre, colegio, grado y avatar desde `s-edit-profile`. Los cambios se guardan tanto en `perfiles` como en los metadatos de Supabase Auth:

```javascript
await supabaseClient.from('perfiles').update({ nombre, colegio, grado, avatar })
  .eq('id', APP.currentUserId);

await supabaseClient.auth.updateUser({
  data: { nombre, colegio, grado, avatar }
});
```

## Modal de bienvenida

Al crear una cuenta, se muestra un modal de bienvenida con el nombre del usuario:

```javascript
const greeting = document.getElementById('welcome-greeting');
greeting.textContent = `Bienvenido/a, ${nombre}`;
openModal('m-welcome');
```

## Avatar

Los avatares se generan automáticamente usando la API de [DiceBear](https://www.dicebear.com/):

```javascript
const avatar = meta.avatar || 
  `https://api.dicebear.com/9.x/micah/svg?seed=${nombre}&backgroundColor=bde0fe`;
```
