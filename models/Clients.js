"use strict";
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');


const client = new mongoose.Schema({
    name: { type: String, trim: true },
    picUrl: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pin: String,
    status: {
        type: String,
        enum: [
            'active', 'inactive', 'inComplete'
        ],
        default: 'inComplete'
    },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

client.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});
mongoose.plugin(findOrCreate);
mongoose.model('client', client);