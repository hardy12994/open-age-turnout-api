"use strict";

exports.create = (req, res) => {

    console.log('this is user create function');
    res.data({
        niceCreated: true
    });
};
exports.get = (req, res) => {
    console.log('this is user get function');
    res.data({
        niceGet: true
    });

};
exports.search = (req, res) => {
    console.log('this is user search function');
    res.data({
        niceSearch: true
    });

};

exports.update = (req, res) => {
    console.log('this is user update function');
    res.data({
        niceGet: true
    });
};

exports.delete = (req, res) => {
    console.log('this is user delete function');
    res.data({
        niceDelete: true
    });

};