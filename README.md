# BalearTrek Front

Frontend de BalearTrek, una plataforma para descubrir rutas de senderismo en las Islas Baleares, consultar detalles de cada trek y gestionar el perfil del usuario.

## Funcionalidades
- Landing con rutas destacadas.
- Catálogo con filtros por isla, municipio y búsqueda por nombre.
- Ficha de trek con información detallada, puntos de interés y reuniones.
- Secciones informativas: FAQ y Contacto.
- Área de perfil con comentarios (rutas protegidas).

## Stack
- React + Vite
- React Router
- Leaflet + React Leaflet
- ESLint

## Requisitos
- Node.js (LTS recomendado)
- npm

## Configuración
El frontend consume una API externa. Define la base de la API con la variable de entorno:

- `VITE_API_BASE_URL` (ejemplo: `http://localhost:8000`)

Puedes crear un archivo `.env` en la raíz del proyecto con:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Scripts útiles
- `npm run dev`: entorno de desarrollo.
- `npm run build`: build de producción.
- `npm run preview`: previsualizar el build.
- `npm run lint`: ejecutar ESLint.

## Estructura principal
- `src/pages`: páginas de la app (home, catálogo, perfil, etc.).
- `src/components`: componentes reutilizables.
- `src/utils`: helpers y utilidades.
- `src/auth`: contexto de autenticación y rutas protegidas.

## Rutas principales
- `/`: inicio
- `/catalogo`: catálogo de treks
- `/treks/:regNumber`: detalle de trek
- `/login`: login
- `/registro`: registro
- `/perfil`: perfil (protegida)
- `/perfil/comentarios`: comentarios (protegida)

## Notas
- Las imágenes de los treks se resuelven contra `VITE_API_BASE_URL` cuando vienen con rutas relativas.
- Si no hay API configurada, se mostrarán rutas relativas tal como llegan.
