const express = require('express');
const repository = require('./recipeRepository');
const bodyParser = require('body-parser');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const routes = require('./routes');
const passport = require('passport');
const session = require('express-session');
const Repository = require('./userRepository');

const app = express();

if (false) {
  console.log('Using CORS to allow all origins');
  app.use(cors());
}

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public'));

passport.use(
  new LocalStrategy(
    {
      usernameField: 'userId',
      passwordField: 'password',
    },
    function (userId, password, done) {
      const ok = Repository.verifyUser(userId, password);

      if (!ok) {
        return done(null, false, { message: 'Invalid username/password' });
      }

      const user = Repository.getUser(userId);
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = Repository.getUser(id);

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.get('/api/recipes', (req, res) => {
  const since = req.query['since'];

  if (since) {
    res.json(repository.getAllRecipesSince(since));
  } else {
    res.json(repository.getAllRecipes());
  }
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = repository.getRecipe(req.params['id']);

  if (!recipe) {
    res.status(404);
    res.send();
  } else {
    res.json(recipe);
  }
});

app.delete('/api/recipes/:id', (req, res) => {
  const deleted = repository.deleteRecipe(req.params.id);
  if (deleted) {
    res.status(204);
  } else {
    res.status(404);
  }
  res.send();
});

app.post('/api/recipes', (req, res) => {
  const dto = req.body;

  const id = repository.createNewRecipe(dto.meal, dto.chef, dto.day);

  res.status(201);
  res.header('location', '/api/recipes/' + id);
  res.send();
});

app.put('/api/recipes/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    res.status(409);
    res.send();
    return;
  }

  const updated = repository.updateRecipe(req.body);

  if (updated) {
    res.status(204);
  } else {
    res.status(404);
  }
  res.send();
});

app.all('/api*', (req, res) => {
  res.status(404);
  res.send();
});

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;
