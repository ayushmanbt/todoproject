const JWT = require("jsonwebtoken");

module.exports = (req, res, next)=> {
    try {
        const data = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.userID = data.userID
        next()
    } catch (error) {
        return res.json({
            message: "JWT malformed or expired"
        })
    }
}