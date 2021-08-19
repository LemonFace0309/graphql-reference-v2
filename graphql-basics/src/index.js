import { GraphQLServer } from 'graphql-yoga';

import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import db from './db';

// Scalar types - String, Boolean, Int, Float, ID

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.debug('The server is up!');
});
