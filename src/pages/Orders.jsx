import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import { ORDER_STATUS } from "../utils/constants";
import {
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", filters],
    queryFn: () => orderService.getOrders(filters),
    retry: 2,
    onError: (error) => {
      console.error("Orders fetch error:", error);
    },
  });

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      [ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [ORDER_STATUS.CONFIRMED]: "bg-blue-100 text-blue-800",
      [ORDER_STATUS.SHIPPED]: "bg-purple-100 text-purple-800",
      [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
      [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "Pending"}
      </span>
    );
  };

  const getOrdersArray = () => {
    if (!ordersData) return [];
    if (Array.isArray(ordersData)) return ordersData;
    if (ordersData.data && Array.isArray(ordersData.data))
      return ordersData.data;
    if (ordersData.orders && Array.isArray(ordersData.orders))
      return ordersData.orders;
    return [];
  };

  const orders = getOrdersArray();

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
          <div className="text-red-500 text-lg mb-2">Failed to load orders</div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button onClick={refetch} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with curved background */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order</h1>
            <p className="text-orange-100">
              Manage customer orders and transactions
            </p>
          </div>
          <TrashIcon className="w-6 h-6 text-white cursor-pointer hover:text-red-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
            >
              <option value="">All Status</option>
              <option value={ORDER_STATUS.PENDING}>Pending</option>
              <option value={ORDER_STATUS.CONFIRMED}>Confirmed</option>
              <option value={ORDER_STATUS.SHIPPED}>Shipped</option>
              <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
              <option value={ORDER_STATUS.CANCELLED}>Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={refetch}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-xl transition-colors cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No orders found</div>
            <p className="text-gray-400">
              Orders will appear here once customers place them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={order._id || order.id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-pink-200"
                        src={
                          order.productImage ||
                          order.product?.image ||
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center"
                        }
                        alt="Product"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.productId || order.product?._id || "0987654"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderId || order._id || "654321245"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.userName ||
                          order.user?.fullName ||
                          "Lorem Ipsum"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.location || order.shippingAddress || "Pune"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.price || order.totalAmount || "350"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(order)}
                        className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
              Showing 1-12 of 1,253
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Order Details"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Order Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <strong>Order ID:</strong>{" "}
                    {selectedOrder.orderId || selectedOrder._id}
                  </p>
                  <p>
                    <strong>Product ID:</strong>{" "}
                    {selectedOrder.productId || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> $
                    {selectedOrder.price || selectedOrder.totalAmount}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.userName || selectedOrder.user?.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.userEmail || selectedOrder.user?.email}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedOrder.location || selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
