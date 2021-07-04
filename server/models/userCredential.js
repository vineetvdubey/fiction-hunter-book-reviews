const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserCredentialSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model('UserCredential', UserCredentialSchema);
