"use strict";
const mongoose = require('mongoose');

const unit = new mongoose.Schema({

    name: String,
    description: String,
    bucket: { type: mongoose.Schema.Types.ObjectId, ref: 'bucket', required: true },
    company: {
        name: String,
        amount: Number
    },
    organization: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
        amount: Number
    },
    code: String,
    picUrl: String,
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }

});

unit.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('unit', unit);