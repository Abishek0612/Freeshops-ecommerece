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
  SUB_CATEGORIES_BY_CATEGORY: "/SubCategory/allSubcategoryById",

  // Conditions
  CONDITIONS: "/admin/Condition/allCondition",
  CREATE_CONDITION: "/admin/Condition/addCondition",
  UPDATE_CONDITION: "/admin/Condition/updateCondition",
  DELETE_CONDITION: "/admin/Condition/deleteCondition",

  // Brands
  BRANDS: "/admin/Brand/allBrand",
  CREATE_BRAND: "/admin/Brand/addBrand",
  UPDATE_BRAND: "/admin/Brand/updateBrand",
  DELETE_BRAND: "/admin/Brand/deleteBrand",

  // Models
  MODELS: "/admin/Model/allModel",
  CREATE_MODEL: "/admin/Model/addModel",
  UPDATE_MODEL: "/admin/Model/updateModel",
  DELETE_MODEL: "/admin/Model/deleteModel",
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
