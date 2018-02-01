(function($) {
	$.fn.easyTradePayoutSlider = function(options) {
		var el = $(this);

		var parent = el.parent();
		
		el.hide();
		
		var parentWidth = parent.width();

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
			ticksPositions: [],
			max: null,
			min: null,
			tickValue: [],
			toolTipValue: null,
			sliderMode: 'rates',
			dealPrice: 12,
			currentRate: 1.32781,
			sliderWidth: null,
			sliderContainerHeight: null,
			snapEnabled: false
		}

		var settings = $.extend({
			complete: null,
			sliderPositionInterval: 20,
			sliderHeight: 10,
			sliderPadding: 30,
			ticksLabelFontSize: 14,
			ticksLabelPadding: 10,
			ticksHeight: 7,
			handleWidth: 25,
			handleHeight: 20,
			backgroundColor: '#ecf7fc',
			value: 0,
			snapToTickRange: 20,
			toolTipHeight: 35,
			toolTipWidth: 85,
			toolTipFontSize: 16,
			risk: 150
		}, options);
		
		// Dom elements
		var sliderContainer,	
			sliderTrack,
			sliderHandle,
			ticksTopContainer,
			ticksBottomContainer,
			tickLabelsTopContainer,
			tickLabelsBottomContainer,
			toolTipTop,
			toolTipBottom,
			downLabel,
			currencyLabel,
			upLabel,
			sliderModeMenu;

		initializeState();
		
		initializeDomElements();
		
		addDomElements();
		
		addTicks();
		
		addLabels();




		function initializeState(){
			state.min = -4 * settings.risk;
			state.max = 4 * settings.risk;
			state.sliderValue = settings.value;
			state.tickValues = [-2 * settings.risk, -1 * settings.risk, 0, settings.risk, 2 * settings.risk];

			state.sliderWidth = parentWidth - settings.sliderPadding * 2;
			state.sliderContainerHeight = ( settings.sliderHeight + 2 * settings.ticksHeight + 2 * settings.ticksLabelFontSize ) * 3;
			
			state.sliderTrackPositionTop = state.sliderContainerHeight / 2 - settings.sliderHeight / 2;

			state.handlePositionTop = state.sliderTrackPositionTop + ( settings.sliderHeight - settings.handleHeight ) / 2;
		
			state.handleX = convertValueToOffset(settings.value) - settings.handleWidth / 2;
		}
		
		function initializeDomElements() {

			sliderContainer = $('<div class="slider-container em-payout-slider"></div>');	
			sliderTrack = $('<div class="slider-track"><div class="slider-track-half left"></div><div class="slider-track-half right"></div></div>');
			
			sliderHandle = $('<div class="slider-handle"><span class="slider-arrow slider-left-arrow fa fa-angle-left"></span><span class="fa fa-angle-right slider-right-arrow slider-arrow"></span></div>');
			
			ticksTopContainer = $('<div class="slider-tick-container top"></div>');	
			ticksBottomContainer = $('<div class="slider-tick-container bottom"></div>');
			tickLabelsTopContainer = $('<div class="slider-tick-labels-container top"></div>');
			tickLabelsBottomContainer = $('<div class="slider-tick-labels-container bottom"></div>');
			
			// Tooltips
			toolTipTop = $('<div class="slider-tooltip top">0</div>');
			toolTipBottom = $('<div class="slider-tooltip bottom"> ' + convertSliderValueToPipRate() + ' </div>');
			
			// Legend
			downLabel = $('<div class="slider-legend down">Down</div>');
			currencyLabel = $('<div class="slider-legend currency">Eur</div>');
			upLabel = $('<div class="slider-legend up">Up</div>');
			// Slider mode
			sliderModeMenu = $('<div class="slider-menu"><div data-slider-menu-item="pips" class="slider-menu-item ">Pips</div><div data-slider-menu-item="rates" class="slider-menu-item active">Rates</div></div>');
		}

		function addDomElements(){
			sliderContainer.css({
				width: parentWidth + 'px',
				height: state.sliderContainerHeight + 'px',
				backgroundColor: settings.backgroundColor 
			})		
			
			
			sliderTrack.css({
				height: settings.sliderHeight + 'px',
				top: state.sliderTrackPositionTop  + 'px',
				width: state.sliderWidth + 'px',
				left: settings.sliderPadding + 'px' 
			});
			
			
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
			
			toolTipTop.css({
				top: state.handlePositionTop - settings.toolTipHeight - 4 + 'px',
				left: state.handleX + settings.handleWidth / 2 - settings.toolTipWidth / 2 + 'px',
				width: settings.toolTipWidth + 'px',
				height: settings.toolTipHeight + 'px',
				lineHeight: settings.toolTipHeight + 'px',
			});

			toolTipBottom.css({
				top: state.handlePositionTop + settings.handleHeight + 4 + 'px',
				left: state.handleX + settings.handleWidth / 2 - settings.toolTipWidth / 2 + 'px',
				width: settings.toolTipWidth + 'px',
				lineHeight: settings.toolTipHeight + 'px',
				height: settings.toolTipHeight + 'px'
			});

			downLabel.css({
				left: settings.sliderPadding + 'px',
				top: state.sliderTrackPositionTop + settings.sliderHeight + 14 + 'px'
			})

			upLabel.css({
				right: settings.sliderPadding + 'px',
				top: state.sliderTrackPositionTop + settings.sliderHeight + 14 + 'px'
			})

			currencyLabel.css({
				right: settings.sliderPadding + 'px',
				top: state.sliderTrackPositionTop - 26 + 'px'
			})

			sliderContainer.append(sliderTrack);	
			sliderContainer.append(sliderHandle);	
			sliderContainer.append(ticksTopContainer);	
			sliderContainer.append(ticksBottomContainer);	
			sliderContainer.append(tickLabelsTopContainer);	
			sliderContainer.append(tickLabelsBottomContainer);	
			sliderContainer.append(toolTipTop);
			sliderContainer.append(toolTipBottom);
			sliderContainer.append(sliderModeMenu);
			sliderContainer.append(downLabel);
			sliderContainer.append(currencyLabel);
			sliderContainer.append(upLabel);
		}

		function addTicks() {
			state.tickValues.forEach(function(tickValue, i) {
				var tickClass = tickValue === 0 ? 'big' : 'small';
				
				var topTickHeight = tickValue === 0 ? settings.ticksHeight * 2 : settings.ticksHeight;
				var bottomTickHeight = tickValue === 0 ? state.sliderContainerHeight / 2  : settings.ticksHeight;

				var tickBottom = $('<div class="slider-tick ' + tickClass + ' "></div>');
				var tickTop = $('<div class="slider-tick ' + tickClass + '"></div>');
				var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
				
				ticksTopContainer.append(tickTop);
				ticksBottomContainer.append(tickBottom);

				tickBottom.css({
					left: tickOffset - 1+ 'px',
					height: topTickHeight + 'px'
				})
				tickTop.css({
					left: tickOffset -1 + 'px',
					height: bottomTickHeight + 'px',
				})
				state.ticksPositions.push(tickOffset);
			});
		}
		
		function addLabels() {
			tickLabelsTopContainer.empty();
			tickLabelsBottomContainer.empty();

			state.tickValues.forEach(function(tickValue, i) {
				if(tickValue !== 0){
					
					var labelTop = $('<div data-label-index=' + i + ' class="topLabel">' + convertTickValueToTickLabel(tickValue) + '</div>');

					var labelBottom = $('<div data-label-risk= ' + tickValue + ' class="bottomLabel">' + convertSliderValueToPipRate(tickValue) + '</div>');

					var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
					
					
					tickLabelsTopContainer.append(labelTop);
					tickLabelsBottomContainer.append(labelBottom);
					
					setTimeout(function(){
						labelTop.css({
							left: tickOffset - labelTop.width() / 2 + 'px',
							fontSize: settings.ticksLabelFontSize + 'px',
							top: settings.ticksLabelPadding + 'px',
							visibility: 'visible' 
						});

						labelBottom.css({
							left: tickOffset - labelBottom.width() / 2 + 'px',
							top: settings.ticksLabelPadding + 'px',
							fontSize: '14px',
							visibility: 'visible' 
						});

					}, 0)

				}
			})
		}


		// Helper function that prepares tickValue for display by adding plus sign
		function convertTickValueToTickLabel(tickValue) {
			return tickValue < 0 ? '+' + (-tickValue) : '+' + tickValue	
		}
		
		// Helper function that transformt the rate value into format suitable for 
		// display. Big pips, small pips and these kind of things
		function formatRateValue(rateValue) {
			rateValue = rateValue.toString();
			var fullNumber = rateValue.split('.')[0];
			var decimalNumber = rateValue.split('.')[1];
			var decimalFirstPart = decimalNumber.substring(0, 2);
			var decimalSecondPart = decimalNumber.substring(2, 4);
			var decimalThirdPart = decimalNumber.substring(4, 5);
			return '<div class="slider-formated-rate"><span class="full-number">' + fullNumber + '.</span><span class="decimal-first-part">' + decimalFirstPart + '</span><span class="decimal-second-part" >' + decimalSecondPart + '</span><span class="decimal-third-part">' + decimalThirdPart + '</span></div>';

		}
		
		
		$(parent).prepend(sliderContainer);
		
		// Attaching event listeners
		function addEventListeners() {
			$(document).on('mousedown touchstart', '.slider-handle', function(e) {
				console.log('we got here!!!');
				state.mouseClient = e;
				
				var pageX;
				
				pageX = state.mouseClient.pageX ? state.mouseClient.pageX : state.mouseClient.originalEvent.touches[0].pageX;

				state.mouseXHandleOffset = pageX - sliderHandle.offset().left;
				setMouseTrackingInterval();
				state.handleState = handleStates.MOVING;
				
			})

			$(document).on('mouseup touchend', function(e) {
				state.handleState = handleStates.FREE;
				if(mouseTrackingInterval){
					state.snapEnabled = false;
					clearInterval(mouseTrackingInterval);
				}
			});


			$(document).on('mousemove touchmove', function(e) {
				if(state.handleState === handleStates.MOVING) {
					state.mouseClient = e;
				}
			});

			$(document).on('dragstart', function(){
				return false;
			});

			$(document).on('click touch', '.slider-menu-item', function(e) {
				$('.slider-menu-item').removeClass('active');
				$(this).addClass('active');
				state.sliderMode = $(this).attr('data-slider-menu-item');
				modeChange();
			})

		}

		var mouseTracking; 
		var mouseTrackingInterval;
		var limitReached = false;
		
		// Initializing the interval for tracking mouse moves. Used to move the slider
		function setMouseTrackingInterval() {
			mouseTrackingInterval = setInterval(function() {
				if(!state.mouseClient) {
					return;
				}
				
				var pageX;
				
				pageX = state.mouseClient.pageX ? state.mouseClient.pageX : state.mouseClient.originalEvent.touches[0].pageX;
				
				state.mouseXContainerOffset = pageX - sliderContainer.offset().left;

				state.handleX = state.mouseXContainerOffset - state.mouseXHandleOffset;
				
				toolTipBottom.show();
				
				if(toolTipBottom.css('visibility') === 'hidden'){
					toolTipBottom.css({
						visibility: 'visible'
					});
				}
				limitReached = false;
				
				if(state.handleX < settings.sliderPadding){
					state.handleX = settings.sliderPadding;	
					toolTipBottom.css({
						visibility: 'hidden'
					});		
					limitReached = true;		
				}

				if(state.handleX > state.sliderWidth + settings.sliderPadding - settings.handleWidth){
					state.handleX = state.sliderWidth + settings.sliderPadding - settings.handleWidth;		
					toolTipBottom.css({
						visibility: 'hidden'
					});			
					limitReached = true;
				}

				// Snap to tick
				var handleMiddlePosition = state.handleX + settings.handleWidth / 2; 
				if(state.snapEnabled){
					state.ticksPositions.forEach(function(tick) {
						tick = tick + settings.sliderPadding;
						
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
				}else{
					var handleSafe = true;
					state.ticksPositions.forEach(function(tick) {
						tick = tick + settings.sliderPadding;
						if(handleMiddlePosition - settings.snapToTickRange <= tick && tick <= handleMiddlePosition){
							handleSafe = false;
						}

						if(handleMiddlePosition + settings.snapToTickRange >= tick && tick >= handleMiddlePosition){
							handleSafe = false;
						}						
						
					})
					state.snapEnabled = handleSafe;
				}
				

				state.sliderValue = convertOffsetToValue(state.handleX + settings.handleWidth / 2);
				

				sliderHandle.css({
					left: state.handleX + 'px'
				});

				toolTipTop.css({
					left: state.handleX + settings.handleWidth / 2 - settings.toolTipWidth / 2 + 'px'
				})

				toolTipBottom.css({
					left: state.handleX + settings.handleWidth / 2 - settings.toolTipWidth / 2 + 'px'
				});

				state.toolTipValue = limitReached ? 'unlimited' : parseInt(state.sliderValue < 0 ? -state.sliderValue : state.sliderValue);

				
				toolTipTop.html(state.toolTipValue);
				toolTipBottom.html(convertSliderValueToPipRate())

			}, settings.sliderPositionInterval);
		}


		/*
		 * Helper function that transforms the current slider value to rate or pips, based 
		 * on the slider mode. Slider more can be set to rates or pips. 
		 * 
		 * Default slider values are stored in payout format. This means that when we 
		 * move the slider, variable sliderValue stores the payout value. Down payout
		 * values will be negative, up payout values will be position. 
		 * 
		 */
		function convertSliderValueToPipRate(value) {
			var sliderValue = value || state.sliderValue;
			if(state.sliderMode === 'rates'){
				return formatRateValue(convertRiskToPrice(sliderValue));
			}

			return convertRiskToPips(sliderValue);
		}
		
		// Helper function that converts current mouse offset to payout value. Used 
		// to calculate sliderValue
		function convertOffsetToValue(x) {
			return  (x - settings.sliderPadding) * (state.max - state.min ) / state.sliderWidth + state.min; 
		}
		
		// Helper function that converts payout value to the offset. Used to position 
		// elements on slider basesd on some predefined payout value
		function convertValueToOffset(v) {
			return  settings.sliderPadding + ( state.sliderWidth * ( v - state.min) ) / ( state.max - state.min );
		}
		

		function updateLabels() {
			
		}

		function updateTicks() {

		}
		
		
		// Helper function that convert payout ammount to rate
		function convertRiskToPrice(risk) {
			return parseFloat((state.currentRate + convertRiskToPips(risk) / 100000).toFixed(5));	
		}
		
		// Helper function that converts payout ammount to pips
		function convertRiskToPips(risk) {
			return risk * state.dealPrice / settings.risk;	
		}

		addEventListeners();
		
		// Slider mode change handler
		function modeChange() {
			$('.bottomLabel').each(function(i, el) {
				var tickValue = $(this).attr('data-label-risk');
				var value = convertSliderValueToPipRate(tickValue);
				$(this).html(value);
				var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
				$(this).css({
					left: tickOffset - $(this).width() / 2 + 'px',
				});
			})

		
			toolTipBottom.html(convertSliderValueToPipRate())
		}
		
		// Public API functions

		// API function to set/change the risk amount.
		// This should update top tick labels, 
		this.setRisk = function(risk) {
			if(!risk) return;
			//toolTipBottom.html(convertSliderValueToPipRate())
			settings.risk = risk;

			state.min = -4 * settings.risk;
			state.max = 4 * settings.risk;
			state.tickValues = [-2 * settings.risk, -1 * settings.risk, 0, settings.risk, 2 * settings.risk];
			

			state.sliderValue = convertOffsetToValue(state.handleX + settings.handleWidth / 2);

			if(state.toolTipValue !== 'unlimited'){
				state.toolTipValue = parseInt(state.sliderValue < 0 ? -state.sliderValue : state.sliderValue)	
			}
			
			toolTipTop.html(state.toolTipValue);

			addLabels();

		}
		
		// API function to set/change current rate. 
		// This should update bottom tick labels
		this.setCurrentRate = function(currentRate) {
			if(!currentRate) return;

			state.currentRate = currentRate;

			if(state.sliderMode === 'rates') {
				// Update bottom labels
				// Update bottom tooltip
				toolTipBottom.html(convertSliderValueToPipRate())
				addLabels();
			}

		}
		
		// API function to set/change current deal price in pips. 
		// This should update bottom and top slider track and labels. 
		this.setDealPrice = function(dealPrice) {
			if(!dealPrice) return;

			state.dealPrice = dealPrice;

			if(state.sliderMode === 'pips') {
				// Update bottom labels
				// Update bottom tooltip
				toolTipBottom.html(convertSliderValueToPipRate())
				addLabels();
			}


		}

		return this;
		
	}

}(jQuery))