"use strict";

/**
 * ===================================
 * NAVIGATION SYSTEM
 * ===================================
 * Gestión de la navegación móvil, sticky navbar y waypoints
 */

$(document).ready(function () {
	
	/* Responsive Navigation - Mobile Menu */
	$("#nav-mobile").html($("#nav-main").html());
	
	// Variable para prevenir clics múltiples
	var isAnimating = false;
	
	// Toggle mobile menu - Sistema de estados controlado con protección
	$("#nav-trigger span").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation(); // Evitar propagación del evento
		
		// Prevenir clics múltiples durante animación
		if (isAnimating) {
			return false;
		}
		
		var $menu = $("nav#nav-mobile ul");
		var $trigger = $(this);
		
		isAnimating = true; // Bloquear nuevos clics
		
		if ($menu.hasClass("expanded")) {
			// CERRAR: expanded -> collapsing -> (vacío)
			$menu.removeClass("expanded expanding").addClass("collapsing");
			$trigger.removeClass("open");
			
			// Después de la animación, limpiar clases y desbloquear
			setTimeout(function() {
				$menu.removeClass("collapsing");
				isAnimating = false;
			}, 700); // Usar el tiempo máximo de animación
			
		} else {
			// ABRIR: (vacío) -> expanding -> expanded
			$menu.removeClass("collapsing").addClass("expanding");
			$trigger.addClass("open");
			
			// Cambiar a expanded después de un frame para activar transición
			requestAnimationFrame(function() {
				$menu.addClass("expanded");
				
				// Desbloquear después de que la apertura esté completa
				setTimeout(function() {
					isAnimating = false;
				}, 500); // Tiempo de apertura
			});
		}
		
		return false; // Prevenir cualquier comportamiento adicional
	});

	// Close mobile menu when clicking on links (excepto el botón CV)
	$("#nav-mobile ul a:not(.menu-button)").on("click", function(e) {
		var $menu = $("nav#nav-mobile ul");
		
		if ($menu.hasClass("expanded") && !isAnimating) {
			isAnimating = true;
			
			$menu.removeClass("expanded expanding").addClass("collapsing");
			$("#nav-trigger span").removeClass("open");
			
			setTimeout(function() {
				$menu.removeClass("collapsing");
				isAnimating = false;
			}, 700);
		}
	});

	// Prevenir clics en el menú cuando está animando
	$("#nav-mobile").on("click", function(e) {
		if (isAnimating) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	});

	/* Sticky Navigation */
	if (!!$.prototype.stickyNavbar) {
		$('#header').stickyNavbar();
	}

	/* Navigation waypoint for solid background */
	$('#banner').waypoint(function (direction) {
		if (direction === 'down') {
			$('#header').addClass('nav-solid');
		} else {
			$('#header').removeClass('nav-solid');
		}
	}, {
		offset: '-90%'
	});

});

/**
 * ===================================
 * MOBILE MENU OVERLAY SYSTEM
 * ===================================
 * Sistema de menú móvil unificado con overlay para toda la web
 */

(function() {
    'use strict';
    
    let isMenuOpen = false;
    
    /**
     * Inicializa el sistema de menú móvil overlay
     */
    function initMobileMenuOverlay() {
        // Crear elementos del menú si no existen
        createMobileMenuElements();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Configurar detección de color del hamburger
        handleHamburgerColor();
    }
    
    /**
     * Crea los elementos HTML del menú móvil overlay
     */
    function createMobileMenuElements() {
        // Verificar si ya existen los elementos
        if (document.querySelector('.hamburger-menu')) {
            return;
        }
        
        // Crear botón hamburger
        const hamburgerButton = document.createElement('button');
        hamburgerButton.className = 'hamburger-menu';
        hamburgerButton.innerHTML = '<span class="hamburger-icon"></span>';
        
        // Crear overlay del menú
        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'mobile-menu-overlay';
        
        // Crear contenido del menú
        const menuContent = document.createElement('div');
        menuContent.className = 'mobile-menu-content';
        
        // Obtener enlaces de navegación principal
        const navMain = document.querySelector('#nav-main ul');
        if (navMain) {
            let menuHTML = '<ul>';
            
            // Si estamos en el CV, añadir icono Back al principio
            if (window.location.pathname.includes('/cv') || document.querySelector('.cv-container')) {
                menuHTML += '<li><a href="/index.html" class="cv-back-link"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABs0lEQVR4nO2ZzytEURSAP/kVzzQr0SwQVpOyUsrGhuIPYKH8KNlLWVBiIQtLu1nMSsrCxkIWSoxslBI7ZUQpmqyU0jC69RbT6b0J3TfmvN5XZ/Xq3Pv1zrnvdB9ERFQkTcAOkAPSQA1KJTJAoSjGCYFEAZggBBKnQD1KcIBjD4kzIIYSnEiiQnAiiQrBCYNEzOeI/Uu8Ak/AJbAPbABjQEvQEnHg3JJEqfhy5RaCkoqXSaQ43oEtoLWSS+u3ZThTrlEk4z77CQ1AAkgCA+4mU8A18FlCKGV7krYh44fpi3ng3kdmV5OMoRZYAj481tjEMkHLGPqArMfJNoxCmW7gReS/BepQKNMP5EX+aQKglEyjpTXSIvcFAeEns2gpf5tH83dRRpk1i/lPRO45AsTIHLgLXVkeMZaFiCm3wDEjTZXlnEMePaiSXiFyh1ISQuQZpTSHRaQjLKWVFCI3KGUwLKfWpBDZRikrQmQdpewJkSmUkhUiPSikXUi8AdUoZFaIHKKUIyFibiNVzlh5cQHRiUJWPf5NquRRiJh+UclDkUTO/U+jklH3rZjvyMh/byYigpDwDaXWVJpzhf7CAAAAAElFTkSuQmCC" alt="Volver" style="width:20px;height:20px;margin-right:8px;opacity:0.8;"> Inicio</a></li>';
            }
            
            // Copiar todos los elementos li del nav original
            const navItems = navMain.querySelectorAll('li');
            navItems.forEach(item => {
                menuHTML += item.outerHTML;
            });
            
            menuHTML += '</ul>';
            menuContent.innerHTML = menuHTML;
        } else {
            // Fallback: si no encuentra el nav, crear menú básico para CV
            if (window.location.pathname.includes('/cv') || document.querySelector('.cv-container')) {
                menuContent.innerHTML = `
                    <ul>
                        <li><a href="/index.html" class="cv-back-link"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABs0lEQVR4nO2ZzytEURSAP/kVzzQr0SwQVpOyUsrGhuIPYKH8KNlLWVBiIQtLu1nMSsrCxkIWSoxslBI7ZUQpmqyU0jC69RbT6b0J3TfmvN5XZ/Xq3Pv1zrnvdB9ERFQkTcAOkAPSQA1KJTJAoSjGCYFEAZggBBKnQD1KcIBjD4kzIIYSnEiiQnAiiQrBCYNEzOeI/Uu8Ak/AJbAPbABjQEvQEnHg3JJEqfhy5RaCkoqXSaQ43oEtoLWSS+u3ZThTrlEk4z77CQ1AAkgCA+4mU8A18FlCKGV7krYh44fpi3ng3kdmV5OMoRZYAj481tjEMkHLGPqArMfJNoxCmW7gReS/BepQKNMP5EX+aQKglEyjpTXSIvcFAeEns2gpf5tH83dRRpk1i/lPRO45AsTIHLgLXVkeMZaFiCm3wDEjTZXlnEMePaiSXiFyh1ISQuQZpTSHRaQjLKWVFCI3KGUwLKfWpBDZRikrQmQdpewJkSmUkhUiPSikXUi8AdUoZFaIHKKUIyFibiNVzlh5cQHRiUJWPf5NquRRiJh+UclDkUTO/U+jklH3rZjvyMh/byYigpDwDaXWVJpzhf7CAAAAAElFTkSuQmCC" alt="Volver" style="width:20px;height:20px;margin-right:8px;opacity:0.8;"> Inicio</a></li>
                        <li><a href="#about">ABOUT ME</a></li>
                        <li><a href="#education">EDUCATION</a></li>
                        <li><a href="#grants">GRANTS & AWARDS</a></li>
                        <li><a href="#research">RESEARCH PROJECTS</a></li>
                        <li><a href="#software">SOFTWARE & TOOLS</a></li>
                        <li><a href="#publications">PUBLICATIONS</a></li>
                        <li><a href="#talks">PRESENTATIONS</a></li>
                        <li><a href="#teaching">TEACHING</a></li>
                        <li><a href="#activities">ACTIVITIES</a></li>
                        <li><a href="#skills">SKILLS</a></li>
                        <li><a href="#languages">LANGUAGES</a></li>
                    </ul>
                `;
            }
        }
        
        menuOverlay.appendChild(menuContent);
        
        // Añadir elementos al DOM
        document.body.appendChild(hamburgerButton);
        document.body.appendChild(menuOverlay);
        
        console.log('Mobile menu elements created successfully');
    }
    
    /**
     * Configura los event listeners del overlay
     */
    function setupEventListeners() {
        const hamburgerButton = document.querySelector('.hamburger-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!hamburgerButton || !menuOverlay) {
            console.warn('Mobile menu overlay elements not found');
            return;
        }
        
        // Toggle menú al hacer clic en hamburger
        hamburgerButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenuOverlay();
        });
        
        // Cerrar menú al hacer clic en el overlay (fuera del contenido)
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                closeMenuOverlay();
            }
        });
        
        // Configurar event listeners para enlaces
        updateMenuEventListeners();
    }
    
    /**
     * Actualiza los event listeners de los enlaces del menú overlay
     */
    function updateMenuEventListeners() {
        const menuLinks = document.querySelectorAll('.mobile-menu-content a:not(.menu-button)');
        
        // Cerrar menú al hacer clic en enlaces (excepto botón CV/Back)
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenuOverlay();
            });
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenuOverlay();
            }
        });
    }
    
    /**
     * Alterna el estado del menú overlay
     */
    function toggleMenuOverlay() {
        if (isMenuOpen) {
            closeMenuOverlay();
        } else {
            openMenuOverlay();
        }
    }
    
    /**
     * Abre el menú overlay
     */
    function openMenuOverlay() {
        const hamburgerButton = document.querySelector('.hamburger-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!hamburgerButton || !menuOverlay) return;
        
        isMenuOpen = true;
        
        // Añadir clases activas
        hamburgerButton.classList.add('active');
        menuOverlay.classList.add('show');
        
        // Prevenir scroll del body
        document.body.classList.add('menu-open');
        
        // Foco en el overlay para accesibilidad
        menuOverlay.focus();
    }
    
    /**
     * Cierra el menú overlay
     */
    function closeMenuOverlay() {
        const hamburgerButton = document.querySelector('.hamburger-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!hamburgerButton || !menuOverlay) return;
        
        isMenuOpen = false;
        
        // Remover clases activas
        hamburgerButton.classList.remove('active');
        menuOverlay.classList.remove('show');
        
        // Restaurar scroll del body
        document.body.classList.remove('menu-open');
    }
    
    /**
     * Maneja el color del hamburger menu según la posición del scroll
     */
    function handleHamburgerColor() {
        const hamburgerButton = document.querySelector('.hamburger-menu');
        const banner = document.querySelector('#banner');
        
        if (!hamburgerButton || !banner) return;
        
        // Configurar waypoint para detectar cuando sales del banner
        if (typeof $ !== 'undefined' && $.fn.waypoint) {
            $('#banner').waypoint(function (direction) {
                if (direction === 'down') {
                    // Fuera del banner: usar primary
                    hamburgerButton.classList.add('over-content');
                } else {
                    // Sobre el banner: usar accent
                    hamburgerButton.classList.remove('over-content');
                }
            }, {
                offset: '-90%'
            });
        }
    }
    
    // Exponer funciones para uso externo
    window.MobileMenuOverlay = {
        init: initMobileMenuOverlay,
        open: openMenuOverlay,
        close: closeMenuOverlay,
        toggle: toggleMenuOverlay
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenuOverlay);
    } else {
        initMobileMenuOverlay();
    }
    
})();
