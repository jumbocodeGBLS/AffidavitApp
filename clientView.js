$(document).ready(function(){
	$("#myCarousel").carousel({interval: false});
    $(document).on( "click", ".answer", function () {
    	$(this).css("background", "#348017");
    	$(this).siblings('.answer').css("background", "#64E986");
    	useranswer[this.getAttribute("name")[8]] = parseInt(this.getAttribute("value"));
    });
});