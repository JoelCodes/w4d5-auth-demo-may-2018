const bcrypt = require('bcrypt');

exports.seed = function (knex, Promise) {
  return knex('photos').del()
    .then(() => knex('users').del())
    .then(() => knex('users')
        .returning('*')
        .insert([{
          name: 'Joel',
          email: 'joel@joel.joel',
          password_hash: bcrypt.hashSync('joel', 12),
        }, {
          name: 'Matt',
          email: 'matt@matt.matt',
          password_hash: bcrypt.hashSync('matt', 12),
        }]))
    .then((insertedUsers) => {
      const [joel, matt] = insertedUsers;
      return knex('photos')
        .returning('*')
        .insert([{
          user_id: joel.id,
          url: 'https://images.reverb.com/image/upload/s---lKagEAM--/a_exif,c_limit,e_unsharp_mask:80,f_auto,fl_progressive,g_south,h_620,q_90,w_620/v1485378602/kcjtfylbstlzr5a8clwl.jpg',
          description: 'I want me that mandocello',
        }, {
          user_id: matt.id,
          url: 'https://i.ytimg.com/vi/KG1U8-i1evU/maxresdefault.jpg',
          description: 'The surliest llama',
        }]);
    });
};
