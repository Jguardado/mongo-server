const should = require('should');
const sinon = require('sinon');
const bookController = require('../controllers/bookController');

describe('Book Controller Test', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {
      const Book = function () { this.save = () => { } };
      const req = {
        body: {
          author: 'fake author',
        },
      };
      const res = {
        send: sinon.spy(),
        status: sinon.spy(),
        json: sinon.spy(),
      };

      const controller = bookController(Book);
      controller.post(req, res);
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});
