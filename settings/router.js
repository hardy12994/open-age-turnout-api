"use strict";
module.exports.manager = app => {

    let api = app.appRouter;

    api.model('users')
        .register('REST');

};