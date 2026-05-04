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
- `npm run dev` - Iniciar servidor con nodemon (puerto 5000)
- `npm start` - Iniciar servidor (sin hot reload)
- `npm run seed` - Cargar datos de prueba en la BD (15 usuarios, 13 fiestas, 22 publicaciones)

## Base de datos

Usuarios de prueba:
- **Usuario normal**: `silvia@aquihayfiesta.es` / `Prueba123`
- **Admin**: `admin.fiestas@aquihayfiesta.es` / `Admin123`

Datos incluidos:
- 15 usuarios normales + 2 admins
- 10 fiestas oficiales (San Valentín, Halloween, Navidad, etc.)
- 3 fiestas creadas por usuarios (Moros y Cristianos, Boda, Bando Murcia)
- 22 publicaciones con distintos tipos de contenido

## Arranque rapido recomendado

1. Terminal A (backend):
	- `cd backend`
	- `npm run dev`
2. Terminal B (frontend):
	- `cd frontend`
	- `npm run dev`
3. Abrir la URL que muestre Vite (normalmente `http://localhost:5173` o `http://localhost:5174`)
4. Comprobar backend en `http://localhost:5000/api/health`

## Estado actual

- Estructura separada front/back y comandos dedicados.
- Login y registro del frontend conectados al backend.
- Validaciones basicas en formularios de autenticacion.
- Persistencia local de sesion, idioma, tema y guardados en `localStorage`.

## Siguientes pasos recomendados

- Preparar el despliegue (frontend y backend) en una plataforma gratuita.
- Añadir tests basicos de autenticacion y API.
