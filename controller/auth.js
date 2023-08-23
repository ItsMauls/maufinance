const User = require("../models/user")
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')

exports.getSignUp = (req,res) => {
    try
    {
    res.status(422)
    .render('./auth/signup', {
        path : '/signup',
        pageTitle : 'Sign Up Page',
        validationError : [],
        errorMessage : '',
        oldInput : {
            username : '',
            email : '',
            password : '',
            confirmPassword : ''
          },
          isAuth : false
    })
}
catch(err) {
    console.log(err)
}
}

exports.postSignUp = async(req,res,next) => {
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const errors = validationResult(req)
    const confirmPassword = req.body.confirmPassword
    const user = await User.findOne({email : email})
    const encryptedPassword = await bcryptjs.hash(password,12)

try {
    if(!errors.isEmpty()) {
        return res.status(422)
        .render('./auth/signup', {
            path : '/signup',
            pageTitle : 'Sign Up Page',
            validationError : errors.array(),
            errorMessage : errors.array()[0].msg,
            oldInput : {
                username : req.body.username,
                email,
                password,
                confirmPassword
            }
        })
    }

    if(!user) {
        const createUser = new User ({
            username,
            email,
            password : encryptedPassword
        })
        await createUser.save()      
    }
    return res.redirect('/login')
}

catch(err) {
    console.log(err)
}}




exports.getLogin = (req,res) => {
    res.status(422)
    .render('./auth/login', {
        path : '/login',
        pageTitle : 'Login Page',
        validationError : [],
        errorMessage : '',
        oldInput : {
            email : '',
            password : ''
        },
        isAuth : false
    })
}

exports.postLogin = async (req,res) => {
const email = req.body.email
const password = req.body.password 
const errors = validationResult(req)
const user = await User.findOne({email : email})
try {
    if(!errors.isEmpty()) {
        res.status(422)
        .render('./auth/login', {
            path : '/login',
            pageTitle : 'Login Page',
            validationError : errors.array(),
            errorMessage : errors.array()[0].msg,
            oldInput : {
                email,
                password
            }
        })
    }
        if(!user) {
            throw new Error("There's no Account Registered, Please Sign up!")
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if(isMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
                if(err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        }
}
catch(err) {
    console.log(err)
}
}

exports.postLogout = (req,res) => {
    req.session.destroy(err => {
        console.log(err)
    })
    res.redirect('/')
}