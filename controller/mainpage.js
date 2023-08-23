const User = require('../models/user')

exports.getMainPage = async (req,res,next) => {
    try 
{  
     if(req.session.user) {
        const user = await User.findById(req.session.user._id)
        res.render('mainpage', {
            path : '/',
            pageTitle : 'mauFinance',
            currentUser : user.username,
            user,
            isAuth : req.session.user
        })
    }
    res.render('mainpage', {
        path : '/',
        pageTitle : 'mauFinance'    
    })
}
    catch (err){
        console.log(err)
    }
}



