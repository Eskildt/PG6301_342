import React from 'react';
import { allCards } from '../server/cardsRepository';
import {withRouter} from "react-router-dom";
import HeaderBar from "./headerbar";

export class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: null
        }
    }

    componentDidMount() {
        console.log(allCards());
        const cards = allCards();
       this.setState( {cards: cards});
       console.log(cards);
    }

    render() {

        let table;

        if (this.state.cards === null || this.state.cards.length === 0) {
            table = <p>There is no cards registered in the database</p>;
        } else {

            table = (
                <div className='tbl-header'>
                    <p>Overview of all the cards in the game</p>
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
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.cards.map((r) => (
                            <tr key={'key_' + r.id}>
                                <td>{r.cardsName}</td>
                                <td>{r.description}</td>
                                <td>{r.value}</td>
                                <td>{r.price}</td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>
            );
        }

       return <div>
            <HeaderBar
                updateLoggedInUserId={this.props.updateLoggedInUserId}
            />

           {this.state.cards && table}
        </div>
    }
}

export default withRouter(Cards);