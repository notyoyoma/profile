var colorLoop, newColors, speed = 1, permalink;

/* event and change handling */
$(window).load(function() {
	$('[class^="icon-"]').click(function() { $(this).next('input[type="checkbox"], button').click(); $(this).next('input[type="text"]').focus(); });
	$('input').focus(function() { $('#controls').addClass('focus'); });
	$('input').blur(function() { $('#controls').removeClass('focus');update(); });
	$('[data-prompt]').each(function() { if($(this).val() == '') $(this).addClass('prompt'); $(this).val($(this).data('prompt')); });
	$('[data-prompt]').focus(function() { if ($(this).val() == $(this).data('prompt')) $(this).val('').removeClass('prompt'); });
	$('[data-prompt]').blur(function() { if ($(this).val() == '') $(this).val($(this).data('prompt')).addClass('prompt'); });
	attachColorPicker($('input.color'));
	$('button#add-color').click(function() {
		$(this).parent().before($('.clone-template').first().clone());
		$('.clone-template').last().append('<span class="delete-color">X</span>');
		attachColorPicker($('.clone-template').last().find('input'));
		update();
	});
	$('#controls').on('click', '.delete-color', function() {
		$(this).parent().remove();
		update();
	});
	$('#get-permalink').on('click', function() {
		if (window.permalink) {
			window.prompt('Here is your link:', window.permalink);
		} else {
			window.alert( 'Set more options first' );
		}
	});
	$('input[type="text"]').bind("enterKey", function(e){ $(this).blur(); });
	$('input[type="text"]').keyup(function(e){ if(e.keyCode == 13) $(this).trigger("enterKey"); });

	var hash = window.location.hash,
			data = (hash) ? $.parseJSON(unescape(hash.substring(1, hash.length))).reverse() : '';
	if (data.length >= 4) {
		$('#image, #repeat, #time').each(function() {
			if ($(this).attr('type') == 'checkbox') {
				$(this).prop('checked', data.pop());
			} else {
				$(this).val(data.pop());
			}
		});
		$.each( data.pop(), function(i, value) {
			if (i-2 >= 0) $('#add-color').click();
			var tmp = $(this);
			$('.color:eq('+i+')').val(value);
		});


		update();
	}
});

/* You need to attach the color picker on the fly when a new color box is created */
function attachColorPicker(el) {
	el.ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).ColorPickerHide();
			update();
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		},
		onShow: function() {
			$(this).blur();
			$('#controls').addClass('focus');
		},
		onHide: function () {
			$('#controls').removeClass('focus'); 
		},
		eventName: 'focus'
	}).bind('keyup', function(){
		$(this).ColorPickerSetColor(this.value);
	});

}

/* This updates everything */
function update() {
	var inpt_img = $('#image'),
			img = inpt_img.val(),
			inpt_rpt = $('#repeat'),
			rpt = (inpt_rpt.is(':checked')) ? 1 : 0 ,
			inpt_time = $('#time'),
			tim = (!isNaN(parseFloat(inpt_time.val())) && isFinite(inpt_time.val())) ? inpt_time.val() : 1 ,
			inpt_colors = $('input.color'),
			colors = inpt_colors.map(function() { return $(this).val(); });

	/* Update background image */
		if ( img != '' && img != inpt_img.data('prompt') ) $('#background_img').css('background-image', 'url('+img+')');
		if ( rpt ) $('#background_img').css({'background-repeat': 'repeat', 'background-size': 'auto', 'background-position': 'center'});
		else $('#background_img').css({'background-repeat': 'no-repeat', 'background-size': 'cover', 'background-position': 'center'});

	/* set colors of controls */
		inpt_colors.each(function() {
			$(this).parent().css('color', '#'+$(this).val());
			$(this).css('background-color', '#'+$(this).val());
		});
	
	/* remove non hex codes */
		colors = $.grep(colors, function(value) { return /^[0-9A-F]{6}$/i.test(value) });

	/* set body trasform duration */
		$('body').css('transition', 'background-color '+tim*.8+'s ease-in-out');
		window.speed = tim;
		
	/* set global variables */
		window.newColors = colors;
	
	/* set value of permalink */
		if (img && img.length && img != inpt_img.data('prompt') && colors && colors.length ) {
			var link = [];
			link.push(img);
			link.push(rpt);
			link.push(tim);
			link.push(colors);
			window.permalink = "http://"+window.location.host+window.location.pathname+'#'+escape(JSON.stringify(link));
		} else {
			window.permalink = 0;
		}
		
		
}

/* this runs all the time, it just waits for an interval, and swaps the colors */
function rotateColors() {
	/* make sure colorLoop is not empty */
		if (window.colorLoop && window.colorLoop.length 
				|| (window.newColors && window.newColors.length) ) {
			/* if new colors have been set */
				if (window.newColors && window.newColors.length) {
					/* overwrite colorLoop */
					window.colorLoop = window.newColors;
					/* and reset newColors */
					window.newColors = false;
				}
			/* get first color */
			next_color = window.colorLoop.splice(0,1).pop();
			/* move first color to end of array */
			window.colorLoop.push(next_color);
			/* set body background to next_color */
			$('body').css('background-color', '#'+next_color);
		}
		/* wait for speed */
		setTimeout( rotateColors, window.speed*1000 );
}
rotateColors();
