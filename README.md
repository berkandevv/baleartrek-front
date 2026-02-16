# BalearTrek Front

Frontend de BalearTrek: aplicación web para explorar excursiones en Baleares, consultar encuentros, ver lugares destacables en mapa y gestionar la cuenta del usuario.

## Estado actual del proyecto

### Navegación y estructura general
- Header global con navegación a Inicio, Excursiones (catálogo), Contacto y FAQ.
- Menú de cuenta para usuarios autenticados con acceso a perfil y cierre de sesión.
- Scroll automático al inicio en cada cambio de ruta.
- Footer global en toda la app.

### Home
- Hero principal con llamada a la acción hacia el catálogo.
- Sección dinámica "Las 5 excursiones más destacadas".
- Criterio de destacadas implementado: orden por `score.average` descendente y selección Top 5.

### Catálogo de excursiones
- Carga de excursiones desde API.
- Visualización solo de excursiones activas (`status === 'y'`).
- Filtros:
  - Islas (multi-selección).
  - Zona (single select).
  - Municipio (single select).
  - Búsqueda por query param `?q=` (nombre, municipio o zona).
- Ordenación:
  - Nombre (A-Z).
  - Mejor valoradas (por media de puntuación).
- Paginación:
  - Tamaño de página fijo (`6`).
  - Navegación con anterior/siguiente y páginas numeradas.
  - Sincronización con query param `?page=`.

### Detalle de excursión
- Carga por número de registro (`regNumber`) y validación de estado.
- Hero de cabecera con imagen, ubicación y métricas.
- Datos mostrados:
  - Nombre, descripción, municipio, isla, zona.
  - Puntuación media y número de valoraciones.
  - Número de encuentros y asistentes.
- Bloques funcionales:
  - Encuentros de la excursión.
  - Lugares destacables.
  - Comentarios publicados.

### Lugares destacables (detalle de excursión)
- Mapa interactivo con Leaflet/OpenStreetMap.
- Marcadores generados desde coordenadas GPS (`lat,lng`).
- Ajuste automático del mapa a los marcadores.
- Lista de lugares con tipo y coordenadas.
- Al pulsar un lugar, se enfoca en el mapa y se abre su popup.

### Encuentros de una excursión
- Listado en carrusel horizontal (drag + botones).
- Información por encuentro:
  - Fecha y hora.
  - Guía asignado.
  - Participantes.
  - Apertura y cierre de inscripción.
- Estado de inscripción:
  - Abierta/cerrada según ventana de fechas (`appDateIni`, `appDateEnd`).
  - Encuentro finalizado según fecha/hora del encuentro.
- Acción de usuario autenticado:
  - Inscribirse.
  - Cancelar asistencia.
  - Bloqueo de acción para el guía del propio encuentro.
- Navegación a ficha individual del encuentro.

### Ficha de encuentro
- Ruta dedicada por `meetingId`.
- Resumen del encuentro con:
  - Código de registro de la excursión.
  - Municipio e isla.
  - Fecha y hora formateadas.
- Organización:
  - Guía principal del encuentro.
- Inscripciones:
  - Estado visual abierta/cerrada.
  - Fechas de apertura y cierre.
  - CTA para inscribirse/cancelar (según estado).
- Participación:
  - Número de asistentes.
  - Número de comentarios.
  - Puntuación media validada.

### Comentarios públicos
- Extracción de comentarios publicados (`status === 'y'`) desde encuentros.
- Ordenación de más reciente a más antiguo.
- Visualización de:
  - Autor.
  - Fecha.
  - Puntuación (0-5 en estrellas).
  - Texto del comentario.
  - Imágenes asociadas (si existen).
- Botón de "mostrar más/menos" en listados largos.

### Autenticación y sesión
- Login contra API (`/api/login`).
- Registro contra API (`/api/register`) con:
  - Nombre.
  - Apellidos.
  - Email.
  - DNI/NIE.
  - Teléfono.
  - Contraseña y confirmación.
- Persistencia de token en `sessionStorage`.
- Carga automática de usuario autenticado (`/api/user`).
- Logout contra API (`/api/logout`) y limpieza de sesión.
- Protección de rutas privadas mediante `ProtectedRoute`.

### Perfil de usuario (zona privada)
- Edición de datos personales:
  - Nombre.
  - Apellidos.
  - DNI/NIE.
  - Teléfono.
  - Email.
- Validaciones de email y DNI/NIE.
- Guardado de perfil contra API.
- Eliminación/desactivación de cuenta (`status: 'n'`) y cierre de sesión.
- Resumen de actividad:
  - Rutas completadas.
  - Valoraciones.
  - Próximos encuentros.

### Mis encuentros / historial (zona privada)
- Carga de encuentros del usuario autenticado.
- Sección de próximos encuentros:
  - Información básica.
  - Guía principal.
  - Botón para cancelar asistencia.
- Sección de historial:
  - Ordenable por más recientes o mejor valorados.
  - Estado de valoración (publicado/pendiente).
  - Puntuación y comentario.
  - Imagen de la valoración si está disponible.

### FAQ
- Sección de preguntas frecuentes con bloques desplegables.
- Incluye:
  - Reglas de inscripción (apertura 1 mes antes y cierre 1 semana antes).
  - Escala de valoración 0-5.
  - Normas de comentarios y moderación.
  - Información de seguro, cancelación y requisitos físicos.

### Contacto
- Formulario de contacto con:
  - Nombre.
  - Correo electrónico.
  - Mensaje.
- Envío mediante `mailto:` con asunto y cuerpo preformateados.

## Stack
- React 19 + Vite
- React Router
- Tailwind CSS
- Leaflet + React Leaflet

## Requisitos
- Node.js (LTS recomendado)
- npm

## Configuración
El frontend consume una API externa. Define la URL base:

- `VITE_API_BASE_URL` (ejemplo: `http://localhost:8000`)
- `VITE_CONTACT_EMAIL` (opcional, correo destino del formulario de contacto)

Archivo `.env` de ejemplo:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_CONTACT_EMAIL=tu-correo@dominio.com
```

## Puesta en marcha

```bash
npm install
npm run dev
```

## Scripts
- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de producción.
- `npm run preview`: previsualización local del build.

## Rutas principales
- `/`: home.
- `/catalogo`: catálogo de excursiones.
- `/treks/:regNumber`: detalle de excursión.
- `/treks/:regNumber/encuentros/:meetingId`: detalle de encuentro.
- `/contacto`: contacto.
- `/faq`: preguntas frecuentes.
- `/login`: inicio de sesión.
- `/registro`: registro de usuario.
- `/perfil`: perfil del usuario (protegida).
- `/perfil/comentarios`: mis encuentros e historial (protegida).

## Estructura del proyecto
- `src/features`: módulos por dominio (`auth`, `catalog`, `content`, `home`, `profile`, `trek-details`).
- `src/features/*/pages`: pantallas de cada dominio.
- `src/features/*/components`: componentes específicos de cada dominio.
- `src/features/*/hooks`: lógica reutilizable de cada dominio.
- `src/features/*/utils`: utilidades de dominio (por ejemplo, en `trek-details`: `attendance`, `comments`, `map`, `meetings`, `view`).
- `src/components`: componentes UI globales compartidos.
- `src/utils`: utilidades transversales (API, fechas, validaciones, HTTP, URLs).
- `src/assets`: recursos estáticos.

## Notas técnicas
- Las imágenes se normalizan con `resolveImageUrl` para soportar rutas relativas de backend.
- Si no hay `VITE_API_BASE_URL`, se intentan resolver URLs tal como llegan.
- El estado de inscripción se calcula en frontend con fechas de inscripción y fecha/hora del encuentro.
