const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            required: true
        },
    
        password: {
            type: String,
            required: true
        }
    }
)

UserSchema.pre("save", function(next){
    this.password = bcrypt.hashSync(this.password);
    next();
})

const User = mongoose.model("User", UserSchema);


module.exports = User;