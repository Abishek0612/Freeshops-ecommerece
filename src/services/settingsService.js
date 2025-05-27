import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const settingsService = {
  sendNotification: async (data) => {
    const response = await api.post(ENDPOINTS.SEND_NOTIFICATION, data);
    return response.data;
  },

  getAllNotifications: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ALL_NOTIFICATIONS, { params });
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.post("/admin/updateSettings", data);
    return response.data;
  },
};
