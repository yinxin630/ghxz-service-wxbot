'use strict';

const CO = require('co');
const sleep = require('./utils/sleep.js');
const Message = require('./utils/message.js');

// 微信网页版替换了console对象，需要再预加载中保留原生console对象
global.NativeConsole = window.console;

// Mongoose连接在窗体出现前后不同，此处为了一加载微信窗体就建立连接，供后续业务使用
const Mongoose = require('mongoose');
const mongodbAddress = require('./config/mongodb.js');
Mongoose.connect(mongodbAddress);

// 主流程
CO(function* () {
    let isLogged = false;
    while (!isLogged) {
        isLogged = checkLoginStatus();
        yield sleep(500);
    }

    let getAllNewMessagesTask = Message.getAllNewMessages();
    while (true) {
        let newMessages = yield* getAllNewMessagesTask();
        Message.showMessages(newMessages);

        yield sleep(1000);
    }
});

var waitLogin = false;
function checkLoginStatus() {
    let qrcodeDiv = document.querySelector('.qrcode');
    let chatItemDiv = document.querySelector('.chat_item')

    if (chatItemDiv) {
        NativeConsole.log('用户已登录');
        return true;
    }
    else if (qrcodeDiv) {
        let qrcodeImage = qrcodeDiv.firstElementChild;
        if (qrcodeImage && qrcodeImage.src.match(/.*login.weixin.qq.com\/qrcode\/.*/)) {
            if (!waitLogin) {
                NativeConsole.log(`获取到二维码 -> [${qrcodeDiv.firstElementChild.src}] 请扫一扫登录`);
            }
            waitLogin = true;
        }
        else {
            waitLogin = false;
            NativeConsole.log('用户未登录，获取登录二维码');
        }
    }
    else {
        NativeConsole.log('页面未加载完毕');
    }
    return false;
}