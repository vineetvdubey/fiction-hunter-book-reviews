const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UserCredential = require('../models/userCredential');

const router = express.Router();

/* ***********************************************************
 * Helpers to handle error scenarios - Start
 * ******************************************************** */
const handleServerError = (err, res) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).send({ error: 'Internal Server Error. Please contact admin.' });
};

const handleInvalidJson = (res) => {
  res.status(400).send({ error: 'Invalid/unexpected json body. Refer API Docs.' });
};

const handleInvalidCredentials = (res) => {
  res.status(400).send({ error: 'Incorrect email or password.' });
};
/* ***********************************************************
 * Helpers to handle error scenarios - End
 * ******************************************************** */

/* ***********************************************************
 * Middlewares specific to sessions apis - Start
 * ******************************************************** */
const middlewares = {
  validateSessionCreateJson(req, res, next) {
    if (req.body.email && req.body.password) {
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
 * Middlewares specific to sessions apis - End
 * ******************************************************** */

/* ***********************************************************
 * Routes for sessions - Start
 * ******************************************************** */

// Create a session i.e login a user
router.post('/', [middlewares.validateSessionCreateJson], (req, res) => {
  const { email, password } = req.body;
  UserCredential.findOne({ email: email.toLowerCase() })
    .then((userCred) => {
      if (userCred) {
        if (bcrypt.compareSync(password, userCred.password)) {
          User.findOne({ email }).then((user) => {
            req.session.userId = user._id;
            req.session.userName = user.userName;
            req.session.role = user.role;
            res.status(200).send();
          });
        } else {
          handleInvalidCredentials(res);
        }
      } else {
        handleInvalidCredentials(res);
      }
    })
    .catch((err) => handleServerError(err));
});

// Delete a session i.e logout
router.delete('/me', (req, res) => {
  delete req.session.userId;
  delete req.session.userName;
  delete req.session.role;
  res.status(204).send();
});

/* ***********************************************************
 * Routes for sessions - End
 * ******************************************************** */

module.exports = router;
