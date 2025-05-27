import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const orderService = {
  getOrders: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ORDERS, { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`${ENDPOINTS.ORDER_BY_ID}/${id}`);
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get(ENDPOINTS.TRANSACTIONS, { params });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`${ENDPOINTS.TRANSACTION_BY_ID}/${id}`);
    return response.data;
  },
};
