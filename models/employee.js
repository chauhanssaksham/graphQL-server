const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }]
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports  = Employee