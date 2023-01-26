const doWork = async ()=>{
    return 4
}

(async ()=>{
    console.log( await doWork())
})()


