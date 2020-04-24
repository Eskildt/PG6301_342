import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chef: this.props.chef ? this.props.chef : '',
      meal: this.props.meal ? this.props.meal : '',
      day: this.props.day ? this.props.day : '',
    };

    this.ok = this.props.ok ? this.props.ok : 'Ok';
  }

  onFormSubmit = async (event) => {
    event.preventDefault();

    const completed = await this.props.okCallback(
      this.state.chef,
      this.state.meal,
      this.state.day,
      this.props.recipeId
    );

    if (completed) {
      this.props.history.push('/');
    } else {
      alert('Failed to create new Recipe');
    }
  };

  onChefChange = (event) => {
    this.setState({ chef: event.target.value });
  };

  onMealChange = (event) => {
    this.setState({ meal: event.target.value });
  };

  onDayChange = (event) => {
    this.setState({ day: event.target.value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <div className='inputTitle'>Chef(s):</div>
          <input
            placeholder={'Type the chef(s) of this recipe'}
            value={this.state.chef}
            onChange={this.onChefChange}
            className='bookInput'
          />
          <div className='inputTitle'>Meal:</div>
          <input
            placeholder={'Type the meal of this recipe'}
            value={this.state.meal}
            onChange={this.onMealChange}
            className='bookInput'
          />
          <div className='inputTitle'>Year:</div>
          <input
            placeholder={'Type the day for this meal.'}
            value={this.state.day}
            onChange={this.onDayChange}
            className='bookInput'
          />

          <button type='submit' className={'btn'}>
            {this.ok}
          </button>
          <Link to={'/'}>
            <button className={'btn'}>Cancel</button>
          </Link>
        </form>
      </div>
    );
  }
}

export default withRouter(Recipe);
