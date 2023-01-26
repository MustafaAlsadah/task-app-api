const express = require("express")
const Task = require("../models/task")
const router = new express.Router()

router.post("/tasks", async (req, res)=>{

    try {
        const taskProps = req.body
        const taskInstance = new Task(taskProps)
        const savedInstance = await taskInstance.save()
        res.status(201).json({
            result: "Success", 
            savedInstance
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get("/tasks", async (req, res)=>{

    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).end()
    }
})

router.get("/tasks/:id", async (req, res)=>{

    try {
        const id = req.params.id
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).end()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/tasks/:id", async (req, res)=>{
const validUpdates = ["description", "completed"]
const updates = Object.keys(req.body)
const isValidUpdate = validateUpdates(validUpdates, req.body)

if(!isValidUpdate){
   return res.status(400).send({error: "Invalid update fields", validUpdates})
}

try {
    const id = req.params.id
    const task = await Task.findById(id)
    if(!task){
        return res.status(404).end()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()

    res.send(task)
} catch (error) {
    res.status(400).send(error)
}
})

router.delete("/tasks/:id", async (req, res)=>{
try {
    const id = req.params.id
    const task = await Task.findByIdAndDelete(id)
    if(!task){
       return res.status(404).end()
    }

    res.send(task)
} catch (error) {
    res.status(500).end()
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