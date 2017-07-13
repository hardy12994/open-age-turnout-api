"use strict";
const mongoose = require('mongoose');

const employee = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: String,
    state: String,
    pincode: String,
    phone: { type: Boolean, unique: true },
    admin: { type: Boolean, default: false },
    status: {
        type: String,
        enum: [
            'active', 'inactive'
        ]
    },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization', required: true },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

employee.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('employee', employee);