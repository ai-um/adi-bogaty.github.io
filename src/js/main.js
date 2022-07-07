$(document).ready(function() {
	// preloader fading-out when document is ready
    $(".loader_inner").fadeOut();
    $(".loader").delay(400).fadeOut("slow");



    // fading-in of sections
    function onEntry(entry) {
	  entry.forEach(change => {
	    if (change.isIntersecting) {
	     change.target.classList.add('element-show');
	    }
	  });
	}

	let options = {
	  threshold: [0.5] };
	let observer = new IntersectionObserver(onEntry, options);
	let elements = document.querySelectorAll('.section-container');

	for (let elm of elements) {
	  observer.observe(elm);
	}




	// animate.css when on hover
	// Thank to: https://github.com/daneden/animate.css
	function animate(elem) {
		var effect = elem.data("effect");
		elem.addClass('animate__animated '+effect).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			elem.removeClass('animate__animated '+effect);
		});
	}
	$(".skill-item-logo").mouseenter( function(){
		animate($(this));
	});






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
	$('.js-modal-close').click(function() {
		$(this).parent('.js-modal').removeClass('is-show');
		$('.js-modal-overlay').removeClass('is-show');
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

});

