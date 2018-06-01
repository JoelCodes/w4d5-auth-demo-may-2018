
exports.up = function (knex) {
  return knex.schema.createTable('photos', (table) => {
    table.increments();
    table.string('url');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
    table.text('description');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('photos');
};
