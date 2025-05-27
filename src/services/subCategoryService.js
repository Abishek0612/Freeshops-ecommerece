import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const subCategoryService = {
  getSubCategories: async () => {
    try {
      const response = await api.get(ENDPOINTS.SUB_CATEGORIES_ADMIN);
      return response.data;
    } catch (error) {
      const response = await api.get(ENDPOINTS.SUB_CATEGORIES);
      return response.data;
    }
  },

  createSubCategory: async (formData) => {
    const response = await api.post(ENDPOINTS.CREATE_SUB_CATEGORY, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateSubCategory: async (id, data) => {
    const response = await api.put(
      `${ENDPOINTS.UPDATE_SUB_CATEGORY}/${id}`,
      data
    );
    return response.data;
  },

  deleteSubCategory: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_SUB_CATEGORY}/${id}`);
    return response.data;
  },
};
