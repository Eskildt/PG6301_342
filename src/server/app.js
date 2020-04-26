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
const ews = require('express-ws')(app);
const WS = require('ws');

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

/*WebSocket */

let counter = 0;

const messages = [];

app.get('/api/messages', (req, res) => {
  const since = req.query['since'];

  const data = messages;

  if (since) {
    res.json(data.filter((m) => m.id > since));
  } else {
    res.json(data);
  }
});

app.post('/api/messages', (req, res) => {
  const dto = req.body;

  const id = counter++;

  const msg = { id: id, author: dto.author, text: dto.text };

  messages.push(msg);

  res.status(201); //created
  res.send();

  const nclients = ews.getWss().clients.size;
  console.log('Going to broadcast message to ' + nclients + ' clients');

  ews.getWss().clients.forEach((client) => {
    if (client.readyState === WS.OPEN) {
      const json = JSON.stringify(msg);
      console.log('Broadcasting to client: ' + JSON.stringify(msg));
      client.send(json);
    } else {
      console.log('Client not ready');
    }
  });
});

app.ws('/', function (ws, req) {
  console.log('Established a new WS connection');
});

function clearMessages() {
  //yep, that's how you "clear" an array in JS...
  messages.length = 0;
}

/* Recipe API */

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

module.exports = { app, clearMessages };
