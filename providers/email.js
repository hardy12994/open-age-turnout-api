'use strict';
var mailProvider = require('config').get('mailer');
var mailgun = require('mailgun-js');
var logger = require('../helpers/logger')('api.messages');
var template = require('../helpers/template');

var templateSetter = function(scrum, info) {

    var format = template.formatter(scrum);
    return format.inject(info);

};

var sendMail = function(data, callback) {

    var log = logger.start('sending Mail');

    var mailer = new mailgun({
        apiKey: mailProvider.api_key,
        domain: mailProvider.domain
    });

    mailer.messages().send(data, function(err, body) {
        if (err) {
            log.silly("Err: " + err);
            return callback(err);
        }
        logger.info(body);
        callback(null);
    });

};

exports.sendConfermationCode = function(data, cb) {

    var info = {
        code: data.code
    };

    var settings = {
        to: data.email,
        from: mailProvider.adminEmail,
        subject: 'Confirmation Code',
        html: templateSetter("Welcome,<br><br>" +
            "Your confirmation code is <b>{{code}}</b>", info)
    };
    sendMail(settings, function(err) {
        if (err) {
            return cb(err);
        }
        cb(null, 'mail sent');
    });
};