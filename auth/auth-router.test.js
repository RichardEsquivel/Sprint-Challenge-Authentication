const supertest = require('supertest')
const authRouter = require('../auth/auth-router.js');
const db = require('../database/dbConfig.js');
const server = require('../api/server.js');
const { validateUser } = require('./auth-helpers.js')


//we're going to test here after implementing environment using cross env and set in the package.json that the test environment is DB_ENV=testing

test('the current environment should be testing', () => {
	expect(process.env.DB_ENV).toBe('testing')
});


describe('Auth-router test that validates user', () => {
	describe('validateUser()', () => {
		beforeEach(async () => {
			await db('users').truncate();
		});

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