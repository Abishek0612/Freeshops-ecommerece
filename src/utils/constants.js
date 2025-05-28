// src/utils/constants.js
export const API_BASE_URL =
  "https://mamun-reza-freeshops-backend.vercel.app/api/v1";

export const ENDPOINTS = {
  // Auth
  LOGIN: "/admin/login",
  REGISTER: "/admin/registration",
  PROFILE: "/admin/getProfile",
  DASHBOARD: "/admin/getDashboard",
  GRAPH_DATA: "/admin/getGraphData",

  // Articles
  ARTICLES: "/admin/Article/getArticle",
  CREATE_ARTICLE: "/admin/Article/createArticle",
  UPDATE_ARTICLE: "/admin/Article/updateArticle",
  DELETE_ARTICLE: "/admin/Article/deleteArticle",

  // Users
  USERS: "/admin/getAllUsers",
  USER_BY_ID: "/admin/getUserById",
  BLOCK_USER: "/admin/userActiveBlock",
  DELETE_USER: "/admin/deleteUser",

  // Auto Dealership
  AUTO_DEALERSHIP: "/admin/AutoDealerShip/allAutoDealerShip",
  CREATE_AUTO_DEALERSHIP: "/admin/AutoDealerShip/addAutoDealerShip",
  UPDATE_AUTO_DEALERSHIP: "/admin/AutoDealerShip/updateAutoDealerShip",
  DELETE_AUTO_DEALERSHIP: "/admin/AutoDealerShip/deleteAutoDealerShip",
  ADD_DATA_IN_DATA: "/admin/AutoDealerShip/addDataInData",
  ADD_DATA_IN_PROMOTED: "/admin/AutoDealerShip/addDataInPromotedPlacement",
  ADD_DATA_IN_EVERYTHING: "/admin/AutoDealerShip/addDataInEveryThing",

  // Jobs
  JOBS: "/admin/allJobsForAdmin",
  JOB_BY_ID: "/admin/getJobs",
  UPDATE_JOB: "/admin/updateJobs",
  DELETE_JOB: "/admin/deleteJobs",

  // Products
  PRODUCTS: "/user/allProduct",
  PRODUCTS_ADMIN: "/admin/allProductForAdmin",
  PRODUCT_BY_ID: "/admin/getProduct",
  UPDATE_PRODUCT: "/admin/updateProduct",
  DELETE_PRODUCT: "/admin/deleteProduct",

  // Orders
  ORDERS: "/admin/getOrders",
  ORDER_BY_ID: "/admin/getOrdersById",
  TRANSACTIONS: "/admin/getTransactions",
  TRANSACTION_BY_ID: "/admin/getTransactionsById",

  // Settings & Notifications
  SEND_NOTIFICATION: "/admin/notification/sendNotification",
  ALL_NOTIFICATIONS: "/admin/notification/allNotification",

  // Categories
  CATEGORIES: "/admin/Category/allCategory",
  CREATE_CATEGORY: "/admin/Category/addCategory",
  UPDATE_CATEGORY: "/admin/Category/updateCategory",
  DELETE_CATEGORY: "/admin/Category/deleteCategory",

  // Sub Categories
  SUB_CATEGORIES: "/SubCategory/all/Subcategory",
  SUB_CATEGORIES_ADMIN: "/SubCategory/all/SubCategoryForAdmin",
  CREATE_SUB_CATEGORY: "/SubCategory/addSubcategory",
  UPDATE_SUB_CATEGORY: "/SubCategory/updateSubcategory",
  DELETE_SUB_CATEGORY: "/SubCategory/deleteSubcategory",

  // Conditions
  CONDITIONS: "/admin/Condition/allCondition",
  CREATE_CONDITION: "/admin/Condition/addCondition",
  UPDATE_CONDITION: "/admin/Condition/updateCondition",
  DELETE_CONDITION: "/admin/Condition/deleteCondition",

  // Blog Categories
  BLOG_CATEGORIES: "/admin/BlogCategory/allBlogCategory",
  CREATE_BLOG_CATEGORY: "/admin/BlogCategory/addBlogCategory",
  UPDATE_BLOG_CATEGORY: "/admin/BlogCategory/updateBlogCategory",
  DELETE_BLOG_CATEGORY: "/admin/BlogCategory/deleteBlogCategory",

  // Blog Pages
  BLOG_PAGES: "/admin/allBlogPage",
  CREATE_BLOG_PAGE: "/admin/createBlogPage",
  DELETE_BLOG_PAGE: "/admin/deleteBlogPage",

  // Blogs
  BLOGS: "/admin/allBlog",
  GET_BLOG: "/admin/getBlog",
  CREATE_BLOG: "/admin/addBlog",
  UPDATE_BLOG: "/admin/updateBlog",
  DELETE_BLOG: "/admin/deleteBlog",
  ALL_BLOG_FOR_ADMIN: "/admin/allBlogForAdmin",
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
};

export const PRODUCT_STATUS = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
};

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const JOB_STATUS = {
  VACANT: "Vacant",
  FILLED: "Filled",
};

export const JOB_TYPE = {
  REMOTE: "Remote",
  ONSITE: "Onsite",
  HYBRID: "Hybrid",
};
