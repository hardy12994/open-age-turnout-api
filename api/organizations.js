"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/organization');
let updater = require('../helpers/updater');

exports.create = (req, res) => {

    let model = req.body;

    if (!model.client) {
        return res.failure('client is Required');
    }

    bluebird.resolve(db.client.findById(model.client))
        .then(client => {
            if (!client) {
                return bluebird.reject('no client found');
            }
            model.client = client;

            return bluebird.resolve(db.organization.findOne({
                name: {
                    $regex: model.name,
                    $options: 'ig'
                },
                phone: model.phone,
                pincode: model.pincode
            }));
        })
        .then(organization => {
            if (organization) {
                return bluebird.reject('already have organization at this place');
            }

            return new db.organization(model).save();
        })
        .then(organization => res.data(mapper.toModel(organization)))
        .catch(err => res.failure(err));
};

exports.get = (req, res) => {

    let organizationId = req.params.id;

    bluebird.resolve(db.organization.findById(organizationId))
        .then(organization => {
            if (!organization) {
                return bluebird.reject('no organization found');
            }
            res.data(mapper.toModel(organization));
        })
        .catch(err => res.failure(err));
};

exports.search = (req, res) => {

    // get by client only
    //needs token

};

exports.update = (req, res) => {

    let organizationId = req.params.id;
    let model = req.body;

    if (model.client) {
        return res.failure('client can not be updated');
    }


    bluebird.resolve(db.organization.findById(organizationId))
        .then(organization => {
            if (!organization) {
                bluebird.reject('no organization found');
            }
            organization = updater.entitiesUpdater(organization, model);
            return organization.save();
        })
        .then(organization => res.data(mapper.toModel(organization)))
        .catch(err => res.failure(err));
};

exports.delete = (req, res) => {

    // by admin
    //needs token
    let organizationId = req.params.id;

    bluebird.resolve(db.organization.findByIdAndRemove(organizationId))
        .then(() => res.success('org has been removed'))
        .catch(err => res.failure(err));

};