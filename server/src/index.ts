import * as http from 'http';
import { ApolloServer, gql ,PubSub } from 'apollo-server-express';
import * as express from 'express';

const typeDefs = gql`

  type Subscription {
    postAdded: Post
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String
    comment: String
  }
`
const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';

const resolvers = {

  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    posts(root, args, context) {
      return [{ author: 'JJ', comment: 'TTESSST1' }]
    },
  },
  Mutation: {
    addPost(root, args, context) {

      pubsub.publish(POST_ADDED, { postAdded: args });
      return args;
    },
  },
};

const PORT = 4000;
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({app})

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})