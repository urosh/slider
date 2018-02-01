$(document).ready(function() {
	console.log('We got here');
	var em_slider = $('.mySlider').easyTradePayoutSlider({
		ticksLabels: [1, 2, 4]
	});


	
	setTimeout(function(){
		console.log(em_slider);
		em_slider.setRisk(300);
	}, 3000)
})