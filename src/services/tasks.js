'use strict';

const actions = require('./actions');
const Database = require('../util/db-config');

/**
 * Represents the autopilot assistant tasks
 *
 * @class Tasks
 */
class Tasks {
  /**
   * Creates an instance of Tasks.
   *
   * @param {*} assistant
   * @memberof Tasks
   */
  constructor(assistant) {
    this.assistant = assistant;
  }

  /**
   * Creates all tasks
   *
   * @param {*} samples
   * @param {Database} database
   * @memberof Tasks
   */
  async createAll(samples, database = new Database()) {
    await database.init();
    const data = await database.getData();
    await this._createOrUpdate(
      actions.greeting(data.name),
      'Greetings',
      samples.greetings
    );
    await this._createOrUpdate(actions.mainMenu(), 'Main Menu', []);
    await this._createOrUpdate(
      { actions: [{ redirect: data.resetPasswordUrl }] },
      'Reset Password',
      samples.passwordReset
    );
    await this._createOrUpdate(
      actions.checkDelivery(),
      'Check Delivery',
      samples.checkDelivery
    );
    await this._createOrUpdate(
      actions.additionalInformation(data.weekdayHours, data.weekendHours),
      'Additional Information',
      samples.additionalInformation
    );
    await this._createOrUpdate(
      actions.operator(data.operatorUrl),
      'Operator',
      []
    );
  }
  /**
   * Create or update a generic task for the assistant
   *
   * @param {*} actions
   * @param {string} name
   * @param {string[]} samples
   * @return {Promise<TaskInstance>}
   */
  async _createOrUpdate(actions, name, samples) {
    const existingTasks = await this.assistant.tasks().list();
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    let task = existingTasks.find(task => task.uniqueName === slug);
    if (task === undefined) {
      console.log(`Create ${name} task`);
      task = await this.assistant.tasks().create({
        friendlyName: name,
        uniqueName: slug,
        actions,
      });
    } else {
      console.log(`Update "${name}" task`);
      const existingSamples = await task.samples().list();
      await existingSamples.forEach(async sample => {
        await sample.remove();
      });
      await task.update({
        actions,
      });
    }

    samples.forEach(async sample => {
      await task.samples().create({
        sourceChannel: 'sms',
        taggedText: sample,
        language: 'en-US',
      });
    });
    return task;
  }
}

module.exports = Tasks;
