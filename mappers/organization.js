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

    if (entity.client._doc) {
        model.client = {
            id: entity.client.id,
            name: entity.client.name,
            picUrl: entity.client.picUrl,
            address: entity.client.address,
            email: entity.client.email,
            state: entity.client.state,
            pincode: entity.client.pincode,
            phone: entity.client.phone
        };
    } else {
        model.client = entity.client.toString();
    }

    return model;
};

exports.toSearchModel = entities => {

    return entities.map(entity => {
        return exports.toModel(entity);
    });
};