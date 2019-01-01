import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from "apollo-boost";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const uri = 'http://127.0.0.1:4000/graphql';

const client = new ApolloClient({ uri });

const GET_TODOS = gql`
  {
    todos {
      id
      text
      done
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $done: Boolean!) {
    updateTodo(id: $id, done: $done) {
      id
      text
      done
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const ADD_TODO = gql`
  mutation createTodo($text: String!, $done: Boolean!) {
    createTodo(text: $text, done: $done) {
      id
      text
      done
    }
  }
`;

const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, text, done }) => {
        let input;

        return (
          <div key={id}>
            <Mutation mutation={UPDATE_TODO}>
              {(updateTodo, { loading, error }) => (
                <div>
                  {done && <p><s>{text}</s></p> || <p>{text}</p>}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      updateTodo({ variables: { id, done: !done } });
                    }}
                  >
                    <button type="submit">{done && "Undo" || "Done"}</button>
                  </form>
                  {loading && <p>Loading...</p>}
                  {error && <p>Error :( Please try again</p>}
                </div>
              )}
            </Mutation>
            <Mutation 
              mutation={DELETE_TODO}
              update={(cache, { data: { deleteTodo } }) => {
                const { todos } = cache.readQuery({ query: GET_TODOS });
                cache.writeQuery({
                  query: GET_TODOS,
                  data: { todos: todos.filter(todo => todo.id !== id) }
                });
              }}>
            {(deleteTodo, { loading, error }) => (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    deleteTodo({ variables: { id } });
                  }}
                >
                  <button type="submit">Delete</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p>Error :( Please try again</p>}
              </div>
            )}
          </Mutation>
          </div>
        );
      });
    }}
  </Query>
);

const AddTodo = () => {
  let input;

  return (
    <Mutation
      mutation={ADD_TODO}
      update={(cache, { data: { createTodo } }) => {
        const { todos } = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: { todos: todos.concat([createTodo]) }
        });
      }}
    >
      {createTodo => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              input.value.length > 0 && createTodo({ variables: { text: input.value, done: false } });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>Todos</h2>
      <AddTodo />
      <Todos />
    </div>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
