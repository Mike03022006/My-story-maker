# 🔊 Cómo Instalar Voces en el Celular

## 📱 ANDROID

### **Método 1: Google Text-to-Speech (Recomendado)**

#### **Paso 1: Verificar si está instalado**
1. Abre **Configuración** (⚙️)
2. Busca **"Idioma y entrada"** o **"Sistema"**
3. Toca **"Idioma y entrada"**
4. Busca **"Salida de texto a voz"** o **"Text-to-speech"**
5. Verifica que esté **"Motor de síntesis de voz de Google"**

#### **Paso 2: Instalar voces en español**
1. En **"Salida de texto a voz"**, toca el ícono de **⚙️** junto a **"Motor de síntesis de voz de Google"**
2. Toca **"Instalar datos de voz"**
3. Busca **"Español"** en la lista
4. Descarga las siguientes voces:
   - **Español (España)** - Voz femenina/masculina
   - **Español (Estados Unidos)** - Voz femenina/masculina
   - **Español (México)** - Voz femenina/masculina (opcional)

#### **Paso 3: Configurar como predeterminado**
1. Vuelve a **"Salida de texto a voz"**
2. Selecciona **"Motor de síntesis de voz de Google"** como motor predeterminado
3. Selecciona **"Español"** como idioma predeterminado
4. Ajusta la **velocidad** (normal o más lento)

#### **Paso 4: Probar**
1. En la misma pantalla, toca **"Escuchar un ejemplo"**
2. Deberías escuchar una voz en español
3. Si no funciona, reinicia el celular

---

### **Método 2: Desde Google Play Store**

1. Abre **Google Play Store**
2. Busca **"Google Text-to-Speech"**
3. Asegúrate de que esté **actualizado** (última versión)
4. Abre la app
5. Toca **"Instalar datos de voz"**
6. Descarga **"Español (España)"** o **"Español (Estados Unidos)"**

---

## 🍎 iOS (iPhone/iPad)

### **Paso 1: Activar VoiceOver o Leer pantalla**

#### **Opción A: Configurar voces de Siri**
1. Abre **Ajustes** (⚙️)
2. Ve a **"Siri y Buscar"**
3. Toca **"Idioma"**
4. Selecciona **"Español (España)"** o **"Español (México)"**
5. Toca **"Voz de Siri"**
6. Selecciona una voz (Masculina o Femenina)
7. Espera a que se descargue (puede tardar unos minutos)

#### **Opción B: Configurar voces de Accesibilidad**
1. Abre **Ajustes** (⚙️)
2. Ve a **"Accesibilidad"**
3. Toca **"Contenido hablado"**
4. Toca **"Voces"**
5. Toca **"Español"**
6. Descarga las voces disponibles:
   - **Mónica (España)** - Voz femenina
   - **Jorge (España)** - Voz masculina
   - **Paulina (México)** - Voz femenina
   - **Juan (México)** - Voz masculino

#### **Paso 2: Activar "Leer pantalla"**
1. En **"Accesibilidad"** → **"Contenido hablado"**
2. Activa **"Leer pantalla"**
3. Activa **"Leer selección"**
4. Ajusta la **velocidad de lectura**

#### **Paso 3: Probar**
1. Abre Safari o cualquier app con texto
2. Desliza con **dos dedos desde arriba** hacia abajo
3. Deberías escuchar el texto en español

---

## 🌐 PROBAR EN EL NAVEGADOR

### **Android - Chrome**
1. Abre **Chrome**
2. Ve a tu app: `http://localhost:8100` o la URL de tu app
3. Crea una historia
4. Toca el botón **🔊 Escuchar historia**
5. Debería reproducirse con la voz instalada

### **iOS - Safari**
1. Abre **Safari**
2. Ve a tu app
3. Crea una historia
4. Toca el botón **🔊 Escuchar historia**
5. **IMPORTANTE**: En iOS, la primera vez puede pedir permiso

---

## ⚠️ PROBLEMAS COMUNES

### **Problema 1: No se escucha nada**

**Android**:
1. Verifica que el volumen multimedia esté alto (no el volumen de llamada)
2. Verifica que Google Text-to-Speech esté actualizado
3. Reinicia el celular
4. Vuelve a descargar las voces en español

**iOS**:
1. Verifica que las voces estén completamente descargadas
2. Ve a Ajustes → Accesibilidad → Contenido hablado → Voces
3. Elimina y vuelve a descargar la voz en español
4. Reinicia el iPhone

---

### **Problema 2: Habla en inglés en lugar de español**

**Android**:
1. Ve a Configuración → Idioma y entrada → Salida de texto a voz
2. Toca el ícono ⚙️ junto al motor de Google
3. Selecciona **"Español"** como idioma predeterminado
4. Reinicia la app

**iOS**:
1. Ve a Ajustes → Accesibilidad → Contenido hablado → Voces
2. Cambia el orden de las voces (arrastra español hacia arriba)
3. Elimina las voces en inglés si no las necesitas

---

### **Problema 3: La voz suena robótica o cortada**

**Solución**:
1. Descarga voces de **mejor calidad** (Enhanced o Premium)
2. En Android: Motor de Google → Instalar datos de voz → Busca voces "Enhanced"
3. En iOS: Descarga voces de mayor tamaño (las que tienen más MB)

---

### **Problema 4: No funciona en el navegador del celular**

**Android - Chrome**:
1. Abre Chrome
2. Ve a Configuración (⋮) → Configuración del sitio → Permisos
3. Asegúrate de que el sitio tenga permisos de audio
4. Limpia la caché de Chrome

**iOS - Safari**:
1. Safari tiene limitaciones con Web Speech API
2. **Solución**: Usa la app como PWA (Progressive Web App)
3. O instala la app con Capacitor (app nativa)

---

## 🔧 VERIFICAR QUE FUNCIONA

### **Prueba rápida en Android**:
```
1. Abre Google Assistant (mantén presionado el botón de inicio)
2. Di "Configurar Text-to-Speech"
3. Sigue las instrucciones
4. Prueba diciendo "Lee esto: Hola, soy una voz en español"
```

### **Prueba rápida en iOS**:
```
1. Abre Notas
2. Escribe "Hola, esta es una prueba"
3. Selecciona el texto
4. Toca "Hablar" en el menú
5. Deberías escuchar la voz en español
```

---

## 📊 VOCES RECOMENDADAS

### **Android (Google Text-to-Speech)**:
| Voz | Idioma | Calidad | Tamaño |
|---|---|---|---|
| **Español (España)** | es-ES | Alta | ~50 MB |
| **Español (Estados Unidos)** | es-US | Alta | ~50 MB |
| **Español (México)** | es-MX | Media | ~30 MB |

### **iOS (Voces de Apple)**:
| Voz | Idioma | Calidad | Tamaño |
|---|---|---|---|
| **Mónica** | es-ES | Premium | ~200 MB |
| **Jorge** | es-ES | Premium | ~200 MB |
| **Paulina** | es-MX | Premium | ~200 MB |
| **Juan** | es-MX | Premium | ~200 MB |

---

## 🎯 CONFIGURACIÓN RECOMENDADA

### **Para la mejor experiencia**:

**Android**:
- Motor: **Google Text-to-Speech**
- Idioma: **Español (España)** o **Español (Estados Unidos)**
- Velocidad: **Normal** (1.0x)
- Tono: **Normal**

**iOS**:
- Voz: **Mónica (España)** o **Paulina (México)**
- Velocidad: **Normal** (50%)
- Calidad: **Premium** (descarga completa)

---

## 🚀 DESPUÉS DE INSTALAR

1. **Reinicia tu celular** (importante)
2. **Abre tu app** en el navegador
3. **Crea una historia** con plan Basic o Premium
4. **Toca el botón 🔊** para escuchar
5. **Ajusta el volumen** multimedia (no el de llamada)

---

## 💡 TIPS ADICIONALES

### **Para Android**:
- Si usas Samsung, también puedes instalar **"Samsung Text-to-Speech"**
- Algunas marcas tienen sus propios motores TTS (Xiaomi, Huawei, etc.)
- Siempre usa el motor de **Google** para mejor compatibilidad

### **Para iOS**:
- Las voces Premium suenan mucho mejor que las básicas
- Descarga las voces cuando estés conectado a WiFi (son grandes)
- Puedes tener múltiples voces instaladas y cambiar entre ellas

### **Para ambos**:
- Mantén el sistema operativo actualizado
- Mantén el navegador actualizado (Chrome en Android, Safari en iOS)
- Si la app está instalada como PWA o app nativa, funcionará mejor

---

## 📞 SOPORTE

Si después de seguir estos pasos aún no funciona:

1. **Verifica tu dispositivo**:
   - Android: Versión 5.0 o superior
   - iOS: Versión 12.0 o superior

2. **Verifica el navegador**:
   - Android: Chrome 60+ o Firefox 62+
   - iOS: Safari 14.5+

3. **Prueba en otro navegador**:
   - Android: Prueba Firefox o Edge
   - iOS: Safari es el único que funciona bien

4. **Considera instalar la app nativa**:
   - Con Capacitor, la app funcionará como app nativa
   - Mejor rendimiento y compatibilidad
   - Acceso a todas las voces del sistema

---

## ✅ CHECKLIST

- [ ] Voces en español instaladas
- [ ] Motor TTS configurado correctamente
- [ ] Idioma predeterminado: Español
- [ ] Volumen multimedia alto
- [ ] Permisos de audio habilitados
- [ ] Navegador actualizado
- [ ] Celular reiniciado
- [ ] Prueba realizada en la app

---

¡Listo! Ahora deberías poder escuchar las historias en tu celular. 🎉🔊

**Tiempo estimado**: 5-10 minutos
**Dificultad**: Fácil
**Costo**: Gratis
