"use strict";
const mongoose = require('mongoose');
const dbConf = require('config').get('db');
var fs = require('fs');
var join = require('path').join;
var logger = require('../helpers/logger')('db');

module.exports.configure = () => {

    let connect = () => {
        mongoose.connect(dbConf.url, { useMongoClient: true });
    };
    connect();
    var db = mongoose.connection;


    db.on('connected', function() {
        logger.info('DB Connected');
    });

    db.on('error', function(err) {
        logger.error('Mongoose default connection error: ' + err);
    });

    db.on('disconnected', function() {
        logger.info('Again going to connect DB');
        connect();
    });

    fs.readdirSync(join(__dirname, '../models'))
        .forEach(function(file) {
            if (file.indexOf('.js')) {
                require(join(__dirname, '../models', file));
            }
        });
    global.db = mongoose.models;
};