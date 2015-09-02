swfobject.addDomLoadEvent(function () {
    var swf = new fullAvatarEditor("fullAvatarEditor.swf", "expressInstall.swf", "change_img", {
            id : "swf",
            upload_url : "/designer/u_img",
            method : "post",
            avatar_tools_visible : false,
            avatar_sizes : '140*140',
            avatar_intro : '以下是最终头像展示效果',
            src_upload : 0
        }, function (msg) {
            switch(msg.code)
            {
                case 5 : 
                    if(msg.type == 0)
                    {
                        window.location.reload();

                    }
                break;
            }

        }
    );
});