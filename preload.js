'use strict';

const CO = require('co');
const Electron = require('electron');
const Clipboard = Electron.clipboard;
const Plain = require('./messages/plain.js');
const App = require('./messages/app.js');
const Card = require('./messages/card.js');

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

// 主流程
CO(function* () {
    var hasLogged = false;
    while (!hasLogged) {
        hasLogged = checkLoginStatus();
        yield sleep(500);
    }

    var getMessagesTask = getAllNewMessages();
    while (true) {
        var newMessages = yield* getMessagesTask();
        showMessages(newMessages);

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

function getAllNewMessages() {
    var currentFormMessagesNumber = 0;
    return function* () {
        var messages = [];
        
        // 开始获取当前窗体消息
        var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
        var getMessages = getFormNewMessages(currentFormMessages.length - currentFormMessagesNumber);
        messages.push(...getMessages);
        currentFormMessagesNumber = currentFormMessages.length;
        
        // 开始获取其它窗体消息
        var newMessageReddots = document.querySelectorAll('.web_wechat_reddot_middle');
        for (var dIndex = 0; dIndex < newMessageReddots.length; dIndex++) {

            var reddotNumber = Number.parseInt(newMessageReddots.item(dIndex).textContent)
            var tempChatForm = newMessageReddots.item(dIndex).parentElement.parentElement;

            tempChatForm.click();
            yield sleep(50);

            var otherMessages = getFormNewMessages(reddotNumber);
            messages.push(...otherMessages);

            var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
            currentFormMessagesNumber = currentFormMessages.length;
        }
        return messages;
    }
}

function getFormNewMessages(count) {
    var messages = [];
    var currentFormMessages = document.querySelectorAll('.you > .content > .bubble > .bubble_cont > *');
    var messageFrom = document.querySelector('.title_name').textContent;

    for (var mIndex = 0; mIndex < count; mIndex++) {
        var tempNewMessage = currentFormMessages.item(currentFormMessages.length - count + mIndex);
        var newMessage = undefined;
        
        var type = tempNewMessage.attributes.getNamedItem('class').textContent;
        switch (type) {
            case 'plain': {
                newMessage = new Plain(tempNewMessage, messageFrom);
                
                // reply(newMessage);
                
                break;
            }
            case 'app': {
                newMessage = new App(tempNewMessage, messageFrom);
                
                // reply(newMessage);
                
                break;
            }
            case 'card': {
                newMessage = new Card(tempNewMessage, messageFrom);
                
                tempNewMessage.click();
                var userCardInfo = document.querySelector('#mmpop_profile > .profile_mini > .profile_mini_bd > .nickname_area');
                userCardInfo.children[0].click();
                
                // reply(newMessage);
                
                break;
            }
        }

        messages.push(newMessage);
    }

    return messages;
}

function showMessages(messages) {
    for (var message of messages) {
        NativeConsole.log('收到' + message);
    }
}

function reply(message) {
    var editArea = document.querySelector('#editArea');
    var sendButton = document.querySelector('.btn_send');

    Clipboard.clear();
    Clipboard.writeText(message.type == 'plain' ? message.text : message.href);

    editArea.focus();
    document.execCommand('paste');

    sendButton.click();
}