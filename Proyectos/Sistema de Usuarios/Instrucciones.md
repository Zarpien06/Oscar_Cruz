
# React + Node.js Auth System 🔐

Proyecto completo de autenticación (registro/inicio de sesión) con frontend en **React + Vite + TypeScript** y backend en **Node.js + Express + MySQL**. Incluye CRUD completo para usuarios (crear, leer, actualizar, eliminar) con diseño moderno.

---

## 📁 Estructura del Proyecto

```

react-node-auth-project/
│
├── backend/              → Servidor Node.js + Express
│   ├── controllers/      → Lógica de usuarios
│   ├── routes/           → Rutas de la API
│   ├── config/           → Conexión a base de datos
│   ├── middleware/       → Validaciones y auth
│   ├── server.js         → Archivo principal del backend
│   └── .env              → Variables de entorno
│
├── frontend/             → Aplicación React (Vite + TS)
│   ├── src/
│   │   ├── components/   → Componentes React
│   │   ├── pages/        → Páginas (Login, Registro, etc.)
│   │   ├── App.tsx       → Aplicación principal
│   │   └── main.tsx      → Entrada de Vite
│   └── vite.config.ts    → Configuración de Vite
│
└── database/
└── init.sql          → Script SQL para crear la base de datos y tabla usuarios

````

---

## ⚙️ Requisitos

- Node.js (v18 o superior)
- MySQL Server o Workbench
- npm (v9 o superior)

---

## 🛠️ Instalación paso a paso

### 1. Clonar el proyecto

```bash
git clone https://github.com/tu_usuario/react-node-auth-project.git
cd react-node-auth-project
````

---

### 2. Configurar la base de datos (MySQL)

1. Abre MySQL Workbench
2. Ejecuta el script ubicado en: `database/init.sql`
3. Este script crea:

   * Una base de datos llamada `react_auth`
   * Una tabla llamada `usuarios`

---

### 3. Backend (Node.js + Express)

#### 🔽 Instalar dependencias

```bash
cd backend
npm install
```

#### ⚙️ Crear archivo `.env`

Crea un archivo `.env` en la carpeta `backend/` con este contenido:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=react_auth
PORT=3001
```

📌 Cambia los datos según tu configuración MySQL.

#### 🚀 Iniciar el servidor backend

```bash
npm run dev
```

> El backend corre en: `http://localhost:3001`

---

### 4. Frontend (React + Vite + TypeScript)

#### 🔽 Instalar dependencias

```bash
cd frontend
npm install
```

Si da error al iniciar, instala:

```bash
npm install @vitejs/plugin-react react react-dom
npm install -D typescript @types/react @types/react-dom
```

#### 🚀 Iniciar el servidor frontend

```bash
npm run dev
```

> El frontend corre en: `http://localhost:5173`

---

## 🚀 Funcionalidades

* ✅ Registro de usuario
* ✅ Inicio de sesión
* ✅ CRUD de usuarios

  * Crear usuario
  * Ver lista de usuarios
  * Editar usuario
  * Eliminar usuario
* ✅ Estilo moderno y responsivo

---

## 🧪 Endpoints del Backend

* `POST /api/auth/register` → Registro
* `POST /api/auth/login` → Login
* `GET /api/users` → Ver todos los usuarios
* `GET /api/users/:id` → Ver un usuario
* `POST /api/users` → Crear nuevo usuario
* `PUT /api/users/:id` → Actualizar usuario
* `DELETE /api/users/:id` → Eliminar usuario

---

## 🐞 Problemas comunes

### ❌ Access denied for user 'root'@'localhost'

🔧 Solución:

* Asegúrate de que tu `.env` tenga la contraseña correcta de MySQL.

### ❌ Vite plugin react no encontrado

🔧 Solución:

```bash
npm install @vitejs/plugin-react
```

---

## 🧾 Licencia

Este proyecto es libre de usar para propósitos educativos. Puedes modificarlo y adaptarlo a tus necesidades. Si lo usas en producción, considera implementar medidas de seguridad adicionales como JWT, encriptación de contraseñas, validaciones robustas, etc.

---

## ✨ Autor

Desarrollado por Oscar Mauricio Cruz Figueroa.

```


