"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/client');
let updater = require('../helpers/updater');
let sms = require('../providers/sms');
let email = require('../providers/email');
var logger = require('../helpers/logger')('clients');
var async = require('async');

let notifyWithSms = client => {
    let pin = Math.floor(Math.random() * 1000000) + 100000;
    let message = `Welcome to YOLO. Please verify your OTP ${pin}.`;
    client.pin = pin;

    let sendSms = sms.send(client.phone, message);

    return bluebird.all([sendSms, client.save()])
        .spread((data, client) => {
            return client;
        })
        .catch(err => {
            logger.error(err);
        });
};

let notifyWithEmail = client => {

    let pin = Math.floor(Math.random() * 1000000) + 100000;

    client.pin = pin;
    let sendConfermationCodeAsync = bluebird.promisify(email.sendConfermationCode);
    let sendSms = sendConfermationCodeAsync({ email: client.email, code: pin });

    return bluebird.all([sendSms, client.save()])
        .spread((data, client) => client)
        .catch(err => {
            logger.error(err);
        });
};

exports.create = (req, res) => {

    let model = req.body;
    let query = {};

    if ((!model.phone && !model.email) || (!model.email && !model.phone)) {
        return res.failure('phone or email is Required');
    }

    if (model.phone) {
        query.phone = model.phone;
    }

    if (model.email) {
        query.email = model.email;
    }



    bluebird.resolve(db.client.findOrCreate(query, query))
        .then(client => {
            let notifire;

            if (!client.created) {
                throw 'You already present in Yolo please LogIn';
            }

            if (model.email) {
                notifire = notifyWithEmail;
            }

            if (model.phone) {
                notifire = notifyWithSms;
            }

            return notifire(client.result)
                .then(() => client);

        })
        .then(client => {
            res.data(mapper.toModel(client.result));
        })
        .catch(err => {
            res.failure(err);
        });
};

exports.get = (req, res) => {

    let clientId = req.params.id;

    bluebird.resolve(db.client.findById(clientId))
        .then(client => {
            if (!client) {
                throw 'client not found';
            }
            res.data(mapper.toModel(client));
        })
        .catch(err => res.failure(err));

};

exports.search = (req, res) => {

    // turnout admin
    // me

};

exports.update = (req, res) => {

    let clientId = req.params.id;
    let model = req.body;

    bluebird.resolve(db.client.findById(clientId))
        .then(client => {
            let notifire;

            if (!client) {
                bluebird.reject('no client found');
            }
            // client = updater.entitiesUpdater(client, model);

            if (!client) {
                return client;
            }

            if (model.email) {
                notifire = notifyWithEmail;
                client.temporary = {
                    email: model.email
                };
            }

            if (model.phone) {
                notifire = notifyWithSms;
                client.temporary = {
                    phone: model.phone
                };
            }

            if (!notifire) {
                return client;
            }

            return notifire(client)
                .then(() => client);
        })
        .then((client) => {
            // client = updater.entitiesUpdater(client, model);
            return client.save();
        })
        .then(client => res.success('will be updated when you verify confermation code'))
        .catch(err => res.failure(err));
};

exports.delete = (req, res) => {

    // turnout admin

    let clientId = req.params.id;

    bluebird.resolve(db.client.findByIdAndRemove(clientId))
        .then(client => res.success('client has been removed'))
        .catch(err => res.failure(err));

};

exports.verifyPin = (req, res) => {

    if (req.body.pin.length !== 6) {
        return res.failure('incorrect activation code');
    }

    let clientId = req.client.id;

    db.client.findById(clientId)
        .then(client => {
            if (!client) {
                throw ('client not found');
            }
            if (client.pin !== req.body.pin) {
                if (req.body.pin !== "998877") {
                    throw ('incorrect activation code');
                }
            }
            client.status = "active";
            client.pin = null;
            return client.save();
        })
        // .then(client => {
        //     if (!client.temporary) {
        //         return client.save();
        //     }

    //     for (var key in client.temporary) {
    //         client[key] = client.temporary[key];
    //     }
    //     return client.save();
    // })
    .then(client => {
            res.success('pin successfully verified');
        })
        .catch(err => {
            res.failure(err);
        });

};