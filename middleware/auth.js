const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
	// Check if an Authorization header was sent
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

	// check if the header was sent in the right format - "Bearer abcdefg"
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
        req.isAuth = false;
        return next();
	}

	// try to verify the token
	let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.KEY);
    } catch (err) {
        req.isAuth = false;
        return next();
	}
	
	if (!decodedToken) {
		req.isAuth = false
		return next();
	}

	req.isAuth = true;
	req.userID = decodedToken.userID
	next();
};
