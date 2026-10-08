# Viabilia: comparador de alternativas de inversión

Aplicación web para decidir en qué invertir. El usuario ingresa dos o más alternativas (inversión, vida útil, ingresos, costos y valor de salvamento) y la plataforma calcula VPN, TIR, CAUE, relación beneficio/costo y periodo de recuperación, los compara en un dashboard y escribe una conclusión.

## ¿Para quién es?
- **Beneficiario del caso real:** [COMPLETAR: nombre real de la empresa, entidad, comunidad o público estudiantil].
- **Otros usuarios posibles:** estudiantes de ingeniería económica, microempresarios y comunidades que deban elegir entre alternativas de inversión.

## La idea en una frase
Esta herramienta resuelve [COMPLETAR: problemática concreta] de [COMPLETAR: nombre real del beneficiario], y cualquier actor similar podría usarla para decidir entre alternativas de inversión con criterios de ingeniería económica (VPN, TIR, CAUE y B/C).

## Enlaces
- **Aplicación desplegada:** https://viabilia-three.vercel.app
- **Repositorio:** https://github.com/danidehoyosimpreciones-glitch/viabilia

## Documentación
- [Manual de usuario](docs/manual-de-usuario.md)
- [Documentación técnica](docs/documentacion-tecnica.md)
- [Registro de supuestos](docs/registro-de-supuestos.md)
- [Guía de reutilización](docs/guia-de-reutilizacion.md)

## Cómo correrlo en local
1. Instala Node.js (https://nodejs.org) y la herramienta de Vercel: `npm i -g vercel`.
2. En la carpeta del proyecto: `npm install`.
3. Crea un cluster gratuito en MongoDB Atlas (https://mongodb.com/atlas), un usuario de base de datos y en **Network Access** permite `0.0.0.0/0`.
4. Copia `.env.example` a `.env.local` y llena `MONGODB_URI` y `JWT_SECRET`.
5. Ejecuta `vercel dev` y abre http://localhost:3000.

## Cómo desplegarlo
1. Sube el repositorio a GitHub.
2. En https://vercel.com crea un proyecto desde ese repositorio (Framework: Other).
3. En **Settings > Environment Variables** agrega `MONGODB_URI` y `JWT_SECRET`.
4. Despliega. Cada cambio que subas a la rama `main` se publica automáticamente.

## Estructura
- `public/`: la aplicación (HTML, CSS y JavaScript).
- `api/`: funciones del servidor (registro, inicio de sesión y proyectos).
- `docs/`: manual de usuario y documentación técnica.

## Límites del prototipo
No incluye impuestos, depreciación ni financiación con crédito, y usa flujos anuales constantes ajustados por inflación. Los resultados dependen de los supuestos que ingrese el usuario. Ver el [registro de supuestos](docs/registro-de-supuestos.md).
