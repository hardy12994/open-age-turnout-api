'use strict';
var handlebars = require('handlebars');
var moment = require('moment');

handlebars.registerHelper('date', function(date) {
    if (!date) {
        return '';
    }
    return moment(date).format('DD-MM-YYYY');
});

handlebars.registerHelper('time', function(date) {
    if (!date) {
        return '';
    }
    return moment(date).format('hh:mm:ss');
});

exports.formatter = function(format) {
    var template = handlebars.compile(format);
    return {
        inject: function(data) {
            return template(data);
        }
    };
};