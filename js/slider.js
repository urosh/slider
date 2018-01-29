(function($) {
	$.fn.easyTradePayoutSlider = function(options) {
		var el = $(this);

		var parent = el.parent();
		el.hide();

		var handleStates = {
			FREE: 'free',
			ACTIVE: 'active',
			MOVING: 'moving'
		}

		var state = {
			handleState: handleStates.FREE,
			sliderValue: null,
			xOffset: null,
			yOffset: null,
			mouseCliend: null
		}

		var settings = $.extend({
			ticks: [-300, -150, 0, 150, 300],
			complete: null,
			sliderPositionInterval: 50,
			max: 600,
			min: -600,
			width: 550,
			height: 70,
			sliderHeight: 15,
			handleWidth: 30,
			handleHeight: 21
		}, options);

		var sliderContainer = $('<div class="slider-container em-payout-slider"></div>');	
		var sliderTrack = $('<div class="slider-track"></div>');
		var sliderHandle = $('<div class="slider-handle"></div>');
		var ticksTopContainer = $('<div class="slider-tick-container top"></div>');	
		var ticksBottomContainer = $('<div class="slider-tick-container bottom"></div>');
		

		sliderContainer.css({
			width: settings.width + 'px',
			height: settings.height + 'px' 
		})
		
		sliderTrack.css({
			height: settings.sliderHeight + 'px' 
		})

		sliderHandle.css({
			width: settings.handleWidth + 'px',
			height: settings.handleHeight + 'px'
		})

		sliderContainer.append(sliderTrack);	
		sliderContainer.append(sliderHandle);	
		sliderContainer.append(ticksTopContainer);	
		sliderContainer.append(ticksBottomContainer);	
		
		$(parent).prepend(sliderContainer);

		function addEventListeners() {
			$(document).on('mousedown touchstart', function(e) {
				state.handleState = handleStates.ACTIVE;
				console.log('We pressed the slider');
				if(state.handleState = handleStates.ACTIVE) {
					setMouseTrackingInterval();
					state.handleState = handleStates.MOVING;
				}
			})

			$(document).on('mouseup touchend', function(e) {
				
				console.log('We released the slider')
				if(state.handleState = handleStates.MOVING) {
					clearInterval(mouseTrackingInterval);
					state.handleState = handleStates.FREE;
				}

			});


			$(document).on('mousemove', function(e) {
				if(state.handleState === handleStates.MOVING) {
					state.mouseClient = e;
				}
			})


		}

		var mouseTracking; 
		
		function setMouseTrackingInterval() {
			mouseTrackingInterval = setInterval(function() {
				state.xOffset = state.mouseClient.pageX - sliderContainer.offset().left;
				state.yOffset = state.mouseClient.pageY - sliderContainer.offset().top;
				
				if(state.xOffset > 0 && state.xOffset < settings.width - settings.handleWidth && state.yOffset > 0 && state.yOffset < settings.height) {
					sliderHandle.css({
						left: state.xOffset + 'px'
					})
				}

				if(state.xOffset < 0 && state.yOffset < settings.height) {
					sliderHandle.css({
						left: 0
					})
				}

				if(state.xOffset > settings.width - settings.handleWidth && state.yOffset < settings.height) {
					sliderHandle.css({
						left: settings.width - settings.handleWidth + 'px'
					})
				}

			}, settings.sliderPositionInterval);
		}

		
		addEventListeners();
		
	}

}(jQuery))