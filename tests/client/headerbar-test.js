//Core code: https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/tests/client/headerbar-test.jsx

const React = require('react');
const { mount } = require('enzyme');
const { MemoryRouter } = require('react-router-dom');

const { HeaderBar } = require('../../src/client/headerbar');
const { app } = require('../../src/server/app');

const notLoggedInMsg = 'You are not logged in';


describe("Test Header Component", () => {
  it("should test Header containing buttons", () => {
    const userId = null;
    const updateLoggedInUser = () => {
    };

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
          <HeaderBar userId={userId} updateLoggedInUser={updateLoggedInUser}/>
        </MemoryRouter>
    );
    const html = driver.html();
    expect(html.includes(notLoggedInMsg)).toEqual(true);
  })

  test('Test not logged in', async () => {
    const userId = null;
    const updateLoggedInUser = () => {
    };

    const driver = mount(
        <MemoryRouter initialEntries={['/home']}>
          <HeaderBar userId={userId} updateLoggedInUser={updateLoggedInUser}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(notLoggedInMsg)).toEqual(true);
  });

  test('Test logged in', async () => {
    const userId = 'Foo';
    const updateLoggedInUser = () => {
    };

    const driver = mount(
        <MemoryRouter initialEntries={['/home']}>
          <HeaderBar userId={userId} updateLoggedInUser={updateLoggedInUser}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(notLoggedInMsg)).toEqual(false);
    expect(html.includes(userId)).toEqual(true);
  })
});

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
