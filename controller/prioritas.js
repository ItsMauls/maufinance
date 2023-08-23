
const User = require('../models/user')
const Needs = require('../models/needs')
const Wants = require('../models/wants')
const { validationResult } = require('express-validator')


exports.getPriority = async (req,res) => {
    try { 
        if(req.session.user) {
            const needs = await Needs.find({user : req.session.user._id})
            const user = await User.findById(req.session.user._id)
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
        if(!req.session.user) {
            res.redirect('/')
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

        const userDashboard = user.dashboard[0]
        const totalHarga = needs.reduce((total, needs) => total + needs.price, 0)

        if (!needs) {
           return next(new Error('Tidak Ada Priority!'))
        }
        await Needs.findByIdAndDelete(needID)
        const updatedNeed = needs.filter(need => need._id.toString() !== needID)

        res.status(201)
        .render('./menu/priority', 
        {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            needs : updatedNeed,
            totalHarga,
            userDashboard
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
        const userDashboard = user.dashboard[0]
        const totalHarga = wants.reduce((total, wants) => total + wants.price, 0)
        if(req.session.user) {
        res.render('./menu/Wishlist', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            wants,
           userDashboard,
            totalHarga
        })
        if(!req.session.user) {
            res.redirect('/')
        }
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
        const wantID = req.params.wantId;
        const wants = await Wants.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        const userDashboard = user.dashboard[0]
        const totalHarga = wants.reduce((total, wants) => total + wants.price, 0)

        if (!wants) {
           return next(new Error('Tidak Ada Wishlist!'))
        }
        await Wants.findByIdAndDelete(wantID)
      
        const updatedW = wants.filter(want => want._id.toString() !== wantID)
        
        res.status(201)
        .render('./menu/Wishlist', 
        {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.username,
            user,
            wants : updatedW,
            userDashboard,
            totalHarga
        })
         console.log(`#${prio} Terhapus!`)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

