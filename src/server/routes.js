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

router.post('/api/transfers', (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  const dto = req.body;

  const from = req.user.id;
  const to = dto.to;
  const amount = dto.amount;

  const transferred = Repository.transferMoney(from, to, amount);

  const form = req.is('application/x-www-form-urlencoded');

  if (form) {
    res.status(302);
    if (transferred) {
      res.location('/');
    } else {
      res.location('/?error=true');
    }
    res.send();
  } else {
    if (transferred) {
      res.status(204);
    } else {
      res.status(400);
    }

    res.send();
  }
});

module.exports = router;
