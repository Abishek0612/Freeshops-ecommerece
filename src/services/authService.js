import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.LOGIN, credentials);
    if (response.data.accessToken) {
      localStorage.setItem("adminToken", response.data.accessToken);
      localStorage.setItem("adminUser", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("adminUser"));
  },

  getProfile: async () => {
    const response = await api.get(ENDPOINTS.PROFILE);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get(ENDPOINTS.DASHBOARD);
    return response.data;
  },

  getGraphData: async (params = {}) => {
    const response = await api.get(ENDPOINTS.GRAPH_DATA, { params });
    return response.data;
  },
};
