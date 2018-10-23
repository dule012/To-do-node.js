const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')
const mongoose = require('mongoose')
require('./demo_create_mongo_db.js')
const User = require('./models/user.js')


mongoose.connect('mongodb://localhost:27017', (err) => {
    if (err) {
        return console.log('ERROR MONGOOSE')
    }
    console.log('MONGOOSE CONNECTED')
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: 'AsoJoKisa2',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next) => {
    console.log(req)
    next()
})

app.get('/', (req, res) => {
    res.send('Hello my friend')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save((err) => {
        if (err) return
        console.log(newUser)
        console.log('saved user')
    
        res.redirect('/')
    })
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) return
        if (!user) {
            return console.log('not founded user')
            done(null, false)
        }
        done(null, user)
    })
}))

passport.serializeUser((user, done) => {
    done(null, user)
})


passport.deserializeUser((user, done) => {
    User.findById(user._id, (err, foundedUser) => {
        if (err) {
            return
        }

        done(err, foundedUser)
    })
})


app.listen(3001, () => {
    console.log('server listening')
})


