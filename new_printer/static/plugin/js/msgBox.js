/* 弹出框
*  Author:Well and CKY
*  参数:
*   第一个是标题、（必填）
*   第二个是内容、 (选填、不填为可输入状态)
*   第三个是回调函数、
*   输入框内的值由变量 _msgTxt 接收
*/

(function () {
    $.msgBox = function (title, msg, callback){
        if(msg && typeof msg === "function"){ 
            callback=msg;
        }
        GenerateHtml(title, msg);
        btnOk(callback);
        btnNo();
    };

    // 参数：文本、时间、回调
    $.msgBox.mini = function (txt,time,callback){
        var str = "<div id='msgBoxMini'></div>";
        $('body').append(str);
        var msgBoxMini = $('#msgBoxMini'),
            _time = 1400;

        if(time && typeof time == 'number') _time = time;
        msgBoxMini.css({
            'min-height':'18px',
            'min-width':'100px',
            'position':'fixed',
            'left':'50%',
            'top':'50%',
            'z-index':'9999',
            'font-size':'16px',
            'padding':'40px 50px',
            'border-radius':'4px',
            'box-shadow':'0px 0px 12px 2px #aaa',
            'background':'rgba(121,208,206,.9)',
            'color':'#fff',
            'border':'3px solid #f9f9f9',
            'text-align':'center'
        });

        var _w = msgBoxMini.outerWidth(true),
            _h = msgBoxMini.outerHeight(true);
        msgBoxMini.css({
            'margin-left':-_w/2,
            'margin-top':-_h/2
        });
        this.show=(function (){
            msgBoxMini.text(txt);
            msgBoxMini.show();
            setTimeout(function (){
                msgBoxMini.fadeOut(function (){
                    msgBoxMini.remove();
                    if(typeof time == 'function'){
                        time();
                    }else if(typeof callback == 'function'){
                        callback();
                    }
                });
            },_time);
        })();
    };

    //生成Html
    var GenerateHtml = function (title, msg) {
        var _html = "";
        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';
        if(msg && typeof msg !== "function"){
            _html += '<div id="mb_msg">'+msg+'</div>';
        }else{
            _html +='<textarea style="resize:none;" placeholder="请输入信息" id="mb_text" row="3"></textarea>';
        }
        _html +='<div id="mb_btnbox">';
        if(msg && typeof msg == "function"){
             _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html +='<input id="mb_btn_ok" type="button" value="确定" />';
        _html += '</div></div>';
        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); GenerateCss();
    };
    //生成Css
    var GenerateCss = function () {
        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'
        });
        $("#mb_con").css({ zIndex: '999999', width: '340px', position: 'fixed',
            backgroundColor: 'White', borderRadius: '10px'
        });
        $("#mb_tit").css({ display: 'block', fontSize: '14px', color: '#444', padding: '10px 15px',
            backgroundColor: '#DDD', borderRadius: '10px 10px 0 0',
            borderBottom: '3px solid #009BFE', fontWeight: 'bold'
        });
        $("#mb_msg").css({ padding: '40px 20px', lineHeight: '20px',color:"#444",
            borderBottom: '1px dashed #DDD', fontSize: '13px', textAlign: 'center'
        });
        $("#mb_text").css({ padding: '10px', lineHeight: '20px',color:"#444",height:'60px',width:'250px',margin:"10px 35px",
            border:'none', fontSize: '14px',outline:'none',overflow:'auto', borderBottom: '1px dashed #DDD'
        });
        $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'center' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '85px', height: '30px', color: 'white', border: 'none', backgroundColor: '#168bbb', cursor: 'pointer' });
        $("#mb_btn_no").css({"marginRight":"30px",background:"#ddd",color:"#666"});
        var _widht = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高
        var boxWidth = $("#mb_con").width();
        var boxHeight = $("#mb_con").height();
        //让提示框居中
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    };

    //确定按钮事件
    var btnOk = function (callback) {
        $("#mb_btn_ok").on('click',function () {
            _msgTxt = $("#mb_text").val();
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) === 'function') {
                callback();
            }
            return _msgTxt;
        });
    };
    var btnNo = function () {
        $("#mb_btn_no").on('click',function () {
            $("#mb_box,#mb_con").remove();
            return false;
        });
    };
})();
