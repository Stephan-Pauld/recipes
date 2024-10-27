import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    recipe: Recipe!
    user: User!
    content: String!
    parentComment: Comment
    replies: [Comment!]!
    createdAt: String!
  }

  type Recipe {
    id: ID!
    title: String!
    category: Category!
    user: User!
    tags: [String!]!
    ingredients: String!
    instructions: String!
    referenceUrl: String
    comments: [Comment!]!
    createdAt: String!
  }

  type Query {
    me: User
    recipes(search: String): [Recipe!]!
    recipe(id: ID!): Recipe
    categories: [Category!]!
    comments(recipeId: ID!, parentCommentId: ID): [Comment!]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    createRecipe(
      title: String!
      categoryId: ID!
      tags: [String!]!
      ingredients: String!
      instructions: String!
      referenceUrl: String
    ): Recipe!
    
    createCategory(
      name: String!
    ): Category!

    addComment(
      recipeId: ID!
      content: String!
      parentCommentId: ID
    ): Comment!

    deleteComment(
      commentId: ID!
    ): Boolean!
  }
`;