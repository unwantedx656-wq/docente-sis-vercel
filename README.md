# Docente SIS - Gestión Pedagógica Offline-First

Sistema avanzado de gestión para docentes peruanos, alineado con el currículo nacional **MINEDU**. Diseñado para funcionar 100% offline con seguridad de grado bancario (AES-256) y asistencia de IA dual (Gemini + Grok).

## ✨ Características Principales

- **Seguridad Máxima**: Encriptación local AES-256-GCM mediante PIN maestro de 6 dígitos. Sin recuperación (Privacidad Total).
- **Modo Offline-First**: Funciona sin internet mediante IndexedDB (Dexie.js). Sincronización automática al detectar conexión.
- **Asistente IA Dual**: 
  - **Gemini 1.5 Flash**: Generación de sesiones y unidades didácticas.
  - **Grok (xAI)**: Validación estricta de alineación curricular y pertinencia pedagógica.
- **Contexto MINEDU**: Incluye base de datos local del currículo nacional para RAG (Retrieval Augmented Generation).
- **Gestión Integral**: Cursos, Unidades, Sesiones, Alumnos e Incidencias Disciplinarias.
- **PWA**: Instalable en Android, iOS y Escritorio.

## 🚀 Despliegue en Vercel

1. **Clonar el repositorio**.
2. **Configurar Variables de Entorno** en el Dashboard de Vercel:
   - `GEMINI_API_KEY`: Tu clave de Google AI Studio.
   - `GROK_API_KEY`: Tu clave de X.AI API.
3. **Comando de Build**: `npm run build`
4. **Directorio de Salida**: `dist`

## 🛠️ Tecnologías

- **Frontend**: React + Vite + TypeScript.
- **Estilos**: TailwindCSS + Framer Motion (Premium UI).
- **Base de Datos**: IndexedDB + Dexie.js.
- **Seguridad**: Web Crypto API.
- **Backend**: API Routes (Vercel Serverless Functions).

---
Desarrollado por **Marcial Gutiérrez**  
Contacto: marcialgutierrez607@gmail.com
