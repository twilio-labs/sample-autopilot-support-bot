'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Tasks = require('../../src/services/tasks');

const expect = chai.expect;

chai.use(sinonChai);

describe('Services.Tasks', function() {
  afterEach(function() {
    sinon.restore();
  });
  describe('#createAll', function() {
    it('creates all the tasks', async function() {
      const database = {
        init: sinon.stub(),
        getData: sinon.stub().resolves({
          name: 'Teldigo',
          baseUrl: 'http://example.com',
          resetPasswordUrl: 'http://example.com/password',
          weekdayHours: {
            start: 8,
            end: 17,
          },
          weekendHours: {
            start: 9,
            end: 12,
          },
        }),
      };

      const tasks = new Tasks({});
      const stub = sinon.stub(tasks, '_createOrUpdate');
      await tasks.createAll(sinon.stub(), database);

      expect(stub).to.have.callCount(6);
      expect(stub.getCall(0)).to.have.been.calledWith(
        sinon.match.has('actions'),
        'Greetings'
      );
      expect(stub.getCall(1)).to.have.been.calledWith(
        sinon.match.has('actions'),
        'Main Menu'
      );
      expect(stub.getCall(2)).to.have.been.calledWith(
        sinon.match.has('actions'),
        'Reset Password'
      );
      expect(stub.getCall(3)).to.have.been.calledWith(
        sinon.match.has('actions')
      );
      expect(stub.getCall(4)).to.have.been.calledWith(
        sinon.match.has('actions'),
        'Additional Information'
      );
      expect(stub.getCall(5)).to.have.been.calledWith(
        sinon.match.has('actions'),
        'Operator'
      );
    });
  });

  describe('#_createOrUpdate', function() {
    context('when there is no existing tasks', function() {
      it('creates a new task', async function() {
        const assistant = {
          tasks: sinon.stub().returns({
            list: sinon.stub().resolves([]),
            create: sinon.stub().resolves({
              samples: sinon.stub().returns({
                create: sinon.stub(),
              }),
            }),
          }),
        };
        const tasks = new Tasks(assistant);
        const samples = ['sample'];
        await tasks._createOrUpdate(
          { actions: 'My Actions' },
          'My Task',
          samples
        );
        expect(assistant.tasks().create).to.have.been.calledOnceWith({
          friendlyName: 'My Task',
          uniqueName: 'my-task',
          actions: {
            actions: 'My Actions',
          },
        });
      });
    });

    context('when there is an existing task', function() {
      it('updates the task with the actions provided', async function() {
        const updateStub = sinon.stub();
        const sampleStub = sinon.stub();
        const assistant = {
          tasks: sinon.stub().returns({
            list: sinon.stub().resolves([
              {
                uniqueName: 'my-task',
                update: updateStub,
                samples: sampleStub.returns({
                  list: sinon.stub().resolves([]),
                  create: sinon.stub(),
                }),
              },
            ]),
            create: sinon.stub(),
          }),
        };
        const tasks = new Tasks(assistant);
        await tasks._createOrUpdate({ actions: 'My Actions' }, 'My Task', [
          'sample',
        ]);
        expect(assistant.tasks().create).to.not.have.been.called;
        expect(updateStub).to.have.been.calledOnceWith({
          actions: {
            actions: 'My Actions',
          },
        });
        expect(sampleStub().create).to.have.been.called;
      });
    });
  });
});
