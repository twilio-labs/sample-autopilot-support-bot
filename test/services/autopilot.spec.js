'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const client = require('twilio')('ACxxxxxxxx', 'fake-token');

const assistant = require('../../src/services/assistant');
const updateAssistant = require('../../src/services/autopilot');
// const Tasks = require('../../src/services/tasks');

const expect = chai.expect;

chai.use(sinonChai);

describe('Services.Autopilot', function() {
  afterEach(function() {
    sinon.restore();
  });
  describe('#updateAssistant', function() {
    let tasksStub;
    let assistantStub;

    beforeEach(function() {
      tasksStub = {
        createAll: sinon.stub(),
      };
      assistantStub = {
        modelBuilds: sinon.stub().returns({
          create: sinon.stub(),
        }),
      };
    });
    context(
      'when there is no phone number attached to the account',
      function() {
        it('aborts the setup', async function() {
          sinon.stub(assistant, 'linkAssistantToPhoneNumber').resolves(null);
          await updateAssistant(assistantStub, tasksStub);

          expect(assistantStub.modelBuilds).to.not.have.been.called;
          expect(tasksStub.createAll).to.not.have.been.called;
        });
      }
    );

    context('when there is a phone number attached to the account', function() {
      it('creates the tasks for the assistant', async function() {
        sinon.stub(assistant, 'linkAssistantToPhoneNumber').resolves({});
        await updateAssistant(assistantStub, tasksStub);

        expect(assistantStub.modelBuilds).to.have.been.calledOnce;
        expect(tasksStub.createAll).to.have.been.calledOnce;
      });
    });
  });
});
