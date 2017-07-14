"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/client');
let updator = require('../helpers/updator');

exports.create = (req, res) => {

    let model = req.body;
    bluebird.resolve(new db.client(model).save())
        .then(client => res.data(mapper.toModel(client)))
        .catch(err => res.failure(err));
};

exports.get = (req, res) => {

    let clientId = req.params.id;

    bluebird.resolve(db.client.findById(clientId))
        .then(client => res.data(mapper.toModel(client)))
        .catch(err => res.failure(err));

};
exports.search = (req, res) => {
    console.log('this is client search function');
    res.data({
        niceSearch: true
    });

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
    let clientId = req.params.id;

    bluebird.resolve(db.client.findByIdAndRemove(clientId))
        .then(client => res.success('client has been removed'))
        .catch(err => res.failure(err));

};