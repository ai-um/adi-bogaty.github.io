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

});

