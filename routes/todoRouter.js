const express = require("express");
const { body } = require("express-validator");
const authGuard = require("../middlewares/authGuard");
const validationMiddleware = require("../middlewares/validationMiddleware");

const todoRouter = express.Router();

const Todo = require("../models/Todo");

todoRouter.get(
    "/all",
    authGuard,
    async(req,res) => {
    try {
        let todos = await Todo.find({userID: req.userID});
        res.json({todos});
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong",
            error: error.toString()
        })  
    }
    
})

todoRouter.get(
    "/:id", 
    authGuard,
    async(req,res) => {
    try {
        let {id} = req.params
        let todo = await Todo.findById(id);
        if(!todo){
            return res.status(404).json({
                message: "Todo not found"
            })
        }
        res.json({
            todo
        })
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong",
            error: error.toString()
        })
    }
})

todoRouter.post(
    "/create", 
    authGuard,
    body("description").notEmpty(),
    validationMiddleware,
    (req, res) => {
    try{
        let {description} = req.body;
        if(!description) {
            return res.status(400).json({
                message: "Description not provided"
            })
        }
        const newTodo = new Todo({
            description,
            userID: req.userID
        })

        newTodo.save();

        return res.json({todo: newTodo});
    } catch(error){
        res.status(500).json({
            message: "Sorry something went wrong",
            error: error.toString()
        })  
    }
})

todoRouter.post(
    "/update", 
    authGuard,
    body("id").notEmpty(),
    body("description").notEmpty(),
    body("isDone").notEmpty(),
    validationMiddleware,
    async(req,res) => {
    try {
        let {id, description, isDone} = req.body;

        let todo = await Todo.findById(id);

        if(!todo || todo.userID != req.userID){
            res.status(404).json({
                message: "Sorry todo not found",
            }) 
        }

        todo = await Todo.findByIdAndUpdate(id, {
            description,
            isDone
        }, {new: true})
        
        return res.json({
            message: "Updated successfully",
            todo
        })
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong",
            error: error.toString()
        })  
    }

})

todoRouter.post(
    "/delete", 
    authGuard,
    body("id").notEmpty(),
    validationMiddleware,
    async(req,res) => {
        try {
            let {id} = req.body;
            let todo = await Todo.findByIdAndDelete(id, {new: true});
            return res.json({
                message: "Deleted successfully",
                todo
            })
        } catch (error) {
            res.status(500).json({
                message: "Sorry something went wrong",
                error: error.toString()
            })
        }
})

module.exports = todoRouter;