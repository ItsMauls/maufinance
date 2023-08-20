const User = require("../models/user")
const Dashboard = require("../models/dashboard")

exports.getDashboard = async (req,res) => {
    try {

        if(req.session.user) {
           const user = await User.findById(req.session.user._id)
           res.render('./menu/dashboard', {
               pageTitle : 'Dashboard',
               path : '/dashboard',
               currentUser : user.username,
               user
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
            .populate('dashboard')
            const dashboards = user.dashboard; // Array of populated dashboard documents
            dashboards.forEach(d => {
                const balance = d.debt; // Access balance field
                console.log(balance)
                // ... do something with balance
            });
            
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
        user.dashboard.push(insertBalance)
        await user.save()
        res.redirect('/manage')
    }
    catch(err) {
        console.log(err)
    }
}
