'use strict';

const expect = require('chai').expect;
const Database = require('../../src/util/db-config');

describe('Util.Database', function() {
  afterEach('clear database', async function() {
    const db = await new Database().init();
    await db._clearDatabase();
  });

  describe('#setDefaults()', function() {
    it('sets default data on the db', async function() {
      const db = await new Database().init();
      await db.setDefaults();
      expect(await db.getData()).to.eql({
        name: 'Teldigo',
        weekdayHours: {
          start: '08:00:00',
          end: '17:00:00',
        },
        weekendHours: {
          start: '09:00:00',
          end: '12:00:00',
        },
      });
    });
  });

  describe('#getData()', function() {
    context('when the database has not been initialized', function() {
      it('returns null', async function() {
        const db = new Database();
        const data = await db.getData();
        expect(data).to.be.null;
      });
    });

    context('when there is no data in the database', function() {
      it('returns undefined', async function() {
        const db = await new Database().init();
        const data = await db.getData();
        expect(data).to.be.undefined;
      });
    });

    context('when there is data in the database', function() {
      it('returns the existing data', async function() {
        const existingData = {
          name: 'Twilio',
          weekdayHours: {
            start: 9,
            end: 18,
          },
          weekendHours: {
            start: 9,
            end: 14,
          },
        };
        const db = await new Database(existingData).init();
        const data = await db.getData();
        expect(data).to.eql(existingData);
      });
    });
  });

  describe('#save()', function() {
    it('overrides existing data with the new values', async function() {
      const db = await new Database().init();
      await db.setDefaults();
      const data = {
        name: 'Twilio',
        weekdayHours: {
          start: 9,
          end: 18,
        },
        weekendHours: {
          start: 9,
          end: 14,
        },
      };
      await db.save(data);
      expect(await db.getData()).to.eql(data);
    });
  });
});
