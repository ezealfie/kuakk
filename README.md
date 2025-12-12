# Timeline de Aniversario - Eze & Sabri

Sitio web personal para celebrar y documentar la relación mes a mes con fotos y un contador en tiempo real.

## 🚀 Tecnologías

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Supabase** (Backend y Base de Datos)
- **Tailwind CSS**
- **shadcn/ui**

## 📋 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Base de Datos

Ejecuta el script SQL en tu proyecto de Supabase:

```bash
# El script está en scripts/001_create_tables.sql
# Cópialo y ejecútalo en el SQL Editor de Supabase
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar en producción
pnpm start
```

## 🌐 Deployment en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel:
   - Ve a Settings → Environment Variables
   - Agrega `NEXT_PUBLIC_SUPABASE_URL`
   - Agrega `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Vercel detectará automáticamente Next.js y hará el deploy

## 🔐 Contraseña por defecto

La contraseña por defecto es: `kuakpato`

(Puedes cambiarla ejecutando el script SQL con una nueva contraseña)

## 📝 Estructura del Proyecto

```
app/
  ├── page.tsx          # Página de login
  ├── timeline/
  │   └── page.tsx      # Página principal del timeline
  └── layout.tsx        # Layout principal

lib/
  └── supabase/
      ├── client.ts     # Cliente de Supabase para el navegador
      └── server.ts     # Cliente de Supabase para el servidor

scripts/
  └── 001_create_tables.sql  # Script de inicialización de BD
```

## 🐛 Solución de Problemas

### Error 404 en Vercel

- Verifica que las variables de entorno estén configuradas
- Revisa los logs de build en Vercel
- Asegúrate de que el script SQL se haya ejecutado en Supabase

### Error de login

- Verifica que la tabla `app_config` tenga un registro con la contraseña
- Revisa las políticas RLS en Supabase
- Verifica que las variables de entorno estén correctamente configuradas

