#!/usr/bin/env node
require('dotenv').config();
import axios from 'axios';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const apiKey = process.env.APIKEY
const fromNumber = process.env.FROM_NUMBER
const toNumber = process.env.TO_NUMBER

if (!apiKey) {
  throw new Error('No APIKEY');
}
if (!accountSid || !authToken) {
    throw new Error('TWILIO_ACCOUNT_SID or AUTH_TOKEN is not defined');
}
if (!toNumber || !fromNumber) {
    throw new Error('FROM_NUMBER or TO_NUMBER is not defined');
}
// Use APIKEY to access etherscan.io
var url = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + apiKey


axios.get(url)
    .then((response) => {
        const safeGasPrice = response.data.result.SafeGasPrice
        // console.log(`The Safe Gas Price is ${safeGasPrice}`)
        if (!safeGasPrice) {
            throw new Error('No Safe Gas Price');
        } else {
            if (safeGasPrice < 70) {
                // Send SMS message via twilio
                client.messages
                    .create({
                        body: 'Safe Gas Price is: ' + safeGasPrice,
                        from: fromNumber,
                        to: toNumber
                    })
                    .then(message => console.log(message.dateCreated + ', ' + message.body + ', ' + message.sid));
            }
        }
    })
