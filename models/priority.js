const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prioritySchema = new Schema({
  needs : {
    type : Schema.Types.ObjectId,
    ref : 'Needs'
  },
  wants : {
    type : Schema.Types.ObjectId,
    ref : 'Wants'
  },
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