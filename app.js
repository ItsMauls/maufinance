const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const User = require("./models/user")
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const methodOverride = require('method-override')
const { OpenAIApi } = require('openai');



require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(methodOverride('_method'))

const userSession = new MongoDBSession ({
    uri : process.env.MONGODB_URI,
    collection : 'session'
})

const mainPageRoutes = require('./routes/main')
const menuRoutes = require('./routes/menu')
const priorityRoutes = require('./routes/priority')
const gptRoutes = require('./routes/gpt')
const { error404, error500 } = require('./controller/error')

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
app.use(priorityRoutes)
app.use(gptRoutes)



app.use( (error,req,res,next) => {
    const status = error.statusCode || 500
    const message = error.message
    if(!error) {
        return res.status(200)
        .json({
            message : 'No Error!'
        })
    }
    return res.status(status)
    .json({
        message : message
    })
  
})

app.use(error404)
app.use(error500)

mongoose.connect(process.env.MONGODB_URI)
.then(result => {
    console.log('Database Connected!')
app.listen(3000)
})
.catch(err => {
  console.log(err)
})
