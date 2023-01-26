const express = require("express")
const User = require("../models/user")
const router = new express.Router()
const auth = require("../middlewares/auth")

router.post("/users/login", async (req, res)=>{ //Login
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post("/users/logout", auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token) //if token matches req.token => keep it
        await req.user.save()

        res.send("Logged out")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post("/users", async (req, res)=>{ //Signup
    const userFields = req.body
    const userInstance = new User(userFields)

    try{
        const token = await userInstance.generateAuthToken( {_id: userInstance._id} )
        res.status(201).json({
            result: "Success!",
            entry: userInstance,
            token
        }) 
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.get("/users/me", auth, async (req, res)=>{

    try {
        console.log(req.user, 1)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/users/:id", async (req, res)=>{

        try {
            const id = req.params.id
            const user = await User.findById(id)
            if(!user){
                return res.status(404).end()
            }
            res.status(200).send(user)
        } catch (error) {
            res.status(500).send(error.message)
        }
})

router.patch("/users/:id", async (req, res)=>{
    const validUpdates = ["name", "age", "email", "password"]
    const updates = Object.keys(req.body)
    const isValidUpdate = validateUpdates(validUpdates, req.body)

    if(!isValidUpdate){
       return  res.status(400).send({error: "Invalid update fields", validUpdates})
    }

    try { 
        const id = req.params.id
        const user = await User.findById(id)

        if(!user){
            return res.status(404).end()
        }
        updates.forEach(update => {
             user[update] = req.body[update]
        });
        await user.save()

        res.send(user) 
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete("/users/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if(!user){
           return res.status(404).end()
        }
        
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * It takes in an array of valid updates and the request body, and returns true if all the requested
 * updates are valid, and false if not
 * @param validUpdatesArray - an array of strings that represent the valid updates that can be made to
 * a user's profile.
 * @param requestBody - The request body that is sent to the server.
 * @returns A boolean value.
 */
function validateUpdates(validUpdatesArray, requestBody){
    const requestedUpdates = Object.keys(requestBody)
    const isValidUpdate = requestedUpdates.every((requestedUpdate) => validUpdatesArray.includes(requestedUpdate))
    return isValidUpdate
}

module.exports = router