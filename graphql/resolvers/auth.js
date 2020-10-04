const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

// Root resolver
const authResolver = {
    createUser: async (args) => {
        try {
            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            );
            const user = new User({
				email: args.userInput.email,
				name: args.userInput.name,
                password: hashedPassword,
            });
            const result = await user.save();
            const token = jwt.sign(
                { userID: result.id, email: result.email },
                process.env.KEY,
                {
                    expiresIn: "1h",
                }
			);
			return {
				userID: user.id,
				token,
				tokenExpiration: 1
			}
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User doesn't exist");
            }
            const isCorrectPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isCorrectPassword) {
                throw new Error("Password is incorrect");
            }
            const token = jwt.sign(
                { userID: user.id, email: user.email },
                process.env.KEY,
                {
                    expiresIn: "1h",
                }
			);
			return {
				userID: user.id,
				token,
				tokenExpiration: 3600
			}
        } catch (err) {
            throw err;
        }
    },
};

module.exports = authResolver;
