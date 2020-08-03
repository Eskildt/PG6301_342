//Core code: https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/src/server/repository.js

const users = new Map();

function getUser(id) {
  return users.get(id);
}

function verifyUser(id, password) {
  const user = getUser(id);

  if (!user) {
    return false;
  }

  return user.password === password;
}

function createUser(id, password) {
  if (getUser(id)) {
    return false;
  }

  const user = {
    id: id,
    balance: 3000,
    password: password,
  };



  users.set(id, user);
  return true;
}

  function buyCards(userId, amount){

    const user = getUser(userId);

  if(isNaN(amount) || amount <= 0){
    return false;
  }

  if(user === undefined){
    return false;
  }

  if(user.balance < amount){
    return false;
  }
  user.balance -=amount;
  return true;
}

  function sellCards(userId, amount){
  const user = getUser(userId);

  if(isNaN(amount) || amount <= 0){
    return false;
  }

  if(user === undefined){
    return false;
  }

  user.balance +=amount
  return true;
}


function resetAllUsers() {
  users.clear();
}

module.exports = {
  verifyUser,
  createUser,
  getUser,
  resetAllUsers,
  buyCards,
  sellCards
};
