import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

const users = [
  {
    id: '1',
    name: 'Charles',
    email: 'test@test.com',
    age: 19,
  },
  {
    id: '2',
    name: 'Liu',
    email: 'Liu@test.com',
    age: 3,
  },
  {
    id: '3',
    name: 'Meow',
    email: 'Cat@test.com',
  },
]

const posts = [
  {
    id: '1',
    title: 'Charles is cool',
    body: '<3',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'I love Charles',
    body: '',
    published: false,
    author: '3',
  },
  {
    id: '3',
    title: 'Bark bark',
    body: ':D',
    published: true,
    author: '1',
  },
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`

const resolvers = {
  Query: {
    users: (parent, { query }, ctx, info) => {
      if (!query) return users;

      return users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
    },
    posts: (parent, { query }, ctx, info) => {
      if (!query) return posts;

      return posts.filter((post) => {
        const isTitlematch = post.title.toLowerCase().includes(query.toLowerCase());
        const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());
        return isTitlematch || isBodyMatch;
      });
    },
    me: () => {
      return {
        id: 'abc123',
        name: 'Charles',
        email: 'test@test.com',
        age: '19',
      }
    },
    post: () => ({
      id: 'def456',
      title: 'cool post',
      body: 'foo bar baz',
      published: true,
    }),
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    }
  },
  User: {
    posts: (parent, arges, ctx, info) => {
      return posts.filter(post => post.author === parent.id);
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up!');
})