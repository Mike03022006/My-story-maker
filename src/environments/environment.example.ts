// Este es un archivo de ejemplo para configurar tu entorno
// Copia este archivo como environment.ts y environment.prod.ts
// y completa con tus propias credenciales

export const environment = {
  production: false,
  
  // Configuración de Firebase
  firebaseConfig: {
    apiKey: "TU_API_KEY_DE_FIREBASE",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-XXXXXXXXXX"
  },
  
  // URL del webhook de n8n para generar historias
  // Obtén esta URL después de crear tu workflow en n8n
  n8nWebhookUrl: 'https://tu-instancia-n8n.com/webhook/generate-story',
  
  // Configuración opcional de la app
  app: {
    name: 'Cuentos Mágicos',
    version: '2.0.0',
    maxCharactersPerStory: 3,
    defaultStoryLength: 400, // palabras
    enableImageGeneration: true,
    enableTextToSpeech: true
  }
};
