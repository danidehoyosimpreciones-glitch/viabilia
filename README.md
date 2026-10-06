# Viabilia: comparador de alternativas de inversión

Frontend (HTML/CSS/JS) en `public/`, backend en `api/` (funciones de Vercel) y base de datos MongoDB Atlas.

## Correrlo en local
1. Instala Node.js y luego `npm i -g vercel`.
2. En la carpeta del proyecto: `npm install`.
3. En https://mongodb.com/atlas crea un cluster gratis (M0), un usuario de base de datos y en **Network Access** agrega `0.0.0.0/0` (necesario para Vercel).
4. Copia `.env.example` a `.env.local` y llena `MONGODB_URI` y `JWT_SECRET`.
5. `vercel dev` y abre http://localhost:3000

## Desplegar en Vercel
1. Sube la carpeta a GitHub y créala como proyecto en https://vercel.com.
2. En Settings > Environment Variables agrega `MONGODB_URI` y `JWT_SECRET`.
3. Despliega.

## Estructura
- `public/`: la aplicación (index.html, css/styles.css, js/app.js)
- `api/auth.js`: registro, inicio de sesión y avatar
- `api/projects.js`: crear, listar, abrir, editar y eliminar proyectos
