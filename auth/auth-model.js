//building out an auth model to separate out the database logic from the auth-router.js router user input and send logic

const db = require('../database/dbConfig.js');

module.exports = {
	add,
	find,
	findBy,
	findById,
};

function find() {
	return db('users').select('id', 'username');
}

function findBy(filter) {
	return db('users').where(filter);
}

async function add(user) {
	const [id] = await db('users').insert(user);

	return findById(id);
}

function findById(id) {
	return db('users')
		.where({ id })
		.first();
}
