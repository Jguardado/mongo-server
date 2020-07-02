const express = require('express');
const bookController = require('../controllers/bookController');

function routes(Book) {
  const controller = bookController(Book);
  const bookRouter = express.Router();
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  bookRouter.route('/books/:bookId')
    .get((req, res) => res.json(req.book))
    .put((req, res) => {
      const { book } = req;
      /* eslint-disable no-param-reassign */
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      /* eslint-enable no-param-reassign */
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(req.book);
      });
    })
    .patch((req, res) => {
      const { book } = req;
      /* eslint-disable no-underscore-dangle */
      if (req.body._id) {
        delete req.body._id;
      }
      /* eslint-enable no-underscore-dangle */
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(req.book);
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
