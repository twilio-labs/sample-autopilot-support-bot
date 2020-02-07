'use strict';

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const Memory = require('lowdb/adapters/Memory');
const path = require('path');

const adapter =
  process.env.NODE_ENV === 'test'
    ? new Memory()
    : new FileAsync(path.join(__dirname, '../../_data/db.json'));

/**
 * Database utility to perform I/O operations to a JSON file
 *
 * @class Database
 */
class Database {
  /**
   * Creates an instance of Database.
   * @param {*} data
   * @memberof Database
   */
  constructor(data) {
    this.data = data;
    this.db = null;
  }

  /**
   * Initializes the database with the provided data
   *
   * @return {Database}
   * @memberof Database
   */
  async init() {
    this.db = await low(adapter);
    if (this.data) {
      await this.db.set('company', this.data).write();
    }
    return this;
  }

  /**
   * Returns the the company data stored on the JSON database
   * @return {*} The company object from the JSON database
   */
  async getData() {
    return this.db ? await this.db.get('company').value() : null;
  }

  /**
   * Overrides existing data with the new data provided
   *
   * @param {*} data
   * @memberof Database
   */
  async save(data) {
    if (this.db) {
      await this.db.set('company', data).write();
    }
  }

  /**
   * Sets the database default values
   */
  async setDefaults() {
    if (this.db) {
      await this.db
        .set('company', {
          name: 'Teldigo',
          weekdayHours: {
            start: '08:00:00',
            end: '17:00:00',
          },
          weekendHours: {
            start: '09:00:00',
            end: '12:00:00',
          },
        })
        .write();
    }
  }
  /**
   * Clears the database. Only used for tests.
   *
   * @param {*} db
   */
  async _clearDatabase() {
    if (this.db) {
      await this.db.unset('company').write();
    }
  }
}

module.exports = Database;
