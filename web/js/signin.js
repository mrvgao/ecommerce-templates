$(function(){
	//telephone
	$("#telephone").blur(function()
	{
		var telephone = $("#telephone").val();
		if (telephone=="") {
			return;
		};
		var dataObject = {
			telephone:$("#telephone").val()
		};
		$.ajax({
		type:"post",
		url:"#",
		data:dataObject,
		dataType:json,
		success:function(msg)
		{
			if(msg.exist==="success"){
				$(".reg-tel-span").css('visibility','visible');
			}
			
		}
		});
	});
	//confirm
	$("#confbtn").click(function() {

		$("#confbtn").attr("disabled", true);
		$(".reg-conf-span").css('visibility','visible');


	});

	//confirm-code
	$("#confirm-code").blur(function()
	{
		var dataObject = {
			confirmcode:$("#confirm-code").val()
		};
		$.ajax({
		type:"post",
		url:"#",
		data:dataObject,
		success:function(msg)
		{
			if(msg==="false"){
				$(".reg-telconf-span").css('visibility','visible');
				$("#confbtn").removeAttr('disabled');
			}
			
		}
		});
	});

	//password
	$('#password').keyup(function(e) {
     var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
     var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
     var enoughRegex = new RegExp("(?=.{6,}).*", "g");
     var p = $(this).val();
     if($(this).val()==""){
     	$('#weak-first').css('background-color','#7fe5ff');
            $("#middle").css('background-color','#7fe5ff');
            $("#strong").css('background-color','#7fe5ff');
            return;
     }
     if (false == enoughRegex.test($(this).val())) {
            $('#weak-first').css('background-color','#4389a2');
            $("#middle").css('background-color','#7fe5ff');
            $("#strong").css('background-color','#7fe5ff');
     } 
      else if (mediumRegex.test($(this).val())) {
             $("#middle").css('background-color','#4389a2');
             $("#strong").css('background-color','#7fe5ff');
     } 
     else if (strongRegex.test($(this).val())) {
             $("#strong").css('background-color','#4389a2');
     } 
    
     return true;
});
	//confirm password

	$("#confirm_password").blur(confirmPassword);

	function confirmPassword(){

		if ($("#password").val()!="") {
			if($("#password").val()!=$("#confirm_password").val()){
				$(".confpass").show();
			}
			else{
				$(".confpass").hide();
				return true;
			}
		};
		return false;
	}
	//sign in
	$("#register").click(function(){
		var dataObject = {

		};
	});
    //login
	$(".signin-button").click(function () {
		var dataObject = {
			username:$("[name='username']").val(),
			password:$("[name='password']").val()
		};
		$.ajax({
            type: 'post',
            url: '#',
            data: dataObject,
            dataType: "json",
            success: function (response) {
                if (response.success === "true") {
                	location.href="#";	
                } else {
                    alert('用户名密码错误请重新输入！');
                    $("[name='username']").focus();
                }
            }
        });
        return false;
	});
})

