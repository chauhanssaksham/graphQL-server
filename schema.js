const {GraphQLObjectType, GraphQLNonNull, GraphQLList ,GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID} = require('graphql')
const Customer = require('./models/customer')
const Employee = require('./models/employee')
const CustomerType = require('./GraphTypes/CustomerType')
const EmployeeType = require('./GraphTypes/EmployeeType')

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
        },
        employee: {
            type: EmployeeType,
            args:{
                id: {type:GraphQLID}
            },
            resolve: async (parent, args)=>{
                return await Employee.findById(args.id)
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve: async ()=>{
                return await Employee.find({});
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
        },
        deleteCustomer: {
            type: CustomerType,
            description: "Delete a customer",
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parents, args) => {
                const customer = await Customer.findById(args.id); 
                customer.remove();
                return customer;
            }
        },
        updateCustomer: {
            type: CustomerType,
            description: "Update a customer",
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
                email: {type: (GraphQLString)},
                name: {type: (GraphQLString)},
                age: {type: (GraphQLInt)},
            },
            resolve: async (parents, args) => {
                const customer = await Customer.findById(args.id);
                if (args.email){
                    customer.email = args.email
                }
                if (args.name){
                    customer.name = args.name
                }
                if (args.age){
                    customer.age = args.age
                }
                customer.save();
                return customer;
            }
        },
        addEmployee: {
            type: EmployeeType,
            description: "Add an employee",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parents, args) => {
                const employee = await Employee.create(args); 
                return employee;
            }
        },
        deleteEmployee: {
            type: EmployeeType,
            description: "Delete an employee",
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parents, args) => {
                const employee = await Employee.findById(args.id); 
                employee.remove();
                return employee;
            }
        },
        updateEmployee: {
            type: EmployeeType,
            description: "Update an employee info",
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
                email: {type: (GraphQLString)},
                name: {type: (GraphQLString)}
            },
            resolve: async (parents, args) => {
                const employee = await Employee.findById(args.id);
                if (args.email){
                    employee.email = args.email
                }
                if (args.name){
                    employee.name = args.name
                }
                employee.save();
                return employee;
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
})