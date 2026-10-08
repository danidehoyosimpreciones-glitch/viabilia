# Documentación técnica

## Stack
| Capa | Tecnología | Función |
|---|---|---|
| Interfaz | HTML, CSS y JavaScript (sin framework) | Pantallas, cálculos y dashboard |
| Servidor | Funciones serverless de Vercel (Node.js, módulos ES) | API de autenticación y proyectos |
| Base de datos | MongoDB Atlas (driver `mongodb`) | Usuarios y proyectos |
| Seguridad | `bcryptjs` y `jsonwebtoken` | Contraseñas cifradas y sesiones |
| Despliegue | Vercel conectado a GitHub | Publicación automática desde `main` |

## Arquitectura
```
Navegador (public/js/app.js)
   │  fetch /api/auth, /api/projects  (token JWT en el encabezado Authorization)
   ▼
Funciones de Vercel (api/auth.js, api/projects.js)
   │  driver de MongoDB (conexión reutilizada, api/_db.js)
   ▼
MongoDB Atlas (base "viabilia": colecciones users y projects)
```
Los cálculos de ingeniería económica se hacen en el navegador (`calc()` en `app.js`). El servidor valida, autentica y guarda los datos.

## Endpoints
| Método y ruta | Qué hace |
|---|---|
| `POST /api/auth` con `action: "register"` | Crea la cuenta y devuelve un token |
| `POST /api/auth` con `action: "login"` | Inicia sesión y devuelve un token |
| `POST /api/auth` con `action: "avatar"` | Guarda el avatar elegido (requiere token) |
| `GET /api/projects` | Lista los proyectos del usuario |
| `GET /api/projects?id=...` | Abre un proyecto del usuario |
| `POST /api/projects` | Crea (sin `id`) o actualiza (con `id`) un proyecto |
| `DELETE /api/projects?id=...` | Elimina un proyecto del usuario |

## Modelo de datos
**Colección `users`:** `email` (único), `hash` (contraseña cifrada con bcrypt), `avatar` (0 a 5), `rol` (reservado, hoy todos son "usuario") y `creado`.

**Colección `projects`:**
```json
{
  "uid": "id del usuario dueño",
  "name": "nombre del proyecto",
  "updated": "fecha de la última edición",
  "data": {
    "nombre": "", "benef": "", "desc": "",
    "tmar": 12, "inf": 5,
    "alts": [
      { "nombre": "", "inv": 0, "vida": 5, "salv": 0, "ing": 0, "cos": 0 }
    ]
  }
}
```

## Fórmulas implementadas
Notación: i = TMAR, g = inflación, I = inversión inicial, n = vida útil, S = valor de salvamento, A = ingresos anuales, C = costos anuales.

- **Flujo de caja:** F₀ = −I; Fₜ = (A − C)·(1 + g)ᵗ⁻¹ para t = 1…n; al flujo del año n se le suma S.
- **VPN** = Σ Fₜ / (1 + i)ᵗ, desde t = 0 hasta n.
- **CAUE** = VPN · i / (1 − (1 + i)⁻ⁿ). Si i = 0, CAUE = VPN / n.
- **TIR:** tasa que hace el VPN igual a cero, hallada por bisección entre −99 % y 1000 % con 80 iteraciones. Si el VPN no cambia de signo en ese rango, se muestra "No definida".
- **Periodo de recuperación:** primer año en que el flujo acumulado es positivo, con interpolación lineal dentro del año. Si no ocurre dentro de la vida útil, se muestra "Más de n años".
- **B/C** = [Σ A(1+g)ᵗ⁻¹/(1+i)ᵗ + S/(1+i)ⁿ] / [I + Σ C(1+g)ᵗ⁻¹/(1+i)ᵗ].
- **Regla de decisión:** se recomienda la alternativa con mayor CAUE. Si el mayor CAUE es menor o igual a cero, se indica que no se recomienda invertir.
- **Sensibilidad:** se repite la comparación con la TMAR menos 3, igual y más 3 puntos porcentuales, y se muestra la mejor alternativa de cada escenario.

## Seguridad
- Las contraseñas se guardan cifradas con bcrypt, nunca en texto plano.
- Las sesiones usan JWT con vigencia de 7 días. El token se guarda en el almacenamiento local del navegador.
- Cada consulta a `projects` filtra por el id del usuario, así que nadie puede abrir proyectos ajenos.
- El texto que escribe el usuario se escapa antes de mostrarse en pantalla.
- Las claves (`MONGODB_URI`, `JWT_SECRET`) viven en variables de entorno y no en el repositorio.

## Limitaciones conocidas
- Sin impuestos, depreciación ni financiación con crédito.
- Flujos anuales constantes ajustados por inflación.
- La comparación por CAUE supone que cada alternativa se puede repetir en las mismas condiciones.
- El campo `rol` existe pero todavía no se usa para diferenciar permisos.
