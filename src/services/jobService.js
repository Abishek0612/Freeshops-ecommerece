import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get(ENDPOINTS.JOBS, { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`${ENDPOINTS.JOB_BY_ID}/${id}`);
    return response.data;
  },

  updateJob: async (id, data) => {
    const response = await api.put(`${ENDPOINTS.UPDATE_JOB}/${id}`, data);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_JOB}/${id}`);
    return response.data;
  },
};
