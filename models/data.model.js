const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    title: { type: String},
    description: { type: String },
    image: { 
      data: Buffer, 
      contentType:String,
      filename:String
    }
})
const DataModel = mongoose.model("data", dataSchema)

module.exports = {
    DataModel
}