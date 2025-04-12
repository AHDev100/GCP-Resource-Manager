import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./graphql/schemas/schema";
import resolvers from "./graphql/resolvers/resolver";

const server = new ApolloServer({
    typeDefs, 
    resolvers
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
    });
    console.log(`🚀 Server ready at ${url}`);
})();