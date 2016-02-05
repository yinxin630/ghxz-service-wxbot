'use strict';

const CO = require('co');
const sleep = require('./utils/sleep.js');
const Message = require('./utils/message.js');

// 微信网页版替换了console对象，需要再预加载中保留原生console对象
global.NativeConsole = window.console;
// global.document = document;

// 主流程
CO(function* () {
    var hasLogged = false;
    while (!hasLogged) {
        hasLogged = checkLoginStatus();
        yield sleep(500);
    }

    var getMessagesTask = Message.getAllNewMessages();
    while (true) {
        var newMessages = yield* getMessagesTask();
        Message.showMessages(newMessages);

        yield sleep(1000);
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