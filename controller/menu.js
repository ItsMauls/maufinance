const User = require("../models/user")
const Dashboard = require("../models/dashboard")

exports.getDashboard = async (req,res) => {
    try {

        if(req.session.user) {
           const user = await User.findById(req.session.user._id)
           const dbData = user.dashboard
           .map(db => {
            return db.dashboardData
           })
           console.log(dbData[dbData.length -1].currentBalance.length)
           res.render('./menu/dashboard', {
               pageTitle : 'Dashboard',
               path : '/dashboard',
               currentUser : user.username,
               user,
               dbData
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

exports.getManage = async(req,res) => {
    try {
        if(req.session.user) {
            const user = await User.findById(req.session.user._id)
           console.log(user.dashboard)
            res.render('./menu/manage', {
                path : './manage',
                pageTitle : 'Manage My Money',
                currentUser : user.username,
                user
            })
        }
        res.render('./menu/manage', {
            path : './manage',
            pageTitle : 'Manage My Money'
        })
    }
    catch(err) {
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
        res.redirect('/dashboard')
    }
    catch(err) {
        console.log(err)
    }
}
