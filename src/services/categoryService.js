import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const categoryService = {
  getCategories: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  createCategory: async (formData) => {
    const response = await api.post(ENDPOINTS.CREATE_CATEGORY, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateCategory: async (id, formData) => {
    const response = await api.put(
      `${ENDPOINTS.UPDATE_CATEGORY}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_CATEGORY}/${id}`);
    return response.data;
  },
};
