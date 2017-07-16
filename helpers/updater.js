"use strict";

exports.entitiesUpdater = (oldModel, newModel) => {

    for (var index in newModel) {
        oldModel[index] = newModel[index];
    }

    return oldModel;
};