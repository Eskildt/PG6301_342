//Core code from: https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/src/client/home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderBar from './headerbar';

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sendTo: "",
      amountToSend: "",
      cards: null,
      error: null,
      balance: null,
    };
  }

  componentDidMount() {
    this.updateBalance();
    this.fetchCards();

    if (this.props.userId) {
      this.props.updateLoggedInUserId;
    }
  }

  async fetchCards() {
    const url = '/api/cards';

    let response;
    let payload;

    try {
      response = await fetch(url);
      console.log(response);
      payload = await response.json();
    } catch (err) {
      this.setState({
        error: 'ERROR when retrieving list of recipes: ' + err,
        cards: null,
      });
      return;
    }

    if (response.status === 200) {
      this.setState({
        error: null,
        cards: payload,
      });
    } else {
      this.setState({
        error: 'Issue with HTTP connection: status code ' + response.status,
        cards: null,
      });
    }
  }

  async deleteCard(card) {
    const url = '/api/cards/' + card.id;

    let response;

    try {
      response = await fetch(url, {method: 'delete'});
      const transferUrl = 'api/sellCard';
      const body = JSON.stringify({ amount: card.price, userId: this.props.userId});
      await fetch(transferUrl, { headers: {
          'Content-Type': 'application/json',
        }, method: 'put', body: body });
      await this.fetchCards();
      await this.updateBalance();

    } catch (err) {
      alert('Delete operation failed: ' + err);
      return false;
    }

    if (response.status !== 204) {
      alert('Delete operation failed: status code ' + response.status);
      return false;
    }

    return true;
  };


  async newRandomCard() {
    const url = 'api/cards';
    try {
      const transferUrl = 'api/buyCards';
      const body = JSON.stringify({ amount: 1000, userId: this.props.userId});
      await fetch(transferUrl, { headers: {
          'Content-Type': 'application/json',
        }, method: 'put', body: body });
      if(this.state.balance >= 1000) {
        for (let i = 0; i < 3; i++) {
          await fetch(url, {method: 'post'});
        }
        await this.fetchCards();
        await this.updateBalance();
      }
    } catch (err) {

    }
  }

  async updateBalance() {
    const url = "/api/user";

    let response;

    try {
      response = await fetch(url);
    } catch (err) {
      this.setState({
        errorMsg: "ERROR when retrieving balance: " + err,
        balance: null
      });
      return;
    }

    if (response.status === 401) {
      //we are not logged in, or session did timeout
      this.props.updateLoggedInUserId(null);
      return;
    }

    if (response.status === 200) {
      const payload = await response.json();
      this.setState({
        errorMsg: null,
        balance: payload.balance
      });

      this.props.updateLoggedInUserId(payload.userId);
    } else {
      this.setState({
        errorMsg: "Issue with HTTP connection: status code " + response.status,
        balance: null
      });
    }
  }


  render() {
    const user = this.props.userId;
    let table;

    if (this.state.error !== null) {
      table = <p>{this.state.error}</p>;
    } else if (this.state.cards === null || this.state.cards.length === 0) {
      table = <p>There is no cards registered in the database</p>;
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
                <th>Name of card</th>
                <th>Description</th>
                <th>Value</th>
                <th>Price</th>
                {user ? <th>Sell</th> : <React.Fragment></React.Fragment>}
              </tr>
              </thead>
              <tbody>
              {this.state.cards.map((r) => (
                  <tr key={'key_' + r.id}>
                    <td>{r.cardsName}</td>
                    <td>{r.description}</td>
                    <td>{r.value}</td>
                    <td>{r.price}</td>
                    {user ? (
                        <td>

                          <button
                              className='btn'
                              onClick={(_) => this.deleteCard(r)}>
                            <i className='fas fa-trash'></i>
                          </button>
                        </td>
                    ) : (
                        <td></td>
                    )}
                  </tr>
              ))}

              </tbody>
            </table>
            <p className="balanceText">Your balance is currently: {this.state.balance}</p>
          </div>
      );
    }

      return (
          <div>
            <HeaderBar
                userId={this.props.userId}s
                updateLoggedInUserId={this.props.updateLoggedInUserId}
            />
            {user &&
              (
              <>
            <h2>Cards inventory</h2>

            {table}
            <button className='btn create'
                    onClick={(_) =>this.newRandomCard()}
            >New Lootbox
            </button>
            </>)
            }
          </div>
      );
    }
}
