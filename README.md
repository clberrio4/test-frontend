# 🚀 Proyecto Vite + React

Este proyecto está desarrollado con [Vite](https://vitejs.dev/) y [React](https://react.dev/).  
Se ejecuta localmente con unos pocos pasos y se despliega automáticamente en **AWS Amplify** al hacer *push* a la rama configurada (en este caso `master`).

---

## 📦 Requisitos previos

Asegúrate de contar con:

- [Node.js](https://nodejs.org/) **v22.x** o superior (incluye `npm`).
- [Git](https://git-scm.com/).
- **AWS CLI v2** instalado y configurado (`aws --version`).
- Credenciales configuradas: `aws configure` (o usa perfiles con `--profile`).
- Cuenta en **AWS Amplify** con la app y rama conectadas.
- (Opcional para Linux/macOS) [`jq`](https://stedolan.github.io/jq/) para parsear JSON en el script de *deploy*.

> Si trabajas con múltiples cuentas de AWS, se recomienda usar perfiles (e.g. `default`, `amplify`).

---

## 🔧 Instalación y ejecución local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/clberrio4/test-frontend
   cd test-frontend
   ```

2. **Configura las variables de entorno**  
   Crea en la raíz un archivo `.env` con:
   ```env
   # URL base del backend
   VITE_API_URL=https://www.example.com
   ```

3. **Instala dependencias y corre el proyecto**
   ```bash
   npm install
   npm run dev
   ```

---

## ☁️ Despliegue en AWS Amplify

### A) Despliegue **automático** por commits
1. En **AWS Amplify Console**, conecta este repositorio (`clberrio4/test-frontend`).  
2. Selecciona la rama (`master` o `main`) y finaliza el asistente.  
3. Cada *push* a esa rama **disparará un build y deploy** automáticamente.

> Si ya lo tienes conectado, no necesitas más. De todas formas

---

### B) Despliegue **manual** (forzar build con AWS CLI)

Estos scripts inician un **job de tipo RELEASE** en Amplify para la **rama ya conectada** a tu App. No suben artefactos: le piden a Amplify que *buildée* la rama indicada.

#### Variables necesarias

- `AMPLIFY_APP_ID` → ID de la App en Amplify (lo ves en la consola o en la URL).
- `AMPLIFY_BRANCH` → nombre de la rama conectada (ej. `master` o `main`).
- (Opcional) `AWS_PROFILE` → perfil de credenciales (`default` si no indicas nada).

Coloca estos archivos en la **raíz del proyecto**:

### 🪟 `deploy.ps1` (Windows / PowerShell)
> ejecutalo directamente desde powershell (pref): `.\deploy.ps1`

### 🐧 `deploy.sh` (Linux/macOS)

> Dale permisos de ejecución: `chmod +x deploy.sh`

## 🆘 Troubleshooting

- **`AccessDeniedException`** → Revisa permisos del usuario/rol IAM (acciones `amplify:start-job`, `amplify:get-job`, `amplify:get-branch`).  
- **`Branch not found`** → La rama indicada **debe estar conectada** a la App en Amplify Console.  
- **Falla el build** → Inspecciona los logs del job en Amplify (pestaña *Builds*).  
- **`aws: command not found`** → Instala AWS CLI v2 y agrega al `PATH`.  
- **`jq: command not found` (Linux/macOS)** → `sudo apt-get install jq` o `brew install jq`.

---

## 📄 Licencia

MIT — siéntete libre de usar y adaptar.
