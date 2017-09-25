"use strict";
let db = global.db;
let bluebird = require('bluebird');
let mapper = require('../mappers/employee');
let updater = require('../helpers/updater');
let sms = require('../providers/sms');
let email = require('../providers/email');
var logger = require('../helpers/logger')('clients');
var async = require('async');

exports.signUp = (req, res) => {

    let model = req.body;
    db.employee.findOne({
            username: model.username
        }).then(emp => {
            if (emp) {
                throw 'username already exist pleasse try another one';
            }
            return new db.employee({
                username: model.username,
                password: model.password
            }).save();
        })
        .then(employee => mapper.toModel(employee))
        .catch(err => res.failure(err));
};


exports.create = (req, res) => {

    let model = req.body;

    db.employee.findOne({
            phone: model.phone
        }).then(emp => {
            if (emp) {
                throw 'phone number already exist pleasse try another one';
            }
            return new db.employee(model).save();
        })
        .then(employee => mapper.toModel(employee))
        .catch(err => res.failure(err));
};

exports.update = (req, res) => {

    let employeeId = req.params.id;
    let model = req.body;

    bluebird.resolve(db.employee.findById(employeeId))
        .then(employee => {

            if (!employee) {
                return bluebird.reject('no employee found');
            }
            return updater.entitiesUpdater(employee, model);

        })
        .then(employee => {
            return employee.save();
        })
        .then(employee => res.data(mapper.toModel(employee)))
        .catch(err => res.failure(err));
};

exports.get = (req, res) => {

    let employeeId = req.params.id === "me" ? req.employee.id : req.params.id;

    bluebird.resolve(db.employee.findById(employeeId))
        .then(employee => {
            if (!employee) {
                throw 'employee not found';
            }
            res.data(mapper.toModel(employee));
        })
        .catch(err => res.failure(err));
};

exports.search = (req, res) => {

    let query = {};

    //TODO put some queries

    db.employee.find(query)
        .then(employees => {

            res.page(mapper.toSearchModel(employees));
        })
        .catch(err => res.failure(err));
};

exports.delete = (req, res) => {

    let employeeId = req.params.id;

    bluebird.resolve(db.employee.remove({ _id: employeeId }))
        .then(employee => {
            if (!employee) {
                throw 'employee not found';
            }
            res.success('employee has been deleted successfully');
        })
        .catch(err => res.failure(err));
};