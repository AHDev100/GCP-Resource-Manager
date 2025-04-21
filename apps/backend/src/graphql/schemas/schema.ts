const typeDefs = `#graphql
    type Valid {
        isValid: Boolean!
        errors: [String]!
    }

    type Status {
        success: Boolean!
        errors: [String]!
    }

    type Mutation {
        validateConfig(config: String!): Valid!
        viewPlan(config: String!): String!
        validateFile(config: String!, fileType: String!): Valid!
        provisionFile(config: String!, fileType: String!, validated: Boolean!): Status!
        provisionForm(blocks: [String]!): Boolean!
        provisionCode(code: String!): Boolean!
    }

    type Query {
        getResources: [String]!
    }
`;

export default typeDefs;