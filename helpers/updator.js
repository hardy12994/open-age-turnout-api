"use strict";

exports.entitiesUpdator = (oldModel, newModel) => {

    for (var index in newModel) {
        oldModel[index] = newModel[index];
    }

    return oldModel;
};