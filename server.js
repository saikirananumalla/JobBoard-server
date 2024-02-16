import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import {ApolloServer} from "@apollo/server";
import {expressMiddleware as apolloMiddleWare} from "@apollo/server/express4";
import { readFile } from 'node:fs/promises';
import {resolvers} from "./resolvers.js";

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphqls', 'utf8');

const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
app.use('/graphql', apolloMiddleWare(apolloServer));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL running on port http://localhost:${PORT}/graphql`);
});
