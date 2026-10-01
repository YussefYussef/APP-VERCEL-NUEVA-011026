# IdeaForge - Generador de Productos con IA

Aplicación completa con encabezado interactivo **TechText** en Canvas 2D y motor de generación de 3 ideas de productos físicos, digitales o híbridos basadas en 2 preguntas clave.

## 🚀 Despliegue en Vercel

Esta aplicación está completamente preparada para Vercel:
- **Frontend**: Vite + React + Tailwind CSS v4.
- **Backend**: Funciones Serverless en `/api/generate-ideas.ts` y `/api/expand-idea.ts`.
- **Configuración de rutas**: `vercel.json` incluido con rewrites automáticos para SPA y Serverless.

### Opción 1: Desplegar desde GitHub (Recomendado)
1. Descomprime el archivo `.zip` o clona tu repositorio en GitHub.
2. Ve a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..."** > **"Project"**.
4. Importa tu repositorio de GitHub.
5. Vercel detectará automáticamente **Vite**.
6. En **Environment Variables**, añade:
   - `GEMINI_API_KEY`: Tu clave de Google Gemini (opcional pero recomendado; si no se especifica, la app usa el generador inteligente integrado).
7. Haz clic en **Deploy**.

### Opción 2: Desplegar con Vercel CLI
En la carpeta del proyecto descomprimido:
```bash
npm i -g vercel
vercel
```

### Ejecutar localmente
```bash
npm install
npm run dev
```
La aplicación correrá en `http://localhost:3000`.
