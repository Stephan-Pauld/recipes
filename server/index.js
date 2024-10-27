import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import cors from 'cors';
import { getUser } from './utils/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Add CORS middleware
app.use(cors());

// Improved MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

await server.start();
server.applyMiddleware({ app });

app.listen(port, () => {
  console.log(`
🚀 Server ready at http://localhost:${port}${server.graphqlPath}
📝 GraphQL Playground available at http://localhost:${port}/graphql
  `);
});