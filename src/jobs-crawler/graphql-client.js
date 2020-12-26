const dotenv = require("dotenv");
const { GraphQLClient } = require("graphql-request");
dotenv.config();

const { BACKEND_API } = process.env;
console.log({ BACKEND_API });
const client = new GraphQLClient(BACKEND_API);

module.exports = client;
