import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
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

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}