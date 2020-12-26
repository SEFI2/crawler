import client from "./graphql-client.js";
import { gql } from 'graphql-request'

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const PublishJob = async (job) => {
  const mutation = gql`
    mutation AddJob($title: String!, $description: String!, $jobDate: String!, $phone: String!, $location: String!) {
      addJob(title: $title, description: $description, jobDate: $jobDate, phone: $phone, location: $location) {
        title
      }
    }
  `;

  const data = await client.request(mutation, job);
  console.log("SUCCESS PUBLISH: ", data);
  console.log("JOB: ", job);
};