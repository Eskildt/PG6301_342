import React from 'react';
import Recipe from './recipe';

export class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: null,
      error: null,
    };

    this.recipeId = new URLSearchParams(window.location.search).get('recipeId');

    if (this.recipeId === null) {
      this.state.error = 'Unspecified book id';
    }
  }

  componentDidMount() {
    if (this.state.error === null) {
      this.fetchRecipe();
    }
  }

  async fetchRecipe() {
    const url = '/api/recipes/' + this.recipeId;

    let response;
    let payload;

    try {
      response = await fetch(url);
      payload = await response.json();
    } catch (err) {
      this.setState({
        error: 'ERROR when retrieving recipe: ' + err,
        recipe: null,
      });
      return;
    }

    if (response.status === 200) {
      this.setState({
        error: null,
        recipe: payload,
      });
    } else {
      this.setState({
        error: 'Issue with HTTP connection: status code ' + response.status,
        recipe: null,
      });
    }
  }

  onOk = async (chef, meal, day, id) => {
    const url = '/api/recipes/' + id;

    const payload = { id, chef, meal, day };

    let response;

    try {
      response = await fetch(url, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return false;
    }

    return response.status === 204;
  };

  render() {
    if (this.state.error !== null) {
      return (
        <div>
          <p>Cannot edit recipe. {this.state.error}</p>
        </div>
      );
    }

    if (this.state.recipe === null) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <h3>Edit Recipe</h3>
        <Recipe
          author={this.state.recipe.author}
          title={this.state.recipe.title}
          year={this.state.recipe.year}
          recipeId={this.recipeId}
          ok={'Update'}
          okCallback={this.onOk}
        />
      </div>
    );
  }
}
