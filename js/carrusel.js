document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los carruseles en la página
    const carruseles = document.querySelectorAll('.carrusel-container');

    carruseles.forEach((carruselContainer) => {
        const carrusel = carruselContainer.querySelector('.carrusel-images');
        const prevBtn = carruselContainer.querySelector('.prev-btn');
        const nextBtn = carruselContainer.querySelector('.next-btn');
        const images = Array.from(carrusel.querySelectorAll('img'));
        const totalImages = images.length;

        // Duplicamos las imágenes al inicio y al final para simular continuidad
        images.forEach(img => {
            const cloneStart = img.cloneNode(true);
            const cloneEnd = img.cloneNode(true);
            carrusel.appendChild(cloneEnd);
            carrusel.insertBefore(cloneStart, images[0]);
        });

        // Recalcular el carrusel con las imágenes clonadas
        const allImages = carrusel.querySelectorAll('img');
        const totalClonedImages = allImages.length;
        const initialOffset = totalImages * 100; // Posición inicial en las imágenes reales
        let currentIndex = totalImages;

        // Ajustar la posición inicial y la altura inicial
        carrusel.style.transform = `translateX(-${initialOffset}%)`;
        carruselContainer.style.height = `${images[0].offsetHeight}px`; // Altura inicial basada en la primera imagen

        const updateCarrusel = () => {
            const offset = -currentIndex * 100;
            carrusel.style.transition = 'transform 0.5s ease-in-out';
            carrusel.style.transform = `translateX(${offset}%)`;

            // Ajustar la altura del contenedor dinámicamente
            const activeImage = allImages[currentIndex];
            carruselContainer.style.height = `${activeImage.offsetHeight}px`;

            // Resetear posición si estamos en los clones
            setTimeout(() => {
                if (currentIndex === 0) {
                    currentIndex = totalImages;
                    carrusel.style.transition = 'none';
                    carrusel.style.transform = `translateX(-${totalImages * 100}%)`;
                }
                if (currentIndex === totalClonedImages - 1) {
                    currentIndex = totalImages - 1;
                    carrusel.style.transition = 'none';
                    carrusel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
            }, 500); // Espera a que la transición termine
        };

        // Evento para el botón siguiente
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarrusel();
        });

        // Evento para el botón anterior
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarrusel();
        });

        // Ajustar la altura dinámica al redimensionar la ventana
        window.addEventListener('resize', () => {
            const activeImage = allImages[currentIndex];
            carruselContainer.style.height = `${activeImage.offsetHeight}px`;
        });
    });
});


function toggleAccordion(element) {
    const parent = element.parentElement;
    const content = parent.querySelector(".accordion-content");
    const isOpen = parent.classList.contains("open");
  
    // Cerrar todos los acordeones
    document.querySelectorAll(".accordion-item").forEach(item => {
      item.classList.remove("open");
      item.querySelector(".accordion-content").style.display = "none";
    });
  
    // Abrir el acordeón actual si estaba cerrado
    if (!isOpen) {
      parent.classList.add("open");
      content.style.display = "block";
    }
  }
   