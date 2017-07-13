"use strict";

let appGenrator = require('express-app-generator');
let router = require('./router');

module.exports.generate = port => {
    appGenrator.generate(port, function(err, app) {
        if (err) {
            return console.log(err);
        }
        router.manager(app);
    });
};