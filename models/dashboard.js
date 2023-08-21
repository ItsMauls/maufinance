const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require("../models/user")

const dashboardSchema = new Schema({
  currentBalance : Number,
  expense : Number,
  debt : Number,
  date : Date,
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }    
}, {timestamps : true})

const Dashboard = mongoose.model('dashboard', dashboardSchema)

module.exports = Dashboard