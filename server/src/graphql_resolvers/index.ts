import * as path from 'path'

import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

export const getGraphQLEndpoint = () => {
    const resolvers = fileLoader(path.join(__dirname, './**/*.resolver.*'))
    const typesArray = fileLoader(path.join(__dirname, './**/*.graphql'));
    const typeDefs = mergeTypes(typesArray);

    return { typeDefs, resolvers }
}
