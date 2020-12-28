const dotenv = require("dotenv");
dotenv.config();

const { GraphQLClient } = require("graphql-request");
const { gql } = require("graphql-request");

const { BACKEND_API } = process.env;
console.log({ BACKEND_API });
const client = new GraphQLClient(BACKEND_API);

const PublishJob = async (job) => {
  const mutation = gql`
    mutation AddJob($title: String!, $description: String!, $jobDate: String!, $phone: String!, $location: String!) {
      addJob(title: $title, description: $description, jobDate: $jobDate, phone: $phone, location: $location) {
        title
      }
    }
  `;
  const data = await client.request(mutation, job);
  console.log("SUCCESS PUBLISH: ", data);
};

module.exports = { client, PublishJob };
