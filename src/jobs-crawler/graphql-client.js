import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
dotenv.config();

const { BACKEND_API } = process.env;
console.log({ BACKEND_API });
const client = new GraphQLClient(BACKEND_API);

export default client;
