const express = require('express');
const router = express.Router();
const passport = require('passport');

const Repository = require('./userRepository');

router.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.status(204).send();
});

router.post('/api/signup', function (req, res) {
  const created = Repository.createUser(req.body.userId, req.body.password);

  if (!created) {
    res.status(400).send();
    return;
  }

  passport.authenticate('local')(req, res, () => {
    req.session.save((err) => {
      if (err) {
        //shouldn't really happen
        res.status(500).send();
      } else {
        res.status(201).send();
      }
    });
  });
});

router.post('/api/logout', function (req, res) {
  req.logout();
  res.status(204).send();
});

router.get('/api/user', (req, res) => {
  if (req.user) {
    res.json({
      userId: req.user.id,
      balance: req.user.balance,
    });
    return;
  }

  res.status(401).send();
});

module.exports = router;
