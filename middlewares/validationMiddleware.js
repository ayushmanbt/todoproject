const {validationResult} = require("express-validator");


module.exports = (req, res, next) => {
    if(validationResult(req).array().length > 0){

        return res.status(400).json({
            message: "All the required fields are not present"
        })
    }
    next()
}