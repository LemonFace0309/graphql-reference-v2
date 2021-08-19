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
    id: '11',
    title: 'Charles is cool',
    body: '<3',
    published: true,
    author: '1',
  },
  {
    id: '12',
    title: 'I love Charles',
    body: '',
    published: false,
    author: '3',
  },
  {
    id: '13',
    title: 'Bark bark',
    body: ':D',
    published: true,
    author: '1',
  },
]

const comments = [
  { 
    id: '101',
    text: 'wow',
    author: '1',
    post: '13',
  },
  {
    id: '102',
    text: 'I love Charles',
    author: '3',
    post: '13',
  },
  {
    id: '103',
    text: 'awesome',
    author: '3',
    post: '12',
  },
  {
    id: '104',
    text: 'so cool',
    author: '2',
    post: '11',
  },
]

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments: (parent, args, ctx, info) => {
      return comments;
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
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => comment.post === parent.id);
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => post.author === parent.id);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => post.id === parent.post);
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