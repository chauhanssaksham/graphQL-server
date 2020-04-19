const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt} = require('graphql')

module.exports = new GraphQLObjectType({
    name: 'employee',
    description: 'This represents an employee',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString}
    })
})