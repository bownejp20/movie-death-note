const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')

require('dotenv').config() 

var db, collection;

const url = process.env.URL
const dbName = process.env.DBNAME

app.listen(6000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('deathNote').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      messages: result.map(individualNote => {
        return {
          ...individualNote,
          reactions: individualNote.thumbUp + individualNote.thumbDown
        }
      })
    })
  })
})

app.post('/messages', (req, res) => {
  db.collection('deathNote').insertOne({ name: req.body.name, note: req.body.note, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  console.log(req.body)
  db.collection('deathNote')
    .findOneAndUpdate({ name: req.body.name, note: req.body.note }, {
      $inc: {
        thumbUp: 1
      }
    }, {
      sort: { _id: -1 },
      upsert: true //if record not found then create one 
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.put('/messages/thumbDown', (req, res) => {
  db.collection('deathNote')
    .findOneAndUpdate({ name: req.body.name, note: req.body.note }, {
      $inc: {
        thumbDown: - 1
      }
    }, {
      sort: { _id: -1 },
      upsert: true  //might be a bug later on that leon leaves and you need to fix
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/messages', (req, res) => {
  db.collection('deathNote').findOneAndDelete({ name: req.body.name, note: req.body.note }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Death Note deleted!')
  })
})
