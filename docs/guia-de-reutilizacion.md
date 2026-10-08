# Guía de reutilización: cómo cargar un caso nuevo

Viabilia sirve para cualquier decisión en la que haya que elegir entre alternativas de inversión. No está atada a un solo caso.

## Para cualquier usuario (empresa, curso o comunidad)
1. **Reúne los datos** de cada alternativa: inversión inicial, vida útil en años, valor de salvamento, ingresos anuales y costos anuales. Define también la TMAR y la inflación esperada.
2. Entra a la aplicación y **crea una cuenta**.
3. Dale a **Crear proyecto** y llena la **Ficha** con el nombre, el beneficiario, la descripción de la decisión, la TMAR y la inflación.
4. En **Alternativas** ingresa de 2 a 4 opciones. Debajo de cada valor en pesos aparece el monto con formato, para detectar ceros de más.
5. Abre el **Dashboard**, lee la conclusión y revisa la sensibilidad a la TMAR.
6. Dale a **Guardar proyecto** para consultarlo después, o a **Imprimir o guardar PDF**.

Cada proyecto se guarda por separado en la cuenta, así que un mismo usuario puede cargar varios casos.

## Ejemplos de decisiones que se pueden cargar
- Comprar un equipo nuevo, usado o arrendarlo.
- Reemplazar una máquina ahora o dentro de unos años.
- Escoger entre dos proyectos productivos con distinta duración.

## Para otro grupo que quiera su propia versión
1. Clona el repositorio y sigue los pasos del README (MongoDB Atlas, `.env.local` y Vercel).
2. El proyecto de ejemplo que aparece al crear un proyecto nuevo se define en `public/js/app.js`, en la función `editor`, con las líneas `ALT(...)`. Cámbialo por los valores típicos de tu caso.
3. Los campos de cada alternativa están en la constante `CAMPOS` de `app.js`. Para agregar un dato nuevo, agrégalo ahí y ajusta la función `calc`.
4. Las fórmulas están en `calc` y se describen en la [documentación técnica](documentacion-tecnica.md).
