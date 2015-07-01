var request = require('request');
var sign = require('./sign');
var Cache = {};
var expireTime = 7200 - 1000;
/**
 * 获取当前时间戳
 * @returns {number}
 */
function getNowTimestamp(){
    return new Date().getTime()/1000
}

/**
 * 刷新token
 * @param key
 * @param config
 * @param callback
 * @returns {*}
 */
exports.refreshToken = function(key, config, callback){
    var cache = Cache[key];
    var time = getNowTimestamp();
    var result;

    if (!cache.time || time - cache > expireTime){
        result = sign(cache.ticket, config.url);
        return callback && callback(null, cache, result);
    }

    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appId+'&secret='+config.appSecret;
    request(url, function (error, response, body) {

        if(error || response.statusCode != 200){
            res.send(error);
            return;
        }
        var access_token = JSON.parse(body).access_token;
        console.log('access_token: ' + access_token);

        var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi';
        request(url, function (error, response, body) {
            console.log('根据accessToken获取..');
            if (error || response.statusCode != 200) {
                callback && callback(error);
                return;
            }

            var ticket = JSON.parse(body).ticket;
            console.log('ticket: '+ticket);

            var data = Cache[key] = {
                time: getNowTimestamp(),
                ticket: ticket
            };


            result = sign(ticket, config.url);
            callback(null, result, data);
        });
    });
};

exports.deleteTokenCache = function(key){
    delete Cache[key];
};
