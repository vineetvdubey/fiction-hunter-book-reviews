const express = require('express');

const router = express.Router();

const users = require('./routes/users');
const sessions = require('./routes/sessions');
const books = require('./routes/books');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/users', users);
router.use('/sessions', sessions);
router.use('/books', books);

module.exports = router;
