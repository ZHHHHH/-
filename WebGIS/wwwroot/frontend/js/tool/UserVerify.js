$(document).ready(function () {
    $('#LoginOutBtn').click(function(){
        showMash("正在退出登录中......",function(){
            $.post(LoginOutUrl, {}, function (data) {
                if (data.code == "0") {
                    hideMash();
                    window.location.href = data.data;
                }
            });
        })
    })
})