'use strict';

const express = require('express');
const base = require('./base');
const autopilot = require('./autopilot');

const app = express();

app.use('/', base);
app.use('/autopilot/support', autopilot);

module.exports = app;
