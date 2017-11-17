// import { setTimeout } from "timers";

"use strict";
let pinConfig = require("config").get("pincode");
let restClient = require('node-rest-client').Client;
let client = new restClient();

exports.get = function(req, res) {

    let pincode = req.params.pin;
    let properUrl = `${pinConfig.url}?format=${pinConfig.format}&api-key=${pinConfig.api_key}&filters[pincode]=`;
    properUrl = properUrl + pincode;

    client.get(properUrl,
        function(data, response) {

            let stringifyBuffer = JSON.stringify(data);
            let bufferOriginal = Buffer.from(JSON.parse(stringifyBuffer).data);
            let originalData = bufferOriginal.toString('utf8');

            return res.page((JSON.parse(originalData)).records || []);
        });

};