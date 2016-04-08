$(function() {
	$('.bg-img').each(function() {
		$(this).parent().css({
			'background': 'url("'+$(this).attr('src')+'") no-repeat center center',
			'background-size': 'cover'
		});
	});
	$('.intro-b button').on('click', function(e) {
		e.preventDefault();
		$('html, body').stop().animate({
			scrollTop: $('.constructor-b').offset().top+30+'px'
		}, 1000);
	});
	$('.call-modal, .order-modal').append('<span class="close"></span>');
	$('[data-open]').on('click', function(e) {
		e.preventDefault();
		var t = $('[data-target="'+$(this).attr('data-open')+'"]');
		$('.fade').stop(true,true).fadeIn(400);
		var h = $(window).scrollTop()+($(window).height()-t.outerHeight())/2;
		if ( h < 0 ) {
			h = 0;
		}
		t.css({
			'top': h+'px'
		}).stop(true,true).fadeIn(400);
	});
	$('.fade, .back-step .cancel, [data-target] .close').bind('click', function(e) {
		e.preventDefault();
		$('.fade, [data-target]').stop(true,true).fadeOut(400);
	});
	$('input[type="radio"]').uniform();
});
$(window).load(function() {
	var max = 0;
	$('.about-b ul li').each(function() {
		var h = $(this).outerHeight(); 
		max = h > max ? h : max;
	});
	$('.about-b ul li').outerHeight(max);
	$('.about-b ul').css({
		'opacity': '1'
	});
});
$(function() {
	$('.item').on('mouseenter', function(e) {
		e.stopPropagation();
		t = $(this);
		$('.tooltip').remove();
		$('body').append('<div class="tooltip">'+$(this).attr('data-tip')+'</div>');
		$('.tooltip').css({
			'left': $(this).offset().left+'px',
			'top': $(this).offset().top-$('.tooltip').outerHeight()+'px',
		}).stop(true,true).fadeIn(0);
	});
	$('.constructor-b .selected').on('mouseenter', 'p span', function(e) {
		e.stopPropagation();
		t = $(this);
		$('.tooltip').remove();
		$('body').append('<div class="tooltip">'+$(this).parent().attr('data-tip')+'</div>');
		$('.tooltip').css({
			'left': $(this).offset().left+'px',
			'top': $(this).offset().top-$('.tooltip').outerHeight()+'px',
			'margin': '-10px 0 0 0'
		}).stop(true,true).fadeIn(0);
	});
	$('.item').on('mouseleave', function(e) {
		$('.tooltip').remove();
	});
	$('.constructor-b .selected').on('mouseleave', 'p span', function(e) {
		$('.tooltip').remove();
	});
	$('.panel').each(function() {
		$(this).mCustomScrollbar({
			scrollButtons:{enable:true,scrollType:'stepped'},
			keyboard:{scrollType:"stepped"},
			mouseWheel:{scrollAmount:138},
			autoExpandScrollbar:true,
			snapAmount:138,
			callbacks:{
				whileScrolling:function() {
					$('.tooltip').remove();
				}
			}
		});
	});
	var currentStep = 1;
	var price = 0;
	var sel = $('.selected');
	var type = $('.config .type li');
	type.eq(0).addClass('active');
	function showStep(e) {
		$('[data-step-element]').hide().filter('[data-step-element="'+e+'"]').show();
		$('.progress li:nth-child('+e+')').addClass('active').siblings().removeClass();
	}
	function updatePrice(e) {
		e = 0;
		sel.find('.name').each(function() {
			e += eval($(this).attr('data-price'));
		});
		var e = e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		$('.total span').text(e);
	}
	function selectAdd(step,id,title,price,desc,type) {
		sel.append('<p class="name" data-tip="'+desc+'" data-price="'+price+'" data-step="'+step+'" data-id="'+id+'" data-type="'+type+'"><span>'+title+'</span><i class="remove"></i></p>');
		sel.find('.default').hide();
	}
	isTab = false;
	$('.selected').on('click', '.remove', function(e) {
		e.preventDefault();
		var t = $(this).parent();
		console.log($('.item[data-step="'+currentStep+'"][data-id="'+t.attr('data-id')+'"]'));
		isTab = true
		$('.item[data-step="'+currentStep+'"][data-id="'+t.attr('data-id')+'"]').trigger('click');
		isTab = false;
		t.remove();
	});
	function selectRemove(step,id,type) {
		if ( currentStep == 1 ) {
			sel.find('[data-step="'+step+'"]').remove();
		} else if ( currentStep == 2 ) {
			sel.find('[data-step="'+step+'"][data-id="'+id+'"]').remove();
		} else if ( currentStep == 3 ) {
			sel.find('[data-step="'+step+'"][data-type="'+type+'"]').remove();
		}
		if ( sel.find('.name').length == 0 ) {
			sel.find('.default').show();
		}
	}
	showStep(currentStep);
	updatePrice(price);
	var canvas = $('.canvas');
	$('.item').on('click', function(e) {
		e.preventDefault();
		var t = $(this);
		var d = 0;
		var a = 500;
		if ( !$(this).hasClass('active') ) {
			t.addClass('active');
			if ( currentStep == 1 && t.siblings().hasClass('active') ) {
				t.siblings().removeClass('active');
				var e = canvas.find('[data-step="'+currentStep+'"]');
				e.stop().animate({
					'opacity': '0'
				}, a/2, function() {
					e.remove();
				});
				d = a/2;
				selectRemove(currentStep);
			} else {
				canvas.find('.dummy').stop().fadeOut(a);
			}
			if ( currentStep == 3 && t.siblings().hasClass('active') && !isTab ) {
				t.siblings().removeClass('active');
				var e = canvas.find('[data-step="'+currentStep+'"][data-type="'+eval($(this).attr('data-type'))+'"]');
				e.stop().animate({
					'opacity': '0'
				}, a/2, function() {
					e.remove();
				});
				d = a/2;
				selectRemove(currentStep,$(this).attr('data-id'),$(this).attr('data-type'));
			}
			if ( isTab ) {
				t.removeClass('active');
				var e = canvas.find('[data-step="'+currentStep+'"][data-type="'+eval($(this).attr('data-type'))+'"]');
				e.stop().animate({
					'opacity': '0'
				}, a/2, function() {
					e.remove();
				});
				d = a/2;
				selectRemove(currentStep,$(this).attr('data-id'),$(this).attr('data-type'));
			}
			if ( !isTab ) {
				$('<img src="'+$(this).attr('data-img-src')+'" width="963" height="715" style="z-index:'+t.attr('data-depth')+'" data-step="'+t.attr('data-step')+'" data-id="'+t.attr('data-id')+'" data-parent="'+t.attr('data-parent')+'" data-type="'+t.attr('data-type')+'" alt="">').appendTo(canvas).stop().delay(d).animate({
					'opacity': '1'
				}, a);
				selectAdd(currentStep,$(this).attr('data-id'),$(this).attr('data-fullname'),$(this).attr('data-price'),$(this).attr('data-tip'),$(this).attr('data-type'));
			}
			$('.complete [data-step-element="'+currentStep+'"] .next').addClass('active');
			updatePrice(price);
		} else {
			t.removeClass('active');
			var e = canvas.find('[data-step="'+currentStep+'"][data-id="'+eval($(this).attr('data-id'))+'"]');
			e.stop().animate({
				'opacity': '0'
			}, a/2, function() {
				e.remove();
			});
			if ( currentStep == 1 ) {
				canvas.find('.dummy').stop().delay(a/2).fadeIn(a);
			}
			selectRemove(currentStep,$(this).attr('data-id'),$(this).attr('data-type'));
			updatePrice(price);
			if ( $('.panel[data-step-element="'+currentStep+'"]').find('.item.active').length == 0 ) {
				$('.complete [data-step-element="'+currentStep+'"] .next').removeClass('active');
			}
		}
	});
	$('.complete button.next').on('click', function(e) {
		e.preventDefault();
		if ( $(this).hasClass('active') ) {
			if ( currentStep !== 3 ) {
				sel.find('.name[data-step="'+currentStep+'"]').find('.remove').hide();
				currentStep++;
				showStep(currentStep);
				var t = $('.panel[data-step-element="'+currentStep+'"]');
				var parent = canvas.find('img[data-step="1"]').attr('data-parent');
				t.find('.item').removeClass('visible').hide();
				t.find('.item').each(function() {
					var arr = $(this).attr('data-sibling').split(',');
					if ( arr.indexOf(""+parent+"") >= 0 ) {
						$(this).addClass('visible');
					}
				});
				t.find('.item.visible').show();
				t.mCustomScrollbar('update');
				if ( currentStep == 3 ) {
					type.filter('.active').trigger('click');
				}
			}
		}
	});
	type.on('click', function(e) {
		e.preventDefault();
		var t = $('.panel[data-step-element="'+currentStep+'"]');
		t.find('.visible').hide().filter('.visible[data-type="'+$(this).attr('data-type')+'"]').show();
		$(this).addClass('active').siblings().removeClass();
		t.mCustomScrollbar('update');
	});
	$('.constructor-b .complete button.back').on('click', function(e) {
		e.preventDefault();
		$('.back-step button.continue').addClass('active');
	});
	$('.back-step button.continue').on('click', function(e) {
		e.preventDefault();
		if ( $(this).hasClass('active') ) {
			$(this).removeClass('active');
			$('.panel[data-step-element="'+currentStep+'"]').find('.item').removeClass('active');
			canvas.find('[data-step="'+currentStep+'"]').hide();
			sel.find('.name[data-step="'+currentStep+'"]').remove();
			currentStep--;
			console.log(currentStep);
			showStep(currentStep);
			sel.find('.name[data-step="'+currentStep+'"] .remove').show();
			updatePrice(price);
			$('.fade, [data-target]').stop().fadeOut(500);
		}
	});
});