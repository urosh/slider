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
			sliderContainerHeight: null
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
			toolTipHeight: 30,
			toolTipWidth: 90,
			toolTipFontSize: 16,
			risk: 150
		}, options);
		
		state.min = -4 * settings.risk;
		state.max = 4 * settings.risk;
		state.sliderValue = settings.value;
		state.tickValues = [-2 * settings.risk, -1 * settings.risk, 0, settings.risk, 2 * settings.risk];

		state.sliderWidth = parentWidth - settings.sliderPadding * 2;
		state.sliderContainerHeight = ( settings.sliderHeight + 2 * settings.ticksHeight + 2 * settings.ticksLabelFontSize ) * 3;

		var sliderContainer = $('<div class="slider-container em-payout-slider"></div>');	
		var sliderTrack = $('<div class="slider-track"><div class="slider-track-half left"></div><div class="slider-track-half right"></div></div>');
		
		var sliderHandle = $('<div class="slider-handle"><span class="slider-arrow slider-left-arrow fa fa-angle-left"></span><span class="fa fa-angle-right slider-right-arrow slider-arrow"></span></div>');
		
		var ticksTopContainer = $('<div class="slider-tick-container top"></div>');	
		var ticksBottomContainer = $('<div class="slider-tick-container bottom"></div>');
		var tickLabelsTopContainer = $('<div class="slider-tick-labels-container top"></div>');
		var tickLabelsBottomContainer = $('<div class="slider-tick-labels-container bottom"></div>');
		
		// Tooltips
		var toolTipTop = $('<div class="slider-tooltip top">0</div>');
		var toolTipBottom = $('<div class="slider-tooltip bottom"> ' + convertSliderValueToPipRate() + ' </div>');
		
		// Slider mode
		var sliderModeMenu = $('<div class="slider-menu"><div data-slider-menu-item="pips" class="slider-menu-item ">Pips</div><div data-slider-menu-item="rates" class="slider-menu-item active">Rates</div></div>');

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


		sliderContainer.append(sliderTrack);	
		sliderContainer.append(sliderHandle);	
		sliderContainer.append(ticksTopContainer);	
		sliderContainer.append(ticksBottomContainer);	
		sliderContainer.append(tickLabelsTopContainer);	
		sliderContainer.append(tickLabelsBottomContainer);	
		sliderContainer.append(toolTipTop);
		sliderContainer.append(toolTipBottom);
		sliderContainer.append(sliderModeMenu);

		function convertTickValueToTickLabel(tickValue) {
			return tickValue < 0 ? '+' + (-tickValue) : '+' + tickValue	
		}
		
		function convertTickValueToRate(tickValue, mode) {
			return tickValue * state.dealPrice / settings.risk;
		}

		function formatRateValue(rateValue) {
			rateValue = rateValue.toString();
			var fullNumber = rateValue.split('.')[0];
			var decimalNumber = rateValue.split('.')[1];
			var decimalFirstPart = decimalNumber.substring(0, 2);
			var decimalSecondPart = decimalNumber.substring(2, 4);
			var decimalThirdPart = decimalNumber.substring(4, 5);
			console.log('<div><span class="full-number"> ' + fullNumber + ' </span><span class="decimal-first-part">  ' + decimalFirstPart + ' </span><span class="decimal-second-part" > ' + decimalSecondPart + '  </span><span class="decimal-third-part"> ' + decimalThirdPart + ' </span></div>');
		}
		
		formatRateValue(state.currentRate);

		state.tickValues.forEach(function(tickValue, i) {
			if(tickValue !== 0){
				var tickBottom = $('<div class="slider-tick small"></div>');
				var tickTop = $('<div class="slider-tick small"></div>');
				
				var labelTop = $('<div data-label-index=' + i + ' class="topLabel">' + convertTickValueToTickLabel(tickValue) + '</div>');

				/*var labelBottom = $('<div data-label-index= ' + i + ' class="bottomLabel">' + convertTickValueToRate(tickValue, state.sliderMode) + '</div>');*/
				var labelBottom = $('<div data-label-risk= ' + tickValue + ' class="bottomLabel">' + convertSliderValueToPipRate(tickValue) + '</div>');

				var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
				
				ticksTopContainer.append(tickTop);
				ticksBottomContainer.append(tickBottom);

				tickBottom.css({
					left: tickOffset -1  + 'px',
					height: settings.ticksHeight + 'px'
				})
				tickTop.css({
					left: tickOffset -1 + 'px',
					height: settings.ticksHeight + 'px'
				});
				
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

				state.ticksPositions.push(tickOffset);
				
			}else{
				var tickBottom = $('<div class="slider-tick big"></div>');
				var tickTop = $('<div class="slider-tick big"></div>');
				var tickOffset = convertValueToOffset(tickValue) - settings.sliderPadding;
				
				ticksTopContainer.append(tickTop);
				ticksBottomContainer.append(tickBottom);

				tickBottom.css({
					left: tickOffset - 1+ 'px',
					height: state.sliderContainerHeight / 2 - settings.sliderPadding / 2 + 'px'
				})
				tickTop.css({
					left: tickOffset -1 + 'px',
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
			});

			$(document).on('click', '.slider-menu-item', function(e) {
				$('.slider-menu-item').removeClass('active');
				$(this).addClass('active');
				state.sliderMode = $(this).attr('data-slider-menu-item');
				modeChange();
			})

		}

		var mouseTracking; 
		var mouseTrackingInterval;
		var limitReached = false;

		function setMouseTrackingInterval() {
			mouseTrackingInterval = setInterval(function() {
				if(!state.mouseClient) {
					return;
				}
				
				state.mouseXContainerOffset = state.mouseClient.pageX - sliderContainer.offset().left;

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

		function convertSliderValueToPipRate(value) {
			var sliderValue = value || state.sliderValue;
			if(state.sliderMode === 'rates'){
				return convertRiskToPrice(sliderValue);
			}

			return convertRiskToPips(sliderValue);
		}

		function convertOffsetToValue(x) {
			return  (x - settings.sliderPadding) * (state.max - state.min ) / state.sliderWidth + state.min; 
		}
		
		function convertValueToOffset(v) {
			return  settings.sliderPadding + ( state.sliderWidth * ( v - state.min) ) / ( state.max - state.min );
		}
			
		function updateLabels() {
			
		}

		function updateTicks() {

		}
		
		

		function convertRiskToPrice(risk) {
			return parseFloat((state.currentRate + convertRiskToPips(risk) / 100000).toFixed(5));	
		}

		function convertRiskToPips(risk) {
			return risk * state.dealPrice / settings.risk;	
		}

		addEventListeners();
		
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

		this.setRisk = function(risk) {

		}

		this.setCurrentPrice = function(currentPrice) {

		}

		this.setDealPrice = function(dealPrice) {

		}


		
	}

}(jQuery))