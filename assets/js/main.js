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
		// Fix for IE min-height
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

		breakpoints.on('<=small', function() {
			$main.unscrollex().scrollex({
				mode: 'middle', top: '15vh', bottom: '-15vh',
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
			
			// Prevent background scrolling when menu is open
			$body.css('overflow', $menuOverlay.hasClass('active') ? 'hidden' : 'auto');
		});

		// Close menu when a link is clicked
		$menuOverlay.find('a').on('click', function() {
			$menuToggle.removeClass('open');
			$menuOverlay.removeClass('active');
			$body.css('overflow', 'auto');
		});
	}

})(jQuery);