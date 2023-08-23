const mongoose = require('mongoose')
const Schema = mongoose.Schema

const needsSchema = new Schema({
      items : {
        type : String,
        required : true
      },
      price : {
        type : Number,
        required : true
      },
      qty : {
        type : Number,
        default : 1
      },
    user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
 }, {timestamps : true})

const Needs = mongoose.model('needs', needsSchema)

module.exports = Needs