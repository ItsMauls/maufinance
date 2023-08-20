const express = require('express')
const { getMainPage } = require('../controller/mainpage')
const { getSignUp, postSignUp, getLogin, postLogin, postLogout } = require('../controller/auth')
const { signupValidation, signinValidation } = require('../middleware/validation')
const router = express.Router()

router.get('/', getMainPage)
router.get('/signup', getSignUp)
router.post('/signup', signupValidation, postSignUp)
router.get('/login', getLogin)
router.post('/login',signinValidation, postLogin)
router.post('/logout', postLogout)

module.exports = router