(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$intro = $('#intro'),
		$topNav = $('#top-nav'),
		$floatingLogo = $('.floating-logo'),
		$menuToggle = $('#mobile-menu-toggle'),
		$menuOverlay = $('#mobile-menu-overlay');

	// 1. Breakpoints
	breakpoints({
		default:   ['1681px',   null       ],
		xlarge:    ['1281px',   '1680px'   ],
		large:     ['981px',    '1280px'   ],
		medium:    ['737px',    '980px'    ],
		small:     ['481px',    '736px'    ],
		xsmall:    ['361px',    '480px'    ],
		xxsmall:   [null,       '360px'    ]
	});

	// 2. Initial Page Load
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// 3. Scrolly & Parallax
	$('.scrolly').scrolly();
	
	// Helper for background parallax
	$.fn._parallax = function(intensity) {
		var	$window = $(window), $this = $(this);
		if (this.length == 0 || intensity === 0) return $this;
		if (this.length > 1) {
			for (var i=0; i < this.length; i++) $(this[i])._parallax(intensity);
			return $this;
		}
		if (!intensity) intensity = 0.25;
		$this.each(function() {
			var $t = $(this), $bg = $('<div class="bg"></div>').appendTo($t), on, off;
			on = function() {
				$bg.removeClass('fixed').css('transform', 'matrix(1,0,0,1,0,0)');
				$window.on('scroll._parallax', function() {
					var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);
					$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');
				});
			};
			off = function() {
				$bg.addClass('fixed').css('transform', 'none');
				$window.off('scroll._parallax');
			};
			if (browser.name == 'ie' || browser.name == 'edge' || window.devicePixelRatio > 1 || browser.mobile) off();
			else {
				breakpoints.on('>large', on);
				breakpoints.on('<=large', off);
			}
		});
		$window.off('load._parallax resize._parallax').on('load._parallax resize._parallax', function() {
			$window.trigger('scroll');
		});
		return $(this);
	};

	$wrapper._parallax(0.925);

	// 4. Intro & Main Scroll Logic
	if ($intro.length > 0) {
		if (browser.name == 'ie') {
			$window.on('resize.ie-intro-fix', function() {
				var h = $intro.height();
				$intro.css('height', (h > $window.height()) ? 'auto' : h);
			}).trigger('resize.ie-intro-fix');
		}

	// Hide intro based on scroll breakpoints
		breakpoints.on('>small', function() {
			$main.unscrollex().scrollex({
				mode: 'bottom', top: '25vh', bottom: '-50vh',
				enter: function() { $intro.addClass('hidden'); },
				leave: function() { $intro.removeClass('hidden'); }
			});
		});

		breakpoints.on('>small', function() {
			$main.unscrollex().scrollex({
				mode: 'top', 
				top: '100vh',
				enter: function() { $intro.addClass('hidden'); },
				leave: function() { $intro.removeClass('hidden'); }
			});
		});
	}

	// 5. Desktop Top Nav & Logo Scroll Effect
	if ($topNav.length > 0) {
		$window.on('scroll', function() {
			if ($window.scrollTop() > 100) {
				$body.addClass('scrolled');
			} else {
				$body.removeClass('scrolled');
			}
		});
	}

	// 6. Custom Mobile Splash Menu
	if ($menuToggle.length > 0) {
		$menuToggle.on('click', function() {
			$(this).toggleClass('open');
			$menuOverlay.toggleClass('active');
			$body.css('overflow', $menuOverlay.hasClass('active') ? 'hidden' : 'auto');
		});

		$menuOverlay.find('a').on('click', function() {
			$menuToggle.removeClass('open');
			$menuOverlay.removeClass('active');
			$body.css('overflow', 'auto');
		});
	}

	// 7. Desktop Top Nav logic
	if ($topNav.length > 0) {
		$window.on('scroll', function() {
			if ($window.scrollTop() > 50) {
				$body.addClass('scrolled');
			} else {
				$body.removeClass('scrolled');
			}
		});
	}

	// 8. Parche selection + redirect logic (ADD HERE)
	let selectedParcheUrl = null;

	$(".parche-option").on("click", function (e) {
  	e.preventDefault();
  	e.stopPropagation();

  	const url = $(this).data("url");
  	window.location.href = url;
	});



	$(".parche-form").on("submit", function (e) {
		e.preventDefault();
		const value = $(this).find("select").val();

		const routes = {
			calle: "https://docs.google.com/forms/d/e/1FAIpQLSe6EfhHE6Hpfs-m6E5bIifOuciUlWy2TRvHobbyXDqRNePAOg/viewform?usp=dialog",
			voto: "https://docs.google.com/forms/d/e/1FAIpQLSdFG-pZsmX1rhW-S2cXzcwYWGI8V5gmFPe-dS88swi8_InWJg/viewform?usp=dialog",
			cultura: "https://docs.google.com/forms/d/e/1FAIpQLSflJuXUlEjAVFAckwg1W7Cxl2mY12ylAbkiPBs_c61Wyr_amg/viewform?usp=dialog",
			comunicacion: "https://docs.google.com/forms/d/e/1FAIpQLSdpaALZ1tWVGwwkkxpQN2xa2Dic3EdlTTs9qYZ2puXcuHxDZQ/viewform?usp=dialog"
		};

		if (!routes[value]) {
			alert("Por favor selecciona un parche");
			return;
		}

		window.location.href = routes[value];
	});

	// Dynamic "Parchar" Button Toggle Logic
	var $parcheBtn = $('.mobile-parche-btn');
	var $volunteerSection = $('#volunteer-natalia');

	if ($parcheBtn.length > 0 && $volunteerSection.length > 0) {
		$window.on('scroll', function() {
			// Calculate when the user is near the volunteer section
			// We subtract 300px to trigger the change slightly before they hit the section
			var volunteerPos = $volunteerSection.offset().top - 300;

			if ($window.scrollTop() >= volunteerPos) {
				// Change to "Back to Top" mode
				$parcheBtn.text('VOLVER ARRIBA');
				$parcheBtn.attr('href', '#intro');
			} else {
				// Reset to "Parchar" mode
				$parcheBtn.text('¡PARCHAR!');
				$parcheBtn.attr('href', '#volunteer-natalia');
			}
		});
	}
})(jQuery);

function toggleReadMore() {
	var dots = document.getElementById("dots");
	var moreText = document.getElementById("more-text");
	var btnText = document.getElementById("readMoreBtn");

	if (dots.style.display === "none") {
		dots.style.display = "inline";
		btnText.innerHTML = "Leer más"; 
		moreText.style.display = "none";
	} else {
		dots.style.display = "none";
		btnText.innerHTML = "Leer menos"; 
		moreText.style.display = "inline";
	}
}

