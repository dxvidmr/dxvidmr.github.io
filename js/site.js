"use strict";

$(document).ready(function () {
	/* Video Lightbox */
	if (!!$.prototype.simpleLightboxVideo) {
		$('.video').simpleLightboxVideo();
	}

	/*ScrollUp*/
	if (!!$.prototype.scrollUp) {
		$.scrollUp();
	}

	/*Responsive Navigation*/
	$("#nav-mobile").html($("#nav-main").html());
	$("#nav-trigger span").on("click",function() {
		if ($("nav#nav-mobile ul").hasClass("expanded")) {
			$("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
			$(this).removeClass("open");
		} else {
			$("nav#nav-mobile ul").addClass("expanded").slideDown(250);
			$(this).addClass("open");
		}
	});

	$("#nav-mobile").html($("#nav-main").html());
	$("#nav-mobile ul a").on("click",function() {
		if ($("nav#nav-mobile ul").hasClass("expanded")) {
			$("nav#nav-mobile ul.expanded").removeClass("expanded").slideUp(250);
			$("#nav-trigger span").removeClass("open");
		}
	});

	/* Sticky Navigation */

	if (!!$.prototype.stickyNavbar) {
		$('#header').stickyNavbar();
	}

	$('#banner').waypoint(function (direction) {
		if (direction === 'down') {
			$('#header').addClass('nav-solid');
		}
		else {
			$('#header').removeClass('nav-solid');
		}
	}, {
		offset: '-90%'
	});

});




/* WOW Elements and Parallax Effects */
$(window).load(function () { // makes sure the whole site is loaded
	$('body').css({'overflow-y': 'visible'});

	/* WOW Elements */
	if (typeof WOW == 'function') {
		new WOW().init();
	}

	/* Parallax Effects */
	if (!!$.prototype.enllax) {
		$(window).enllax();
	}

});


/* POP UP CARDS */
function openPopup(event, popupId) {
	event.preventDefault();
	document.getElementById(popupId).classList.add("active");
	document.querySelector(".overlay").classList.add("active");
  }
  
  function closePopup(popupId) {
	document.getElementById(popupId).classList.remove("active");
	document.querySelector(".overlay").classList.remove("active");
  }
  
  function closeAnyPopup() {
	const popups = document.querySelectorAll('.popup');
	const overlay = document.getElementById('overlay');
  
	popups.forEach(function(popup) {
	  if (popup.classList.contains('active')) {
		popup.classList.remove('active');
	  }
	});
  
	overlay.classList.remove('active');
  }
  
  
  