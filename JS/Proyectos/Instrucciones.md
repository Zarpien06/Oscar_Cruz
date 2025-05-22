# 🚀 Parte lógica de un proyecto “Backend” con JavaScript (Node.js)

Este proyecto usa **Express**, **MySQL**, **body-parser** y **nodemon** para crear un servidor backend básico en Node.js.

---

## 🛠️ PASOS PARA CREAR EL BACKEND EN NODE.JS

### ✅ 1. Crear la carpeta del proyecto

```bash
mkdir backend
cd backend
````

---

### ✅ 2. Inicializar el proyecto con Node.js

```bash
npm init -y
```

> Esto crea automáticamente un archivo `package.json` básico.

---

### ✅ 3. Instalar dependencias principales

```bash
npm install express mysql body-parser --save
```

---

### ✅ 4. Instalar `nodemon` para desarrollo

```bash
npm install nodemon --save-dev
```

---

### ✅ 5. Crear archivo principal del proyecto

```bash
touch index.js
```

> Si estás en Windows y `touch` no funciona, puedes usar:

```bash
echo. > index.js
```

---

### ✅ 6. Agregar código básico en `index.js`

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
```

---

### ✅ 7. Configurar script en `package.json`

Abre el archivo `package.json` y en la sección `"scripts"`, agrega lo siguiente:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

### ✅ 8. Ejecutar el servidor en modo desarrollo

```bash
npm run dev
```

---

### ✅ Resultado esperado

En consola deberías ver:

```
Servidor corriendo en http://localhost:3000
```

Y si visitas `http://localhost:3000/` en tu navegador, verás:

```
Servidor backend funcionando
```

---

🎉 ¡Listo! Ahora tienes la base funcional de un backend en Node.js.

```



