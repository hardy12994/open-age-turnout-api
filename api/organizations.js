"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/organization');
let updater = require('../helpers/updater');

exports.create = (req, res) => {

    let model = req.body;
    model.employee = req.employee;

    bluebird.resolve(db.organization.findOne({
            name: {
                $regex: model.name,
                $options: 'ig'
            },
            employee: model.employee.id,
            // phone: model.phone,
            // pincode: model.pincode
        }))
        .then(organization => {
            if (organization) {

                if (model.phone && organization.phone === model.phone.trim()) {
                    return bluebird.reject('Same phone not be use is diffrent organizations.');
                }

                if (organization.name === model.name.trim()) {
                    return bluebird.reject('Same name not be use is diffrent organizations.');
                }

                return new db.organization(model).save();

                // return bluebird.reject('Already have organization at this place');
            }

            return new db.organization(model).save();
        })
        // .then(organization => {
        //     return new db.employee({
        //             name: organization.client.name || '',
        //             phone: organization.client.phone || '',
        //             status: 'active',
        //             organization: organization,
        //             admin: true,
        //             abilities: {
        //                 read: true,
        //                 write: true
        //             }
        //         })
        //         .save()
        //         .then(() => organization);
        // })
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

    let employee = req.employee;

    bluebird.resolve(db.organization.find({ employee: employee }))
        .then(organizations =>
            res.page(mapper.toSearchModel(organizations))
        )
        .catch(err => res.failure(err));
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