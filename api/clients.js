"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/client');
let updater = require('../helpers/updater');

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