const express = require('express');
const Book = require('../models/book');

const router = express.Router();

/* ***********************************************************
 * Helpers to handle error scenarios - Start
 * ***********************************************************
 */
const handleServerError = (err, res) => {
  console.error(err);
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'Invalid parameters.' });
  } else {
    res.status(500).send({ error: 'Internal Server Error. Please contact admin.' });
  }
};

const handleBookNotFound = (res) => {
  res.status(404).send({ error: `Book not found.` });
};

const handleInvalidJson = (res) => {
  res.status(400).send({ error: 'Invalid/unexpected json body. Refer API Docs.' });
};
/* ***********************************************************
 * Helpers to handle error scenarios - End
 * ******************************************************** */

/* ***********************************************************
 * Middlewares specific to books apis - Start
 * ******************************************************** */
const middlewares = {
  validateBookCreateJson(req, res, next) {
    if (req.body.title && req.body.author && req.body.description) {
      next();
    } else {
      handleInvalidJson(res);
    }
  },
  validateReviewJson(req, res, next) {
    if (req.body.message) {
      next();
    } else {
      handleInvalidJson(res);
    }
  },
  validateRatingJson(req, res, next) {
    if (req.body.rating) {
      next();
    } else {
      handleInvalidJson(res);
    }
  },
  logger(req, res, next) {
    console.log(`Processing request: ${req.originalUrl}`);
    next();
  },
};
/* ***********************************************************
 * Middlewares specific to books apis - End
 * ******************************************************** */

/* ***********************************************************
 * Routes for books - Start
 * ******************************************************** */

// Create a book
router.post('/', [middlewares.validateBookCreateJson, middlewares.logger], (req, res) => {
  const { title, author, description, imageUrl } = req.body;
  const newBook = { title, author, description, imageUrl };
  Book.create(newBook)
    .then((book) => {
      res.status(201).send({ bookId: book.bookId });
    })
    .catch((err) => handleServerError(err, res));
});

// Get all books
router.get('/', [middlewares.logger], (req, res) => {
  Book.find()
    .then((books) => {
      const result = books.map((book) => ({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl,
        averageRating: book.averageRating,
      }));
      res.send(result);
    })
    .catch((err) => handleServerError(err, res));
});

// Get a book
router.get('/:bookId', [middlewares.logger], (req, res) => {
  Book.findById(req.params.bookId)
    .then((book) => {
      if (book) {
        const result = {
          bookId: book.bookId,
          title: book.title,
          author: book.author,
          description: book.description,
          imageUrl: book.imageUrl,
          averageRating: book.averageRating,
          reviews: book.reviews,
        };
        res.send(result);
      } else {
        handleBookNotFound(res);
      }
    })
    .catch((err) => handleServerError(err, res));
});
/* ***********************************************************
 * Routes for books - End
 * ******************************************************** */

/* ***********************************************************
 * Routes for reviews - Start
 * ******************************************************** */

// Add own review
router.post('/:bookId/reviews', [middlewares.validateReviewJson, middlewares.logger], (req, res) => {
  const { userId, userName } = req.session;
  const { bookId } = req.params;
  const review = { userId, userName, message: req.body.message };
  Book.findOne({ _id: bookId })
    .then((book) => {
      if (book) {
        const existingReview = book.reviews.find((obj) => obj.userId === userId);
        if (existingReview) {
          res.status(400).send({
            error: 'Only one review allowed per user. Please delete existing review and try again. Refer API Docs.',
          });
        } else {
          Book.updateOne({ _id: bookId }, { $push: { reviews: review } }).then(() => res.status(201).send());
        }
      } else {
        handleBookNotFound(res);
      }
    })
    .catch((err) => handleServerError(err, res));
});

// Delete own review
router.delete('/:bookId/reviews/me', [middlewares.logger], (req, res) => {
  const { userId } = req.session;
  const { bookId } = req.params;
  Book.findByIdAndUpdate({ _id: bookId }, { $pull: { reviews: { userId } } })
    .then((book) => {
      if (book) {
        res.status(204).send();
      } else {
        handleBookNotFound(res);
      }
    })
    .catch((err) => handleServerError(err, res));
});
/* ***********************************************************
 * Routes for reviews - End
 * ******************************************************** */

/* ***********************************************************
 * Routes for ratings - Start
 * ******************************************************** */

// Add own rating
router.put('/:bookId/ratings', [middlewares.validateRatingJson, middlewares.logger], (req, res) => {
  const { userId } = req.session;
  const { bookId } = req.params;
  const { rating: newRating } = req.body;
  Book.findOne({ _id: bookId })
    .then((book) => {
      if (book) {
        const existingRatingsObj = book.ratings.find((obj) => obj.userId === userId);
        if (existingRatingsObj) {
          Book.updateOne(
            { _id: bookId, 'ratings.userId': userId },
            {
              $set: { 'ratings.$.rating': newRating },
              $inc: { ratingValue: newRating - existingRatingsObj.rating, ratingCount: 0 },
            },
          )
            .then(() => res.status(201).send())
            .catch((err) => handleServerError(err, res));
        } else {
          const newRatingsObj = { userId, rating: newRating };
          Book.updateOne(
            { _id: bookId },
            {
              $push: { ratings: newRatingsObj },
              $inc: { ratingValue: newRating, ratingCount: 1 },
            },
          ).then(() => res.status(201).send());
        }
      } else {
        handleBookNotFound(res);
      }
    })
    .catch((err) => handleServerError(err, res));
});

// Delete own rating
router.delete('/:bookId/ratings/me', [middlewares.logger], (req, res) => {
  const { userId } = req.session;
  const { bookId } = req.params;
  Book.findOne({ _id: bookId, 'ratings.userId': userId })
    .then((book) => {
      if (book) {
        const existingRating = book.ratings.find((obj) => obj.userId === userId).rating;
        Book.updateOne(
          { _id: bookId, 'ratings.userId': userId },
          {
            $pull: { ratings: { userId } },
            $inc: { ratingValue: 0 - existingRating, ratingCount: -1 },
          },
        ).then(() => res.status(204).send());
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => handleServerError(err, res));
});
/* ***********************************************************
 * Routes for ratings - End
 * ******************************************************** */

module.exports = router;
