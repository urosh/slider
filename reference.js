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
	sliderMode: null,
	dealPrice: 12,
	currentRate: 1.32781,
	sliderWidth: null,
	sliderContainerHeight: null,
	snapEnabled: null
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

var sliderContainer ;	
var sliderTrack = ;

var sliderHandle = ;

var ticksTopContainer = ;	
var ticksBottomContainer = ;
var tickLabelsTopContainer = ;
var tickLabelsBottomContainer = ;

// Tooltips
var toolTipTop = ;
var toolTipBottom = ;


var downLabel;
var currencyLabel;
var upLabel;


// Slider mode
var sliderModeMenu = ;

function initializeState() {}
function initializeDomElements() {}
function addDomElements() {}


function convertTickValueToTickLabel(){}
function formatRateValue() {}
function addEventListeners(){}
function setMouseTrackingInterval(){}
function convertSliderValueToPipRate() {}

function convertOffsetToValue(){}
function convertValueToOffset(){}

function convertRiskToPrice(){}

function modeChange(){}



