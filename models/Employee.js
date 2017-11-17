"use strict";
const mongoose = require('mongoose');

const employee = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String },
    token: String,
    name: { type: String, trim: true },
    address: String,
    state: String,
    pincode: String,
    phone: String,
    email: String,
    abilities: {
        read: { type: Boolean, default: false }, // for client - true
        write: { type: Boolean, default: false } // for client - true
    },
    status: {
        type: String,
        enum: [
            'active', 'inactive'
        ],
        default: 'active'
    },
    organizations: [{
        admin: Boolean,
        activeHere: Boolean,
        created_At: { type: Date, default: Date.now },
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' }
    }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

employee.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('employee', employee);