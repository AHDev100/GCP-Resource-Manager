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
        provisionFile(config: String!, fileType: String!): Status!
        provisionForm(blocks: [String]!): Boolean!
        provisionCode(code: String!): Boolean!
    }

    type Query {
        getResources: [String]!
    }
`;

export default typeDefs;