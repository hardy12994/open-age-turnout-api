"use strict";
let _ = require('underscore');


exports.toModel = entity => {
    return {
        id: entity.id,
        name: entity.name,
        picUrl: entity.picUrl,
        address: entity.address,
        email: entity.email,
        state: entity.state,
        pincode: entity.pincode,
        phone: entity.phone,
        created_At: entity.created_At,
        updated_At: entity.updated_At
    };
};

exports.toSearchModel = entities => {

    return entities.map(entity => {
        return exports.toModel(entity);
    });
};