const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    message: { type: String, required: true },
    postedAt: { type: Number, default: Date.now },
  },
  { _id: false },
);

const RatingSchema = new Schema(
  {
    userId: { type: String, required: true },
    rating: { type: String, required: true },
  },
  { _id: false },
);

const BookSchema = new Schema({
  _id: { type: Schema.ObjectId, alias: 'bookId', auto: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  ratingCount: { type: Number, default: 0 },
  ratingValue: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  ratings: [RatingSchema],
});

BookSchema.virtual('averageRating').get(function averageRating() {
  return (this.ratingCount === 0 ? 0 : this.ratingValue / this.ratingCount).toFixed(2);
});

module.exports = mongoose.model('Book', BookSchema);
