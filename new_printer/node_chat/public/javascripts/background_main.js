var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql  = require('mysql');


function connectDatabase() {

	// 创建一个connection
	var connection = mysql.createConnection({
		host     : '192.168.1.101',       // 主机
		user     : 'root',               // MySQL认证用户名
		password : '1',        // MySQL认证用户密码
		port: '3306',                   // 端口号
		database: 'free_chat_nw',
	});

	// 创建一个connection
	connection.connect(function(err) {

		if (err) {
			return;
		}
	});
	return connection;
}


function closeDatabase(connection) {

	// 关闭connection
	connection.end(function(err) {

		if(err) {
			return;
		}
	});
}


function querySqlOrder(sqlOrder, callback) {
	var connection = connectDatabase();

	// 执行查找语句
	connection.query(sqlOrder, function(err, result) {

		if (err) {
			return;
		}
		callback(result);

		closeDatabase(connection);
	});
}


function dealWithRequestFromForeground(req,res) {

	var title = req.body.a_title;
	var cont = req.body.a_cont;

	if (req.body.flag === "insert") {
		var sqlOrder = "insert into test_table (title,content) values ('"+title+"','"+cont+"')";
	} else if (req.body.flag === "select") {
		var sqlOrder = "select * from test_table";
	}
}


/*
* items_wanted : 想要的数据
* table : 数据所在的表
* items_filter : 作为筛选条件的字段的名称
* values_filter : 字段的值
* filter_condition : 指定返回记录的顺序
* res : 用来向前台返回数据的对象
*/

function selectData ( items_wanted, table, items_filter, values_filter, filter_condition, callback ) {
	var sqlOrder = "select ";

	for (var i = 0; i < items_wanted.length; i++){
		sqlOrder += items_wanted[i];
		if(i !== items_wanted.length-1 ){
			sqlOrder += ",";
		}
	}
	sqlOrder += " from ";
	sqlOrder += table;
	
	//如果有筛选条件，加上where
	if(items_filter[0] !== undefined){
		sqlOrder += " where ";
	}
	
	for (var i = 0; i < items_filter.length; i++){
		if(values_filter[i].length > 0 && typeof(values_filter[i]) !== 'string'){
			console.log('length:'+typeof(values_filter[i]));
			sqlOrder += items_filter[i] + " in(";
			values_filter[i].forEach(function(item,index){
				console.log('item:'+item);
				sqlOrder += "'" + item + "'";
				if(index === values_filter[i].length-1){
					sqlOrder += ")";
				}else{
					sqlOrder += ",";
				}
			});
		}else{
			sqlOrder += items_filter[i] + "='"+values_filter[i]+"'";
		}
		if(i !== items_filter.length-1 ){
			sqlOrder += " and ";
		}
	}
	sqlOrder += " " + filter_condition 
	console.log('sqlOrder:'+sqlOrder);
	querySqlOrder( sqlOrder, function(result){				 
		callback(result);
	});
}


function insertData( table, items, values, condition, callback ){
	var sqlOrder = "";
	sqlOrder += 'insert into ' + table;
	if(items[0] !== undefined){
		sqlOrder += ' (';
		for (var i = 0; i < items.length; i++){
			sqlOrder += items[i];
			if(i !== items.length-1 ){
				sqlOrder += ",";
			}
		}
		sqlOrder += ')';
	}
	sqlOrder += ' values (';
	for (var i = 0; i < values.length; i++){
		sqlOrder += "'" + values[i] + "'";
		if(i !== values.length-1 ){
			sqlOrder += ",";
		}
	}
	if(condition === 'select last_insert_id() as id'){
		sqlOrder += ")"; 
		queryInsertSqlorderAndReturnId( sqlOrder, condition, function(result){
			callback(result);
		});
	}else{
		sqlOrder += ") " + condition;
		querySqlOrder( sqlOrder, function(result){		 
			callback(result);
		});
	}
	console.log('sqlOrder:'+sqlOrder);
}


function queryInsertSqlorderAndReturnId(sqlOrder, condition, callback){
	var connection = connectDatabase();

	// 执行查找语句
	connection.query(sqlOrder, function(err, result) {

		if (err) {
			return;
		}
		connection.query(condition, function(err_1, result_1) {

			if (err_1) {
				return;
			}
			callback(result_1);
			closeDatabase(connection);
		});

	});
}


function updateData(table, updateItems, updateValues, filterItems, filterValues, filterCondition, callback){
	var sqlOrder = "update " + table + " set ";

	for (var i = 0; i < updateItems.length; i++){
		
		// 从这里开始
		var re = new RegExp('(\\+[\\d+])|(\\-[\\d+])|(\\*[\\d+])|(\\/[\\d+])' ,'ig') 

		if(re.test(updateValues[i])){
			sqlOrder += updateItems[i] + '=' + updateItems[i] + updateValues[i];
		}else{
			sqlOrder += updateItems[i] + '="' + updateValues[i] +'"';
		}
		if(i !== updateItems.length-1 ){
			sqlOrder += ",";
		}
	}
	sqlOrder += " where ";

	for (var i = 0; i < filterItems.length; i++){
		sqlOrder += filterItems[i] + "='"+filterValues[i]+"'";

		if(i !== filterItems.length-1 ){
			sqlOrder += " and ";
		}
	}
	sqlOrder += " " + filterCondition;
	querySqlOrder( sqlOrder, function(result){			 
		callback(result);
	});
}


function deleteData(table, filterItems, filterValues, filterCondition, callback){
	var sqlOrder = "delete from " + table + " where ";

	for (var i = 0; i < filterItems.length; i++){
		sqlOrder += filterItems[i] + '="' + filterValues[i] +'"';
		if(i !== filterItems.length-1 ){
			sqlOrder += ",";
		}
	}
	sqlOrder += " " + filterCondition; 
	querySqlOrder( sqlOrder, function(result){
		callback(result);
	});
}


module.exports = router;
module.exports.querySqlOrder = querySqlOrder;
module.exports.connectDatabase = connectDatabase;
module.exports.closeDatabase = closeDatabase;
module.exports.selectData = selectData;
module.exports.insertData = insertData;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;

