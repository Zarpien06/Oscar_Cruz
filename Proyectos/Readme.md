# Proyectos Full Stack con React (Vite + TypeScript), Node.js / Python y MySQL

Este repositorio contiene múltiples proyectos **full stack**, que integran:

- **Frontend**: React con Vite y TypeScript (TSX)
- **Backend**: Node.js o Python (Flask)
- **Base de Datos**: MySQL, administrado con Workbench

---

## 🧱 Estructura del Proyecto

```

/frontend        → Proyecto React + Vite + TypeScript (.tsx)
/backend/nodejs  → Servidor con Express.js
/backend/python  → Servidor con Flask
/database        → Archivos .sql para la base de datos

````

---

## ✅ Tecnologías utilizadas

### Frontend
- React
- Vite
- TypeScript (.tsx)
- CSS moderno y responsive

### Backend
- Node.js con Express o Python con Flask
- Comunicación API RESTful

### Base de Datos
- MySQL + Workbench para gestión visual

---

## ⚙️ Requisitos

Antes de iniciar, asegúrate de tener instalado:

- [Node.js (LTS)](https://nodejs.org/)
- [Python 3.x](https://www.python.org/)
- [MySQL](https://dev.mysql.com/downloads/) + opcionalmente [Workbench](https://dev.mysql.com/downloads/workbench/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) o Insomnia para probar tus APIs

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repo.git
cd nombre-del-repo
````

---

### 2. Instalar dependencias

#### Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Esto inicia la app en `http://localhost:5173`.

#### Backend con Node.js

```bash
cd backend/nodejs
npm install
npm start
```

#### Backend con Python

```bash
cd backend/python
pip install -r requirements.txt
python app.py
```

---

### 3. Configurar la Base de Datos

1. Crea una base de datos en MySQL (Workbench recomendado).
2. Importa los archivos `.sql` desde `/database`.
3. Edita las credenciales en:

   * `config.js` (Node.js)
   * `settings.py` o `.env` (Python)

---

## 🧪 Funcionalidades actuales

* ✅ Registro e inicio de sesión con React
* ✅ Validación de formularios en TypeScript
* ✅ Ejemplo de operación matemática (suma) en frontend
* ✅ Control de usuarios simulado (sin backend aún)
* ⏳ API y almacenamiento real en progreso...

---

## 🤝 Contribución

1. Haz fork del repo
2. Crea tu rama: `git checkout -b feature/mi-funcionalidad`
3. Haz tus cambios: `git commit -am 'feat: nueva funcionalidad'`
4. Sube tu rama: `git push origin feature/mi-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia **MIT**.

---

¡Gracias por visitar y contribuir al proyecto! 🚀

```



