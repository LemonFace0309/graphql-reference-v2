import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Boolean, Int, Float, ID

let users = [
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
];

let posts = [
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
];

let comments = [
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
];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
`;

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
      };
    },
    post: () => ({
      id: 'def456',
      title: 'cool post',
      body: 'foo bar baz',
      published: true,
    }),
  },
  Mutation: {
    createUser: (parent, { data }, ctx, info) => {
      const emailTaken = users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...data,
      };
      users.push(user);
      return user;
    },
    deleteUser: (parent, { id }, ctx, info) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) throw new Error('User not found');
      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });
      comments = comments.filter((comment) => comment.author !== id);

      return deletedUsers[0];
    },
    createPost: (parent, { data }, ctx, info) => {
      const userExists = users.some((user) => user.id === data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...data,
      };
      posts.push(post);
      return post;
    },
    deletePost: (parent, { id }, ctx, info) => {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex === -1) throw new Error('Post not found');
      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== id)
      return deletedPosts[0];
    },
    createComment: (parent, { data }, ctx, info) => {
      const postExists = posts.some((post) => post.id === data.post && post.published);
      const userExists = users.some((user) => user.id === data.author);

      if (!postExists || !userExists) throw new Error('Unable to create new comment');
      const comment = {
        id: uuidv4(),
        ...data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment: (parent, { id }, ctx, info) => {
      const commentIndex = comments.findIndex((comment) => comment.id === id);
      if (commentIndex === -1) throw new Error('Comment not found');
      const deletedComments = comments.splice(commentIndex, 1);
      return deletedComments[0];
    },
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter((post) => post.author === parent.id);
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
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
});
