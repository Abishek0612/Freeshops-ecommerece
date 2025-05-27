import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const conditionService = {
  getConditions: async () => {
    const response = await api.get(ENDPOINTS.CONDITIONS);
    return response.data;
  },

  createCondition: async (data) => {
    const response = await api.post(ENDPOINTS.CREATE_CONDITION, data);
    return response.data;
  },

  updateCondition: async (id, data) => {
    const response = await api.put(`${ENDPOINTS.UPDATE_CONDITION}/${id}`, data);
    return response.data;
  },

  deleteCondition: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_CONDITION}/${id}`);
    return response.data;
  },
};
