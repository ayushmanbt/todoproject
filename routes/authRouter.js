const express = require("express");

const {body, validationResult} = require("express-validator");
const User = require("../models/User");

const JWT = require("jsonwebtoken")

const bcrypt = require("bcryptjs");
const authGuard = require("../middlewares/authGuard");

const userRouter = express.Router();

userRouter.post(
    "/create", 
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").notEmpty(),
    (req, res, next) => {
        if(validationResult(req).array().length > 0){

            return res.status(400).json({
                message: "All the required fields are not present"
            })
        }
        next()
    },
    async(req, res) => {

        try {
            const user = new User({
                ...req.body
            });
    
            await user.save();
            res.json({
                user
            });
            
        } catch (error) {
            res.json({
                error: error.toString(),
                message: "Something went wrong!"
            })
        }

    }
)

userRouter.post(
    "/login",
    body("email").isEmail(),
    body("password").notEmpty(),
    (req,res, next) => {
        if(validationResult(req).array().length > 0){
            return res.json({
                message: "All the required fields are not filled"
            })
        }
        next();
    },
    async(req,res) => {
        try {
            const user = await User.findOne({email: req.body.email});

            if(!user){
                return res.json({
                    message: "User not found!"
                })
            }

            let result = bcrypt.compareSync(req.body.password, user.password);

            let accesstoken = JWT.sign(
                {userID: user._id}, 
                process.env.JWT_SECRET,
                {
                    expiresIn: "30m"
                }
            );

            let refreshtoken = JWT.sign(
                {userID: user._id}, 
                process.env.REFRESH_SECRET,
            );

            if(result){

                res.cookie("REFRESH", refreshtoken, {
                    httpOnly: true
                });

                return res.json({
                    message: "Login Success!",
                    accesstoken
                })
            }

            else{
                return res.json({
                    message: "Login Failed!"
                })
            }
            

        } catch (error) {
            res.json({
                error: error.toString(),
                message: "Something went wrong!"
            })
        }
    }
)


userRouter.get(
    "/refresh",
    async(req, res) => {

        try {
            const refreshtoken = req.cookies["REFRESH"];
            const {userID} = JWT.verify(refreshtoken, process.env.REFRESH_SECRET);
            
            const user = await User.findById(userID);

            if(!user) return res.json({message: "user not found!"});

            let accesstoken = JWT.sign(
                {userID: user._id}, 
                process.env.JWT_SECRET,
                {
                    expiresIn: "30m"
                }
            );

            let rt = JWT.sign(
                {userID: user._id}, 
                process.env.REFRESH_SECRET,
            );

            res.cookie("REFRESH", rt, {httpOnly: true});

            return res.json({
                message: "Refreshed!",
                accesstoken
            })

        } catch (error) {
            res.json({
                error: error.toString(),
                message: "Something went wrong!"
            })
        }
        
    }
)

userRouter.get(
    "/logout",
    (req, res) => {
        res.clearCookie("REFRESH");
        res.json({
            message: "Logout Successful"
        })
    }
)


userRouter.get(
    "/details",
    authGuard,
    async(req,res) => {
        try {
            const user = await User.findById(req.userID)

            res.json({
                user
            })
        } catch (error) {
            res.json({
                error: error.toString(),
                message: "Something went wrong!"
            })
        }
    }
)





module.exports = userRouter;
