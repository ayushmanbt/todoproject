const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    description: {
        type: String,
        required: true
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;