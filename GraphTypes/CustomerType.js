const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt} = require('graphql')

module.exports = new GraphQLObjectType({
    name: 'customer',
    description: 'This represents a customer',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
})