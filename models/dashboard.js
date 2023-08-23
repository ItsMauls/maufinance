const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require("../models/user")

const dashboardSchema = new Schema({
  currentBalance : {
    type : Number,
    required : true
  },
  expense : Number,
  debt : Number,
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }    
}, {timestamps : true})

const Dashboard = mongoose.model('dashboard', dashboardSchema)

module.exports = Dashboard