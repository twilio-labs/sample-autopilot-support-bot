'use strict';

const cfg = require('../config');
const twilio = require('twilio')(cfg.twilioAccountSid, cfg.twilioAuthToken);

/**
 * Gets or creates a new assistant for the autopilot
 * @param {string} name
 * @param {string} baseUrl
 * @param {TwilioClient} client
 * @return {Promise<AssistantInstance>}
 */
async function updateOrCreateAssistant(name, baseUrl, client = twilio) {
  const uniqueName = name.toLowerCase().replace(/\s+/g, '-');
  const defaults = {
    defaults: {
      assistant_initiation: `${baseUrl}/autopilot/support/greetings`,
      fallback: 'task://operator',
    },
  };

  const assistants = await client.autopilot.assistants.list();
  const assistant = assistants.find(
    assistant => assistant.uniqueName === uniqueName
  );
  if (!assistant) {
    console.log(`Create assistant: "${name}"`);
    return await client.autopilot.assistants.create({
      friendlyName: name,
      uniqueName: uniqueName,
      defaults,
    });
  } else {
    console.log(`Update assistant: "${name}"`);
    return await assistant.update({
      defaults,
    });
  }
}

/**
 * Links a phone number to an autopilot assistant
 * @param {string} assistantSid
 * @param {string} accountSid
 * @param {string} phoneNumber
 * @param {TwilioClient} client
 * @return {Promise<IncomingPhoneNumberInstance|undefined>}
 */
async function linkAssistantToPhoneNumber(
  assistantSid,
  accountSid,
  phoneNumber,
  client = twilio
) {
  console.log('Link phone number to assistant');
  const incomingPhoneNumbers = await client.api.incomingPhoneNumbers.list();
  const incomingPhoneNumber = incomingPhoneNumbers.find(
    incomingPhoneNumbers => incomingPhoneNumbers.phoneNumber === phoneNumber
  );
  if (!incomingPhoneNumber) {
    return null;
  }
  return await incomingPhoneNumber.update({
    smsMethod: 'POST',
    smsUrl: `https://channels.autopilot.twilio.com/v1/${accountSid}/${assistantSid}/twilio-messaging`,
  });
}

module.exports = {
  updateOrCreateAssistant,
  linkAssistantToPhoneNumber,
};
