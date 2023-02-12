const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: "String",
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(entry){
            const entryIsInvalid = !validator.isEmail(entry)
            if(entryIsInvalid){
                throw new Error("Invalid email format")
            }
        }
    },
    password: {
        type: String,
        minLength: 7,
        trim: true,
        required: true,
        validate(entry){
            if((entry.toLowerCase()).includes("password")){
                throw new Error("It's not allowed to include the word \"password\" in your password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(entry){
            if(entry<0){
                throw new Error("Age can't be less than 0")
            }
        }
    },
    tokens: [{ 
        token:{
            type: String,
            required: true
        }
     }]
})

userSchema.statics.findByCredentials = async (email, pass)=>{
    const user = await User.findOne({ email })
    if(!user){
        throw new Error(`User with email ${email} is not registered`)
    }
    const authenticated = await bcrypt.compare(pass, user.password)

    if(authenticated){
        return user
    }else{
        throw new Error("Wrong password")
    }
}

userSchema.methods.generateAuthToken = async function(payload){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "dontdozat")
    user.tokens.push( {token} )
    await user.save()

    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userJson = user.toObject()
    delete userJson.tokens
    delete userJson.password
    return userJson
}

/* It's a middleware that hashes the password before saving it to the database. */
userSchema.pre("save", async function(next){
    const user = this
    if(user.isModified("password")){
        const hashedPass = await bcrypt.hash(user.password, 8)
        user.password = hashedPass
    }
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = mongoose.models["User"] || User