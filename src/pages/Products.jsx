import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { PRODUCT_STATUS } from "../utils/constants";
import {
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
    category: "",
  });

  const queryClient = useQueryClient();

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", appliedFilters],
    queryFn: () => productService.getProducts(appliedFilters),
    retry: 2,
    onError: (error) => {
      console.error("Products fetch error:", error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      productService.updateProduct(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      alert("Product status updated successfully!");
    },
    onError: (error) => {
      console.error("Update status error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update product status. Please try again.";
      alert(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      alert("Product deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete product error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete product. Please try again.";
      alert(errorMessage);
    },
  });

  const handleStatusChange = (productId, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to change the status to ${newStatus}?`
      )
    ) {
      updateStatusMutation.mutate({ id: productId, status: newStatus });
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const clearedFilters = { search: "", status: "", category: "" };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      [PRODUCT_STATUS.APPROVED]: "bg-green-100 text-green-800",
      [PRODUCT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [PRODUCT_STATUS.REJECTED]: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const getProductsArray = () => {
    if (!productsData) return [];

    if (productsData.status === 200 && productsData.data) {
      if (Array.isArray(productsData.data)) {
        return productsData.data;
      }
      if (
        productsData.data.products &&
        Array.isArray(productsData.data.products)
      ) {
        return productsData.data.products;
      }
      if (productsData.data.docs && Array.isArray(productsData.data.docs)) {
        return productsData.data.docs;
      }
    }

    if (Array.isArray(productsData)) return productsData;
    if (productsData.data && Array.isArray(productsData.data))
      return productsData.data;
    if (Array.isArray(productsData.products)) return productsData.products;
    if (productsData.result && Array.isArray(productsData.result))
      return productsData.result;

    return [];
  };

  const renderLocation = (location) => {
    if (!location) return "N/A";

    if (typeof location === "string") {
      return location;
    }

    if (typeof location === "object") {
      if (location.type === "Point" && location.coordinates) {
        return `Lat: ${location.coordinates[1]}, Lng: ${location.coordinates[0]}`;
      }

      if (location.address || location.city || location.state) {
        const parts = [];
        if (location.address) parts.push(location.address);
        if (location.city) parts.push(location.city);
        if (location.state) parts.push(location.state);
        if (location.country) parts.push(location.country);
        return parts.length > 0 ? parts.join(", ") : "N/A";
      }

      return JSON.stringify(location);
    }

    return String(location);
  };

  const products = getProductsArray();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-lg mb-2">
            Failed to load products
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Products Management</h1>
        <p className="text-orange-100">Review and manage platform products</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-center">
          <div className="grid gri-1 md:grid-cols-4 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input-field"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleApplyFilters();
                  }
                }}
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleApplyFilters}
                className="btn-primary flex-1"
              >
                Apply Filters
              </button>
              <button onClick={handleClearFilters} className="btn-secondary">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <p className="text-gray-400">
              {productsData
                ? "Try adjusting your search filters."
                : "Unable to load products from the API."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product._id || product.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            src={
                              product.image?.[0] ||
                              product.image ||
                              product.images?.[0] ||
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center"
                            }
                            alt={product.name || "Product"}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name || product.title || "Untitled"}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {(
                              product.description || "No description"
                            ).substring(0, 50)}
                            ...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.categoryId?.name ||
                          product.category?.name ||
                          "Electronic & Media"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.subCategoryId?.name ||
                          product.subCategory?.name ||
                          "Home & Garden"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.isFree ? "Free" : `$${product.price || "0"}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <select
                          value={product.status || PRODUCT_STATUS.APPROVED}
                          onChange={(e) =>
                            handleStatusChange(
                              product._id || product.id,
                              e.target.value
                            )
                          }
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value={PRODUCT_STATUS.PENDING}>
                            Pending
                          </option>
                          <option value={PRODUCT_STATUS.APPROVED}>
                            Approved
                          </option>
                          <option value={PRODUCT_STATUS.REJECTED}>
                            Rejected
                          </option>
                        </select>
                        {getStatusBadge(
                          product.status || PRODUCT_STATUS.APPROVED
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.userId?.fullName ||
                          product.seller?.name ||
                          "Ayesha Flyweis"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.userId?.email ||
                          product.seller?.email ||
                          "ayesha@flyweis.technology"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product._id || product.id)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Product Details"
        size="xl"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={
                    selectedProduct.image?.[0] ||
                    selectedProduct.image ||
                    selectedProduct.images?.[0] ||
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center"
                  }
                  alt={selectedProduct.name || selectedProduct.title}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedProduct.name ||
                      selectedProduct.title ||
                      "Untitled"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedProduct.categoryId?.name ||
                        selectedProduct.category?.name ||
                        "N/A"}
                    </span>
                  </div>
                  {(selectedProduct.subCategoryId?.name ||
                    selectedProduct.subCategory?.name) && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        Subcategory:
                      </span>
                      <span className="text-sm text-gray-700">
                        {selectedProduct.subCategoryId?.name ||
                          selectedProduct.subCategory?.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Price:
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {selectedProduct.isFree
                        ? "Free"
                        : `$${selectedProduct.price || "0"}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    {getStatusBadge(selectedProduct.status)}
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Location:
                    </span>
                    <span className="text-sm text-gray-900">
                      {renderLocation(selectedProduct.location)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Seller Information:
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProduct.userId?.fullName ||
                        selectedProduct.seller?.name ||
                        "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.userId?.email ||
                        selectedProduct.seller?.email ||
                        "N/A"}
                    </p>
                    {selectedProduct.userId?.phone && (
                      <p className="text-sm text-gray-600">
                        {selectedProduct.userId.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Product Description:
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            )}

            {/* Additional product details if available */}
            {(selectedProduct.condition ||
              selectedProduct.brand ||
              selectedProduct.model) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Additional Details:
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.condition && (
                    <div>
                      <span className="text-xs text-gray-500">Condition:</span>
                      <p className="text-sm text-gray-900">
                        {selectedProduct.condition}
                      </p>
                    </div>
                  )}
                  {selectedProduct.brand && (
                    <div>
                      <span className="text-xs text-gray-500">Brand:</span>
                      <p className="text-sm text-gray-900">
                        {selectedProduct.brand}
                      </p>
                    </div>
                  )}
                  {selectedProduct.model && (
                    <div>
                      <span className="text-xs text-gray-500">Model:</span>
                      <p className="text-sm text-gray-900">
                        {selectedProduct.model}
                      </p>
                    </div>
                  )}
                  {selectedProduct.createdAt && (
                    <div>
                      <span className="text-xs text-gray-500">Posted:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedProduct.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;
