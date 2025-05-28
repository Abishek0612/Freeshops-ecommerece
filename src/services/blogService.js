import api from "./api";
import { ENDPOINTS } from "../utils/constants";

export const blogService = {
  // Blog Categories
  getBlogCategories: async (params = {}) => {
    const response = await api.get(ENDPOINTS.BLOG_CATEGORIES, { params });
    return response.data;
  },

  createBlogCategory: async (data) => {
    const response = await api.post(ENDPOINTS.CREATE_BLOG_CATEGORY, data);
    return response.data;
  },

  updateBlogCategory: async (id, data) => {
    const response = await api.put(
      `${ENDPOINTS.UPDATE_BLOG_CATEGORY}/${id}`,
      data
    );
    return response.data;
  },

  deleteBlogCategory: async (id) => {
    const response = await api.delete(
      `${ENDPOINTS.DELETE_BLOG_CATEGORY}/${id}`
    );
    return response.data;
  },

  // Blog Pages
  getBlogPages: async (params = {}) => {
    const response = await api.get(ENDPOINTS.BLOG_PAGES, { params });
    return response.data;
  },

  createBlogPage: async (formData) => {
    const response = await api.post(ENDPOINTS.CREATE_BLOG_PAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBlogPage: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_BLOG_PAGE}/${id}`);
    return response.data;
  },

  // Blogs
  getBlogs: async (params = {}) => {
    const response = await api.get(ENDPOINTS.BLOGS, { params });
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`${ENDPOINTS.GET_BLOG}/${id}`);
    return response.data;
  },

  createBlog: async (formData) => {
    const response = await api.post(ENDPOINTS.CREATE_BLOG, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBlog: async (id, formData) => {
    const response = await api.put(`${ENDPOINTS.UPDATE_BLOG}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`${ENDPOINTS.DELETE_BLOG}/${id}`);
    return response.data;
  },

  getAllBlogForAdmin: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ALL_BLOG_FOR_ADMIN, { params });
    return response.data;
  },
};
