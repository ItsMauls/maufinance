const User = require('../models/user')

exports.error404 = async (req, res, next) => {
   
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            await res.status(404).render('./error/400', {
                path: 'error404',
                pageTitle: 'Error 404',
                user: user,
                currentUser: user.username,
                isAuth: req.session.isLoggedIn
            });
        } else {
            await res.status(404).render('./error/400', {
                path: 'error404',
                pageTitle: 'Error 404'
            });
        }
        next();
    
};


exports.error500 = async (req,res,next) => {
   
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            await res.status(500).render('./error/500', {
                path: 'error500',
                pageTitle: 'Error 500',
                user: user,
                currentUser: user.username,
                isAuth: req.session.isLoggedIn
            });
        } else {
            await res.status(500).render('./error/500', {
                path: 'error500',
                pageTitle: 'Error 500'
            });
        }
        next();
    
}