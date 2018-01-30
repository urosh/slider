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
			handleXOffset: null,
			handleYOffset: null,
			mouseXDelta: null,
			mouseXOffset: null,
			mouseYOffset: null,
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
			max: 600,
			min: -600,
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
		
		var sliderStats = $('<div class="slider-stats">mouseXOffset: <span class="mouseXOffset"></span><br>handleXOffset: <span class="handleXOffset"></span><br>Mouse Delta: <span class="mouseDelta"></span><br>Delta Leaks: <span class="deltaLeak"></span></div>');

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
		
		state.handleXOffset = convertValueToOffset(settings.value);
		
		sliderHandle.css({
			width: settings.handleWidth + 'px',
			height: settings.handleHeight + 'px',
			backgroundColor: settings.backgroundColor,
			top: state.handlePositionTop + 'px',
			left: state.handleXOffset + 'px'
		});

		

		sliderContainer.append(sliderTrack);	
		sliderContainer.append(sliderHandle);	
		sliderContainer.append(ticksTopContainer);	
		sliderContainer.append(ticksBottomContainer);	
		sliderContainer.append(sliderStats);	
		
		settings.ticks.forEach(function(tickValue) {
			var tickBottom = $('<div class="slider-tick small"></div>');
			var tickTop = $('<div class="slider-tick small"></div>');
			tickBottom.css({
				left: tickValue + 'px',
			})
			tickTop.css({
				left: tickValue + 'px',
				top: '5px'
			})
			ticksTopContainer.append(tickTop);
			ticksBottomContainer.append(tickBottom);
		});

		$(parent).prepend(sliderContainer);

		function addEventListeners() {
			$(document).on('mousedown touchstart', '.slider-handle', function(e) {
				
				state.handleState = handleStates.ACTIVE;
				if(state.handleState = handleStates.ACTIVE) {
					setMouseTrackingInterval();
					state.handleState = handleStates.MOVING;
				}
			})

			$(document).on('mouseup touchend', function(e) {
				console.log('MouseUp')
				state.handleState = handleStates.FREE;
				state.mouseXOffset = null;
				state.mouseYOffset = null;
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
				
				/*state.mouseXOffset = e.pageX;
				state.mouseYOffset = e.pageY;
				state.handleXOffset = e.pageX - sliderContainer.offset().left - e.pageX - sliderHandle.offset().left;
				console.log(e.pageX, sliderContainer.offset().left, sliderHandle.offset().left);
				*/

				if(!state.mouseXOffset){
					state.mouseXOffset = state.mouseClient.pageX - sliderContainer.offset().left;
					updateStats();
					return;
				}
				
				
				
				
				state.mouseXDelta = state.mouseClient.pageX - sliderContainer.offset().left - state.mouseXOffset;
				state.mouseXOffset = state.mouseClient.pageX - sliderContainer.offset().left;
				state.handleXOffset = state.handleXOffset + state.mouseXDelta;
				updateStats();

				//console.log(state.xOffset);
				/*if(state.handleXOffset > settings.sliderPadding && state.handleXOffset < state.sliderWidth - settings.handleWidth + settings.sliderPadding ) {
					
					state.sliderValue = convertOffsetToValue(state.handleXOffset);
					updateStats();
					sliderHandle.css({
						left: state.handleXOffset + 'px'
					});

					
				}

				//console.log(state.xOffset);
				if(state.handleXOffset < settings.sliderPadding) {
					state.sliderValue = settings.min;
					state.handleXOffset = settings.sliderPadding;
					updateStats();
					sliderHandle.css({
						left: state.handleXOffset + 'px'
					});

					
				}*/



				/*if(state.handleXOffset < 0 && state.yOffset < settings.height) {
					state.handleXOffset = settings.sliderPadding;

					state.sliderValue = settings.min;
					sliderHandle.css({
						left: state.handleXOffset + 'px'
					})
				}*/

				/*if(state.xOffset > state.sliderWidth - settings.handleWidth && state.yOffset < settings.height) {
					state.sliderValue = settings.max;
					state.handleXOffset = settings.sliderPadding + state.sliderWidth;
					sliderHandle.css({
						left: settings.width - settings.handleWidth + 'px'
					})
				}*/


			}, settings.sliderPositionInterval);
		}

		function convertOffsetToValue(x) {
			return x * state.sliderWidth / ( settings.max - settings.min ) + settings.sliderPadding; 
		}

		function convertValueToOffset(v) {
			return  settings.sliderPadding + ( state.sliderWidth * ( v - settings.min) ) / ( settings.max - settings.min );
		}
		function updateStats(){
			$('.handleXOffset').text(state.handleXOffset);
			$('.mouseXOffset').text(state.mouseXOffset);
			$('.mouseDelta').text(state.mouseXDelta);
			if(state.mouseXDelta > 10){
				$('.deltaLeak').append(state.mouseXDelta + ' ');
			}
		}
		addEventListeners();
		
	}

}(jQuery))