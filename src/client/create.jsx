import React from 'react';
import Recipe from './recipe';

export class Create extends React.Component {
  constructor(props) {
    super(props);
  }

  onOk = async (chef, meal, day, recipeId) => {
    const url = '/api/recipes';

    const payload = { chef, meal, day };

    let response;

    try {
      response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return false;
    }

    return response.status === 201;
  };

  render() {
    return (
      <div>
        <h3>Create a New Recipe</h3>
        <Recipe
          author={''}
          title={''}
          year={''}
          ok={'Create'}
          okCallback={this.onOk}
        />
      </div>
    );
  }
}
