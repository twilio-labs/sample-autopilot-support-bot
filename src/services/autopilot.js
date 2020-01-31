const cfg = require('../config');

const assistantService = require('./assistant');
const samples = require('../util/samples');

/**
 * Update or creates the whole workflow of the autopilot assistant
 *
 * @param {*} assistant
 * @param {Tasks} tasks
 * @return {Promise<void>}
 */
async function updateAssistant(assistant, tasks) {
  try {
    const incomingPhoneNumberInstance = await assistantService.linkAssistantToPhoneNumber(
      assistant.sid,
      cfg.twilioAccountSid,
      cfg.twilioPhoneNumber
    );
    if (!incomingPhoneNumberInstance) {
      console.log('Phone number not found. Setup aborted!');
      return;
    }

    await tasks.createAll(samples);
    await assistant.modelBuilds().create();
  } catch (e) {
    console.error(e);
  }
}

module.exports = updateAssistant;
