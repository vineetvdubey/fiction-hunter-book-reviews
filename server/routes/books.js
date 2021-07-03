const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Book = require('../models/book');
const Rating = require('../models/rating');

const router = express.Router();

const serverError = (err, res) => {
  console.error(err);
  res.status(500).send({ error: 'Internal Server Error' });
};

const invalidJson = (res) => res.status(400).send({ error: 'Missing mandatory fields in json body. Refer API Docs.' });

const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};

/**
 * Middlewares specific to books route
 */
const middlewares = {
  validateBookId(req, res, next) {
    if (!isValidObjectId(req.params.bookId)) {
      res.status(400).send({ error: `Book not found with bookId: ${req.params.bookId}` });
      return;
    }
    next();
  },
  validateBookCreate(req, res, next) {
    const { title, author, description } = req.body;
    if (title && author && description) {
      next();
    } else {
      invalidJson(res);
    }
  },
  validateReviewCreate(req, res, next) {
    if (req.body.message) {
      next();
    } else {
      invalidJson(res);
    }
  },
  validateRatingCreate(req, res, next) {
    if (req.body.rating) {
      next();
    } else {
      invalidJson(res);
    }
  },
  logger(req, res, next) {
    console.log(`Request hit : ${req.originalUrl}`);
    next();
  },
};

/**
 * Create a book
 */
router.post('/', [middlewares.validateBookCreate, middlewares.logger], (req, res) => {
  const { title, author, description, imageUrl } = req.body;
  const newBook = new Book({ title, author, description, imageUrl });
  newBook
    .save()
    .then((book) => {
      res.status(201).send({ bookId: book.bookId });
    })
    .catch((err) => serverError(err, res));
});

/**
 * Get all books
 */
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
    .catch((err) => serverError(err, res));
});

/**
 * Get specific book
 */
router.get('/:bookId', [middlewares.validateBookId, middlewares.logger], (req, res) => {
  const { bookId } = req.params;
  Book.findById(bookId)
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
        res.status(400).send({ error: `Book not found with bookId: ${bookId}` });
      }
    })
    .catch((err) => serverError(err, res));
});

/**
 * Create review
 */
router.post(
  '/:bookId/reviews',
  [middlewares.validateBookId, middlewares.validateReviewCreate, middlewares.logger],
  (req, res) => {
    const { userId, userName } = req.session;
    const { bookId } = req.params;
    const { message } = req.body;
    const review = {
      userId,
      userName,
      message,
    };
    // TODO Check if review exist for current user before pushing to reviews array
    Book.findByIdAndUpdate({ _id: bookId }, { $push: { reviews: review } })
      .then(() => res.status(201).send())
      .catch((err) => serverError(err, res));
  },
);

/**
 * Delete review
 */
router.delete('/:bookId/reviews/me', [middlewares.validateBookId, middlewares.logger], (req, res) => {
  const { userId } = req.session;
  const { bookId } = req.params;
  Book.findByIdAndUpdate({ _id: bookId }, { $pull: { reviews: { userId } } })
    .then(() => res.status(204).send())
    .catch((err) => serverError(err, res));
});

/**
 * Create rating
 * //TODO Document steps
 * //TODO try solving this without using additional Rating collection, use Books collection
 */
router.post(
  '/:bookId/ratings',
  [middlewares.validateBookId, middlewares.validateRatingCreate, middlewares.logger],
  (req, res) => {
    req.session.userId = 'vineet'; // TODO remove this line, added for testing
    const { userId } = req.session;
    const { bookId } = req.params;
    const { rating } = req.body;
    const ratingId = { userId, bookId };
    Rating.findOne({ _id: ratingId })
      .then((ratingObj) => {
        let deltaRatingValue;
        let deltaRatingCount;
        if (ratingObj) {
          deltaRatingValue = rating - ratingObj.rating;
          deltaRatingCount = 0;
        } else {
          deltaRatingValue = rating;
          deltaRatingCount = 1;
        }
        Rating.updateOne({ _id: ratingId }, { rating }, { upsert: true }).then(() => {
          Book.findByIdAndUpdate(
            { _id: bookId },
            { $inc: { ratingValue: deltaRatingValue, ratingCount: deltaRatingCount } },
          )
            .then(() => res.status(201).send())
            .catch((err) => serverError(err, res));
        });
      })
      .catch((err) => serverError(err, res));
  },
);

/**
 * Delete rating
 * //TODO Document steps
 * //TODO try solving this without using additional Rating collection, use Books collection
 */
router.delete('/:bookId/ratings/me', [middlewares.validateBookId, middlewares.logger], (req, res) => {
  req.session.userId = 'vineet'; // TODO remove this line, added for testing
  const { userId } = req.session;
  const { bookId } = req.params;
  const ratingId = { userId, bookId };
  Rating.findOne({ _id: ratingId })
    .then((ratingObj) => {
      if (ratingObj) {
        const deltaRatingValue = -1 * ratingObj.rating;
        const deltaRatingCount = -1;
        Rating.deleteOne({ _id: ratingId }).then(() => {
          Book.findByIdAndUpdate(
            { _id: bookId },
            { $inc: { ratingValue: deltaRatingValue, ratingCount: deltaRatingCount } },
          )
            .then(() => res.status(201).send())
            .catch((err) => serverError(err, res));
        });
      } else {
        res.status(204).send();
      }
    })
    .catch((err) => serverError(err, res));
});

module.exports = router;
