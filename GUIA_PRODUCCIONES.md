# 📚 Guía Completa: Añadir Nuevas Producciones Teatrales

## 🎯 Resumen Rápido

Para añadir una nueva producción necesitas modificar **4 archivos**:
1. `js/productions.js` - Configuración y funciones JavaScript
2. `index.html` - Estructura HTML de la producción y modal
3. Carpeta `images/carrusel/` - Subir las imágenes con nomenclatura correcta
4. *(Opcional)* `css/components.css` - Solo si necesitas estilos específicos

---

## 📁 Convención de Nomenclatura de Imágenes

### Estructura de Carpetas
```
images/
└── carrusel/
    ├── LaCuevaDeSalamanca/
    │   ├── cueva01.jpeg
    │   ├── cueva02.jpeg
    │   └── cueva13.jpeg
    ├── Fuenteovejuna/
    │   ├── fo01.jpg
    │   ├── fo02.jpg
    │   └── fo28.jpg
    └── [TuNuevaProduccion]/
        ├── [prefijo]01.[ext]
        ├── [prefijo]02.[ext]
        └── [prefijo]XX.[ext]
```

### Reglas Importantes
- ✅ **Numeración secuencial**: 01, 02, 03... (con ceros a la izquierda)
- ✅ **Sin huecos**: Si falta la imagen 05, se parará en la 04
- ✅ **Misma extensión**: Todas las imágenes con .jpg, .jpeg o .png
- ✅ **Prefijo consistente**: Todas con el mismo prefijo

### Ejemplos Válidos
```
hamlet01.jpg, hamlet02.jpg, hamlet03.jpg...
bodas01.png, bodas02.png, bodas03.png...
casa01.jpeg, casa02.jpeg, casa03.jpeg...
```

### ❌ Ejemplos Incorrectos
```
hamlet1.jpg, hamlet2.jpg... (falta cero)
hamlet01.jpg, hamlet03.jpg... (falta la 02)
hamlet01.jpg, hamlet02.png... (extensiones mixtas)
```

---

## 🛠️ Pasos para Añadir una Nueva Producción

### Ejemplo: Añadir "Hamlet"

#### 1. Subir Imágenes
Crear carpeta y subir imágenes:
```
images/carrusel/Hamlet/
├── hamlet01.jpg
├── hamlet02.jpg
├── hamlet03.jpg
├── ...
└── hamlet15.jpg
```

#### 2. Configurar JavaScript (`js/productions.js`)

**A. Añadir configuración:**
```javascript
// En productionsConfig, agregar:
hamlet: {
    folder: 'Hamlet',                           // Nombre de la carpeta
    prefix: 'hamlet',                           // Prefijo de archivos
    extension: '.jpg',                          // Extensión de imágenes
    maxImages: 50,                              // Límite de búsqueda
    title: 'Hamlet',                            // Título para alt
    modalId: 'hamletModal',                     // ID único del modal
    sliderSelector: '.production-hero:not(.reverse) .production-slider', // Selector CSS
    index: 0,
    timer: null,
    images: []
}
```

**B. Crear funciones específicas:**
```javascript
// Funciones para Hamlet
function openHamletModal() {
    openModal('hamletModal', 'hamlet');
}

function closeHamletModal(e) {
    closeModal('hamletModal', 'hamlet', e);
}

function hamletModalPrev(e) {
    e.stopPropagation();
    const config = productionsConfig.hamlet;
    const slides = document.querySelectorAll('#hamletModal .modal-slide');
    config.index = (config.index - 1 + slides.length) % slides.length;
    showModalSlide('hamletModal', config.index);
    resetMouseIdleTimer('hamletModal');
}

function hamletModalNext(e) {
    e.stopPropagation();
    const config = productionsConfig.hamlet;
    const slides = document.querySelectorAll('#hamletModal .modal-slide');
    config.index = (config.index + 1) % slides.length;
    showModalSlide('hamletModal', config.index);
    resetMouseIdleTimer('hamletModal');
}

function hamletGoToSlide(e, idx) {
    e.stopPropagation();
    productionsConfig.hamlet.index = idx;
    showModalSlide('hamletModal', idx);
    resetMouseIdleTimer('hamletModal');
}
```

**C. Añadir navegación por teclado:**
```javascript
// En el evento keydown, agregar:
} else if (document.getElementById('hamletModal').classList.contains('active')) {
    if (e.key === 'Escape') {
        closeHamletModal(e);
    } else if (e.key === 'ArrowLeft') {
        hamletModalPrev(e);
    } else if (e.key === 'ArrowRight') {
        hamletModalNext(e);
    }
}
```

**D. Añadir inicialización:**
```javascript
// En DOMContentLoaded, agregar:
await initProduction('hamlet');
```

#### 3. Crear HTML (`index.html`)

**A. Contenedor de la producción:**
```html
<!-- Production Hero para Hamlet -->
<div class="production-hero" onclick="openHamletModal()">
    <div class="production-content">
        <h3>Hamlet</h3>
        <p>El príncipe de Dinamarca enfrenta la venganza, la locura y el destino en esta obra maestra de Shakespeare.</p>
        <span class="production-year">2024</span>
    </div>
    <div class="production-slider">
        <!-- Las imágenes se generan automáticamente -->
    </div>
</div>
```

**B. Modal de la galería:**
```html
<!-- Modal para Hamlet -->
<div id="hamletModal" class="modal" onclick="closeHamletModal(event)">
    <div class="modal-content">
        <button class="close-modal" onclick="closeHamletModal(event)">&times;</button>
        <div class="modal-carousel">
            <!-- Las imágenes se generan automáticamente -->
            <button class="modal-prev" onclick="hamletModalPrev(event)">‹</button>
            <button class="modal-next" onclick="hamletModalNext(event)">›</button>
        </div>
        <div class="modal-indicators">
            <div class="modal-counter">1 / 15</div>
            <div class="modal-dots">
                <!-- Los dots se generan automáticamente -->
            </div>
        </div>
    </div>
</div>
```

---

## 🎨 Layouts Disponibles

### Layout Normal (imagen izquierda, texto derecha)
```html
<div class="production-hero" onclick="openProduccionModal()">
```
```javascript
sliderSelector: '.production-hero:not(.reverse) .production-slider'
```

### Layout Invertido (imagen derecha, texto izquierda)
```html
<div class="production-hero reverse" onclick="openProduccionModal()">
```
```javascript
sliderSelector: '.production-hero.reverse .production-slider'
```

---

## 🔧 Configuraciones Avanzadas

### Cambiar Velocidad de Autoplay
```javascript
// En autoProdSlide(), cambiar 4000ms por el valor deseado:
config.timer = setTimeout(() => autoProdSlide(prodKey), 3000); // 3 segundos
```

### Cambiar Tiempo de Idle de Controles
```javascript
// En resetMouseIdleTimer(), cambiar 500ms:
mouseIdleTimers[modalId] = setTimeout(() => hideModalControls(modalId), 1000); // 1 segundo
```

### Usar Diferentes Extensiones
```javascript
// Imágenes en PNG:
extension: '.png'

// Imágenes en JPEG:
extension: '.jpeg'
```

---

## 🐛 Solución de Problemas

### Las imágenes no aparecen
1. **Verificar nomenclatura**: ¿Tienen ceros a la izquierda? (01, 02, 03...)
2. **Verificar secuencia**: ¿Falta alguna imagen en la secuencia?
3. **Verificar rutas**: ¿La carpeta está en `images/carrusel/`?
4. **Verificar configuración**: ¿Coinciden folder, prefix y extension?

### El modal no se abre
1. **Verificar funciones**: ¿Están creadas las funciones específicas?
2. **Verificar HTML**: ¿El onclick llama a la función correcta?
3. **Verificar modalId**: ¿Coincide en configuración y HTML?

### Errores en consola
1. **Abrir DevTools** (F12) y revisar la consola
2. **Verificar nombres**: ¿Coinciden todas las referencias?
3. **Verificar inicialización**: ¿Está añadida en DOMContentLoaded?

---

## 📋 Checklist para Nueva Producción

- [ ] Imágenes subidas con nomenclatura correcta
- [ ] Configuración añadida en `productionsConfig`
- [ ] 5 funciones específicas creadas
- [ ] Navegación por teclado añadida
- [ ] Inicialización añadida en DOMContentLoaded
- [ ] HTML del production-hero creado
- [ ] HTML del modal creado
- [ ] Probado en navegador

---

## 🎭 Ejemplos de Nombres de Producciones

### Nombres Recomendados
```javascript
// Obras clásicas
hamlet: { folder: 'Hamlet', prefix: 'hamlet' }
macbeth: { folder: 'Macbeth', prefix: 'macbeth' }
otelo: { folder: 'Otelo', prefix: 'otelo' }

// Obras españolas
bodas: { folder: 'BodasDeSangre', prefix: 'bodas' }
casa: { folder: 'LaCasaDeBernardaAlba', prefix: 'casa' }
vida: { folder: 'LaVidaEsSueno', prefix: 'vida' }

// Obras modernas
esperando: { folder: 'EsperandoAGodot', prefix: 'godot' }
muerte: { folder: 'MuerteDeUnViajante', prefix: 'viajante' }
```

### ❌ Evitar
- Espacios en nombres: `la casa` ❌ → `lacasa` ✅
- Caracteres especiales: `año-2024` ❌ → `ano2024` ✅
- Números al inicio: `2024obra` ❌ → `obra2024` ✅

---

¡Con esta guía ya puedes añadir todas las producciones teatrales que quieras! 🎭✨
