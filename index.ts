#!/usr/bin/env node
require('dotenv').config();
import axios from 'axios';
import { createTransport } from 'nodemailer';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const apiKey = process.env.APIKEY
if (!apiKey) {
  throw new Error('No APIKEY');
}
if (!accountSid || !authToken) {
    throw new Error('TWILIO_ACCOUNT_SID or AUTH_TOKEN is not defined');
}

var url = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + apiKey


axios.get(url)
    .then((response) => {
        const safeGasPrice = response.data.result.SafeGasPrice
        // console.log(`Your Safe Gas Price is ${safeGasPrice}`)
        if (!safeGasPrice) {
            throw new Error('No Safe Gas Price');
        } else {
            if (safeGasPrice < 70) {
                client.messages
                    .create({
                        body: 'Safe Gas Price is: ' + safeGasPrice,
                        from: '+12398808970',
                        to: '+15715946171‬'
                    })
                    .then(message => console.log(message.dateCreated + ', ' + message.body + ', ' + message.sid));
            }
        }
    })
