"use strict";
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');


const client = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    picUrl: String,
    address: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
        type: String,
        enum: [
            'active', 'inactive'
        ],
        default: 'active'
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