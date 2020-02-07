const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../server');
const agent = supertest(app);

describe('appointment', function() {
  describe('GET /', function() {
    it('returns index.html', function(done) {
      agent
        .get('/')
        .expect(function(response) {
          expect(response.text).to.contain('SMS Support Chatbot');
        })
        .expect(200, done);
    });
  });
});
