document.writeln("    <div id=\'maskDiv\'>");
document.writeln("        <div id=\'loading-mask\'>");
document.writeln("            <div id=\'loading-center-mask\'>");
document.writeln("                <div id=\'loading-center-absolute-mask\'>");
document.writeln("                    <div class=\'object-mask\' id=\'object_one_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_two_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_three_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_four_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_five_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_six_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_seven_mask\'></div>");
document.writeln("                    <div class=\'object-mask\' id=\'object_eight_mask\'></div>");
document.writeln("                </div>");
document.writeln("            </div>");
document.writeln("        </div>");
document.writeln("        <div id=\'maskTip\'></div>");
document.writeln("    </div>");

document.write('<link rel="stylesheet" type="text/css" href="/frontend/lib/lobibox/css/lobibox.css" />');
document.write('<script src="/frontend/lib/lobibox/js/lobibox.js"></script>');
/**
 * @method 弹出提示框
 * @param {string} msg 要提示的消息
 * @param {string} type 提示框的类型：default，info，warning，error，success，默认为success
 * @param {boolean} rounded 若为true，提示框为圆形，若为false，提示框为正方形，默认为false
 * @param {boolean} delayIndicator 若为true，则显示时间进度条，若为false，则不显示时间进度条，默认为true
 * @param {string} size 提示框尺寸大小：large，mini，默认为mini
 * @param {string} img 要显示的图片路径
 * @param {string} title 标题
 * @param {string} sound 若为true，开启提示音，若为false，关闭提示音，默认为true
 */
function ShowMiniNotice(msg, type, rounded, delayIndicator, size, img, title, sound) {
    if (type == null) {
        type = 'success';
    }
    if (rounded == null) {
        rounded = false;
    }
    if (delayIndicator == null) {
        delayIndicator = true;
    }
    if (size == null) {
        size = 'mini';
    }
    if (sound == null) {
        sound = true;
    }
    Lobibox.notify(type, {
        size: size,
        rounded: rounded,
        delayIndicator: delayIndicator,
        img: img,
        title: title,
        sound: sound,
        msg: msg
    });
}

/**
 * @method 弹出警告提示框
 * @param {string} msg 要提示的消息
 * @param {string} type 提示框的类型：info，warning，error，success，默认为info
 */
function ShowMsg(msg, type) {
    if (type == null) {
        type = 'info'
    }
    Lobibox.alert(type, {
        title:"提示([Esc]键返回)",
        msg: msg,
        buttons: {
            ok: {
                text: "确定"
            }
        }
    });
}

/**
 * @method 弹出确认提示框
 * @param {string} msg 要提示的消息
 * @param {string} callback 回调函数：function($this, type),type:'yes','no'
 */
function ShowConfirmMsg(msg, callback) {
    Lobibox.confirm({
        msg: msg,
        title: "确认操作",
        buttons: {
            yes: {
                'class': 'btn btn-success',
                text: "确定"
            },
            no: {
                'class': 'btn btn-warning',
                text: "取消"
            }
        },
        callback: callback
    });
}


//添加遮罩
function showMash(tipText, callback) {
    var mask = $('#maskDiv');
    mask.css('width', $(document.body).width());
    mask.css('height', $(document.body).height());
    var maskloading = $('#loading-mask');
    maskloading.css('top', (mask.height() - maskloading.height()) / 2);
    maskloading.css('left', (mask.width() - maskloading.width()) / 2 - 20);
    var maskTip = $('#maskTip');
    if (tipText != null)
        maskTip.text(tipText);
    maskTip.css('top', (mask.height() - maskTip.height()) / 2 + maskloading.height() + 10);
    maskTip.css('width', mask.width());
    if (typeof (callback) != 'undefined')
        mask.show(callback);
    else
        mask.show();
    isMashShow = true;
}
//隐藏遮罩
function hideMash() {
    $('#maskDiv').hide();
    isMashShow = false;
}