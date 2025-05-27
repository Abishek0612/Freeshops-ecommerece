import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const productService = {
  getProducts: async (params = {}) => {
    try {
      console.log("Fetching products with params:", params);

      let response;
      try {
        response = await api.get(ENDPOINTS.PRODUCTS, { params });
        console.log("Products fetched from user endpoint:", response.data);
      } catch (error) {
        console.log(
          "User endpoint failed, trying admin endpoint:",
          error.response?.status
        );
        response = await api.get(ENDPOINTS.PRODUCTS_ADMIN, { params });
        console.log("Products fetched from admin endpoint:", response.data);
      }

      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.PRODUCT_BY_ID}/${id}`);
      console.log("Product by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get product by ID error:", error);
      throw error;
    }
  },

  updateProduct: async (id, data) => {
    try {
      console.log("Updating product:", id, data);

      let response;
      try {
        response = await api.put(`${ENDPOINTS.UPDATE_PRODUCT}/${id}`, data);
      } catch (error) {
        response = await api.put(`/admin/updateProduct/${id}`, data);
      }

      console.log("Update product response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update product error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      console.log("Deleting product:", id);

      let response;
      try {
        response = await api.delete(`${ENDPOINTS.DELETE_PRODUCT}/${id}`);
      } catch (error) {
        response = await api.delete(`/admin/deleteProduct/${id}`);
      }

      console.log("Delete product response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete product error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },
};
