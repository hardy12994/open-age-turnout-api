"use strict";
const mongoose = require('mongoose');

const client = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    picUrl: String,
    address: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

client.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('client', client);