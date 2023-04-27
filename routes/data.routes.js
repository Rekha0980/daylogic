const express = require("express")
const multer = require('multer');
const { DataModel } = require("../models/data.model");
const dataRoutes = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

dataRoutes.post('/upload', upload.single('image'), async (req, res) => {
    //console.log(req.file)
    const { mimetype, buffer, originalname } = req.file;
    const { title, description } = req.body;
    const image = new DataModel({
        title: title,
        description: description,
        image: {
            data: buffer,
            contentType: mimetype,
            filename: originalname
        }
    });
    //console.log(image)
    await image.save();
    res.send('Image uploaded successfully');
});

dataRoutes.get("/", async (req, res) => {
    let data = await DataModel.find()
    res.send(data)
})

dataRoutes.delete("/:id", async (req, res) => {
    const id = req.params.id
    const note = await DataModel.findOne({ "_id": id })
    const userID_in_note = note.userID
    const userId_makeing_req = req.body.userID

    try {
        if (userId_makeing_req !== userID_in_note) {
            res.send({ "msg": "You are not authorized" })

        }
        else {
            await DataModel.findByIdAndDelete({ "_id": id })
            res.send("data deleted")
        }
    }
    catch (err) {
        console.log({ "err": "error creating note" })
        console.log(err)
    }

})

// dataRoutes.patch("/update/:id", async (req, res) => {
//     const payload = req.body
//     const id = req.params.id
//     const note = await DataModel.findOne({ "_id": id })
//     const userID_in_note = note.userID
//     const userId_makeing_req = req.body.userID

//     try {
//         if (userId_makeing_req !== userID_in_note) {
//             res.send({ "msg": "You are not authorized" })

//         }
//         else {
//             await NoteModel.findByIdAndUpdate({ "_id": id }, payload)
//             res.send("note updated")
//         }
//     }
//     catch (err) {
//         console.log({ "err": "error creating note" })
//         console.log(err)
//     }

// })

module.exports = {
    dataRoutes
}