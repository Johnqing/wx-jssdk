/**
 * 随机字符串
 * @returns {string}
 */
var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

/**
 * 时间戳
 * @returns {string}
 */
var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};
/**
 * 排序算法
 * @param args
 * @returns {string}
 */
var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须与调用 JSAPI 时的页面 URL 完全一致
 *
 * @returns
 */
var sign = function (ticket, url) {
    var ret = {
        jsapi_ticket: ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var string = raw(ret);
    var jsSHA = require('jssha');
    var shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');

    return ret;
};

module.exports = sign;
