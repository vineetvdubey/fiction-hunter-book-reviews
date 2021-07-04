const handleNoAuthentication = (res) => {
  res.status(401).send({ error: 'Please login.' });
};

const handleNoAuthorization = (res) => {
  res.status(403).send({ error: 'Insufficient permission.' });
};

const authorizeUser = (req, res, next) => {
  if (req.session.userId && req.session.role) {
    if (req.session.role === 'USER' || req.session.role === 'ADMIN') {
      next();
    } else {
      handleNoAuthorization(res);
    }
  } else {
    handleNoAuthentication(res);
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.session.userId && req.session.role) {
    if (req.session.role === 'ADMIN') {
      next();
    } else {
      handleNoAuthorization(res);
    }
  } else {
    handleNoAuthentication(res);
  }
};

module.exports = {
  authorizeUser,
  authorizeAdmin,
};
