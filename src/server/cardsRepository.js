const cards = new Map();
const cardsUser = new Map();

let counter = 0;

function cardsOwned() {
  cards.clear();
  counter = 0;

  createNewCard('Andrea Arcuri', 'Says he is no sadist, teaches web & api', 'Legendary', "Vendor does not want him");

}

function createNewCard(cardsname, description, value, price) {
  const id = '' + counter;
  counter++;

  const card = {
    id: id,
    cardsName: cardsname,
    description: description,
    value: value,
    price : price,
  };

  cards.set(id, card);

  return id;
}




const dealRandomCards = () => {
  const allPossibleCards = allCards();
  let index = Math.floor(Math.random() * allPossibleCards.length);
  const card = {
      id: '' + counter,
      cardsName: allPossibleCards[index].cardsName,
      description: allPossibleCards[index].description,
      value: allPossibleCards[index].value,
      price : allPossibleCards[index].price,
  };
  counter++;
  cards.set(card.id, card);
  return cards.size;
}

function balance() {
  console.log(cards);
}


function allCards() {
  return [{id: "0", cardsName: 'Andrea Arcuri', description: 'Wrecks you with exam', value: 'Legendary', price: 1000},
  ({id: "1", cardsName:'Moonfire', description: 'Deal 1 damage', value: 'Normal',price: 100}),
  ({id: "2", cardsName:'Kayn Sunfury', description: 'Charge: All friendly attacks ignore taunt', value: 'Legendary', price: 1000}),
  ({id: "3", cardsName:'Explosive Trap', description: 'Secret: When your hero is attacked, deal 2 damage to all enemies', value: 'Standard',price: 100}),
  ({id: "4", cardsName:'Tome of intellect', description: 'Add a random Mage spell to your hand', value: 'Normal',price: 100}),
  ({id: "5", cardsName:'Scavenging Hyena', description: 'Whenever a friendly beast dies, gain +2/+1.', value: 'Beast',price: 100}),
  ({id: "6", cardsName:'Rolling Fireball', description: 'Deal 8 damage to a minion', value: 'Epic',price: 500}),
  ({id: "7", cardsName:'Holy Light', description: 'Restore 6 Health.', value: 'Normal',price: 100}),
  ({id: "8", cardsName:'Shotbot', description: 'Reborn', value: 'Normal',price: 100}),
  ({id: "9", cardsName:'Consecration', description: 'Deal 2 damage to all enemies.', value: 'Normal',price: 100}),
  ({id: "10", cardsName:'Northsire Cleric', description: 'Whenever a minion is healed, draw a card.', value: 'Rare',price: 200}),
  ({id: "11", cardsName:'Mind Control', description: 'Take control of an enemy minion', value: 'Epic',price: 500}),
  ({id: "12", cardsName:'Spymistress', description: 'Stealth', value: 'Normal',price: 100}),
  ({id: "13", cardsName:'Assassinate', description: 'Destroy an enemy minion', value: 'Standard',price: 100}),
  ({id: "14", cardsName:'Totemic Might', description: 'Give your totems +2 Health', value: 'Normal',price: 100}),
  ({id: "15", cardsName:'Windfury', description: 'Give a minion Windfury', value: 'Rare',price: 200}),
  ({id: "16", cardsName:'Hex', description: 'Transform a minion into a 0/1 Frog with Taunt', value: 'Normal',price: 100}),
  ({id: "17", cardsName:'Voidwalker', description: 'Taunt', value: 'Normal',price: 100}),
  ({id: "18", cardsName:'Grommash Hellscream', description: 'Charge. Has +6 attack while damaged', value: 'Legendary', price: 1000}),
  ({id: "19", cardsName:'Ysera', description: 'At the end of your turn, add a Dream Card to your hand.', value: 'Legendary', price: 1000})];
}





function deleteCards(id) {
  console.log(id);
  return cards.delete(id);
}

function getCards(id) {
  return cards.get(id);
}

function getAllCards() {
  return Array.from(cards.values());
}

function updateCards(card) {
  if (!cards.has(card.id)) {
    return false;
  }

  cards.set(card.id, card);
  return true;
}

function getAllCardsSince(value) {
  return cards.values().filter((r) => r.value >= value);
}

module.exports = {
  cardsOwned: cardsOwned,
  getAllCards: getAllCards,
  getAllCardsSince: getAllCardsSince,
  createNewCard: createNewCard,
  getCard: getCards,
  updateCard: updateCards,
  deleteCard: deleteCards,
  dealRandomCards: dealRandomCards,
  allCards: allCards,
  balance: balance
};
