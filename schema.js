const {GraphQLObjectType, GraphQLNonNull, GraphQLList ,GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID} = require('graphql')
const Customer = require('./models/user')

const CustomerType = new GraphQLObjectType({
    name: 'customer',
    description: 'This represents a customer',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
})

const RootQueryType = new GraphQLObjectType({
    name:'RootQuery',
    description: "This is the root querry",
    fields: ()=>({
        customer: {
            type: CustomerType,
            args:{
                id: {type:GraphQLID}
            },
            resolve: async (parent, args)=>{
                return await Customer.findById(args.id)
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve: async ()=>{
                return await Customer.find({});
            }
        }
    })
})

const MutationType = new GraphQLObjectType({
    name:'Mutations',
    description: "Root Mutations",
    fields: ()=>({
        addCustomer: {
            type: CustomerType,
            description: "Add a customer",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parents, args) => {
                const customer = await Customer.create(args); 
                return customer;
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
})