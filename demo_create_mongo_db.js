var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err)
        return console.log('db connection ERROR')
    }
    const dbo = db.db('mydb')
    dbo.createCollection("customers", function (err, res) {
        if (err) {
            return 
        }

        console.log("Collection created!");
        res.insertOne({ name: 'Dule' }, (err, obj) => {
            if (err) {
                return 
            }
        })

        res.findOne({ name: 'Dule' }, (err, obj) => {
            if (err) return 
            console.log(obj)
            db.close();
        })
    });
});