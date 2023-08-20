const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const User = require("./models/user")
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)


require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', 'views')

const userSession = new MongoDBSession ({
    uri : process.env.MONGODB_URI,
    collection : 'session'
})

const mainPageRoutes = require('./routes/main')
const menuRoutes = require('./routes/menu')

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : process.env.MYSECRET,
    resave : false, 
    saveUninitialized : false,
    store : userSession})
)

app.use(async (req,res,next) => {
    try {
        if(!req.session.user) {
        return next()
    }
    const user = await User.findById(req.session.user._id)
    req.user = user
    next() }
    catch (err) {
        console.log(err)
    }
})

app.use((req,res,next) => {
    res.locals.isAuth = req.session.isLoggedIn
    next()
  })

app.use(mainPageRoutes)
app.use(menuRoutes)

app.use( (error,req,res,next) => {
    const status = error.statusCode || 500
    const message = error.message
    if(!error) {
        return res.status(200)
    }
    return res.status(status)
    .json({
        message
    })
  
})

mongoose.connect(process.env.MONGODB_URI)
.then(result => {
    console.log('Database Connected!')
app.listen(3000)
})
.catch(err => {
  console.log(err)
})
