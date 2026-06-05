---
id: instalacion
title: Instalación y configuración local
sidebar_position: 2
---

# Instalación y configuración local

## Requisitos previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local (se recomienda [XAMPP](https://www.apachefriends.org/))
- Cuenta en [Supabase](https://supabase.com) (para el backend)
- Git

## Clonar el repositorio

```bash
git clone https://github.com/Samuel-David-Garcia-Mejia/mambkids.git
cd mambkids
```

## Estructura de archivos

```
mambkids/
├── app.html          # Aplicación principal (SPA)
├── index.html        # Página de entrada/redirección
├── script.js         # Lógica de la aplicación
├── styles.css        # Estilos globales
├── config.js         # Configuración de Supabase
├── docs-site/        # Documentación (Docusaurus)
└── README.md
```

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia tu **Project URL** y **anon key** desde *Settings → API*
3. Edita el archivo `config.js`:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## Crear las tablas en Supabase

Ejecuta el siguiente SQL en el **SQL Editor** de Supabase:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  nombre varchar NOT NULL,
  colegio varchar,
  grado varchar,
  avatar varchar,
  created_at timestamptz DEFAULT now()
);

-- Tabla de obras
CREATE TABLE obras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  nombre varchar NOT NULL,
  descripcion text,
  estilo varchar,
  imagen_url text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de favoritos
CREATE TABLE obras_favoritas (
  user_id uuid REFERENCES auth.users(id),
  obra_id uuid REFERENCES obras(id),
  PRIMARY KEY (user_id, obra_id)
);

-- Tabla de logros (catálogo)
CREATE TABLE logros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre varchar NOT NULL,
  condicion text NOT NULL,
  icon_name varchar,
  requisito int2 NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Tabla de logros por usuario
CREATE TABLE usuario_logros (
  user_id uuid REFERENCES auth.users(id),
  logro_id uuid REFERENCES logros(id),
  conteo integer NOT NULL DEFAULT 0,
  cumple_requisito boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, logro_id)
);
```

## Ejecutar localmente

1. Coloca los archivos en la carpeta `htdocs` de XAMPP:
   ```
   C:\xampp\htdocs\mambkids\
   ```
2. Inicia Apache desde el panel de control de XAMPP
3. Abre `http://localhost/mambkids/app.html` en tu navegador

## Hosting en Azure Static Web Apps

La app está desplegada en Microsoft Azure. Para desplegar tu propia versión:

1. Crea un recurso **Static Web App** en el [portal de Azure](https://portal.azure.com)
2. Conecta tu repositorio de GitHub
3. Configura el workflow generado automáticamente por Azure
4. Cada push a `main` desplegará automáticamente los cambios
