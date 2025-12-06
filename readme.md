# AWS Cloud Practitioner - Video Player (React + TypeScript)

Aplicación de reproductor de videos para el curso AWS Certified Cloud Practitioner, migrada de HTML/JavaScript vanilla a React con TypeScript.

## 🚀 Características

- ✅ **React + TypeScript**: Arquitectura moderna y type-safe
- ✅ **Diseño Netflix-like**: Interfaz oscura con carruseles horizontales
- ✅ **Búsqueda en tiempo real**: Filtra videos por nombre o módulo
- ✅ **Reproducción automática**: Cola de videos con auto-play
- ✅ **Progreso guardado**: Retoma desde donde lo dejaste (localStorage)
- ✅ **Navegación de videos**: Siguiente/Anterior en el reproductor
- ✅ **Responsive**: Funciona en móvil, tablet y desktop
- ✅ **Streaming de videos**: Soporte para range requests

## 📁 Estructura del Proyecto

```
cloud practitioner/
├── certified-cloud-practitioner-aws/  # Carpeta con videos
├── react-app/                         # Aplicación React
│   ├── src/
│   │   ├── components/               # Componentes UI
│   │   │   ├── Header/
│   │   │   ├── VideoCard/
│   │   │   ├── VideoSection/
│   │   │   ├── VideoGrid/
│   │   │   └── VideoPlayer/
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useVideoData.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useVideoPlayer.ts
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # Funciones helper
│   │   ├── App.tsx                   # Componente principal
│   │   └── main.tsx                  # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server.js                          # Servidor Node.js
├── videos-data.json                   # Metadata de videos
└── index.html                         # HTML original (backup)
```

## 🛠️ Instalación y Uso

### Modo Desarrollo

1. **Iniciar el servidor Node.js** (en una terminal):
```bash
node server.js
```
Esto iniciará el servidor en `http://localhost:8000`

2. **Iniciar el dev server de React** (en otra terminal):
```bash
cd react-app
npm run dev
```
Esto iniciará Vite en `http://localhost:3000`

3. **Abrir en el navegador**:
Visita `http://localhost:3000`

> **Nota**: El proxy de Vite redirige las peticiones de videos y JSON al servidor en puerto 8000.

### Modo Producción

1. **Construir la aplicación React**:
```bash
cd react-app
npm run build
```

2. **Iniciar el servidor**:
```bash
cd ..
node server.js
```

3. **Abrir en el navegador**:
Visita `http://localhost:8000`

El servidor detectará automáticamente el build de React y lo servirá.

## 🎯 Funcionalidades

### Búsqueda
- Escribe en el campo de búsqueda para filtrar videos
- Busca por nombre de video o nombre de módulo
- Los resultados se actualizan en tiempo real

### Reproducción
- Click en cualquier video para reproducir
- El reproductor se abre en modo modal
- Auto-play del siguiente video al terminar
- Navegación: botones "Anterior" y "Siguiente"

### Progreso
- El progreso se guarda automáticamente cada 5 segundos
- Al recargar la página, se restaura el último video
- Se guarda la posición exacta de reproducción

### Carruseles
- Desplazamiento horizontal de videos
- Botones de navegación ← →
- Efectos de fade en los extremos
- Responsive en todos los dispositivos

## 🔧 Tecnologías Utilizadas

- **React 18**: Librería UI
- **TypeScript**: Type safety
- **Vite**: Build tool y dev server
- **CSS Modules**: Estilos componentes
- **Node.js**: Servidor backend
- **HTML5 Video**: Reproductor nativo

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## ⚙️ Configuración

### Vite Proxy
El archivo `vite.config.ts` configura el proxy para desarrollo:

```typescript
server: {
  port: 3000,
  proxy: {
    '/videos-data.json': 'http://localhost:8000',
    '/certified-cloud-practitioner-aws': 'http://localhost:8000',
  },
}
```

### Servidor Node.js
- Puerto: 8000
- Soporta range requests para videos
- Sirve React build en producción
- Fallback a HTML original si no hay build

## 📱 Responsive Design

La aplicación es completamente responsive:

- **Desktop** (>768px): Vista completa con múltiples videos por fila
- **Tablet** (768px-480px): Vista adaptada
- **Mobile** (<480px): Vista optimizada para móvil

## 🎨 Temas y Estilos

- **Tema oscuro**: Paleta Netflix-like
- **Colores principales**: 
  - Fondo: `#071018`
  - Acento: `#e50914` (rojo)
  - Texto: `#e6eef8`
- **Tipografía**: Inter, Segoe UI
- **Animaciones**: Transiciones suaves en hover y navegación

## 🚦 Estado del Proyecto

✅ **Migración completada**
- Todos los componentes implementados
- Custom hooks funcionando
- Estilos migrados
- Servidor actualizado
- Proxy configurado

🔜 **Próximos pasos (opcional)**:
- Tests unitarios con Vitest
- Tests E2E con Playwright
- Mejoras de accesibilidad
- PWA support

## 📄 Licencia

Proyecto personal para el curso AWS Certified Cloud Practitioner.

---

**Autor**: RL  
**Fecha**: Diciembre 2024
