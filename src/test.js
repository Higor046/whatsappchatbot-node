const axios = require('axios');
require('dotenv').config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const MESSAGE_SID = 'MM8a865b98046ce51104273291e11a43e1';
const MEDIA_SID = 'ME633be4ffe31de05701a12f4ebc85cd26';

const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages/${MESSAGE_SID}/Media/${MEDIA_SID}`;

const config = {
  headers: {
    'Authorization': `Basic ${Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json'
  }
};

axios.get(url, config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
