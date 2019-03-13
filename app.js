const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const mongo = require('mongodb').MongoClient;
const path = require('path')
const User = require('./models/user.js')


let dbMain, collection_todo

mongo.connect('mongodb://localhost:27017', (err, db) => {
    if (err) return
    dbMain = db.db('mydb')
    dbMain.createCollection('to-do', (err, collection) => {
        collection_todo = collection
    })
})

mongoose.connect('mongodb://localhost:27017', (err) => {
    if (err) {
        // return console.log(err)
    }
    // console.log('mongoose CONNECTED')
})

// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
//     next();
// });


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




passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) return
        if (!user) {
            console.log('not founded user')
            return done(null, false)
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password)
        if (isPasswordCorrect) {
            console.log('password correct')
            return done(null, user)
        } else {
            return done(null, false)
        }
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
const loggedIn = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/', loggedIn, (req, res) => {
    dbMain.collection('to-do').find({ username: req.user.username }, { projection: { _id: 0 } }).toArray((err, arr) => {
        res.render('index', {
            arrOftodos: arr
        })
    })
})

app.post('/', (req, res) => {
    dbMain.createCollection('to-do', (err, collection) => {
        if (err) {
            return
        }
        collection.insertOne({ todoTitle: req.body.todoTitle, finished: req.body.finished, username: req.user.username }, (err, doc) => {
            if (err) {
                return
            }
        })
        collection.findOne({ username: req.user.username, todoTitle: req.body.todoTitle }, { projection: { _id: 0 } }, (err, doc) => {
            if (err) {
                return
            }
            res.json(doc)
        })
    })
})

app.put('/', (req, res) => {
    dbMain.collection('to-do').updateOne({
        $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }]
    }, { $set: { finished: req.body.finished } }, (err, doc) => {
        if (err) {
            return
        }
    })
    dbMain.collection('to-do').findOne({ username: req.user.username, todoTitle: req.body.todoTitle }, { projection: { _id: 0 } }, (err, doc) => {
        if (err) {
            return
        }
        res.json(doc)
    })

})

app.delete('/', (req, res) => {
    dbMain.collection('to-do').deleteOne({ $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }] }, (err, del) => {
        if (err) {
            return
        } else {
            res.send('deleted')
        }

    })
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/')
})

app.get('/registration', (req, res) => {
    res.render('registration')
})

app.post('/registration', (req, res) => {

    const hashedPassword = bcrypt.hashSync(req.body.password)
    req.body.password = hashedPassword

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save((err, user) => {
        if (err) return
        res.redirect('/login')
    })
})
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

app.get('*', function (req, res) {
    res.redirect('/')
});
app.listen(3002, () => {
    console.log('server listening')
})


