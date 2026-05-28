# AquiHayFiesta_UA

Proyecto de la asignatura Usabilidad y Accesibilidad del Grado en Ingenieria Multimedia.

Aplicacion web sobre eventos y festividades con:
- Frontend en React + Vite.
- Backend en Express + MongoDB.

## Estructura del repositorio

```
AquiHayFiesta_UA/
├── frontend/               # React + Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeds/
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── config/
└── README.md
```

## Requisitos

- Node.js 18+
- npm
- MongoDB local o Atlas

## Configuracion

### Frontend
```bash
cd frontend
cp .env.example .env
# Revisar VITE_API_URL (por defecto: http://localhost:5000/api)
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env
# Configurar MONGODB_URI y JWT_SECRET
npm install
npm run dev
```

## Comandos

### Frontend (`frontend/`)
- `npm install` - Instalar dependencias
- `npm run dev` - Iniciar servidor de desarrollo (Vite en localhost:5173)
- `npm run build` - Build para producción
- `npm run preview` - Ver build producción localmente

### Backend (`backend/`)
- `npm install` - Instalar dependencias
- `npm install express-rate-limit` - middleware para Express. Limita el número de peticiones que un cliente puede hacer a la API en un período de tiempo determinado.
- `npm run dev` - Iniciar servidor con nodemon (puerto 5000)
- `npm start` - Iniciar servidor

## Base de datos

Usuarios de prueba:
- **Usuario normal**: `carlos@aquihayfiesta.es` / `Prueba123`
- **Admin**: `admin.fiestas@aquihayfiesta.es` / `Admin123`

## Arranque rapido recomendado

1. Terminal A (backend):
	- `cd backend`
	- `npm start`
2. Terminal B (frontend):
	- `cd frontend`
	- `npm run dev`
3. Abrir la URL que muestre Vite (normalmente `http://localhost:5173` o `http://localhost:5174`)
4. Comprobar backend en `http://localhost:5000/api/health`

## OTRA OPCIÓN:
Ver la app desplegada en [htt](https://aquihayfiesta.onrender.com/)