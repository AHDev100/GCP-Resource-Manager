const typeDefs = `#graphql
    type Mutation {
        provisionFile(config: String!, fileType: String!): Boolean!
        provisionForm(blocks: [String]!): Boolean!
        provisionCode(code: String!): Boolean!
    }

    type Query {
        getResources: [String]!
    }

    type Subscription {
        logTerraform(command: String!): String!
    }
`;

export default typeDefs;