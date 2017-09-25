"use strict";
let fs = require('fs');
let auth = require('../middlewares/aunthentication');

module.exports.manager = app => {

    app.get('/default', (req, res) => {
        res.render('index', { title: '~ THIS IS TURNOUT API ~' });
    });

    app.get('/swagger', (req, res) => {

        res.writeHeader(200, { "Content-Type": "text/html" });
        fs.readFile('./public/swagger.html', null, function(err, data) {
            if (err) {
                return res.writeHead(404);
            }
            res.write(data);
            res.end();
        });
    });


    let api = app.appRouter;

    api.model('clients')
        .register('CRUD');

    api.model('clients')
        .register({
            action: 'POST',
            url: '/verify',
            method: 'verifyPin',
            filter: auth.clientRequired
        });

    api.model('employees')
        .register('REST', auth.employeeRequired);

    api.model('employees')
        .register({
            action: 'POST',
            url: '/signUp',
            method: 'signUp',
            filter: auth.clientRequired
        });

    api.model('organizations')
        .register('REST');

};