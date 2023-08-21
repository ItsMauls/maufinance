const Priority = require('../models/priority')
const User = require('../models/user')

exports.getPriority = async (req,res) => {
    try {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`
        const priority = await Priority.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        const totalHarga = priority.reduce((total, prio) => total + prio.needs[0].price, 0)
        const prioData = [...priority.map(prio => {
            return prio.needs[0]._id
        })]
        // const totalHargaWants = priority.reduce((total, prio) => total + prio.wants[0].price, 0)
        const userData = user.dashboard.map(u => {
            return u.dashboardData
        })
        
        if(req.session.user) {
        res.render('./menu/priority', {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.name,
            user,
            priority,
            prioData,
            totalHarga,
            userData,
            currentDate
           
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
          .json ({message : err})
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

        const postNeeds = new Priority ({
          needs : {
            qty,
            items,
            price
          },
          user : user._id
        }) 
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

exports.postWants = async (req,res,next) => {
    try {
        const user = await User.findById(req.session.user._id)
        const {
            qty_wants,
            items_wants,
            price_wants
        } = req.body

        const postWants = new Priority ({
          wants : {
            qty : qty_wants,
            items : items_wants,
            price : price_wants
          },
          user : user._id
        })
        await postWants.save()
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
        const prioID = req.params.prioId;
        const prio = await Priority.findById(prioID);
        const priority = await Priority.find({user : req.session.user._id})
        const user = await User.findById(req.session.user._id)
        
        if (!prio) {
           return next(new Error('Tidak Ada Priority!'))
        }
        await Priority.findByIdAndDelete(prioID)
        res.status(200)
        .render('./menu/priority', 
        {
            path : '/prioritas',
            pageTitle : 'Prioritas Saya',
            currentUser : user.name,
            user,
            priority})
        console.log(`#${prio} Terhapus!`)
        
        return res.redirect('/prioritas');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

