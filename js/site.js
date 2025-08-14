"use strict";

/**
 * ===================================
 * CORE SITE FUNCTIONALITY
 * ===================================
 * Funciones básicas del sitio: ScrollUp, WOW effects, inicialización
 */

$(document).ready(function () {
	
	/* ScrollUp Button */
	if (!!$.prototype.scrollUp) {
		$.scrollUp();
	}

});

/* WOW Elements & Page Initialization */
$(window).load(function () {
	// Mostrar el contenido de la página cuando esté completamente cargada
	$('body').css({'overflow-y': 'visible'});

	/* WOW Elements - Animate on scroll (si está disponible) */
	if (typeof WOW == 'function') {
		new WOW().init();
	}

});
  
  
  