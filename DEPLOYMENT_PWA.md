# Guía de Despliegue PWA - Daniel Core

## 📱 Implementación Multi-Plataforma

Esta guía explica cómo desplegar Daniel Core como una Progressive Web App (PWA) accesible desde celular, tablet y computador **sin necesidad de Google Play o App Store**.

---

## 🚀 Opción 1: Despliegue en Google Cloud Run (Recomendado)

### Prerrequisitos
- Cuenta de Google Cloud Platform
- `gcloud` CLI instalado
- Servidor GPT-SoVITS accesible públicamente (ver sección "Configuración del Servidor de Voz")

### Pasos de Despliegue

1. **Configurar variables de entorno para producción**

Editar `.env`:
```bash
VITE_VOICE_SERVER_URL=https://tu-servidor-sovits.com
VITE_USE_REMOTE_VOICE=true
```

2. **Desplegar a Cloud Run**

```bash
# Autenticarse
gcloud auth login

# Configurar proyecto
gcloud config set project TU_PROJECT_ID

# Desplegar
gcloud builds submit --config cloudbuild.yaml
```

3. **Obtener la URL de la aplicación**

```bash
gcloud run services describe daniel --region=us-central1 --format='value(status.url)'
```

4. **Configurar dominio personalizado (Opcional)**

```bash
gcloud run domain-mappings create --service daniel --domain tu-dominio.com --region us-central1
```

---

## 🌐 Opción 2: Despliegue en Vercel/Netlify

### Vercel

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Configurar variables de entorno**
```bash
vercel env add VITE_VOICE_SERVER_URL
vercel env add VITE_USE_REMOTE_VOICE
```

3. **Desplegar**
```bash
npm run build
vercel --prod
```

### Netlify

1. **Instalar Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Desplegar**
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 🎤 Configuración del Servidor de Voz

Para que la funcionalidad de voz funcione en dispositivos móviles, necesitas desplegar el servidor GPT-SoVITS en un servidor accesible públicamente.

### Opción A: Google Cloud VM

1. **Crear una VM**
```bash
gcloud compute instances create sovits-server \
  --machine-type=n1-standard-4 \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=50GB
```

2. **Instalar GPT-SoVITS en la VM**
```bash
# SSH a la VM
gcloud compute ssh sovits-server

# Instalar dependencias
sudo apt update
sudo apt install python3-pip git -y

# Clonar e instalar GPT-SoVITS
git clone https://github.com/RVC-Boss/GPT-SoVITS.git
cd GPT-SoVITS
pip3 install -r requirements.txt

# Copiar tus modelos entrenados
# (usar gcloud compute scp o similar)
```

3. **Configurar firewall**
```bash
gcloud compute firewall-rules create allow-sovits \
  --allow tcp:9880 \
  --source-ranges 0.0.0.0/0
```

4. **Ejecutar el servidor**
```bash
python3 api.py
```

5. **Obtener IP pública**
```bash
gcloud compute instances describe sovits-server --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

### Opción B: Servidor Dedicado/VPS

Similar a la opción A, pero en tu proveedor preferido (DigitalOcean, AWS, etc.)

---

## 📲 Instalación en Dispositivos

### Android

1. Abrir Chrome/Edge en el dispositivo
2. Navegar a la URL de tu app (ej: `https://daniel-core.run.app`)
3. Tocar el menú (⋮) → "Agregar a pantalla de inicio"
4. La app aparecerá como una aplicación nativa

**Alternativa:** El prompt de instalación aparecerá automáticamente después de 10 segundos.

### iOS (iPhone/iPad)

1. Abrir Safari en el dispositivo
2. Navegar a la URL de tu app
3. Tocar el botón "Compartir" (□↑)
4. Seleccionar "Agregar a pantalla de inicio"
5. La app aparecerá como una aplicación nativa

### Windows/macOS/Linux

1. Abrir Chrome/Edge
2. Navegar a la URL de tu app
3. Hacer clic en el ícono de instalación (⊕) en la barra de direcciones
4. Confirmar instalación
5. La app se instalará como aplicación de escritorio

---

## 🔧 Configuración Post-Despliegue

### Verificar Funcionalidad PWA

1. **Service Worker registrado**
   - Abrir DevTools → Application → Service Workers
   - Debe aparecer "sw.js" como activo

2. **Manifest válido**
   - Application → Manifest
   - Verificar que todos los campos estén correctos

3. **Íconos cargados**
   - Verificar que `/icon-192.png` y `/icon-512.png` se carguen correctamente

4. **Funcionalidad offline**
   - Activar modo offline en DevTools
   - La app debe seguir funcionando (con limitaciones)

### Permisos Necesarios

La app solicitará los siguientes permisos:

- **Micrófono**: Para reconocimiento de voz
- **Notificaciones** (opcional): Para alertas del Sentinela

---

## 🎯 Características PWA Implementadas

✅ **Instalable** - Se puede agregar a la pantalla de inicio
✅ **Offline** - Funciona sin conexión (caché de recursos estáticos)
✅ **Responsive** - Adaptado a móvil, tablet y desktop
✅ **Rápido** - Service Worker con estrategia de caché optimizada
✅ **Seguro** - Requiere HTTPS
✅ **Actualizable** - Notificación automática de nuevas versiones

---

## 📊 Monitoreo

### Lighthouse Audit

Ejecutar auditoría PWA:

```bash
# Instalar Lighthouse
npm install -g lighthouse

# Ejecutar auditoría
lighthouse https://tu-app.com --view
```

Deberías obtener puntuaciones altas en:
- Performance
- PWA
- Accessibility
- Best Practices

---

## 🐛 Troubleshooting

### La app no se instala

- Verificar que estés usando HTTPS
- Verificar que `manifest.json` sea válido
- Verificar que el Service Worker esté registrado

### El micrófono no funciona en móvil

- Verificar permisos del navegador
- Asegurarse de que estás usando HTTPS
- Verificar que el navegador soporte Web Speech API

### El servidor de voz no responde

- Verificar que `VITE_VOICE_SERVER_URL` esté configurado correctamente
- Verificar que el servidor GPT-SoVITS esté corriendo
- Verificar reglas de firewall

### La app no funciona offline

- Verificar que el Service Worker esté activo
- Revisar la consola para errores de caché
- Verificar que los recursos estén siendo cacheados correctamente

---

## 📝 Notas Importantes

1. **HTTPS es obligatorio** para PWAs (excepto en localhost)
2. **El servidor de voz debe ser accesible públicamente** para funcionar en móviles
3. **Los permisos de micrófono** deben solicitarse en cada sesión en algunos navegadores
4. **iOS Safari** tiene algunas limitaciones con PWAs (sin notificaciones push, etc.)
5. **La instalación es opcional** - la app funciona perfectamente en el navegador

---

## 🔄 Actualizaciones

Para desplegar una nueva versión:

1. Actualizar el código
2. Incrementar versión en `public/manifest.json`
3. Actualizar `CACHE_NAME` en `public/sw.js`
4. Desplegar usando el mismo comando
5. Los usuarios recibirán una notificación de actualización automáticamente

---

## 📞 Soporte

Para problemas o preguntas, revisar:
- Consola del navegador (F12)
- Application → Service Workers
- Application → Manifest
- Network tab para errores de red
