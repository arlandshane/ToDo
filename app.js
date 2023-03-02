const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using MongoClient
const uri = process.env.mongodb + '://arlandshane:TgMApF9Ykdbo37Rx@cluster0.afjehww.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// Connect to default database using Mongoose
mongoose.connect(uri + '/my_db');

// Define the items schema
const itemsSchema = {
    name: String,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: 'default item',
});

const defaultItems = [];

Item.insertMany(defaultItems);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const foundItems = await Item.find({}, 'name');
        const itemNames = foundItems.map((item) => item.name);

        res.render('list', {
            kindOfDay: 'Enter your name in the database',
            newListItems: itemNames,
        });
    } catch (err) {
        console.log(err);
    }
});

app.post('/', async (req, res) => {
    const newItem = new Item({
        name: req.body.newItem,
    });

    defaultItems.push(newItem);

    try {
        await newItem.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

app.get('/items/:my_item', async (req, res) => {
    const my_item = req.params.my_item;

    try {
        const item = await client
            .db('my_db')
            .collection('my_collection')
            .find({}, 'name');

        return res.json(item);
    } catch (err) {
        console.log(err);
    }
});

client.connect((err) => {
    if (err) {
        console.error(err);
        return false;
    }
    // connection to mongo is successful, listen for requests
    app.listen(port, () => {
        console.log('listening for requests');
    });
});
