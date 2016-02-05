/**
 * 将执行线程暂停一段时间
 * @param 暂停的时间，单位毫秒ms
 */
module.exports = function (duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}