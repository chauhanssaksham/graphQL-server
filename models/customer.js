const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports  = Customer