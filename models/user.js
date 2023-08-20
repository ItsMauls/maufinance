const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Dashboard = require("../models/dashboard")

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    dashboard : [
        {
        dashboardID : {
            type : Schema.Types.ObjectId,
            ref : 'dashboard'
        },
        dashboardData : {
            type : Object
        }
    }],
    resetToken : String,
    resetTokenExpiration : Date
}, {timestamps : true})

const User = mongoose.model('user', userSchema)

module.exports = User