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
			handlePositionTop: null,
			ticksPositions: []
		}

		var settings = $.extend({
			ticks: [-300, -150, 0, 150, 300],
			complete: null,
			sliderPositionInterval: 20,
			max: 500,
			min: -500,
			sliderHeight: 10,
			sliderPadding: 30,
			ticksLabelFontSize: 14,
			ticksLabelPadding: 10,
			ticksHeight: 7,
			handleWidth: 25,
			handleHeight: 20,
			backgroundColor: '#ecf7fc',
			value: 0,
			snapToTickRange: 20
		}, options);
		
		state.sliderWidth = parentWidth - settings.sliderPadding * 2;
		state.sliderContainerHeight = ( settings.sliderHeight + 2 * settings.ticksHeight + 2 * settings.ticksLabelFontSize ) * 3;
		var sliderContainer = $('<div class="slider-container em-payout-slider"></div>');	
		var sliderTrack = $('<div class="slider-track"><div class="slider-track-half left"></div><div class="slider-track-half right"></div></div>');
		var sliderHandle = $('<div class="slider-handle"><span class="slider-arrow slider-left-arrow fa fa-angle-left"></span><span class="fa fa-angle-right slider-right-arrow slider-arrow"></span></div>');
		var ticksTopContainer = $('<div class="slider-tick-container top"></div>');	
		var ticksBottomContainer = $('<div class="slider-tick-container bottom"></div>');
		var tickLabelsTopContainer = $('<div class="slider-tick-labels-container top"></div>');
		var tickLabelsBottomContainer = $('<div class="slider-tick-labels-container bottom"></div>');
		
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
			top: state.sliderTrackPositionTop + settings.sliderHeight + 'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px'
		})
		
		tickLabelsTopContainer.css({
			height: settings.ticksLabelFontSize + 2 * settings.ticksLabelPadding + 'px',
			top: state.sliderTrackPositionTop - settings.ticksHeight - settings.ticksLabelFontSize - 2 * settings.ticksLabelPadding +  'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px'
		})

		tickLabelsBottomContainer.css({
			height: settings.ticksLabelFontSize + 2 * settings.ticksLabelPadding + 'px',
			top: state.sliderTrackPositionTop + settings.sliderHeight + settings.ticksHeight +  'px',
			width: state.sliderWidth + 'px',
			left: settings.sliderPadding + 'px'
		})

		sliderContainer.append(sliderTrack);	
		sliderContainer.append(sliderHandle);	
		sliderContainer.append(ticksTopContainer);	
		sliderContainer.append(ticksBottomContainer);	
		sliderContainer.append(tickLabelsTopContainer);	
		sliderContainer.append(tickLabelsBottomContainer);	
		
		function convertTickValueToTickLabel(tickValue) {
			return tickValue < 0 ? '+' + (-tickValue) : '+' + tickValue	
		}

		settings.ticks.forEach(function(tickValue, i) {
			if(tickValue !== 0){
				var tickBottom = $('<div class="slider-tick small"></div>');
				var tickTop = $('<div class="slider-tick small"></div>');
				var labelTop = $('<div data-label-index=' + i + ' class="topLabel">' + convertTickValueToTickLabel(tickValue) + '</div>');
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
				});
				
				tickLabelsTopContainer.append(labelTop);
				
				setTimeout(function(){
					labelTop.css({
						left: tickOffset - labelTop.width() / 2 + 'px',
						fontSize: settings.ticksLabelFontSize + 'px',
						top: settings.ticksLabelPadding + 'px',
						visibility: 'visible' 
					})
				}, 0)

				state.ticksPositions.push(tickOffset);
				
			}else{
				var tickBottom = $('<div class="slider-tick big"></div>');
				var tickTop = $('<div class="slider-tick big"></div>');
				var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
				
				ticksTopContainer.append(tickTop);
				ticksBottomContainer.append(tickBottom);

				tickBottom.css({
					left: tickOffset + 'px',
					height: state.sliderContainerHeight / 2 - settings.sliderPadding / 2 + 'px'
				})
				tickTop.css({
					left: tickOffset + 'px',
					height: settings.ticksHeight * 2 + 'px',
					top: - settings.ticksHeight + 'px'
				})
				state.ticksPositions.push(tickOffset);
			}

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

				// Snap to tick
				
				var handleMiddlePosition = state.handleX + settings.handleWidth / 2; 
				state.ticksPositions.forEach(function(tick) {
					tick = tick + 30;
					if(handleMiddlePosition - settings.snapToTickRange < tick && tick < handleMiddlePosition){
						state.handleX = tick - settings.handleWidth / 2;
						sliderHandle.css({
							left: state.handleX + 'px'
						});
					}

					if(handleMiddlePosition + settings.snapToTickRange > tick && tick > handleMiddlePosition){
						state.handleX = tick - settings.handleWidth / 2;
						sliderHandle.css({
							left: state.handleX + 'px'
						});
					}
				})

				state.sliderValue = convertOffsetToValue(state.handleX + settings.handleWidth / 2);
				

				sliderHandle.css({
					left: state.handleX + 'px'
				});
			}, settings.sliderPositionInterval);
		}

		function convertOffsetToValue(x) {
			return  (x - settings.sliderPadding) * (settings.max - settings.min ) / state.sliderWidth + settings.min; 
		}
		
		function convertValueToOffset(v) {
			return  settings.sliderPadding + ( state.sliderWidth * ( v - settings.min) ) / ( settings.max - settings.min );
		}
			
		function updateLabels() {
			
		}

		function updateTicks() {

		}

		addEventListeners();

		this.setRisk = function(risk) {

		}

		this.setCurrentPrice = function(currentPrice) {

		}

		this.setDealPrice = function(dealPrice) {

		}


		
	}

}(jQuery))