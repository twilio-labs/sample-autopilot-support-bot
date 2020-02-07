'use strict';

const expect = require('chai').expect;
const actions = require('../../src/services/actions');

describe('Services.actions', function() {
  describe('#greeting', function() {
    it('returns a greeting message', function() {
      expect(actions.greeting('Twilio')).to.eql({
        actions: [
          {
            say:
              'Thanks for reaching out to Twilio. What can we help you with?',
          },
          {
            redirect: 'task://main-menu',
          },
        ],
      });
    });
  });

  describe('#mainMenu', function() {
    it('returns the main menu options message', function() {
      expect(actions.mainMenu('http://example.com')).to.eql({
        actions: [
          {
            say: `You can reply with "reset my password", "check on the status of my delivery”, or "I'm looking for additional information."`,
          },
          {
            listen: {
              tasks: [
                'reset-password',
                'check-delivery',
                'additional-information',
              ],
            },
          },
        ],
      });
    });
  });

  describe('#resetPassword', function() {
    it('returns the "reset password" response message', function() {
      expect(actions.resetPassword('1234567890')).to.eql({
        actions: [
          {
            say:
              'We’ve reset the password for the account attached to the number 1234567890. What would you like to do?',
          },
          {
            redirect: 'task://main-menu',
          },
        ],
      });
    });
  });

  describe('#checkDelivery', function() {
    it('returns the "check on delivery" response message', function() {
      expect(actions.checkDelivery()).to.eql({
        actions: [
          {
            say:
              'Your delivery is scheduled for later this evening. You should expect your package to arrive by the end of the day. What would you like to do?',
          },
          {
            redirect: 'task://main-menu',
          },
        ],
      });
    });
  });

  describe('#additionalInformation', function() {
    it('returns the "additional information" response message', function() {
      expect(
        actions.additionalInformation(
          {
            start: '7:00',
            end: '18:00',
          },
          {
            start: '12:00',
            end: '19:00',
          }
        )
      ).to.eql({
        actions: [
          {
            say:
              'Our office hours are from 7:00 to 18:00 Monday - Friday, and from 12:00 to 19:00 on Saturday and Sunday. What would you like to do?',
          },
          {
            redirect: 'task://main-menu',
          },
        ],
      });
    });
  });
});
