require("../src/db/mongoose.js")
const Task = require("../src/models/task.js")

const deleteTaskAndCount = async (id)=>{
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount("63c5a0f411094832b48265cf").then((count)=> console.log(count));

(async ()=>{
    const count = await deleteTaskAndCount("63c5a0f411094832b48265cf")
    console.log(count)
})()
