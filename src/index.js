const express = require("express")
require("./db/mongoose")
const bcrypt = require("bcrypt")

//Routers
const userRouter = require("./routers/userRouter")
const taskRouter = require("./routers/taskRouter")

const port = process.env.PORT || 3000
const app = express()

//Setting-up Middlewares
app.use(express.json())  

//Connecting the separate Routers
app.use(userRouter)
app.use(taskRouter) 

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}...`)
})




