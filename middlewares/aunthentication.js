'use strict';
let jwt = require('jsonwebtoken');
let db = global.db;
let authConfig = require('config').get('auth');
let async = require('async');
let _ = require('underscore');


let extractTokenFields = (token, req, res, cb) => {

    jwt.verify(token, authConfig.secret, {
        ignoreExpiration: true
    }, (err, claims) => {
        if (err) {
            return cb('invalid token.');
        }

        if (!claims.client && !claims.employee) {
            return cb('invalid token.');
        }
        cb(null, claims);
    });
};

exports.getToken = payload => {

    return jwt.sign(payload, authConfig.secret, {
        expiresIn: authConfig.tokenPeriod || 1450
    });

};

exports.employeeRequired = (req, res, next) => {

    let token = req.headers['x-access-token'] || req.body['x-access-token'] || req.query['x-access-token'];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }

    async.waterfall([
        function(cb) {
            extractTokenFields(token, req, res, cb);
        },
        function(claims, cb) {
            db.employee.findById(claims.employee, (err, employee) => {
                if (err) {
                    return cb(err);
                }
                if (!employee) {
                    return cb('employee not found');
                }
                req.employee = employee;
                cb(null);
            });
        }
    ], (err) => {
        if (err) {
            return res.failure(err);
        }
        next();
    });
};

exports.clientRequired = (req, res, next) => {

    let token = req.headers['client-token'] || req.body['client-token'] || req.query['client-token'];

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }

    async.waterfall([
        function(cb) {
            extractTokenFields(token, req, res, cb);
        },
        function(claims, cb) {
            db.client.findById(claims.client, (err, client) => {
                if (err) {
                    return cb(err);
                }
                if (!client) {
                    return cb('client not found');
                }
                req.client = client;
                cb(null);
            });
        }
    ], (err) => {
        if (err) {
            return res.failure(err);
        }
        next();
    });
};