"use strict";
const mongoose = require('mongoose');

const customer = new mongoose.Schema({
    name: { type: String, required: true },
    // picUrl: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

customer.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('customer', customer);