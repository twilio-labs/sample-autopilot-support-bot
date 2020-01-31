'use strict';

const express = require('express');
const twilio = require('twilio');

const cfg = require('../src/config');
const actions = require('../src/services/actions');
const Database = require('../src/util/db-config');
/* eslint-disable new-cap */
const router = express.Router();

// POST /autopilot/support/greeting
router.post('/greetings', async (req, res) => {
  const companyName = 'Teldigo';

  res.send(actions.greeting(companyName));
});

// POST /autopilot/support/dial
router.post('/dial', async (req, res) => {
  const database = await new Database().init();
  const data = await database.getData();
  const response = new twilio.twiml.VoiceResponse();
  const operatorPhone = data.operatorPhoneNumber;
  response.dial(operatorPhone);

  res.send(response.toString());
});

// POST /autopilot/support/reset-password
router.post('/reset-password', async (req, res) => {
  const phoneNumber = JSON.parse(req.body.Memory).twilio.sms.From;
  res.send(actions.resetPassword(phoneNumber));
});

router.post('/operator', async (req, res) => {
  const database = await new Database().init();
  const data = await database.getData();
  const client = twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
  const phoneNumber = JSON.parse(req.body.Memory).twilio.sms.From;
  client.api.calls.create({
    to: phoneNumber,
    from: cfg.twilioPhoneNumber,
    url: data.dialUrl,
  });
  res.send({
    actions: [
      {
        say: 'Allow me to connect you with a support representative.',
      },
    ],
  });
});

module.exports = router;
