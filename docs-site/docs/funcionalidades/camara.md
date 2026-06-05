---
id: camara
title: Cámara y captura
sidebar_position: 1
---

# Cámara y captura de dibujos

## Descripción

La pantalla de cámara permite al usuario fotografiar su dibujo en papel para procesarlo con filtros artísticos de IA. Usa la API `getUserMedia` del navegador para acceder a la cámara trasera del dispositivo.

## Flujo

```
s-camera → [Captura foto] → s-preview → [Confirmar] → s-form
```

## Implementación

### Inicialización de la cámara

```javascript
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' } // cámara trasera
  });
  video.srcObject = stream;
}
```

### Captura de foto

```javascript
function takePhoto() {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
  nav('s-preview');
}
```

### Fallback para móviles sin `getUserMedia`

Si el navegador no soporta la API de cámara (ej. navegadores antiguos de iOS), se activa automáticamente un `<input type="file" accept="image/*" capture="environment">` que abre la cámara nativa del dispositivo.

```javascript
} catch (err) {
  const fileInput = document.getElementById('camera-file-input');
  fileInput.click(); // activa cámara nativa
}
```

## Estados de la cámara

| Estado | Descripción |
|--------|-------------|
| Iniciando | Se solicita permiso al usuario |
| Activa | Stream en vivo en el `<video>` |
| Capturada | Foto almacenada en `capturedImageData` |
| Detenida | `stopCamera()` libera el stream al salir de la pantalla |

:::warning
La cámara se detiene automáticamente al navegar a cualquier otra pantalla, llamando a `stopCamera()` en el hook `onScreenEnter`.
:::
