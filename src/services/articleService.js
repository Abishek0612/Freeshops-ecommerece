import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const articleService = {
  getArticles: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ARTICLES, { params });
    return response.data;
  },

  createArticle: async (formData) => {
    const response = await api.post(ENDPOINTS.CREATE_ARTICLE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateArticle: async (id, data) => {
    const response = await api.put(`${ENDPOINTS.UPDATE_ARTICLE}/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_ARTICLE}/${id}`);
    return response.data;
  },
};
