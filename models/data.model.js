const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    title: { type: String},
    description: { type: String },
    // image: { 
    //   data: Buffer, 
    //   filename:String
    // }
    image:Buffer
})
const DataModel = mongoose.model("data", dataSchema)

module.exports = {
    DataModel
}