'use strict';

const express = require('express');
const Database = require('../src/util/db-config');
const updateAssistant = require('../src/services/autopilot');
const assistantService = require('../src/services/assistant');
const Tasks = require('../src/services/tasks');
const cfg = require('../src/config');

/* eslint-disable new-cap */
const router = express.Router();

// GET: /
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SMS Support Chatbot', number: cfg.twilioPhoneNumber });
});

// GET: /config
router.get('/config', async function(req, res, next) {
  const database = await new Database().init();
  const config = await database.getData();
  res.render('config', {
    config: config
      ? config
      : {
          weekdayHours: {},
          weekendHours: {},
        },
  });
});

// POST: /config
router.post('/config', async function(req, res, next) {
  const database = await new Database().init();
  await database.setDefaults();
  const defaultData = await database.getData();
  const protocol = req.headers['x-forwarded-proto']
    ? req.headers['x-forwarded-proto']
    : req.protocol;
  const baseUrl = `${protocol}://${req.hostname}`;
  const resetPasswordUrl = `${protocol}://${req.hostname}/autopilot/support/reset-password`;
  const operatorUrl = `${protocol}://${req.hostname}/autopilot/support/operator`;
  const dialUrl = `${protocol}://${req.hostname}/autopilot/support/dial`;
  const data = {
    name: req.body.company ? req.body.company : defaultData.name,
    phoneNumber: req.body.phone ? req.body.phone : defaultData.phoneNumber,
    operatorPhoneNumber: req.body.operatorPhone
      ? req.body.operatorPhone
      : defaultData.operatorPhoneNumber,
    weekdayHours: {
      start: req.body.weekdayStartTime
        ? req.body.weekdayStartTime
        : defaultData.weekdayHours.start,
      end: req.body.weekdayEndTime
        ? req.body.weekdayEndTime
        : defaultData.weekdayHours.end,
    },
    weekendHours: {
      start: req.body.weekendStartTime
        ? req.body.weekendStartTime
        : defaultData.weekendHours.start,
      end: req.body.weekendEndTime
        ? req.body.weekendEndTime
        : defaultData.weekendHours.end,
    },
    baseUrl,
    resetPasswordUrl,
    operatorUrl,
    dialUrl,
  };
  await database.save(data);

  // Update autopilot
  const assistant = await assistantService.updateOrCreateAssistant(
    'SMS Support Chatbot',
    baseUrl
  );
  const tasks = await new Tasks(assistant);
  await updateAssistant(assistant, tasks);
  res.render('config', { config: data, message: 'success' });
});

module.exports = router;
