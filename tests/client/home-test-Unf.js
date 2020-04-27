const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { Home } = require('../../src/client/home');

const { app } = require('../../src/server/app');
/*Flaky test need revisit */

const needToLogInMsg = 'You are not logged in';

let server;
let port;

beforeAll((done) => {
  server = app.listen(0, () => {
    port = server.address().port;
    done();
  });
});

afterAll(() => {
  server.close();
});

test('Click link', () => {
  const driver = mount(
    <MemoryRouter>
      <Route component={Home} />
    </MemoryRouter>
  );

  const link = driver.find('#homeLink').hostNodes();

  expect(link).toBeDefined();
});

test('Test not logged in', async () => {
  const driver = mount(<Home />);

  const html = driver.html();
  expect(html.includes(needToLogInMsg)).toEqual(true);
});
