const controllers = (db, collection) => {

    return {

        loginGet: (req, res) => {
            res.render('login')
        },
        loginPost: (req, res) => {
            res.redirect('/')
        },
        logout: (req, res) => {
            req.logout()
            res.redirect('/login')
        },
        registrationGet: (req, res) => {
            res.render('registration')
        },
        registrationPost: (req, res) => {
            const newUser = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password)
            })
            newUser.save((err, user) => {
                if (err) return
                res.redirect('/')
            })
        },
        homeGet: (req, res) => {
            res.render('index')
        },
        homePost: (req, res) => {
            collection.find({ username: req.user.username }, { projection: { _id: 0 } }).toArray((err, array) => {
                if (err) return
            })
            collection.inserOne({ todoTitle: req.body.todoTitle, finished: req.body.finished, username: req.user.username }, (err, doc) => {
                if (err) return
            })
            collection.findOne({ $and: [{ username: req.user.username }, { todoTitle: req.body.todoTitle }] }, { projection: { _id: 0 } }, (err, doc) => {
                if (err) return
                res.json(doc).sendStatus(200)
            })
        },
        homePut: (req, res) => {
            collection.updateOne({ username: req.user.username, todoTitle: req.body.todoTitle }, { $set: { finished: req.body.finished } }, (err, doc) => {
                if (err) return
            })
            collection.findOne({ username: req.user.username, todoTitle: req.body.todoTitle }, { projection: { _id: 0 } }, (err, doc) => {
                if (err) return
                res.json(doc).sendStatus(200)
            })
        },
        homeDelete: (req, res) => {
            collection.deleteOne({ username: req.user.usrename, todoTitle: req.body.title }, (err, doc) => {
                if (err) return
            })
            res.sendStatus(200)
        }


    }

}