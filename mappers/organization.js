"use strict";
let _ = require('underscore');


exports.toModel = entity => {
    let model = {
        id: entity.id,
        name: entity.name,
        address: entity.address,
        state: entity.state,
        city: entity.city,
        pincode: entity.pincode,
        phone: entity.phone,
        created_At: entity.created_At,
        updated_At: entity.updated_At
    };

    if (entity.employee._doc) {
        model.employee = {
            id: entity.employee.id,
            name: entity.employee.name,
            picUrl: entity.employee.picUrl,
            address: entity.employee.address,
            email: entity.employee.email,
            state: entity.employee.state,
            pincode: entity.employee.pincode,
            phone: entity.employee.phone
        };
    } else {
        model.employee = entity.employee.toString();
    }

    return model;
};

exports.toSearchModel = entities => {

    return entities.map(entity => {
        return exports.toModel(entity);
    });
};