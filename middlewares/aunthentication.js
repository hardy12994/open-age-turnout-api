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
            return res.failure('invalid token.');
        }

        if (!claims.client && !claims.employee) {
            return res.failure('invalid token.');
        }
        cb(null, claims);
    });
};

let requireToken = (req, res) => {

    let token = req.headers['x-access-token'] || req.body.token || req.query.token;

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }
    return token;

};

exports.getToken = payload => {

    return jwt.sign(payload, authConfig.secret, {
        expiresIn: authConfig.tokenPeriod || 1450
    });

};

exports.employeeRequired = (req, res, next) => {

    let token = requireToken(req, res);

    async.waterfall([
        function(cb) {
            extractTokenFields(token, req, res, cb);
        },
        function(claims, cb) {
            db.employee.findById(claims.employee, (err, employee) => {
                if (err) {
                    return res.failure(err);
                }

                if (!employee) {
                    return res.failure('employee not found');
                }

                res.employee = employee;
                cb(null);
            });
        }
    ], next());

};

exports.clientRequired = (req, res, next) => {

    let token = requireToken(req, res);

    async.waterfall([
        function(cb) {
            extractTokenFields(token, req, res, cb);
        },
        function(claims, cb) {
            db.client.findById(claims.client, (err, client) => {
                if (err) {
                    return res.failure(err);
                }
                if (!client) {
                    return res.failure('client not found');
                }
                res.client = client;
                cb(null);
            });
        }
    ], next());
};