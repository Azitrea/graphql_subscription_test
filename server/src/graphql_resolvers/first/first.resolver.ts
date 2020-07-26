import { PubSub } from 'apollo-server-express';
import * as database from '../../database';

const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';

export default {
    Subscription: {
        postAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([POST_ADDED]),
        },
    },
    Query: {
        posts(_, args, context) {
            return database.getData();
        },
    },
    Mutation: {
        addPost(_, args, context) {
            database.addData(args)
            pubsub.publish(POST_ADDED, { postAdded: args });
            return args;
        },
    }
}