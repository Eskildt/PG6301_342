//Core code: https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/src/server/server.js

const { app } = require('./app');
const repository = require('./cardsRepository');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  repository.cardsOwned();
  console.log('Started server on port ' + port);
});
