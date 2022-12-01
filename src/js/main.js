$(document).ready(function() {
	$('html').css({'overflow-y': 'hidden'});

	$('.image-link').magnificPopup({type:'image'});
	


	// Modal form closing
	// Create a closure
    // Your base, I'm in it!
    /*var originalRemoveClassMethod = jQuery.fn.removeClass;

    jQuery.fn.removeClass = function(){
        // Execute the original method.
        var result = originalRemoveClassMethod.apply( this, arguments );

        // trigger a custom event
        jQuery(this).trigger('cssClassRemoved');

        // return the original result
        return result;
    }

	// $('body').trigger('cssClassChanged')
	// ....
	$('body').on('cssClassRemoved', ()=>{
		console.log($('body').hasClass('mfp-zoom-out-cur'));
		if (!$('body').hasClass('mfp-zoom-out-cur')) { $('html').css({'overflow-y': 'auto'}); }
	});*/
	
	// $('.mfp-close').click(function() {
	// 	$('html').css({'overflow-y': 'auto'});
	// });

	// preloader fading-out when document is ready
    $(".loader_inner").fadeOut();
    $(".loader").delay(400).fadeOut("slow");

    // animate.css when on hover
	// Thank to: https://github.com/daneden/animate.css
	function animate(elem, target=false) {
		var effect = !target ? elem.data("effect") : elem.dataset.effect;

		if (!target) {
				elem.addClass('animate__animated '+effect).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					elem.removeClass('animate__animated '+effect);
				});
		} else {
			elem.classList.add('animate__animated');
			elem.classList.add(effect);
			elem.addEventListener('animationend', function(e) {
					elem.classList.remove('animate__animated');
					elem.classList.remove(effect);
			});
		}
	}
	$(".skill-item-logo").mouseenter( function(){
		animate($(this));
	});






    // fading-in of sections
    function onEntry(entry) {
		entry.forEach(change => { if (change.isIntersecting) { change.target.classList.add('element-show'); } });
	}
	function onImgEntry(entry) {
		entry.forEach(change => { if (change.isIntersecting) {
			if (change.target.src != change.target.dataset.src) {
				change.target.src = change.target.dataset.src; // это чтобы картинки подгружались по мере прокрутки сайта, чтоб сайт быстрее загрузился и не тратил на это время при загрузке.
			}
		} });
	}
	function onSkillsEntry(entry) {
		entry.forEach(change => { if (change.isIntersecting) {
			// console.log(change);
    		animate(change.target, true);
		}
		});
	}
	
	let noMoreStatistics = false;
	let time = 10000;
	let step = 1;
	function outNum(num, e) {
		n = 0; // переменная одна, а в неё записываются несколько элементов. Получаетя неудобство.

		let t = Math.round(time / (num / step));
		let interval = setInterval(() => {
			n = n + step;
			// console.log('n('+num+')='+n);

			if (n >= num) {
				n = num;
				noMoreStatistics = true;
				clearInterval(interval);
			}
			e.innerHTML = n;
		}, t);
	}
	function onStatisticsEntry(entry) {
		if (noMoreStatistics) return;
		entry.forEach(change => { if (change.isIntersecting) {
			

			let statNum = 0;
			let elem = change.target;
			if (!isNaN(elem.innerHTML)) { // если число, то
				statNum = parseInt(elem.innerHTML);
			}
			outNum(statNum, elem); // $('.statistics-items-item-title')

		} });
	}

	let options = { threshold: [0.25] };
	let observer = new IntersectionObserver(onEntry, options);
	let elements = document.querySelectorAll('.section-container');
	
	let observer_imgs = new IntersectionObserver(onImgEntry, {threshold: [0.15]});
	let imgs = $('img, iframe');

	let observer_skills = new IntersectionObserver(onSkillsEntry, {threshold: [0.15]});
	let skillItems = $('.skill-item-logo');

	let observer_stats = new IntersectionObserver(onStatisticsEntry, {threshold: [0.45]});
	let statItems = $('.statistics-items-item-title');

	for (let elm of elements)   { observer.observe(elm); }
	for (let elm of imgs)       { observer_imgs.observe(elm); }
	for (let elm of skillItems) { observer_skills.observe(elm); }
	for (let elm of statItems)  { observer_stats.observe(elm); }


	
	// A function for declension of numerals like "1 день, 2 дня, 5 дней, 11 дней, 21 день, ...".
	function declOfNum(number, words) {  
		return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
	}




	// An object of calculator of a price and work-time
	var calculator = {
		params: {"type": null, "design":null, "adaptivity":null,},
		work_time: 0,
		price: 0,
		
		countOn: ()=>{
			for (var key in calculator.params) {
				if (!calculator.params[key]) {
					// console.log("\t\t\t>> "+key+" : "+calculator.params[key]); // debug
					return false;
				}
			}
			return true;
		},
		// $('#sl-site-type option[value='+'landing'+']').prop('selected', true);
		// $('#sl-design option[value='+'opt-author_s'+']').prop('selected', true);
		// $('#sl-adaptivity option[value='+'pixel-perfect'+']').prop('selected', true);
		countWorktimeAndPrice: (self)=>{
			// console.log("\t\tin countWorktimeAndPrice..."); // debug
			if (!calculator.countOn()) {
				console.log("\t\tSelect all the options. Only after selecting all the options the calculations will be performed.");
				return false;
			}

			calculator.work_time = 7; // days
			calculator.price     = 0;

			if        (calculator.params.type == "landing") {
				calculator.price += 5000;
			} else if (calculator.params.type == "blog") {
				calculator.price += 5500;
			} else if (calculator.params.type == "forum") {
				calculator.price += 4000;
				calculator.work_time = 12; // days
			} else if (calculator.params.type == "internet-shop") {
				calculator.price += 8000;
				calculator.work_time = 15; // days
			} else if (calculator.params.type == "many-purposes-site") {
				calculator.price += 15000;
				calculator.work_time = 21; // days
			}

			if        (calculator.params.design == "opt-author_s") {
				calculator.price += +3000;
				calculator.work_time += 3; // days
			} else if (calculator.params.design == "opt-available") {
				// price += 0;
			} else { // opt-personal
				calculator.price += 1500;
				calculator.work_time += 3; // days
			}

			
			if        (calculator.params.adaptivity == "pixel-perfect") {
				calculator.price += 0;
			} else if (calculator.params.adaptivity == "rubber") {
				calculator.price += 1500;
			} else if (calculator.params.adaptivity == "adaptive") {
				calculator.price += 2500;
			}

			console.log("\t\tCalculations have been made.");
			return true;
		},
		setWorktimeAndPrice: (id_worktime="#count-time", id_price="#count-price")=>{
			// console.log("\tin setWorktimeAndPrice..."); // debug
			if (!calculator.countWorktimeAndPrice()) {
				console.log("\tOops! Not all the options are selected.");
				return false;
			}

			$(id_worktime) .text(calculator.work_time+" "+declOfNum(calculator.work_time, ['день', 'дня', 'дней']));
			$(id_price).text(calculator.price+" ₽");

			return true;
		},
	};

	function onSiteOptSelectChange(key, val) {
		calculator.params[key] = val;
		calculator.setWorktimeAndPrice();
	}
	function onModalSiteOptSelectChange(key, val) {
		calculator.params[key] = val;
		// console.log(calculator); // debug
		// console.log(calculator.params); // debug
		calculator.setWorktimeAndPrice("#modal-count-time", "#modal-count-price");
	}

	$('select#sl-site-type').on('change', function (e) {
		onSiteOptSelectChange("type", this.value);
	});
	$('select#sl-design').on('change', function (e) {
		onSiteOptSelectChange("design", this.value);
	});
	$('select#sl-adaptivity').on('change', function (e) {
		onSiteOptSelectChange("adaptivity", this.value);
	});

	$('select#modal-sl-site-type').on('change', function (e) {
		onModalSiteOptSelectChange("type", this.value);
	});
	$('select#modal-sl-design').on('change', function (e) {
		onModalSiteOptSelectChange("design", this.value);
	});
	$('select#modal-sl-adaptivity').on('change', function (e) {
		onModalSiteOptSelectChange("adaptivity", this.value);
	});



	// Modal form closing
	$('#modal-price-calc .js-modal-close').click(function() {
		$(this).parent('.js-modal').removeClass('is-show');
		$('#modal-price-calc .js-modal-overlay').removeClass('is-show');
		$('html').css({'overflow-y': 'auto'});

		$('#sl-site-type option[value=' +calculator.params.type      +']').prop('selected', true);
		$('#sl-design option[value='    +calculator.params.design    +']').prop('selected', true);
		$('#sl-adaptivity option[value='+calculator.params.adaptivity+']').prop('selected', true);

		calculator.setWorktimeAndPrice();
	});
	// $('.js-modal-overlay').click(function() {
	//    $('.js-modal.is-show').removeClass('is-show');
	//    $(this).removeClass('is-show');
	// })


	// Подсветка нужных пунктов менюшки или логотипа сайта при прокрутке
	$(window).scroll(function(event) {
		let scrollDistance = $(window).scrollTop();			
		
		$('section:not(#modal-price)').each((i, el) => {
			if (($(el).offset().top - $('nav.nav-cap-menu').outerHeight() <= scrollDistance) && ($(el)[0].id != 'statistics')) {
				if (i > 3) --i;

				$('nav.nav-cap-menu a').each((i, el) => {
					if ($(el).hasClass('menu-active')){
						$(el).removeClass('menu-active'); return false;
					}
				});

				if (i >= 6) { --i; }
				$('nav.nav-cap-menu li:eq('+i+')').find('a').addClass('menu-active');
			} else if ((i == 0) && ($(el).offset().top - $('nav.nav-cap-menu').outerHeight() > scrollDistance) && (!$('.logo a').hasClass('menu-active'))) {
				$('nav.nav-cap-menu a').removeClass('menu-active');
				$('.logo a').addClass('menu-active');
			}
		});
	});



	$('#modal-unexpected .js-modal-close').click(function() {
		$(this).parent('.js-modal').removeClass('is-show');
		$('#modal-unexpected .js-modal-overlay').removeClass('is-show');
		$('html').css({'overflow-y': 'auto'});
	});
	setTimeout(function(){ 
		// alert('Следи за собой. Будь осторожен.');
		$('#modal-unexpected.js-modal-overlay').addClass('is-show');
		$('html').css({'overflow-y': 'hidden'});
	}, 15000);

});

