const express = require('express')
const app = express()
const expressGraphQL = require('express-graphql')
const schema = require('./schema')
const db = require('./mongoose')
const PORT = 5000

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}))

app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`)
})