"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/client');
let updator = require('../helpers/updator');

exports.create = (req, res) => {

    let model = req.body;

    if (!model.phone) {
        return res.failure('phone is Required');
    }

    bluebird.resolve(db.client.findOne({ phone: model.phone }))
        .then(client => {
            if (client) {
                throw 'client already register with this phone number';
            }
            return;
        })
        .then(() => new db.client(model).save())
        .then(client => res.data(mapper.toModel(client)))
        .catch(err => res.failure(err));
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
        .then(client => updator.entitiesUpdator(client, model))
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