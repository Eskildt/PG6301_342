import React from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import HeaderBar from './headerbar';

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchRecipes();

    if (this.props.userId) {
      this.props.updateLoggedInUserId;
    }
  }

  async fetchRecipes() {
    const url = '/api/recipes';

    let response;
    let payload;

    try {
      response = await fetch(url);
      payload = await response.json();
    } catch (err) {
      this.setState({
        error: 'ERROR when retrieving list of recipes: ' + err,
        recipes: null,
      });
      return;
    }

    if (response.status === 200) {
      this.setState({
        error: null,
        recipes: payload,
      });
    } else {
      this.setState({
        error: 'Issue with HTTP connection: status code ' + response.status,
        recipes: null,
      });
    }
  }

  deleteRecipe = async (id) => {
    const url = '/api/recipes/' + id;

    let response;

    try {
      response = await fetch(url, { method: 'delete' });
    } catch (err) {
      alert('Delete operation failed: ' + err);
      return false;
    }

    if (response.status !== 204) {
      alert('Delete operation failed: status code ' + response.status);
      return false;
    }

    this.fetchRecipes();

    return true;
  };

  render() {
    const user = this.props.userId;
    let table;

    if (this.state.error !== null) {
      table = <p>{this.state.error}</p>;
    } else if (this.state.recipes === null || this.state.recipes.length === 0) {
      table = <p>There is no recipe registered in the database</p>;
    } else {
      table = (
        <div className='tbl-header'>
          <table
            cellPadding='0'
            cellSpacing='0'
            border='0'
            className='allBooks'>
            <thead>
              <tr>
                <th>Chef(s)</th>
                <th>Meal</th>
                <th>Day</th>
                {user ? <th>Options</th> : <React.Fragment></React.Fragment>}
              </tr>
            </thead>
            <tbody>
              {this.state.recipes.map((r) => (
                <tr key={'key_' + r.id}>
                  <td>{r.chef}</td>
                  <td>{r.meal}</td>
                  <td>{r.day}</td>
                  {user ? (
                    <td>
                      <Link to={'/edit?recipeId=' + r.id}>
                        <button className='btn'>
                          <i className='fas fa-edit'></i>
                        </button>
                      </Link>

                      <button
                        className='btn'
                        onClick={(_) => this.deleteRecipe(r.id)}>
                        <i className='fas fa-trash'></i>
                      </button>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))}
            </tbody>
            {user ? (
              <Link to={'/create'}>
                <button className='btn create'>New Receipe</button>
              </Link>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </table>
        </div>
      );
    }

    return (
      <div>
        <HeaderBar
          userId={this.props.userId}
          updateLoggedInUserId={this.props.updateLoggedInUserId}
        />
        <h2>This Week's Meal List</h2>

        {table}

        <Link to={'/chat'}>
          <button className='btn'>Chat</button>
        </Link>
      </div>
    );
  }
}
