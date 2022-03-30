const  mongoose = require('mongoose')

const moongose = require('mongoose')
moongose.connect(process.env.MONGODB_URL, {
    useNewUrlParseR: true,
})

