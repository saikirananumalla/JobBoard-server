import {createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from 'graphql';

export const resolvers = {
    Query : {
        jobs: () => getJobs(),

        job: async (_root, {id}) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError('No Job found with id ' + id)
            }
            return job;
        },

        company: async (_root, {id}) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError('No Company found with id ' + id);
            }
            return company;
        },
    },

    Mutation: {
      createJob: (_root, {input : {title, description}}, {user}) => {
          if (!user) {
            throw unAuthorizedError("Missing authentication");
          }

          const companyId = user.companyId; //todo replace later
          return createJob({companyId, title, description})
      },

      deleteJob: (_root, {id}, {user}) => {
          if (!user) {
              throw unAuthorizedError("Missing authentication");
          }
          const job = deleteJob(id, user.companyId);
          if (!job) {
              throw notFoundError("No job found for id " + id);
          }
          return job;
      },

      updateJob: (_root, {input : {id, title, description}}, {user}) => {
          if (!user) {
              throw unAuthorizedError("Missing authentication");
          }
          const cId = user.companyId;
          const job = updateJob({id, title, description, companyId: cId});
          if (!job) {
              throw notFoundError("No job found for id " + id);
          }
          return job;
      }
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    }
};

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: {code: 'NOT_FOUND'},
    });
}

function unAuthorizedError(message) {
    return new GraphQLError(message, {
        extensions: {code: 'UNAUTHORIZED'},
    });
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}