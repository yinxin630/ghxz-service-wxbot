const CO = require('co');

// 微信网页版替换了console对象，需要再预加载中保留原生console对象
const NativeConsole = window.console;

/**
 * 将执行线程暂停一段时间
 * @param 暂停的时间，单位毫秒ms
 */
function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

CO(function* () {
    var hasLogged = false;
    while (!hasLogged) {
        hasLogged = checkLoginStatus();
        yield sleep(500);
    }

    while (true) {
        if (hasNewMessage()) {
            NativeConsole.log('有新消息');
        }

        yield sleep(100);
    }
});

function checkLoginStatus() {
    var qrcodeDiv = document.querySelector('.qrcode');
    var chatItemDiv = document.querySelector('.chat_item')

    if (chatItemDiv) {
        NativeConsole.log('用户已登录');
        return true;
    }
    else if (qrcodeDiv) {
        var qrcodeImage = qrcodeDiv.firstElementChild;
        if (qrcodeImage && qrcodeImage.src.match(/.*login.weixin.qq.com\/qrcode\/.*/)) {
            NativeConsole.log(`获取到二维码 -> [${qrcodeDiv.firstElementChild.src}] 请扫一扫登录`);
        }
        else {
            NativeConsole.log('用户未登录，获取登录二维码');
        }
    }
    else {
        NativeConsole.log('页面未加载完毕');
    }
    return false;
}

function hasNewMessage() {
    var chatItemDiv = document.querySelector('.chat_item');
    var unreadMessagesI = chatItemDiv.querySelector('.web_wechat_reddot_middle');
    if (unreadMessagesI) {
        return true;
    }
}