const bcrypt = require('bcrypt');

const users = [{ id: 1, name: 'Joel', email: 'joel@joel.joel', password_hash: bcrypt.hashSync('joel', 12) }, { id: 2, name: 'Matt', email: 'matt@matt.matt', password_hash: bcrypt.hashSync('matt', 12) }];

function delayResolve(val, t = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, t);
  });
}

function makeUserService(knex) {
  function getUser(id) {
    return delayResolve(users.find(user => user.id === id));
    // return knex('users')
    //   .where('id', Number(id) || 0)
    //   .first('*');
  }
  function getUserByEmail(email) {
    return knex('users')
      .where('email', email)
      .first('*');
  }
  function authenticate(email, password) {
    return getUserByEmail(email)
      .then((user) => {
        if (user) {
          const isValid = bcrypt.compareSync(password, user.password_hash);
          if (isValid) {
            return user;
          }
        }
        return undefined;
      });
  }
  function createUser(name, email, password) {
    const password_hash = bcrypt.hashSync(password, 12);
    return knex('users')
      .returning('*')
      .insert({
        name, email, password_hash,
      });
  }
  return {
    getUser,
    getUserByEmail,
    authenticate,
    createUser,
  };
}

module.exports = makeUserService;
