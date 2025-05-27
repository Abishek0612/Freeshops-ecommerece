import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { USER_STATUS } from "../utils/constants";
import { EyeIcon, NoSymbolIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Users = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    userStatus: "",
    keyword: "",
  });

  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => userService.getUsers(filters),
    onError: (error) => {
      console.error("Users fetch error:", error);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: userService.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Toggle status error:", error);
      alert("Failed to update user status. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("Delete user error:", error);
      alert("Failed to delete user. Please try again.");
    },
  });

  const handleToggleStatus = (userId) => {
    if (window.confirm("Are you sure you want to change this user's status?")) {
      toggleStatusMutation.mutate(userId);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  const getStatusBadge = (status) => {
    // Handle both userStatus and status fields
    const actualStatus = status || USER_STATUS.ACTIVE;
    const statusClasses = {
      [USER_STATUS.ACTIVE]: "bg-green-100 text-green-800",
      [USER_STATUS.INACTIVE]: "bg-red-100 text-red-800",
      [USER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      Online: "bg-green-100 text-green-800",
      Offline: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          statusClasses[actualStatus] || "bg-gray-100 text-gray-800"
        }`}
      >
        {actualStatus === "Online"
          ? "Online"
          : actualStatus === "Offline"
          ? "Offline"
          : actualStatus || "Active"}
      </span>
    );
  };

  const getUsersArray = () => {
    if (!usersData) return [];

    // Handle different response structures
    if (usersData.status === 200 && usersData.data) {
      if (Array.isArray(usersData.data.docs)) return usersData.data.docs;
      if (Array.isArray(usersData.data)) return usersData.data;
    }

    if (Array.isArray(usersData)) return usersData;
    if (usersData.data && Array.isArray(usersData.data.docs))
      return usersData.data.docs;
    if (usersData.data && Array.isArray(usersData.data)) return usersData.data;
    if (Array.isArray(usersData.users)) return usersData.users;
    if (usersData.result && Array.isArray(usersData.result))
      return usersData.result;

    return [];
  };

  const getPaginationData = () => {
    if (!usersData) return { totalPages: 1, totalDocs: 0 };

    if (usersData.data && usersData.data.totalPages) {
      return {
        totalPages: usersData.data.totalPages,
        totalDocs: usersData.data.totalDocs || 0,
      };
    }

    return { totalPages: 1, totalDocs: getUsersArray().length };
  };

  const users = getUsersArray();
  const paginationData = getPaginationData();

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
          <div className="text-red-500 text-lg mb-2">Failed to load users</div>
          <p className="text-gray-500">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["users"])}
            className="mt-4 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching the design */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-orange-100">Manage your platform users</p>
          </div>
          <TrashIcon className="w-6 h-6 text-white cursor-pointer hover:text-red-200" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No users found</div>
            <p className="text-gray-400">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr
                    key={user._id || user.id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-pink-200"
                        src={
                          user.image ||
                          user.profileImage ||
                          user.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        }
                        alt={user.fullName || user.firstName || "User"}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.fullName ||
                          user.firstName ||
                          user.name ||
                          "Lorem Ipsum"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(
                        user.userStatus || user.status || "Online"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "12-2-2025"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.location || user.city || user.address || "Pune"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(user._id || user.id)
                          }
                          className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                          disabled={toggleStatusMutation.isPending}
                        >
                          {toggleStatusMutation.isPending
                            ? "Loading..."
                            : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id || user.id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination info */}
            <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
              Showing 1-12 of 1,253
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
