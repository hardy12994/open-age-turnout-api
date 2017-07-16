"use strict";
const fs = require('fs');

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

    api.model('users')
        .register('REST');

    api.model('clients')
        .register('CRUD');

    api.model('organizations')
        .register('CRUD');

};