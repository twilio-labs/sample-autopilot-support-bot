'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const assistant = require('../../src/services/assistant');

const expect = chai.expect;

chai.use(sinonChai);

describe('Services.Assistant', function() {
  afterEach(function() {
    sinon.restore();
  });
  describe('#updateOrCreateAssistant', function() {
    context('when there is no assistant on the autopilot', function() {
      it('creates a new assistant', async function() {
        const clientStub = {
          autopilot: {
            assistants: {
              list: sinon.stub().resolves([]),
              create: sinon.stub().resolves({}),
            },
          },
        };
        await assistant.updateOrCreateAssistant(
          'My Assistant',
          'http://example.com',
          clientStub
        );
        expect(
          clientStub.autopilot.assistants.create
        ).to.have.been.calledOnceWith({
          defaults: {
            defaults: {
              assistant_initiation:
                'http://example.com/autopilot/support/greetings',
              fallback: 'task://operator',
            },
          },
          friendlyName: 'My Assistant',
          uniqueName: 'my-assistant',
        });
      });
    });

    context('when there is an assistant already on the autopilot', function() {
      it('updates the assistant', async function() {
        const assistantStub = sinon.stub({
          uniqueName: 'my-assistant',
          update: function(...args) {
            return Promise.resolve();
          },
        });

        const clientStub = {
          autopilot: {
            assistants: {
              list: sinon.stub().resolves([assistantStub]),
            },
          },
        };
        await assistant.updateOrCreateAssistant(
          'My Assistant',
          'http://example.com',
          clientStub
        );
        expect(assistantStub.update).to.have.been.calledOnceWith({
          defaults: {
            defaults: {
              assistant_initiation:
                'http://example.com/autopilot/support/greetings',
              fallback: 'task://operator',
            },
          },
        });
      });
    });
  });

  describe('#linkAssistantToPhoneNumber', function() {
    let phoneNumberStub;
    beforeEach(function() {
      phoneNumberStub = sinon.stub({
        phoneNumber: '1234567890',
        update: function(...args) {
          return Promise.resolve();
        },
      });
    });

    context(
      'when there is no phone number attached to the account',
      function() {
        it('aborts the setup ', async function() {
          const clientStub = {
            api: {
              incomingPhoneNumbers: {
                list: sinon.stub().resolves([]),
              },
            },
          };
          const response = await assistant.linkAssistantToPhoneNumber(
            'ASxxxxx',
            'ACxxxxx',
            '1234567890',
            clientStub
          );
          expect(clientStub.api.incomingPhoneNumbers.list).to.have.been
            .calledOnce;
          expect(response).to.be.null;
          expect(phoneNumberStub.update).to.not.have.been.called;
        });
      }
    );

    context('when there is a phone number attached to the account', function() {
      it('updates the incoming phone number ', async function() {
        const clientStub = {
          api: {
            incomingPhoneNumbers: {
              list: sinon.stub().resolves([phoneNumberStub]),
            },
          },
        };
        const response = await assistant.linkAssistantToPhoneNumber(
          'ASxxxxx',
          'ACxxxxx',
          '1234567890',
          clientStub
        );
        expect(
          clientStub.api.incomingPhoneNumbers.list
        ).to.have.been.calledOnce;
        expect(response).to.not.be.null;
        expect(phoneNumberStub.update).to.have.been.calledOnceWith({
          smsMethod: 'POST',
          smsUrl:
            'https://channels.autopilot.twilio.com/v1/ACxxxxx/ASxxxxx/twilio-messaging',
        });
      });
    });
  });
});
