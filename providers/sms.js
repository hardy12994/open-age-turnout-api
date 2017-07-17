'use strict';
var smsConfig = require('config').get('routesms');
var Client = require('node-rest-client-promise').Client;
var logger = require('../helpers/logger')('routesms');

exports.send = function(mobile, message) {
    var log = logger.start('send');

    log.info({
        message: message,
        mobile: mobile
    });

    var client = new Client();

    let smsUrl = smsConfig.url +
        "?username=" + smsConfig.userName +
        "&password=" + smsConfig.password +
        "&type=" + smsConfig.type +
        "&dlr=" + smsConfig.dlr +
        "&destination=" + mobile +
        "&source=" + smsConfig.source +
        "&message=" + message;

    return client.getPromise(smsUrl)
        .then(function(data) {
            log.debug(data);
        }).catch(err => {
            log.error(err);
        });
};