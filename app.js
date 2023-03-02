const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');
const app = express()
const port = process.env.Port || 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);

client.connect(err => {
    if (err) {
        console.error(err);
        return false;
    }
    console.log('Connected to MongoDB Atlas');

    const itemsSchema = {
        name: String
    }

    const Item = mongoose.model('Item', itemsSchema)

    const item1 = new Item({
        name: 'default item'
    })

    const defaultItems = []

    Item.insertMany(defaultItems)

    app.get('/', async (req, res) => {
        try {
            const foundItems = await client.db("my_db")
                .collection("my_collection")
                .find({}, 'name')
                .toArray();

            const itemNames = foundItems.map(item => item.name)
            res.render('list', { kindOfDay: 'Enter your name in the database', newListItems: itemNames })
        } catch (err) {
            console.log(err)
        }
    })

    app.post('/', async (req, res) => {
        const newItem = new Item({
            name: req.body.newItem
        })

        defaultItems.push(newItem)

        try {
            await client.db("my_db")
                .collection("my_collection")
                .insertOne(newItem);
            res.redirect('/')
        } catch (err) {
            console.log(err)
        }
    })

    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
})
