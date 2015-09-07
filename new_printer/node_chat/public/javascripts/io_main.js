var bgMain = require('./background_main');
var SERVICE_NAME = "【3DiLove客服】达芬奇";

var TABLES ={
	user: {
		tableName: 'user',
		username: 'username',
		password: 'password',
		position: 'position',
		protrait: 'protrait'
	},
	chatData: {
		tableName: 'chat_data',
		fromUser: 'from_user',
		toUser: 'to_user',
		content: 'content',
		tinyProtrait: 'tiny_protrait',
		date: 'date'
	}
}

var socketMap = [];
/*var socketMap = {};*/
/*socketMap.customer = [];*/
/*socketMap.customerService = [];*/
var customerServiceList = [];

var usersInfos = [];

function socketMain(socket){
	
	// when a user get connect 
	console.log('user connected'+socket.handshake.address);


	/*socket.on('login/', function(username, password){*/
	/*bgMain.selectData(['*'], TABLES.user.tableName, [TABLES.user.username, TABLES.user.password], [username, password], '', function(result){*/
	/*socket.emit('callback/login/', result[0]);*/
	/*}); */
	/*});*/


	socket.on('chat/logged_in_user/connect', function(userInfo){
		l('logged_in_user');
		var username = userInfo.username;
		var nickname = userInfo.nickname;
		/*socketMap.customer[username] = socket; */
		socketMap[username] = socket;
		socket.emit('callback/logged_in_user/connect', usersInfos);
		socket.broadcast.emit('chat/a_user_connect', userInfo);
	});


	socket.on('chat/anonymous_user/connect', function(){
		l('anonymous_user');
		var ipAddress = socket.handshake.address;
		ipAddress = ipAddress.replace(/([:]+|[.]+|[f]+)/ig,'');
		username = nickname = '顾客'+ipAddress;
		/*socketMap.customer[username] = socket;*/
		socketMap[username] = socket;
		socket.emit('callback/chat/anonymous_user/connect',username,customerServiceList[0]);
	});


	socket.on('chat/customer_service/connect', function(){
		l('customer_service');
		var ipAddress = socket.handshake.address;
		ipAddress = ipAddress.replace(/([:]+|[.]+)/ig,'');
		/*username = nickname = ipAddress;*/
		username = nickname = SERVICE_NAME;
		/*socketMap.customerService[username] = socket;*/
		socketMap[username] = socket;
		socket.emit('callback/chat/customer_service/connect',username);
		customerServiceList.push(username);

		l('ip:'+ipAddress);
	});


	socket.on('chat/disconnect', function(userInfo){
		l('disconnect');
		var username = userInfo.username;
		var nickname = userInfo.nickname;

		socketMap[nickname] = null; 

		usersInfos.forEach(function(item,index){

			if(item.username === username){
				usersInfos.splice(index,1);
			}
		});

		socket.broadcast.emit('chat/a_user_disconnect', userInfo);
	});


	socket.on('chat/a_new_message', function(fromUser, toUser, message){
		var socketTargUser = socketMap[toUser];
		if(socketTargUser !== undefined){
			socketTargUser.emit('chat/a_new_message', message, fromUser);

			var date = new Date();
			var myDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

			bgMain.insertData(TABLES.chatData.tableName, [TABLES.chatData.fromUser, TABLES.chatData.toUser, TABLES.chatData.content, TABLES.chatData.tinyProtrait, TABLES.chatData.date], [fromUser, toUser, message, '', myDate], '', function(result){
				;				 
			});
		}
	})
	

	socket.on('chat/new_chat_message', function(fromUser, toUser, message){
		var socketTargUser = socketMap[toUser];
		if(socketTargUser !== undefined){
			socketTargUser.emit('chat/new_chat_message', message, fromUser);
			/*var date = new Date();*/
			/*var myDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();*/

			/*bgMain.insertData(TABLES.chatData.tableName, [TABLES.chatData.fromUser, TABLES.chatData.toUser, TABLES.chatData.content, TABLES.chatData.tinyProtrait, TABLES.chatData.date], [fromUser, toUser, message, '', myDate], '', function(result){*/
			/*;				 */
			/*});*/
			l('emmied');
		}else{
			l('not emmied:'+toUser);
		}

	});


	socket.on('chat/get_chat_data', function(mainUser, chatWithUser, selectFrom, selectSum){
		var filterCondition = 'order by id desc limit '+selectFrom+','+selectSum;
		bgMain.selectData(['*'], TABLES.chatData.tableName, [TABLES.chatData.fromUser, TABLES.chatData.toUser], [[mainUser, chatWithUser], [mainUser, chatWithUser]], filterCondition, function(result){
			socket.emit('callback/chat/get_chat_data', chatWithUser, result);
		}); 
	});

}


function l(cont){
	console.log(cont);
}
function last(cont, data){
	console.log(cont+JSON.stringify(data));
}

module.exports.socketMain = socketMain;
