const express = require("express")
const multer = require('multer');
const { DataModel } = require("../models/data.model");
const dataRoutes = express.Router()

const upload = multer({ storage: multer.memoryStorage() });

dataRoutes.post('/upload', upload.single('image'), async (req, res) => {
    //console.log(req.file)
    const { buffer, originalname } = req.file;
    const { title, description } = req.body;
    const image = new DataModel({
        title: title,
        description: description,
        // image: {
        //     data: buffer,
        //     filename: originalname
        // }
        image: buffer
    });
    //console.log(image)
    await image.save();
    res.send('Image uploaded successfully');
});

dataRoutes.get("/", async (req, res) => {
    let data = await DataModel.find()
    res.send(data)
})

dataRoutes.get("/:id", async (req, res) => {
    const id = req.params.id
    const data = await DataModel.findOne({ "_id": id })
    res.send(data)
})

dataRoutes.get('/:id/img', async (req, res) => {
    const id = req.params.id;
    await DataModel.findOne({ "_id": id })
        //console.log(data)
        .then(data => {
            if (!data) {
                return res.status(404).send('data not found');
            }
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(data.image);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Error in showing img');
        });
});


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

dataRoutes.patch('/update/:id', upload.single('image'), async (req, res) => {
    try {
      const image = await DataModel.findById(req.params.id);
      if (!image) {
        return res.status(404).send('Image not found');
      }
  
      if (req.file) {
        const {  buffer } = req.file;
        image.image.data = buffer;
      }
  
      if (req.body.title) {
        image.title = req.body.title;
      }
  
      if (req.body.description) {
        image.description = req.body.description;
      }
  
      await image.save();
      res.send('Image updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

module.exports = {
    dataRoutes
}