# 📚 My Story Maker - Creador de Cuentos Infantiles con IA

<div align="center">

![Ionic](https://img.shields.io/badge/Ionic-7.2.0-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

## 🌟 Descripción

**My Story Maker** es una aplicación móvil innovadora que permite a los niños crear sus propias historias personalizadas usando inteligencia artificial. Los niños pueden seleccionar personajes, escenarios y tipos de historia, y la IA genera un cuento único diseñado específicamente para ellos.

### ✨ Características Principales

- 🎨 **Creación Personalizada**: Los niños eligen sus personajes favoritos, lugares mágicos y tipos de aventura
- 🤖 **IA Generativa**: Integración con OpenAI a través de n8n para generar historias únicas
- 🎭 **Perfiles Infantiles**: Cada niño tiene su propio perfil con avatar, edad e intereses
- 📖 **Biblioteca Personal**: Guarda y organiza todas las historias creadas
- 🔊 **Text-to-Speech**: Lee las historias en voz alta con voces naturales
- 🖼️ **Imágenes Ilustrativas**: Cada historia puede incluir imágenes generadas por IA
- 🔒 **Control Parental**: Sistema de seguridad con PIN para proteger el acceso
- 📱 **Multiplataforma**: Disponible para iOS y Android

---

## 🎬 Demo

<div align="center">

### Flujo de Creación de Historia

```
👤 Perfil del Niño → 🎭 Selección de Personajes → 🏰 Elección de Escenario
                                ↓
        📚 Historia Generada con IA ← 🎨 Tipo de Historia
                                ↓
                    🔊 Lectura con Audio + 📖 Texto
```

</div>

---

## 🚀 Comenzando

### Prerequisitos

- Node.js (v18 o superior)
- npm o yarn
- Ionic CLI (`npm install -g @ionic/cli`)
- Android Studio (para compilar en Android)
- Xcode (para compilar en iOS - solo macOS)
- Cuenta de Firebase
- Cuenta de OpenAI
- Cuenta de n8n Cloud (o instalación local)

### 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Mike03022006/My-story-maker.git
   cd My-story-maker/infantil
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```
   
   Edita `environment.ts` con tus credenciales de Firebase:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
     }
   };
   ```

4. **Configura n8n**
   
   Sigue la guía detallada en [`CONEXION_RAPIDA.md`](CONEXION_RAPIDA.md) para:
   - Crear cuenta en n8n Cloud
   - Importar el workflow de generación de historias
   - Configurar credenciales de OpenAI
   - Obtener la URL del webhook

5. **Actualiza la URL de n8n**
   
   Edita `src/app/services/n8n.service.ts`:
   ```typescript
   private n8nWebhookUrl = 'https://tu-instancia.app.n8n.cloud/webhook/generate-story';
   ```

6. **Ejecuta la aplicación**
   ```bash
   ionic serve
   ```

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  Ionic 7 + Angular 17 + TypeScript          │   │
│  │  - Capacitor (Native Features)               │   │
│  │  - RxJS (Reactive Programming)               │   │
│  │  - Web Speech API (Text-to-Speech)           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                   BACKEND                           │
│  ┌──────────────────────────────────────────────┐   │
│  │  Firebase                                    │   │
│  │  - Authentication (Email/Password)           │   │
│  │  - Firestore (NoSQL Database)                │   │
│  │  - Storage (Images)                          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                 AUTOMATION                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  n8n (Workflow Automation)                   │   │
│  │  - Webhook Trigger                           │   │
│  │  - OpenAI Integration (GPT-3.5/GPT-4)        │   │
│  │  - Response Processing                       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Estructura del Proyecto

```
infantil/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── story-reader/    # Lector de historias con TTS
│   │   │   ├── lock-modal/      # Modal de seguridad
│   │   │   └── ...
│   │   ├── pages/               # Páginas de la app
│   │   │   ├── create-story/    # Creación de historias con IA
│   │   │   ├── story-detail/    # Detalle de historia
│   │   │   └── ...
│   │   ├── services/            # Servicios de negocio
│   │   │   ├── n8n.service.ts   # Integración con n8n/OpenAI
│   │   │   ├── auth.service.ts  # Autenticación Firebase
│   │   │   ├── stories.service.ts # Gestión de historias
│   │   │   ├── tts.service.ts   # Text-to-Speech
│   │   │   └── ...
│   │   └── guards/              # Guards de navegación
│   ├── assets/                  # Recursos estáticos
│   └── environments/            # Configuración de entornos
├── android/                     # Proyecto Android nativo
├── firebase.json                # Configuración Firebase
├── firestore.rules             # Reglas de seguridad Firestore
└── n8n-workflow-example.json   # Workflow de n8n
```

---

## 🎨 Funcionalidades Detalladas

### 1. Sistema de Perfiles 👤

- Creación de perfil infantil con:
  - Nombre personalizado
  - Edad (3-12 años)
  - Avatar personalizable
  - Intereses y preferencias
- PIN de seguridad parental
- Múltiples perfiles por dispositivo

### 2. Creador de Historias con IA 🤖

**Paso 1: Selección de Personajes**
- Más de 16 personajes disponibles: dragones, unicornios, astronautas, piratas, etc.
- Hasta 3 personajes por historia
- Interfaz visual intuitiva

**Paso 2: Elección de Escenario**
- 12 escenarios mágicos: bosques, castillos, espacio, océanos, etc.
- Cada escenario tiene su propia atmósfera

**Paso 3: Tipo de Historia**
- 8 tipos diferentes: aventura, fantasía, misterio, humor, etc.
- Cada tipo adapta el tono y estilo narrativo

**Generación con IA**
- Prompt optimizado para historias infantiles
- Generación en 10-30 segundos
- Historias únicas y personalizadas
- Longitud apropiada para la edad del niño

### 3. Biblioteca de Historias 📚

- Vista de tarjetas coloridas
- Búsqueda y filtrado
- Ordenamiento por fecha, favoritos, etc.
- Gestión de historias (editar, eliminar)
- Estadísticas de lectura

### 4. Lector de Historias 📖

- Interfaz de lectura clara y atractiva
- Text-to-Speech integrado:
  - Voces naturales
  - Control de velocidad
  - Pausa/reanudar
  - Resaltado de texto mientras lee
- Imágenes ilustrativas (opcional)
- Modo nocturno para lectura antes de dormir

### 5. Seguridad y Control Parental 🔒

- PIN de 4 dígitos
- Configuración de límites de uso
- Historial de actividades
- Bloqueo de funciones sensibles

---

## 🔧 Configuración Avanzada

### Firebase Security Rules

El proyecto incluye reglas de seguridad para Firestore que aseguran:
- Solo usuarios autenticados pueden leer/escribir
- Los usuarios solo acceden a sus propios datos
- Validación de estructura de datos

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /stories/{storyId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### n8n Workflow

El workflow de n8n incluye:
1. **Webhook Trigger**: Recibe datos de la app
2. **OpenAI Chat Node**: Genera la historia con GPT
3. **Process Response**: Formatea la respuesta
4. **Return Data**: Envía la historia de vuelta a la app

Ver [`n8n-workflow-example.json`](n8n-workflow-example.json) para el workflow completo.

---

## 📱 Compilación para Móviles

### Android

```bash
# Generar build de producción
ionic build --prod

# Sincronizar con Android
ionic cap sync android

# Abrir en Android Studio
ionic cap open android
```

### iOS

```bash
# Generar build de producción
ionic build --prod

# Sincronizar con iOS
ionic cap sync ios

# Abrir en Xcode
ionic cap open ios
```

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run e2e

# Coverage
npm run test:coverage
```

---

## 📊 Costos Estimados

### OpenAI API
- **GPT-3.5-turbo**: ~$0.002 por historia
- **GPT-4**: ~$0.03 por historia

**Ejemplo**: 100 historias/mes con GPT-3.5 = ~$0.20/mes

### Firebase
- **Spark Plan (Gratis)**:
  - 50,000 lecturas/día
  - 20,000 escrituras/día
  - 1 GB almacenamiento
  - Suficiente para desarrollo y pequeña producción

### n8n Cloud
- **Free tier**: 5,000 ejecuciones/mes
- Más que suficiente para uso personal y pequeños proyectos

---

## 🗺️ Roadmap

### Versión Actual (v1.0)
- ✅ Creación de perfiles infantiles
- ✅ Generación de historias con IA
- ✅ Text-to-Speech integrado
- ✅ Biblioteca de historias
- ✅ Control parental

### Próximas Versiones

#### v1.1 (Próximamente)
- [ ] Generación de imágenes con DALL-E
- [ ] Compartir historias con familia
- [ ] Modo offline
- [ ] Más idiomas (inglés, francés)

#### v1.2 (Futuro)
- [ ] Sistema de logros y recompensas
- [ ] Ilustraciones animadas
- [ ] Historias colaborativas (varios niños)
- [ ] Exportar historias como PDF/EPUB

#### v2.0 (Visión)
- [ ] IA de voz personalizada (clonación de voz de los padres)
- [ ] Realidad aumentada para visualizar personajes
- [ ] Juegos interactivos basados en las historias
- [ ] Marketplace de historias de la comunidad

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código del proyecto
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa commits semánticos: `feat:`, `fix:`, `docs:`, etc.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [`LICENSE`](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Miguel Ramirez**

- GitHub: [@Mike03022006](https://github.com/Mike03022006)
- Email: mike03022006@example.com

---

## 🙏 Agradecimientos

- [Ionic Framework](https://ionicframework.com/) - Framework de desarrollo móvil
- [Angular](https://angular.io/) - Framework web
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [OpenAI](https://openai.com/) - IA generativa
- [n8n](https://n8n.io/) - Automatización de workflows
- Comunidad de desarrolladores open source

---

## 📚 Documentación Adicional

- [Guía de Instalación Rápida](CONEXION_RAPIDA.md)
- [Configurar CORS en n8n](CONFIGURAR_CORS_N8N.md)
- [Solución Rápida de CORS](SOLUCION_CORS_RAPIDA.md)
- [Cambiar Modelo de OpenAI](CAMBIAR_MODELO_OPENAI.md)
- [Instalación de Voces TTS](INSTALAR_VOCES_CELULAR.md)
- [Sistema de Suscripciones](SISTEMA_SUSCRIPCIONES.md)

---

## 💬 Soporte

¿Tienes preguntas o problemas? Abre un [issue](https://github.com/Mike03022006/My-story-maker/issues) en GitHub.

---

<div align="center">

### ⭐ Si te gusta este proyecto, dale una estrella en GitHub

**Hecho con ❤️ para los niños que aman las historias**

</div>
