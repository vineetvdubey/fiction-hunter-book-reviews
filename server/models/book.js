const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    postedAt: { type: Number, default: Date.now },
  },
  { _id: false },
);

const RatingSchema = new Schema(
  {
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false },
);

const BookSchema = new Schema({
  _id: { type: Schema.ObjectId, alias: 'bookId', auto: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  imageUrl: { type: String, default: '', trim: true },
  ratingCount: { type: Number, default: 0 },
  ratingValue: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  ratings: [RatingSchema],
});

BookSchema.virtual('averageRating').get(function averageRating() {
  return +(this.ratingCount === 0 ? 0 : this.ratingValue / this.ratingCount).toFixed(2);
});

module.exports = mongoose.model('Book', BookSchema);
