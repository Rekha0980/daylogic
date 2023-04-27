const express = require("express")
require("dotenv").config()
const { connection } = require("./configs/db")
const { userRoutes } = require("./routes/users.routes")
const cors=require("cors")
const { dataRoutes } = require("./routes/data.routes")
const {authentication}=require("./middleware/Authentication")



const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("homepage")

})
app.use("/users",userRoutes)

//app.use(authentication)

app.use("/data",dataRoutes)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("connected to DB")
    }
    catch (err) {
        console.log("error while connected to db")
        console.log(err)
    }
})