const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')



// Set up server
const app = express()
const port = process.env.PORT

// Set up MIDDLEWARE



// Set up routers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



// Start the server
app.listen(port, () => {
    console.log(`Server is up on port: ${port}`)
})

