const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //1:  npm i jsonwebtoken

const Users = require("../auth/auth-model.js");
const { validateUser } = require("./auth-helpers.js");

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
	let user = req.body;
	// always validate the data before sending it to the db
	const validateResult = validateUser(user);

	if (validateResult.isSuccessful === true) {
		const hash = bcrypt.hashSync(user.password, 14); // 2 ^ n
		user.password = hash;

		Users.add(user)
			.then(saved => {
				const token = getJwtToken(user);

				// 3: send the token to the client
				res.status(201).json({
					message: `Welcome ${user.username}! have a token...`,
					token
				})
			})
			.catch(error => {
				res.status(500).json(error);
			});
	} else {
		res.status(400).json({
			message: "Invalid information about the user, see errors for details",
			errors: validateResult.errors
		});
	}
});

router.post("/login", (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				// 2: produce a token
				const token = getJwtToken(user);

				// 3: send the token to the client
				res.status(200).json({
					message: `Welcome ${user.username}! have a token...`,
					token
				});
			} else {
				res.status(401).json({ message: "Invalid Credentials" });
			}
		})
		.catch(error => {
			res.status(500).json(error.toString());
		});
});

function getJwtToken(user) {
	const payload = {
		username: user.username
		//this will come from the database
	};

	const secret = process.env.JWT_SECRET || 'Dead men inside the binary as we utilize the earths energy to explode ourselves into the future 32876';

	const options = {
		expiresIn: "1d"
	};

	return jwt.sign(payload, secret, options);
}

module.exports = router;
