# Social Run 5K — Inscripciones + panel admin

## Ejecutar localmente
1. Instala Node.js LTS.
2. Abre esta carpeta en VS Code.
3. En Terminal ejecuta `npm install`.
4. Crea `.env.local` copiando `.env.example` y rellena la URL y clave pública de Supabase. El enlace de WhatsApp ya está configurado.
5. Ejecuta `npm run dev`.

## Base de datos y seguridad
1. En Supabase, abre SQL Editor > New query.
2. Copia `supabase.sql`.
3. Antes de ejecutarlo, reemplaza en la política el texto `admin@tucorreo.com` por el correo que utilizarás como administrador. Debe coincidir exactamente con el correo de Auth.
4. Ejecuta el SQL.

La tabla permite inserciones públicas (para el formulario de inscripción), pero solo la cuenta autenticada con el correo de administrador especificado puede leer los registros.

## Crear la cuenta administradora
1. En Supabase, entra en Authentication > Users.
2. Pulsa Add user / Create new user.
3. Escribe el correo exacto que pusiste en la política SQL y define una contraseña fuerte. Confirma el usuario si la interfaz te da esa opción.
4. No publiques el registro abierto de usuarios ni agregues una función de crear cuenta en la web.
5. Entra a `http://localhost:5173/admin`, inicia sesión con ese correo y contraseña.

## Panel /admin
- Total de inscritos, inscritos hoy y edad promedio.
- Tabla con nombre completo, edad, celular y fecha.
- Búsqueda por nombre, celular o edad.
- Botón para actualizar y cerrar sesión.
- Enlace discreto ADMIN al pie de la página pública.

## Despliegue
En Vercel, añade las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_WHATSAPP_URL`. Build command: `npm run build`; output directory: `dist`.

Nunca uses una `service_role` key en el navegador. La protección de los datos se aplica con RLS en Supabase, no por ocultar la URL `/admin`.
