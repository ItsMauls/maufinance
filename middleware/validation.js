const { check,body } = require('express-validator')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

exports.signupValidation = [
body('username')
.notEmpty().withMessage('Username Required!')
.trim()
.custom(async (value, {req}) => {
    const userValidation = await User.findOne({username : value})
    if(userValidation) {
        throw new Error('Username Already Registered, Try Another Email!')
    }
}),
body('email')
.isEmail()
.normalizeEmail()
.notEmpty().withMessage('Email Required!')
.trim()
.custom(async (value, {req}) => {
    const userValidation = await User.findOne({email : value})
    if(userValidation) {
        throw new Error('Email Already Registered, Try Another Email!')
    }
    return true
}),

body('password')
.isLength({min : 6}).withMessage('Password Minimum Length is 6')
.isAlphanumeric()
.trim(),

body('confirmPassword')
.isLength({min : 6}).withMessage('Password Minimum Length is 6')
.trim()
.custom((value,{req}) => {
    if(value !== req.body.password) {
        throw new Error('Please Enter Valid Confirm Password')
    }
    return true
}),

(req,res,next) => {
    next()
}
]

exports.signinValidation = [
body('email')
    .isEmail()
    .trim()
    .custom(async (value,{req}) => {
    const userValidate = await User.findOne({email : value})
    if(!userValidate) {
        throw new Error ('Wrong Email!')
    }
    return true
}),
body('password')
    .trim()
    .custom(async (value,{req}) => {
        const validatePassword = await User.findOne({email : req.body.email})
        const isMatch = await bcryptjs.compare(value, validatePassword.password)
        if(!isMatch) {
            throw new Error ('Wrong Password!')
        }
        return true
    }),

    (req,res,next) => {
        next()
    }
]

exports.balance = [
    body('balance')
    .trim()
    .notEmpty().withMessage('Saldo Wajib Diisi!'),

    (req,res,next) => {
        next()
    }
]