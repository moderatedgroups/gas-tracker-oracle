#!/usr/bin/env node
require('dotenv').config();
import axios from 'axios';
import { createTransport } from 'nodemailer';

const apiKey = process.env.APIKEY
if (!apiKey) {
  throw new Error('No APIKEY');
}
const user = process.env.USER
const password = process.env.PASS
if (!user || !password) {
    throw new Error('USER or PASS is not defined');
}

var url = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + apiKey

var transporter = createTransport({
    host: "mail.moderatedgroups.com",
      port: 587,
      //secure: false,
      //tls: {
        // do not fail on invalid certs
      //  rejectUnauthorized: false
      //},
      auth: {
        user: user,
        pass: password,
      },
});

axios.get(url)
    .then((response) => {
        const safeGasPrice = response.data.result.SafeGasPrice
        console.log(`Your Safe Gas Price is ${safeGasPrice}`)
        if (!safeGasPrice) {
            throw new Error('No Safe Gas Price');
        } else {
            if (safeGasPrice < 200) {
                transporter.sendMail({
                    from: user,
                    to: user,
                    subject: 'Safe Gas Price is below 200',
                    text: 'The Safe Gas Price is: ' + safeGasPrice
                }, function(error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
    })
