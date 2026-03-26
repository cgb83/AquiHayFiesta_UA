# AquiHayFiesta_UA

Proyecto de la asignatura Usabilidad y Accesibilidad del Grado en Ingenieria Multimedia.

Aplicacion web sobre eventos y festividades con:
- Frontend en React + Vite.
- Backend en Express + MongoDB.

## Estructura del repositorio

- Frontend (raiz):
	- `src/`
	- `package.json`
- Backend:
	- `aquihayfiesta-backend/aquihayfiesta-backend/src/`
	- `aquihayfiesta-backend/aquihayfiesta-backend/package.json`

## Requisitos

- Node.js 18+
- npm
- MongoDB local o Atlas

## Configuracion

1. Frontend (raiz):
	 - Copiar `.env.example` a `.env`
	 - Revisar `VITE_API_URL` (por defecto `http://localhost:5000/api`)

2. Backend:
	 - Ir a `aquihayfiesta-backend/aquihayfiesta-backend/`
	 - Copiar `.env.example` a `.env`
	 - Configurar `MONGODB_URI` y `JWT_SECRET`

## Comandos

En la raiz del proyecto:

- `npm install`
- `npm run dev` (frontend)
- `npm run dev:frontend` (frontend)
- `npm run dev:backend` (backend)
- `npm run build` (build frontend)

En backend (`aquihayfiesta-backend/aquihayfiesta-backend`):

- `npm install`
- `npm run dev`
- `npm start`
- `npm run seed` (carga 3 usuarios de prueba y 20 fiestas)

## Arranque rapido recomendado

1. Terminal A (backend): `npm run dev:backend`
2. Terminal B (frontend): `npm run dev:frontend`
3. Abrir la URL que muestre Vite (normalmente `http://localhost:5173` o `http://localhost:5174`)
4. Comprobar backend en `http://localhost:5000/api/health`

## Estado actual

- Estructura separada front/back y comandos dedicados.
- Login y registro del frontend conectados al backend.
- Validaciones basicas en formularios de autenticacion.
- Persistencia local de sesion, idioma, tema y guardados en `localStorage`.

## Siguientes pasos recomendados

- Conectar listados y detalle de fiestas a la API (`/api/fiestas`).
- Conectar guardados/publicaciones al backend para eliminar datos mock.
- Añadir tests de integracion de autenticacion.
