// ===============================
// Carrusel de imágenes con dots y auto-focus
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todos los carruseles de la página
  document.querySelectorAll('.carrusel-container').forEach(container => {
    // --- Elementos principales del carrusel ---
    const track   = container.querySelector('.carrusel-images');
    const slides  = track ? Array.from(track.children) : [];
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');
    const dotsNav = container.querySelector('.dots');
    if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

    let slideWidth;       // Ancho en px de cada slide
    let currentIndex = 0; // Índice de la slide activa

    // --- 1) Recalcula anchos para pantallas fluidas ---
    function recalcSizes() {
      slideWidth = container.clientWidth; // Ancho real del contenedor
      track.style.width = `${slideWidth * slides.length}px`;
      slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
      });
      moveTo(currentIndex, false); // Reposiciona sin animación
    }

    // --- 2) Mueve la pista al slide indicado ---
    function moveTo(idx, animate = true) {
      currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
      track.style.transition = animate
        ? 'transform 0.5s ease-in-out'
        : 'none';
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      updateDots();
    }

    // --- 3) Crea y actualiza los dots de navegación ---
    if (dotsNav) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => moveTo(i));
        dotsNav.appendChild(dot);
      });
    }
    function updateDots() {
      if (!dotsNav) return;
      dotsNav.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === currentIndex)
      );
    }

    // --- 4) Botones de navegación y control por teclado (con foco) ---
    prevBtn.addEventListener('click', () => moveTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => moveTo(currentIndex + 1));

    // Permite control por teclado solo cuando el carrusel tiene el foco
    container.tabIndex = 0;
    container.addEventListener('mouseenter', () => container.focus());
    container.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  moveTo(currentIndex - 1);
      if (e.key === 'ArrowRight') moveTo(currentIndex + 1);
    });

    // --- 5) Ajuste automático en resize ---
    window.addEventListener('resize', recalcSizes);

    // --- Inicialización del carrusel ---
    recalcSizes();
    moveTo(0, false);
  });
});

// ===============================
// AUTO-FOCUS: Da el foco al carrusel más visible en pantalla
// ===============================
const carContainers = Array.from(document.querySelectorAll('.carrusel-container'));
carContainers.forEach(c => c._visRatio = 0);

const io = new IntersectionObserver(entries => {
  // Actualiza el ratio de visibilidad de cada carrusel
  entries.forEach(e => e.target._visRatio = e.intersectionRatio);

  // Busca el carrusel más visible
  let max = 0, best = null;
  carContainers.forEach(c => {
    if (c._visRatio > max) {
      max = c._visRatio;
      best = c;
    }
  });

  // Da el foco sin desplazar la página si cambia el más visible
  if (best && document.activeElement !== best) {
    best.focus({ preventScroll: true });
  }
}, {
  threshold: [0, 0.25, 0.5, 0.75, 1]  // Dispara al cruzar estos umbrales
});

// Observa cada carrusel
carContainers.forEach(c => io.observe(c));

// ===============================
// ACORDEÓN: Funcionalidad para abrir/cerrar secciones
// ===============================
function toggleAccordion(element) {
  const parent = element.parentElement;
  const content = parent.querySelector(".accordion-content");
  const isOpen = parent.classList.contains("open");

  // Cierra todos los acordeones
  document.querySelectorAll(".accordion-item").forEach(item => {
    item.classList.remove("open");
    item.querySelector(".accordion-content").style.display = "none";
  });

  // Abre el acordeón actual si estaba cerrado
  if (!isOpen) {
    parent.classList.add("open");
    content.style.display = "block";
  }
}


let prodIndex = 0;
let prodTimer = null;
const prodImgs = document.querySelectorAll('.production-slider img');
function showProdSlide(idx) {
  prodImgs.forEach((img, i) => img.classList.toggle('active', i === idx));
}
function autoProdSlide() {
  prodIndex = (prodIndex + 1) % prodImgs.length;
  showProdSlide(prodIndex);
  prodTimer = setTimeout(autoProdSlide, 2000);
}
if(prodImgs.length) {
  showProdSlide(0);
  prodTimer = setTimeout(autoProdSlide, 2000);
}

// Modal
function openProductionModal() {
  document.getElementById('productionModal').classList.add('active');
  showModalSlide(prodIndex);
}
function closeProductionModal(e) {
  if (!e || e.target === document.getElementById('productionModal') || e.target.classList.contains('close-modal')) {
    document.getElementById('productionModal').classList.remove('active');
  }
}
let modalIndex = 0;
const modalSlides = document.querySelectorAll('.modal-slide');
function showModalSlide(idx) {
  modalIndex = idx;
  modalSlides.forEach((img, i) => img.classList.toggle('active', i === idx));
}
function modalPrev(e) {
  e.stopPropagation();
  modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length;
  showModalSlide(modalIndex);
}
function modalNext(e) {
  e.stopPropagation();
  modalIndex = (modalIndex + 1) % modalSlides.length;
  showModalSlide(modalIndex);
}

// ===============================
// PRODUCTION HEROES: Sistema optimizado para múltiples producciones
// ===============================
const productions = {
  cueva: {
    sliderSelector: '.production-hero:not(.reverse) .production-slider img',
    modalId: 'productionModal',
    modalSlides: '.modal-slide',
    index: 0,
    timer: null
  },
  fuenteovejuna: {
    sliderSelector: '.production-hero.reverse .production-slider img',
    modalId: 'fuenteovejunaModal', 
    modalSlides: '.fuenteovejuna-modal-slide',
    index: 0,
    timer: null
  }
};

// Inicializar cada producción
Object.keys(productions).forEach(key => {
  const prod = productions[key];
  const imgs = document.querySelectorAll(prod.sliderSelector);
  
  if (imgs.length > 0) {
    prod.images = imgs;
    showSlide(key, 0);
    prod.timer = setTimeout(() => autoSlide(key), 4000); // 4 segundos - más lento
  }
});

function showSlide(prodKey, idx) {
  const prod = productions[prodKey];
  if (!prod.images) return;
  
  prod.index = idx;
  prod.images.forEach((img, i) => img.classList.toggle('active', i === idx));
}

function autoSlide(prodKey) {
  const prod = productions[prodKey];
  if (!prod.images) return;
  
  prod.index = (prod.index + 1) % prod.images.length;
  showSlide(prodKey, prod.index);
  prod.timer = setTimeout(() => autoSlide(prodKey), 4000); // 4 segundos
}

// Funciones para modales
function openProductionModal() {
  openModal('cueva');
}

function openFuenteovejunaModal() {
  openModal('fuenteovejuna');
}

function openModal(prodKey) {
  const prod = productions[prodKey];
  const modal = document.getElementById(prod.modalId);
  if (modal) {
    modal.classList.add('active');
    showModalSlide(prodKey, prod.index);
    setupModalControls(modal);
    clearTimeout(prod.timer); // Pausa el autoplay
  }
}

function closeProductionModal(e) {
  closeModal('cueva', e);
}

function closeFuenteovejunaModal(e) {
  closeModal('fuenteovejuna', e);
}

function closeModal(prodKey, e) {
  const prod = productions[prodKey];
  const modal = document.getElementById(prod.modalId);
  
  if (!e || e.target === modal || e.target.classList.contains('close-modal')) {
    modal.classList.remove('active');
    cleanupModalControls(modal);
    // Reanuda el autoplay
    prod.timer = setTimeout(() => autoSlide(prodKey), 4000);
  }
}

// Modal controls y navegación
let mouseIdleTimer = null;

function setupModalControls(modal) {
  showModalControls();
  modal.addEventListener('mousemove', resetMouseIdleTimer);
  document.addEventListener('keydown', handleModalKeyboard);
}

function cleanupModalControls(modal) {
  clearTimeout(mouseIdleTimer);
  modal.removeEventListener('mousemove', resetMouseIdleTimer);
  document.removeEventListener('keydown', handleModalKeyboard);
}

function showModalControls() {
  const controls = document.querySelectorAll('.modal-prev, .modal-next, .modal-indicators');
  controls.forEach(control => control.style.opacity = '1');
}

function hideModalControls() {
  const controls = document.querySelectorAll('.modal-prev, .modal-next, .modal-indicators');
  controls.forEach(control => control.style.opacity = '0');
}

function resetMouseIdleTimer() {
  clearTimeout(mouseIdleTimer);
  showModalControls();
  mouseIdleTimer = setTimeout(hideModalControls, 1000); // 1 segundo hasta ocultar
}

function handleModalKeyboard(e) {
  const activeModal = document.querySelector('.production-modal.active');
  if (!activeModal) return;
  
  resetMouseIdleTimer();
  
  if (e.key === 'Escape') {
    if (activeModal.id === 'productionModal') closeProductionModal();
    if (activeModal.id === 'fuenteovejunaModal') closeFuenteovejunaModal();
  } else if (e.key === 'ArrowLeft') {
    if (activeModal.id === 'productionModal') modalPrev();
    if (activeModal.id === 'fuenteovejunaModal') fuenteovejunaModalPrev();
  } else if (e.key === 'ArrowRight') {
    if (activeModal.id === 'productionModal') modalNext();
    if (activeModal.id === 'fuenteovejunaModal') fuenteovejunaModalNext();
  }
}

// Funciones específicas para cada modal
function showModalSlide(prodKey, idx) {
  const prod = productions[prodKey];
  const slides = document.querySelectorAll(`#${prod.modalId} ${prod.modalSlides}`);
  const counter = document.querySelector(`#${prod.modalId} .modal-counter`);
  const dots = document.querySelectorAll(`#${prod.modalId} .modal-dot`);
  
  prod.modalIndex = idx;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
  
  if (counter) counter.textContent = `${idx + 1} / ${slides.length}`;
  if (dots.length) dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
}

// Navegación La Cueva de Salamanca
function modalPrev(e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  const prod = productions.cueva;
  const slides = document.querySelectorAll(`#${prod.modalId} ${prod.modalSlides}`);
  const newIndex = (prod.modalIndex - 1 + slides.length) % slides.length;
  showModalSlide('cueva', newIndex);
}

function modalNext(e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  const prod = productions.cueva;
  const slides = document.querySelectorAll(`#${prod.modalId} ${prod.modalSlides}`);
  const newIndex = (prod.modalIndex + 1) % slides.length;
  showModalSlide('cueva', newIndex);
}

function goToModalSlide(idx, e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  showModalSlide('cueva', idx);
}

// Navegación Fuenteovejuna
function fuenteovejunaModalPrev(e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  const prod = productions.fuenteovejuna;
  const slides = document.querySelectorAll(`#${prod.modalId} ${prod.modalSlides}`);
  const newIndex = (prod.modalIndex - 1 + slides.length) % slides.length;
  showModalSlide('fuenteovejuna', newIndex);
}

function fuenteovejunaModalNext(e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  const prod = productions.fuenteovejuna;
  const slides = document.querySelectorAll(`#${prod.modalId} ${prod.modalSlides}`);
  const newIndex = (prod.modalIndex + 1) % slides.length;
  showModalSlide('fuenteovejuna', newIndex);
}

function goToFuenteovejunaSlide(idx, e) {
  if (e) e.stopPropagation();
  resetMouseIdleTimer();
  showModalSlide('fuenteovejuna', idx);
}
