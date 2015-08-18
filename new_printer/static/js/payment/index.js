$("#main").click(function(e) {
	$.ajax({
		type: 'get',
        url: '/payment/pay',
        data: {},
        success: function(e) {
             var url = JSON.parse(e)['state'];
            //window.location.replace(url);
            gotoUrl(url);
		}
	})
});

function gotoUrl(url) {
    var gotoLink = document.createElement('a');
    gotoLink.href = url;
    document.body.appendChild(gotoLink);
    gotoLink.click();
};