const express = require("express")
require("dotenv").config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require("../models/user.model");
const userRoutes = express.Router()


userRoutes.post("/register", async (req, res) => {
    const { name, email, pass } = req.body
    try {
        const data =await UserModel.findOne({email})
        bcrypt.hash(pass, 5, async (err, secure_pass) => {
            if (data) {
                res.send({err:"Email already exists"})
            }
            else {
                const user = new UserModel({ name, email,  pass: secure_pass })
                await user.save()
                res.send({"Register":"Register successfully"})
            }
        });

    }
    catch (err) {
        console.log("error while connected to db")
        console.log(err)
        res.status(500).send('Server error');
    }

})



userRoutes.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ email })
        const hased_pass = user[0].pass
        //console.log(hased_pass)
       // console.log(user)
        if (user.length > 0) {
            bcrypt.compare(pass, hased_pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, process.env.key);
                    res.send({ "mess": "login Done", "token": token })
                }
                else {
                    res.send({"err":"wrong credential"})
                }
            });

        }
        else {
            res.send("wrong credential")
        }
    }
    catch (err) {
        console.log("error in login")
        console.log(err)
    }

})


// userRoutes.get("/data", async (req, res) => {
//     const token = req.query.token
//     jwt.verify(token, 'masai', (err, decoded) => {
//         if (err) {
//             res.send("invalid token")
//         }
//         else {
//             res.send("Data...")
//         }
//     })


// })


module.exports = {
    userRoutes
}