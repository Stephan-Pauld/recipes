import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    referenceUrl: String
    instructions: String!
    story: String
    createdAt: String!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
  }

  type Mutation {
    createRecipe(
      title: String!
      referenceUrl: String
      instructions: String!
      story: String
    ): Recipe!
  }
`;