"use strict";
const mongoose = require('mongoose');

const organization = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address_1: { type: String, required: true },
    address_2: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    picUrl: String,
    phone: { type: String, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee', required: true },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

organization.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('organization', organization);