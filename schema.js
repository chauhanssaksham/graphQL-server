const {GraphQLObjectType, GraphQLNonNull, GraphQLList ,GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID} = require('graphql')
const Customer = require('./models/customer')
const Employee = require('./models/employee')

const CustomerType = new GraphQLObjectType({
    name: 'customer',
    description: 'This represents a customer',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
        employee: {
            type: EmployeeType,
            resolve: (customer) => {
                return Employee.findById(customer.employee)
            }
        }
    })
})

const EmployeeType = new GraphQLObjectType({
    name: 'employee',
    description: 'This represents an employee',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        customers: {
            type: GraphQLList(CustomerType),
            resolve: async (employee)=>{
                employee = await Employee.findById(employee.id).populate({path:'customers'});
                return employee.customers
            }
        }
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
                age: {type: GraphQLNonNull(GraphQLInt)},
                employee: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve: async (parents, args) => {
                const employee = await Employee.findById(args.employee);
                if(employee){
                    const customer = await Customer.create(args); 
                    employee.customers.push(customer);
                    employee.save();
                    return customer;
                }
                else{return null;}
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
                await Employee.findByIdAndUpdate(customer.employee, {$pull: {customers: customer.id}})
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
                await Customer.deleteMany({employee: args.id});
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