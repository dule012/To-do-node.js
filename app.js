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



app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});



var url = "mongodb://localhost:27017";

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
        console.log(req.user)
        next()
    } else {
        res.redirect('/login')
    }
}
app.get('/', loggedIn, (req, res) => {
    mongo.connect(url, (err, db) => {
        if (err) return
        const dbo = db.db('mydb')
        dbo.collection('to-do').find({ username: req.user.username }, { projection: { _id: 0 } }).toArray((err, arr) => {
            res.render('index', {
                arrOftodos: arr
            })
            db.close()
        })
    })

})

app.post('/', (req, res) => {
    mongo.connect(url, (err, db) => {
        let dbo = db.db('mydb')
        dbo.createCollection('to-do', (err, collection) => {
            if (err) {
                return console.log('error collection')
            }
            collection.insertOne({ todoTitle: req.body.todoTitle, finished: req.body.finished, username: req.user.username }, (err, doc) => {
                if (err) {
                    return console.log('error insert')
                }

            })
            collection.find({ username: req.user.username }, { projection: { _id: 0 } }).toArray((err, arr) => {
                if (err) {
                    return console.log('error find')
                }
                res.json(arr)
                db.close()

            })
        })

    })
})

app.put('/', (req, res) => {
    mongo.connect(url, (err, db) => {
        const dbo = db.db('mydb')
        dbo.collection('to-do').updateOne({
            $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }]
        }, { $set: { finished: req.body.finished } }, (err, doc) => {
            if (err) {
                return console.log('update error')

            }
        })
        dbo.collection('to-do').findOne({ $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }] }, { projection: { _id: 0 } }, (err, doc) => {
            if (err) {
                return console.log('find error')
            }
            // console.log(doc)
            res.json(doc)
            db.close()
        })

    })
})

app.delete('/', (req, res) => {
    mongo.connect(url, (err, db) => {
        const dbo = db.db('mydb')
        dbo.collection('to-do').deleteOne({ $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }] }, (err, del) => {
            if (err) {
                return console.log('error delete')
            } else {
                console.log('deleted doc')
                res.send('deleted')
                db.close()
            }

        })
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
        console.log(user)
        res.redirect('/login')
    })
})
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})


app.listen(3001, () => {
    console.log('server listening')
})


