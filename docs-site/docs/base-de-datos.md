---
id: base-de-datos
title: Base de datos
sidebar_position: 4
---

# Base de datos

La aplicación usa **Supabase** como backend, que provee una base de datos **PostgreSQL** gestionada, autenticación y almacenamiento de archivos.

## Diagrama de tablas

```
auth.users (Supabase Auth)
     │
     ├──► perfiles (1:1)
     ├──► obras (1:N)
     ├──► obras_favoritas (N:M con obras)
     └──► usuario_logros (N:M con logros)

logros (catálogo estático)
     └──► usuario_logros
```

---

## Tablas

### `perfiles`

![Registros reales de la tabla perfiles en Supabase](docs-site/static/img/database/01_tabla_perfiles.jpg)

Extiende el usuario de Supabase Auth con datos del perfil escolar.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` PK | Igual al `id` de `auth.users` |
| `nombre` | `varchar` | Nombre completo del usuario |
| `colegio` | `varchar` | Nombre del colegio |
| `grado` | `varchar` | Grado escolar (ej. "3ro") |
| `avatar` | `varchar` | URL de imagen de avatar |
| `created_at` | `timestamptz` | Fecha de creación |

---

### `obras`

![Registros reales de la tabla obras en Supabase](docs-site/static/img/database/02_tabla_obras.jpg)

Almacena las obras creadas por los usuarios.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` PK | Identificador único |
| `user_id` | `uuid` FK | Referencia a `auth.users` |
| `nombre` | `varchar` | Nombre dado a la obra |
| `descripcion` | `text` | Descripción opcional |
| `estilo` | `varchar` | Estilo artístico aplicado |
| `imagen_url` | `text` | URL pública en Supabase Storage |
| `created_at` | `timestamptz` | Fecha de publicación |

**Estilos válidos:** `impresionismo`, `vangogh`, `acuarela`, `cubismo`, `puntillismo`, `fantasia`

---

### `obras_favoritas`

![Registros reales de la tabla obras_favoritas en Supabase](docs-site/static/img/database/03_tabla_obras_favoritas.jpg)

Relación muchos-a-muchos entre usuarios y obras que marcaron como favoritas.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `user_id` | `uuid` PK, FK | Referencia a `auth.users` |
| `obra_id` | `uuid` PK, FK | Referencia a `obras` |

---

### `logros`

![Registros reales de la tabla logros en Supabase](docs-site/static/img/database/04_tabla_logros.jpg)

Catálogo estático de logros disponibles en la aplicación.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` PK | Identificador único |
| `nombre` | `varchar` | Nombre del logro |
| `condicion` | `text` | Descripción de la condición en lenguaje natural |
| `icon_name` | `varchar` | Nombre del ícono (Bootstrap Icons) |
| `requisito` | `int2` | Número de veces que se debe cumplir la acción |
| `created_at` | `timestamptz` | Fecha de creación |

**Logros del sistema:**

| Nombre | Condición | Requisito | Ícono |
|--------|-----------|-----------|-------|
| Primer publicación | Publica su primera obra | 1 | `sparkles` |
| Artista constante | Publica 5 obras | 5 | `palette` |
| Colección en crecimiento | Publica 10 obras | 10 | `gallery-horizontal` |
| Favoritos iniciales | Guarda su primera obra en favoritos | 1 | `heart` |
| Coleccionista | Guarda 10 obras en favoritos | 10 | `bookmark` |
| Explorador de estilos | Aplica 3 estilos distintos | 3 | `compass` |
| Cubismo visionario | Publica 3 obras con estilo Cubismo | 3 | `box` |
| Remolinos creativos | Publica 3 obras con estilo Remolinos | 3 | `wind` |
| Maestro del Impresionismo | Publica 5 obras con estilo Impresionismo | 5 | `brush` |
| Acuarela soñadora | Publica 3 obras con estilo Acuarela | 3 | `droplets` |

---

### `usuario_logros`

![Registros reales de la tabla usuario_logros en Supabase](docs-site/static/img/database/05_tabla_usuarios_logros.jpg)

Registra el progreso de cada usuario hacia cada logro.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `user_id` | `uuid` PK, FK | Referencia a `auth.users` |
| `logro_id` | `uuid` PK, FK | Referencia a `logros` |
| `conteo` | `integer` | Número de veces que se ejecutó la acción |
| `cumple_requisito` | `boolean` | `true` cuando `conteo >= requisito` |
| `updated_at` | `timestamptz` | Última actualización |

:::note
`cumple_requisito` es permanente: una vez que pasa a `true`, no vuelve a `false` aunque el conteo baje (ej. al quitar favoritos).
:::

---

## Storage

Las imágenes de las obras se almacenan en el bucket **`obras_bucket`** de Supabase Storage:

```
obras_bucket/
  {user_id}/
    {timestamp}.jpg
```

Las URLs son públicas y se obtienen con:

```javascript
const { data: { publicUrl } } = supabaseClient.storage
  .from('obras_bucket')
  .getPublicUrl(fileName);
```

---

## Políticas RLS (Row Level Security)

Todas las tablas tienen RLS activado. Las políticas configuradas son:

```sql
-- perfiles: el usuario solo ve y edita su propio perfil
CREATE POLICY "perfil_propio" ON perfiles
  FOR ALL USING (auth.uid() = id);

-- obras: lectura pública, escritura propia
CREATE POLICY "obras_lectura" ON obras FOR SELECT USING (true);
CREATE POLICY "obras_insertar" ON obras FOR INSERT WITH CHECK (auth.uid() = user_id);

-- logros: lectura pública
CREATE POLICY "logros_lectura_publica" ON logros FOR SELECT USING (true);

-- usuario_logros: el usuario gestiona sus propios logros
CREATE POLICY "usuario_logros_select" ON usuario_logros FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuario_logros_insert" ON usuario_logros FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuario_logros_update" ON usuario_logros FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```
