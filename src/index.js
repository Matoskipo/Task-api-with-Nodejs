const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

db.connectToDatabase()

const app =express()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter);


const port = process.env.PORT || 3000







app.listen(port, () => {
  console.log("server listening on "+ port);
});

