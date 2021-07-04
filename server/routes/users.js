const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const UserCredential = require('../models/userCredential');

const router = express.Router();

/* ***********************************************************
 * Helpers to handle error scenarios - Start
 * ******************************************************** */
const handleServerError = (err, res) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'Invalid parameters.' });
  } else {
    res.status(500).send({ error: 'Internal Server Error. Please contact admin.' });
  }
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
  validateUserCreateJson(req, res, next) {
    if (req.body.email && req.body.password && req.body.userName) {
      next();
    } else {
      handleInvalidJson(res);
    }
  },
  logger(req, res, next) {
    // eslint-disable-next-line no-console
    console.log(`Processing request: ${req.originalUrl}`);
    next();
  },
};
/* ***********************************************************
 * Middlewares specific to books apis - End
 * ******************************************************** */

/* ***********************************************************
 * Routes for users - Start
 * ******************************************************** */

// Create a user
router.post('/', [middlewares.validateUserCreateJson, middlewares.logger], (req, res) => {
  const { email, password, userName } = req.body;
  UserCredential.findOne({ email: email.toLowerCase() })
    .then((entry) => {
      if (entry) {
        res.status(400).send({ error: 'User already exists.' });
      } else {
        const newUserCredential = { email, password: bcrypt.hashSync(password) };
        UserCredential.create(newUserCredential).then(() => {
          const newUser = { email, userName };
          User.create(newUser).then((user) => {
            res.status(201).send({ userId: user._id });
          });
        });
      }
    })
    .catch((err) => handleServerError(err));
});

// Get own user
router.get('/me', auth.authorizeUser, (req, res) => {
  User.findOne({ _id: req.session.userId })
    .then((user) => {
      res.send({
        userId: user._id,
        userName: user.userName,
        role: user.role,
      });
    })
    .catch((err) => handleServerError(err));
});
/* ***********************************************************
 * Routes for users - End
 * ******************************************************** */

module.exports = router;
