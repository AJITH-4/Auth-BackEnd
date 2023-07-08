const express = require('express')
const app = express()
const cors = require ("cors")
const dotenv = require('dotenv')
dotenv.config()
app.use (cors())

const PORT = process.env.PORT
const indexRouter = require("./router/index")
const userRouter = require ("./router/user")

app.use(express.json())
app.use('/',indexRouter)
app.use('/user',userRouter)

app.listen(PORT,()=>console.log("App is Listening "+PORT))