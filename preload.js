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

// 主流程
CO(function* () {
    var hasLogged = false;
    while (!hasLogged) {
        hasLogged = checkLoginStatus();
        yield sleep(500);
    }

    var getMessagesTask = getAllNewMessages();
    while (true) {
        var newMessages = yield * getMessagesTask();
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

    for (var mIndex = 0; mIndex < count; mIndex++) {
        var TempNewMessage = currentFormMessages.item(currentFormMessages.length - count + mIndex);
        var newMessage = {};

        newMessage.type = TempNewMessage.attributes.getNamedItem('class').textContent;
        switch (newMessage.type) {
            case 'plain': {
                newMessage.text = TempNewMessage.firstElementChild.textContent;
                break;
            }
            case 'app': {
                newMessage.href = TempNewMessage.href;
                newMessage.title = TempNewMessage.children[0].textContent;
                newMessage.image = TempNewMessage.children[1].src;
                newMessage.content = TempNewMessage.children[2].textContent;
                break;
            }
        }

        messages.push(newMessage);
    }

    return messages;
}

function showMessages(messages) {
    for (var message of messages) {
        switch (message.type) {
            case 'plain': {
                NativeConsole.log(`收到文本消息，text -> [${message.text}]`);
                break;
            }
            case 'app': {
                NativeConsole.log(`收到应用消息，href -> [${message.href}]，title -> [${message.title}]，image -> [${message.image}]，content -> [${message.content}]`);
                break;
            }
        }
    }
}