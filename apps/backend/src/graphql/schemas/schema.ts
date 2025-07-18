const typeDefs = `#graphql
    type Valid {
        isValid: Boolean!
        errors: [String]!
    }

    type Status {
        success: Boolean!
        errors: [String]!
    }

    type Config {
        name: String!
        json: JSON
        yaml: String
        terraformHCL: String
        createdAt: String
        lastEdited: String
        notes: String
    }

    type User {
        _id: ID!
        email: String!
        name: String
        refresh_token: String!
        current_config: Config
        saved_configs: [Config!]!
    }

    scalar JSON

    type Mutation {
        registerUser(refreshToken: String!): Status!
        validateConfig(config: String!): Valid!
        validateFile(config: String!, fileType: String!): Valid!
        saveCurrentConfig(name: String!, json: JSON, yaml: String, terraformHCL: String, notes: String): Status!
        saveAsNewConfig(name: String!, json: JSON, yaml: String, terraformHCL: String, notes: String): Status!
        provisionFile(config: String!, fileType: String!, validated: Boolean!): Status!
        provisionForm(blocks: [String]!): Boolean!
        provisionCode(code: String!): Boolean!
    }

    type Query {
        getCurrentUser: User
        getSavedConfigs: [Config]!
        getConfigByName(name: String!): Config
        getResources: String!
        viewPlan: String!
    }
`;

export default typeDefs;