const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prioritySchema = new Schema({
  needs : [
    {
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
      }
    }
  ],
  wants : [
    {
      items : {
        type : String
      },
      price : {
        type : Number
      },
      qty : {
        type : Number,
        default : 1
      }
    }
  ],
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  dashboard : [{
    dashboardID : {
        type : Schema.Types.ObjectId,
        ref : 'dashboard'
      },
      balance : {
        type : Object
      }
  }]
}, {timestamps : true})

const Priority = mongoose.model('priority', prioritySchema)

module.exports = Priority