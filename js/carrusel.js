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
