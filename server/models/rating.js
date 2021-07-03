const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingIdSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const ratingSchema = new Schema(
  {
    _id: {
      type: ratingIdSchema,
    },
    rating: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: false },
);

module.exports = mongoose.model('Rating', ratingSchema);
