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
