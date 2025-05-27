import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get(ENDPOINTS.USERS, { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`${ENDPOINTS.USER_BY_ID}/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`${ENDPOINTS.BLOCK_USER}/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_USER}/${id}`);
    return response.data;
  },
};
