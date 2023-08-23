const User = require("../models/user")
const Needs = require("../models/needs")
const Dashboard = require("../models/dashboard")
const {format} = require('date-fns')
let updatedDashb
const { validationResult } = require('express-validator')

exports.getDashboard = async (req,res) => {
    try {
       
        if(req.session.user) {
           const user = await User.findById(req.session.user._id)
           const rawDate = user.updatedAt.toISOString()
           const formatDate = format(new Date(rawDate), 'd-MM-yy, HH:mm', {weekday : 'long'})
           const userDashboard = user.dashboard[0]
        

           res.render('./menu/dashboard', {
               pageTitle : 'Dashboard',
               path : '/dashboard',
               currentUser : user.username,
               user,
               formatDate,
               updatedDashboard : updatedDashb,
                userDashboard
           })
       }
       res.render('./menu/dashboard', {
           pageTitle : 'Dashboard',
           path : '/dashboard'
       })
   }
   catch (err) {
           console.log(err)
       }
   }



exports.postBalance = async (req,res) => {
 
    const {
        balance,
        expense,
        debt,
        date
    } = req.body
    try {
        const user = await User.findById(req.session.user._id)
        const needs = await Needs.find({user : req.session.user._id})
        const errors = validationResult(req)
        const userDashboard = user.dashboard[0]
        const totalHarga = needs.reduce((total, needs) => total + needs.price, 0)

        if(!errors.isEmpty()) {
            return res.status(422)
            .render('./menu/priority', {
                path : '/prioritas',
                pageTitle : 'Prioritas Saya',
                currentUser : user.username,
                user,
                needs,
                userDashboard,
                totalHarga,
                validationError : errors.array(),
                errorMessage : errors.array()[0].msg
            })
           }
       
        const insertBalance = new Dashboard({
            user : user,
            currentBalance : balance,
            expense,
            debt,
            date
        })
        await insertBalance.save()
        user.dashboard.push({
            dashboardID: insertBalance._id,
            dashboardData: {
                currentBalance: balance,
                expense,
                debt,
                date
            }
        });
        await user.save()
        res.redirect('/prioritas')
    }
    catch(err) {
        console.log(err)
    }
}

exports.updateBalance = async (req,res,next) => {
    const user = await User.findById(req.session.user._id)
    const rawDate = user.updatedAt.toISOString()
    const formatDate = format(new Date(rawDate), 'd-MM-yy, HH:mm', {weekday : 'long'})
    const userBalance = user.dashboard[0].dashboardData
    const userId = user.dashboard[0].dashboardID
    const dashboardId = req.params.dashID
    const {
        balance,
        expense,
        debt
    } = req.body
    try {
    const updatedUserBalance = await Dashboard.findByIdAndUpdate(dashboardId, {
      currentBalance : balance,
      debt,
      expense
        },
        {new : true})
    userBalance.currentBalance = updatedUserBalance.currentBalance
    userBalance.debt = updatedUserBalance.debt
        user.dashboard[0] = {
            dashboardID : dashboardId,
            dashboardData: {
                currentBalance: updatedUserBalance.currentBalance,
                debt: updatedUserBalance.debt,
                expense: updatedUserBalance.expense
            }
        };
    await user.save()

    updatedDashb = updatedUserBalance
    res.status(201)
    .render('./menu/dashboard', {
        pageTitle : 'Dashboard',
        path : '/dashboard',
        currentUser : user.username,
        user,
        formatDate,
        updatedDashboard : updatedDashb,
        userBalance,
        userId
    })
    
    }
    catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}