"use strict";
const mongoose = require('mongoose');

const log = new mongoose.Schema({

    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization', required: true },
    bucket: { type: mongoose.Schema.Types.ObjectId, ref: 'bucket' },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'unit' },
    created_At: { type: Date, default: Date.now },
    updated_At: { type: Date, default: Date.now }
});

log.pre('save', function(next) {
    this.updated_At = Date.now();
    next();
});

mongoose.model('log', log);