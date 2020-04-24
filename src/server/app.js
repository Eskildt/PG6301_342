const express = require('express');
const repository = require('./repository');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

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

app.use(express.static('public'));

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;
