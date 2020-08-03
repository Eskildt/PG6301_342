//Core code from: https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/src/client/index.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Home } from './home';
import { NotFound } from './not_found';

import Login from './login';
import SignUp from './signup';
import Cards from './cards';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
    };
  }

  updateLoggedInUserId = (userId) => {
    this.setState({ userId: userId });
  };

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path='/login'
              render={(props) => (
                <Login
                  {...props}
                  userId={this.state.userId}
                  updateLoggedInUserId={this.updateLoggedInUserId}
                />
              )}
            />
            <Route
              exact
              path='/signup'
              render={(props) => (
                <SignUp
                  {...props}
                  userId={this.state.userId}
                  updateLoggedInUserId={this.updateLoggedInUserId}
                />
              )}
            />
            <Route
              exact
              path='/'
              render={(props) => (
                <Home
                  {...props}
                  userId={this.state.userId}
                  updateLoggedInUserId={this.updateLoggedInUserId}
                />
              )}
            />
            <Route
                exact
                path='/cards'
                render={(props) => (
                    <Cards
                        {...props}
                        updateLoggedInUserId={this.updateLoggedInUserId}
                    />
                )}
            />

            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
