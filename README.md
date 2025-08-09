# 🚀 Proyecto Vite + React

Este proyecto está desarrollado con [Vite](https://vitejs.dev/) y [React](https://react.dev/).  
Se ejecuta localmente con unos pocos pasos y se despliega automáticamente en **AWS Amplify**. al hacer commit en master

---

## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: **v22.x** o superior)
- [npm](https://www.npmjs.com/) (viene incluido con Node.js)
- Una cuenta en [AWS Amplify](https://aws.amazon.com/amplify/) para despliegue

---

## 🔧 Instalación y ejecución en local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/clberrio4/test-frontend
   cd test-frontend
2. **Configura las variables de entorno**
    ```bash
    Crea en la raíz del proyecto un archivo .env con la siguiente variable, apuntando a tu backend
    VITE_API_URL=https://www.example.com
3. **instalar dependecias y correr **
   ```bash
   npm install && npm run dev
