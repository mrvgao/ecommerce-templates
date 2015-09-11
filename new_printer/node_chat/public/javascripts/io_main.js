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
var socketMap = [],
	chatDataMap = [],
	customerServiceList = [],
	usersInfos = [],
	timerMap = [];


function socketMain(socket){

	// when a user get connect 
	console.log('user connected:'+socket.id);

	socket.on('chat/logged_in_user/connect', function(userInfo){
		l('logged_in_user');
		var username = userInfo.username;
		var nickname = userInfo.nickname;
		socketMap[username] = socket;
		socket.emit('callback/logged_in_user/connect', usersInfos);
		socket.broadcast.emit('chat/a_user_connect', userInfo);
	});


	socket.on('chat/anonymous_user/connect', function(Username){
		l('anonymous_user');
		var username, nickname;

		if(Username === null || Username === ''){
			username = socket.id;	
		}else{
			username = Username;
		}

		if(socketMap[username] !== undefined && socketMap[username] !== null){
			socketMap[username].emit('chat/another_user_connect_with_this_id');
		}
		/*else{*/
		/*socket.emit('callback/chat/anonymous_user/connect/failed');*/
		/*}*/
		/*if(socketMap[username] === undefined || socketMap[username] === null){*/

		var ipAddress = socket.handshake.address;
		ipAddress = ipAddress.replace(/([:]+|[.]+|[f]+)/ig,'');
		nickname = '顾客'+ipAddress;
		socketMap[username] = socket;

		if(chatDataMap[username] === undefined){
			chatDataMap[username] = [];
		}

		// 如果用户在一段时间以内再次登录，取消删除该用户的聊天记录的timeout
		clearTimeout(timerMap[username]);
		var targService = customerServiceList[0];
		socket.emit('callback/chat/anonymous_user/connect/succeed',username,nickname,targService,chatDataMap[username][targService]);
	});


	socket.on('chat/customer_service/connect', function(){
		l('customer_service');
		var username, nickname;
		username = nickname = SERVICE_NAME;

		if(socketMap[username] !== undefined && socketMap[username] !== null){
			socketMap[username].emit('chat/another_user_connect_with_this_id');
		}
		/*if(socketMap[username] === undefined || socketMap[username] === null){*/
			var ipAddress = socket.handshake.address;
			ipAddress = ipAddress.replace(/([:]+|[.]+)/ig,'');
			socketMap[username] = socket;

			if(chatDataMap[username] === undefined){
				chatDataMap[username] = [];
			}
			customerServiceList.push(username);
			socket.emit('callback/chat/customer_service/connect/succeed',username);
			/*}else{*/
			/*socket.emit('callback/chat/customer_service/connect/failed',username);*/
			/*}*/
	});


	/*socket.on('chat/disconnect', function(userInfo){*/
	/*l('disconnect');*/
	/*var username = userInfo.username;*/
	/*var nickname = userInfo.nickname;*/

	/*socketMap[nickname] = null; */

	/*usersInfos.forEach(function(item,index){*/

	/*if(item.username === username){*/
	/*usersInfos.splice(index,1);*/
	/*}*/
	/*});*/

	/*socket.broadcast.emit('chat/a_user_disconnect', userInfo);*/
	/*});*/


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


	socket.on('chat/new_chat_message', function(fromUser, fromNickname, toUser, message){
		var socketTargUser = socketMap[toUser];

		if(socketTargUser !== undefined){
			socketTargUser.emit('chat/new_chat_message', message, fromUser, fromNickname);
			/*var date = new Date();*/
			/*var myDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();*/

			/*bgMain.insertData(TABLES.chatData.tableName, [TABLES.chatData.fromUser, TABLES.chatData.toUser, TABLES.chatData.content, TABLES.chatData.tinyProtrait, TABLES.chatData.date], [fromUser, toUser, message, '', myDate], '', function(result){*/
			/*;				 */
			/*});*/

			if(chatDataMap[fromUser][toUser] === undefined){
				chatDataMap[fromUser][toUser] = [];
			}

			if(chatDataMap[toUser][fromUser] === undefined){
				chatDataMap[toUser][fromUser] = [];
			}
			var msgContainer = {
				fromUser: fromUser,
				fromNickname: fromNickname,
				toUser: toUser,
				message: message
			}
			chatDataMap[fromUser][toUser].push(msgContainer);
			chatDataMap[toUser][fromUser].push(msgContainer);
		}else{
			l('msg not emited:"'+socketTargUser+'" not found');
		}

	});


	socket.on('chat/get_chat_data', function(mainUser, chatWithUser, selectFrom, selectSum){
		var filterCondition = 'order by id desc limit '+selectFrom+','+selectSum;
		bgMain.selectData(['*'], TABLES.chatData.tableName, [TABLES.chatData.fromUser, TABLES.chatData.toUser], [[mainUser, chatWithUser], [mainUser, chatWithUser]], filterCondition, function(result){
			socket.emit('callback/chat/get_chat_data', chatWithUser, result);
		}); 
	});


	socket.on('disconnect', function() {

		// clear useless sockets and chatdatas about this user
		for(var key in socketMap){

			if(socketMap[key].id && socketMap[key].id === socket.id){
				socketMap[key] = null;
				timerMap[key] = setTimeout(function(){
					delChatDataUseless(key);
					var socketTargUser = socketMap[SERVICE_NAME];

					if(socketTargUser !== undefined){
						socketTargUser.emit('chat/a_user_disconnect', key);
					}
				},1000); // in 10min
				break;
			}
		}
	});
}


function l(cont){
	console.log(cont);
}


function last(cont, data){
	console.log(cont+JSON.stringify(data));
}


function delChatDataUseless(username){
	delete chatDataMap[username];
	delete socketMap[username];
	console.log('clear useless chat data:'+username);
}


module.exports.socketMain = socketMain;
/*module.exports.delChatDataUselessInRegularTime = delChatDataUselessInRegularTime;*/
