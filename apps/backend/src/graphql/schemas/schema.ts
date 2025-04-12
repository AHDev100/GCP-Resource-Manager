const typeDefs = `#graphql
    type Valid {
        isValid: Boolean!
        errors: [String]!
    }

    type Mutation {
        validateConfig(config: String!): Valid!
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