const supertests = require('supertest')
const authRouter = require('../auth/auth-router.js');
const db = require('../database/dbConfig.js');
const server = require('../api/server.js');
const { validateUser } = require('./auth-helpers.js')


//we're going to test here after implementing environment using cross env and set in the package.json that the test environment is DB_ENV=testing

test('the current environment should be testing', () => {
	expect(process.env.DB_ENV).toBe('testing')
});

//this tests the register endpoint using the validateUser function used to confirm that user is passing in all needed info
describe('Auth-router test that validates user', () => {
	describe('validateUser()', () => {


		it('should fail if misssing password', () => {
			const invalidUser = {};
			const result = validateUser({ username: 'somebody w/o password' });
			const actual = validateUser(invalidUser);
			expect(result.isSuccessful).toBe(false);
			expect(actual.errors).toHaveLength(2);

		})
		it('should succeed if called with a valid user', () => {
			const result = validateUser({
				username: 'somebody',
				password: 'valid password'
			});
			expect(result.isSuccessful).toBe(true);
			expect(result.errors).toHaveLength(0);

		});

	})
})

describe('Test login endpoint to see if we get a 401 response for not having valid password or username and that we get an success message 200 when login is correct and get the Welcome have a token message', () => {
	it('should fail if missing password and username', () => {
		return supertests(server)
			.post('/api/auth/login')
			.send({ username: '', password: '' })
			.then(response => {
				expect(response.status).toEqual(401)
			})
	})
	it('should fail if username and passwords are objects', () => {
		return supertests(server)
			.post('/api/auth/login')
			.send({ username: {}, password: {} })
			.then(response => {
				expect(response.status).toEqual(401)
			})


	})
	it('should return a 400 if we try and access api/jokes without credentials and sending empty object', () => {
		return supertests(server)
			.post('/api/jokes')
			.send({})
			.then(response => {
				expect(response.status).toEqual(400)
			})

	})

})

