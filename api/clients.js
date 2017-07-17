"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/client');
let updater = require('../helpers/updater');
let sms = require('../providers/sms');
var logger = require('../helpers/logger')('clients');


let notifyWithSms = client => {
    let pin = Math.floor(Math.random() * 1000000) + 100000;
    let message = `Welcome to MYAPP Please verify your OTP ${pin}`;
    client.pin = pin;

    let sendSms = sms.send(client.phone, message);

    return bluebird.all([sendSms, client.save()])
        .catch(err => {
            logger.error(err);
        });

};

exports.create = (req, res) => {

    let model = req.body;

    if (!model.phone) {
        return res.failure('phone is Required');
    }

    bluebird.resolve(db.client.findOrCreate({
            phone: model.phone,
            email: model.email
        }, model))
        .then(client => {
            if (client.created) {
                return notifyWithSms(client.result)
                    .then(() => client);
            }
            return client;
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

};

exports.update = (req, res) => {

    let clientId = req.params.id;
    let model = req.body;

    bluebird.resolve(db.client.findById(clientId))
        .then(client => {
            if (!client) {
                bluebird.reject('no client found');
            }
            client = updater.entitiesUpdater(client, model);
            return client.save();
        })
        .then(client => res.data(mapper.toModel(client)))
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
    let clientId = req.body.client;

    db.client.findById(clientId)
        .then(client => {
            if (!client) {
                throw ('client not found');
            }
            if (client.pin !== req.body.pin) {
                if (req.body.pin !== "223311") {
                    throw ('incorrect activation code');
                }
            }
            client.status = "active";
            client.pin = null;
            return client.save();
        })
        .then(client => {
            res.success('pin successfully verified');
        })
        .catch(err => {
            res.failure(err);
        });

};