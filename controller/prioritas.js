
const User = require('../models/user')
const Needs = require('../models/needs')
const Wants = require('../models/wants')
const { validationResult } = require('express-validator')


exports.getPriority = async (req,res) => {
    try {
        const needs = await Needs.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        
        if(req.session.user) {
            const userDashboard = user.dashboard[0]
            const totalHarga = needs.reduce((total, needs) => total + needs.price, 0)
        res.render('./menu/priority', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            needs,
            userDashboard,
            totalHarga,
            validationError : [],
            errorMessage : ''
        })
        }

        res.render('./menu/priority', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya'
        })
    }
    catch(err) {
        if(!err.statusCode) {   
          return res.status(500)
          .json ({message : err.message})
        }
    }
}

exports.postPriority = async (req,res) => {
    try {   
        const user = await User.findById(req.session.user._id)
        const {
            qty,
            items,
            price
        } = req.body

        const postNeeds = new Needs ({
            qty,
            items,
            price, 
            user : user._id })
          
        if(postNeeds) {
            await postNeeds.save()
        }
       res.redirect('/prioritas')
    }
    catch(err) {
        if(!err.statusCode) {
          return res.status(500)
          .json({message : err})
        }
    }
}


exports.deletePriority = async (req, res, next) => {
    try {
        const needID = req.params.needId;
        const needs = await Needs.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        const userData = user.dashboard.map(u => {
            return u.dashboardData
        })
        const totalHarga = needs.reduce((total, needs) => total + needs.price, 0)

        if (!needs) {
           return next(new Error('Tidak Ada Priority!'))
        }
        await Needs.findByIdAndDelete(needID)
        needs.pop(needs.user)
        res.status(201)
        .render('./menu/priority', 
        {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            needs,
            userData,
            totalHarga
        })
         console.log(`#${prio} Terhapus!`)
        
        return res.redirect('/prioritas');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.getWishlist = async (req,res) => {
    try {
        const wants = await Wants.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        const userData = user.dashboard.map(u => {
            return u.dashboardData
        })
        const totalHarga = wants.reduce((total, wants) => total + wants.price, 0)
        if(req.session.user) {
        res.render('./menu/Wishlist', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            wants,
            userData,
            totalHarga
        })

        }
        res.render('./menu/Wishlist', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya'
        })
    }
    catch(err) {
        if(!err.statusCode) {   
          return res.status(500)
          .json ({message : err.message})
        }
    }
}

exports.postWishlist = async (req,res) => {
    try {
        const user = await User.findById(req.session.user._id)
        const {
            qty_w,
            items_w,
            price_w
        } = req.body

        const postWants = new Wants ({
            qty : qty_w,
            items : items_w,
            price : price_w, 
            user : user._id })
          
        if(postWants) {
            await postWants.save()
        }
       
        res.redirect('/prioritas/wishlist')
    }
    catch(err) {
        if(!err.statusCode) {
          return res.status(500)
          .json({message : err})
        }
    }
}



exports.deleteWishlist = async (req, res, next) => {
    try {
        const needID = req.params.needId;
        const wants = await Wants.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        const userData = user.dashboard.map(u => {
            return u.dashboardData
        })
        const totalHarga = wants.reduce((total, wants) => total + wants.price, 0)

        if (!wants) {
           return next(new Error('Tidak Ada Wishlist!'))
        }
        await wants.findByIdAndDelete(needID)
        wants.pop(wants.user)
        res.status(201)
        .render('./menu/Wishlist', 
        {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            wants,
            userData,
            totalHarga
        })
         console.log(`#${prio} Terhapus!`)
        
        return res.redirect('/prioritas');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

