# Schema Documentation

## MongoDB Outline

- **DB**: FictionHunt
- **Collections**:
    - usercredentials
    - users
    - books
    - sessions
<br>

## Mongoose Schema Outline  

### UserCredentialSchema
```javascript
{
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
}
```
<br>

### UserSchema
```javascript
{
  _id: { type: Schema.ObjectId, alias: 'userId', auto: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  userName: { type: String, required: true, unique: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
}
```
<br>

### BookSchema
```javascript
{
  _id: { type: Schema.ObjectId, alias: 'bookId', auto: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  imageUrl: { type: String, default: '', trim: true },
  ratingCount: { type: Number, default: 0 },
  ratingValue: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  ratings: [RatingSchema],
}
```

### ReviewSchema
```javascript
{
  userId: { type: String, required: true },
  userName: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  postedAt: { type: Number, default: Date.now },
}
```

### RatingSchema
```javascript
{
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}
```
