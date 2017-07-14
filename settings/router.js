"use strict";
module.exports.manager = app => {

    app.get('/', (req, res) => {
        res.render('index', { title: '~ THIS IS TURNOUT API ~' });
    });

    let api = app.appRouter;

    api.model('users')
        .register('REST');

    api.model('clients')
        .register('CRUD');

};