const jwt = require("jsonwebtoken")
const user = require("../models/user")
const User = require("../models/user")

const auth = async (req, res, next)=>{
    try {
        const token = req.header("Authorization").replace("Bearer", "").trim()
        const decodedToken = await jwt.verify(token, "dontdozat")
        const validUserForYou = await User.findOne( {_id:decodedToken._id, "tokens.token":token} )

        if(validUserForYou){
            req.token = token
            req.user = validUserForYou
            next()
        }else{
            throw new Error("Plz authenticate yourself")
        }
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = auth