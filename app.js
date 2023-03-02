const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Port = process.env.Port || 3000

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb+srv://arlandshane:TgMApF9Ykdbo37Rx@cluster0.afjehww.mongodb.net/?retryWrites=true&w=majority')

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
        const foundItems = await Item.find({}, 'name')
        // const foundItems = await Item.deleteMany({})
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
        await newItem.save()
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
})

app.listen(Port, () => {
    console.log('Server started on port 3000')
})