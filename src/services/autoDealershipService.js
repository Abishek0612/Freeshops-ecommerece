import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const autoDealershipService = {
  getAutoDealerships: async (params = {}) => {
    const response = await api.get(ENDPOINTS.AUTO_DEALERSHIP, { params });
    return response.data;
  },

  createAutoDealership: async (formData) => {
    const response = await api.post(
      ENDPOINTS.CREATE_AUTO_DEALERSHIP,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateAutoDealership: async (id, formData) => {
    const response = await api.put(
      `${ENDPOINTS.UPDATE_AUTO_DEALERSHIP}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteAutoDealership: async (id) => {
    const response = await api.delete(
      `${ENDPOINTS.DELETE_AUTO_DEALERSHIP}/${id}`
    );
    return response.data;
  },

  addDataInData: async (formData) => {
    const response = await api.post(ENDPOINTS.ADD_DATA_IN_DATA, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  addDataInPromoted: async (formData) => {
    const response = await api.post(ENDPOINTS.ADD_DATA_IN_PROMOTED, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  addDataInEverything: async (formData) => {
    const response = await api.post(
      ENDPOINTS.ADD_DATA_IN_EVERYTHING,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
