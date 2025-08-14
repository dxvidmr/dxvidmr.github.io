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
	
	// Toggle mobile menu
	$("#nav-trigger span").on("click", function() {
		if ($("nav#nav-mobile ul").hasClass("expanded")) {
			$("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
			$(this).removeClass("open");
		} else {
			$("nav#nav-mobile ul").addClass("expanded").slideDown(250);
			$(this).addClass("open");
		}
	});

	// Close mobile menu when clicking on links
	$("#nav-mobile ul a").on("click", function() {
		if ($("nav#nav-mobile ul").hasClass("expanded")) {
			$("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
			$("#nav-trigger span").removeClass("open");
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
