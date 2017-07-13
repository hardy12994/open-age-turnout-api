"use strict";
const mongoose = require('mongoose');

const bucket = new mongoose.Schema({

    name: String,
    description: String,
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

bucket.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('bucket', bucket);