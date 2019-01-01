const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');
const uuidv4 = require('uuid/v4');

let todos = {}

const typeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }

  type Query {
    todo(id: ID!): Todo
    todos: [Todo]
  }

  type Mutation {
    createTodo(text: String!, done: Boolean!): Todo!
    updateTodo(id: ID!, done: Boolean!): Todo!
    deleteTodo(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todo: (parent, {id}) => todos[id],
    todos: () => Object.values(todos)
  },

  Mutation: {
    createTodo: (parent, {text, done}) => {
      const id = uuidv4();
      const todo = {text, done, id}
      todos[id] = todo;
      return todo;
    },

    updateTodo: (parent, {id, done}) => {
      const todo = {
        done
      };
      todos[id] = {...todos[id], ...todo};
      return todos[id];
    },

    deleteTodo: (parent, {id}) => {
      delete todos[id];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`),
);
