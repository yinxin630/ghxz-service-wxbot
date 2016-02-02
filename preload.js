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
    
});