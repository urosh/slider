(function($) {
	$.fn.easyTradePayoutSlider = function(options) {
		var el = $(this);

		var parent = el.parent();
		
		el.hide();
		var parentWidth = parent.width();

		console.log(parentWidth);

		var handleStates = {
			FREE: 'free',
			ACTIVE: 'active',
			MOVING: 'moving'
		}

		var state = {
			handleState: handleStates.FREE,
			sliderValue: null,
			handleX: null,
			handleY: null,
			mouseXContainerOffset: null,
			mouseYContainerOffset: null,
			mouseXHandleOffset: null,
			mouseYHandleOffset: null,
			mouseClient: null,
			sliderWidth: null,
			sliderContainerHeight: null,
			sliderTrackPositionTop: null,
			handlePositionTop: null
		}

		var settings = $.extend({
			ticks: [-300, -150, 0, 150, 300],
			complete: null,
			sliderPositionInterval: 20,
			max: 500,
			min: -500,
			sliderHeight: 10,
			sliderPadding: 30,
			ticksLabelFontSize: 22,
			ticksHeight: 10,
			handleWidth: 25,
			handleHeight: 20,
			backgroundColor: '#ecf7fc',
			value: 0
		}, options);
		
		state.sliderWidth = parentWidth - settings.sliderPadding * 2;
		state.sliderContainerHeight = ( settings.sliderHeight + 2 * settings.ticksHeight + 2 * settings.ticksLabelFontSize ) * 3;
		var sliderContainer = $('<div class="slider-container em-payout-slider"></div>');	
		var sliderTrack = $('<div class="slider-track"></div>');
		var sliderHandle = $('<div class="slider-handle"><span class="slider-arrow slider-left-arrow fa fa-angle-left"></span><span class="fa fa-angle-right slider-right-arrow slider-arrow"></span></div>');
		var ticksTopContainer = $('<div class="slider-tick-container top"></div>');	
		var ticksBottomContainer = $('<div class="slider-tick-container bottom"></div>');
		
		var sliderStats = $('<div class="slider-stats">mouseXContainerOffset: <span class="mouseXContainerOffset"></span> mouseXHandleOffset: <span class="mouseXHandleOffset"></span> Handler Position: <span class="handleX"></span> Slider Value: <span class="sliderValue"></span></div>');

		sliderContainer.css({
			width: parentWidth + 'px',
			height: state.sliderContainerHeight + 'px',
			backgroundColor: settings.backgroundColor 
		})
		
		state.sliderTrackPositionTop = state.sliderContainerHeight / 2 - settings.sliderHeight / 2;
		
		sliderTrack.css({
			height: settings.sliderHeight + 'px',
			top: state.sliderTrackPositionTop  + 'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px' 
		});
		
		state.handlePositionTop = state.sliderTrackPositionTop + ( settings.sliderHeight - settings.handleHeight ) / 2;
		
		state.handleX = convertValueToOffset(settings.value) - settings.handleWidth / 2;
		
		sliderHandle.css({
			width: settings.handleWidth + 'px',
			height: settings.handleHeight + 'px',
			backgroundColor: settings.backgroundColor,
			top: state.handlePositionTop + 'px',
			left: state.handleX + 'px'
		});

		ticksTopContainer.css({
			height: settings.ticksHeight + 'px',
			top: state.sliderTrackPositionTop - settings.ticksHeight + 'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px'
		})

		ticksBottomContainer.css({
			height: settings.ticksHeight + 'px',
			top: state.sliderTrackPositionTop + settings.ticksHeight + 'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px'
		})

		

		sliderContainer.append(sliderTrack);	
		sliderContainer.append(sliderHandle);	
		sliderContainer.append(ticksTopContainer);	
		sliderContainer.append(ticksBottomContainer);	
		sliderContainer.append(sliderStats);	
		
		settings.ticks.forEach(function(tickValue) {
			var tickBottom = $('<div class="slider-tick small"></div>');
			var tickTop = $('<div class="slider-tick small"></div>');
			var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
			
			ticksTopContainer.append(tickTop);
			ticksBottomContainer.append(tickBottom);

			tickBottom.css({
				left: tickOffset + 'px',
				height: settings.ticksHeight + 'px'
			})
			tickTop.css({
				left: tickOffset + 'px',
				height: settings.ticksHeight + 'px'
			})

		});

		$(parent).prepend(sliderContainer);

		function addEventListeners() {
			$(document).on('mousedown touchstart', '.slider-handle', function(e) {
				
				state.handleState = handleStates.ACTIVE;
				if(state.handleState = handleStates.ACTIVE) {
					state.mouseClient = e;
					state.mouseXHandleOffset = state.mouseClient.pageX - sliderHandle.offset().left;
					setMouseTrackingInterval();
					state.handleState = handleStates.MOVING;
				}
			})

			$(document).on('mouseup touchend', function(e) {
				state.handleState = handleStates.FREE;
				if(mouseTrackingInterval){
					clearInterval(mouseTrackingInterval);
				}
				updateStats();
			});


			$(document).on('mousemove', function(e) {
				if(state.handleState === handleStates.MOVING) {
					state.mouseClient = e;
				}
			});

			$(document).on('dragstart', function(){
				return false;
			})

		}

		var mouseTracking; 
		var mouseTrackingInterval;
		
		function setMouseTrackingInterval() {
			mouseTrackingInterval = setInterval(function() {
				if(!state.mouseClient) {
					return;
				}
				
				state.mouseXContainerOffset = state.mouseClient.pageX - sliderContainer.offset().left;

				state.handleX = state.mouseXContainerOffset - state.mouseXHandleOffset;

				if(state.handleX < settings.sliderPadding){
					state.handleX = settings.sliderPadding;					
				}

				if(state.handleX > state.sliderWidth + settings.sliderPadding - settings.handleWidth){
					state.handleX = state.sliderWidth + settings.sliderPadding - settings.handleWidth;					
				}

				state.sliderValue = convertOffsetToValue(state.handleX + settings.handleWidth / 2);

				sliderHandle.css({
					left: state.handleX + 'px'
				});
				updateStats();
			}, settings.sliderPositionInterval);
		}

		function convertOffsetToValue(x) {
			return  (x - settings.sliderPadding) * (settings.max - settings.min ) / state.sliderWidth + settings.min; 
		}
		
		function convertValueToOffset(v) {
			return  settings.sliderPadding + ( state.sliderWidth * ( v - settings.min) ) / ( settings.max - settings.min );
		}
		function updateStats(){
			$('.handleX').text(state.handleX);
			$('.mouseXContainerOffset').text(state.mouseXContainerOffset);
			$('.mouseXHandleOffset').text(state.mouseXHandleOffset);
			$('.sliderValue').text(state.sliderValue);
		}

		addEventListeners();
		
	}

}(jQuery))