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
    const statusClasses = {
      [USER_STATUS.ACTIVE]: "bg-green-100 text-green-800",
      [USER_STATUS.INACTIVE]: "bg-red-100 text-red-800",
      [USER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
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

  const getUsersArray = () => {
    if (!usersData) return [];

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

  console.log("Users Data:", usersData);

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
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Users Management</h1>
        <p className="text-orange-100">Manage your platform users</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by email or phone..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value, page: 1 })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.userStatus}
              onChange={(e) =>
                setFilters({ ...filters, userStatus: e.target.value, page: 1 })
              }
              className="input-field"
            >
              <option value="">All Status</option>
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.INACTIVE}>Inactive</option>
              <option value={USER_STATUS.PENDING}>Pending</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => queryClient.refetchQueries(["users"])}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user._id || user.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image || "https://via.placeholder.com/40"}
                            alt=""
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || user.firstName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.userType || "USER"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.phoneNumber || user.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.userStatus || user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(user._id || user.id)
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title={
                            user.userStatus === USER_STATUS.ACTIVE
                              ? "Block User"
                              : "Activate User"
                          }
                          disabled={toggleStatusMutation.isPending}
                        >
                          {toggleStatusMutation.isPending ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <NoSymbolIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id || user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
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

        {/* Pagination */}
        {paginationData.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
                disabled={filters.page === paginationData.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(filters.page - 1) * filters.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      filters.page * filters.limit,
                      paginationData.totalDocs
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {paginationData.totalDocs}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={filters.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {filters.page} of {paginationData.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={filters.page === paginationData.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
