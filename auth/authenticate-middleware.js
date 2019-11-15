const jwt = require('jsonwebtoken');

//we will export this  function to confirm that the user has not altered the token and has a verified token 

module.exports = (req, res, next) => {
	const token = req.headers.authorization;
	if (token) {
		const secret = process.env.JWT_secret || 'Dead men inside the binary as we utilize the earths energy to explode ourselves into the future 32876'

		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				//this will create a message indicating that the value has been altered
				res.status(401).json({ message: 'Credentials supplied are not valid.' })
			} else {
				req.decodedJwt = decodedToken;
				next();
			}
		})
	}

	else {
		res.status(400).json({ you: 'shall not pass! No credentials provided' });
	}
};
