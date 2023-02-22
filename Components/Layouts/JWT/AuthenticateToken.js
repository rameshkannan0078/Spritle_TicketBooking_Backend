const jwt = require("jsonwebtoken");
const ACCESS_TOKEN = require("../JWT/GlobalTokens");

module.exports = {
    authenticateToken: (req, res, next) => {
        const authorization = req.headers["authorization"];
        const token = authorization && authorization.split(" ")[1];
        if (!token) {
            return res.send({
                status:401,
                message: "Unauthorized: No token provided"
            });
        }

        jwt.verify(token, ACCESS_TOKEN.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.send({
                    status:401,
                    message: "Unauthorized: Invalid token"
                });
            }

            req.user = user;
            next();
        });
    }
};
