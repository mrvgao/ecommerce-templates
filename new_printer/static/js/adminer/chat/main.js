var socket = io('http://127.0.0.1:3000');

var Main = {};
Main.userInfo = null;

$(function(){
	Main.getUserInfoInLocalStorage();
});



Main.getUserInfoInLocalStorage = function(){
	if(localStorage.userInfo){
		Main.userInfo = JSON.parse(localStorage.userInfo);
	}
}


Main.checkLogin = function(){
	if(Main.userInfo === undefined){
		location.href = './login.html'
	}
}


function l(cont){
	console.log(cont);
}


function last(cont, data){
	console.log(cont+JSON.stringify(data));	
};
