import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { autoDealershipService } from "../services/autoDealershipService";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";
import { useForm } from "react-hook-form";

const AutoDealership = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDealership, setEditingDealership] = useState(null);
  const [selectedDealerships, setSelectedDealerships] = useState([]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: dealershipsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["autoDealerships"],
    queryFn: () => autoDealershipService.getAutoDealerships(),
    onError: (error) => {
      console.error("Auto dealerships fetch error:", error);
    },
  });

  const createMutation = useMutation({
    mutationFn: autoDealershipService.createAutoDealership,
    onSuccess: () => {
      queryClient.invalidateQueries(["autoDealerships"]);
      setIsModalOpen(false);
      reset();
      alert("Auto dealership created successfully!");
    },
    onError: (error) => {
      console.error("Create auto dealership error:", error);
      alert("Failed to create auto dealership. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: autoDealershipService.deleteAutoDealership,
    onSuccess: () => {
      queryClient.invalidateQueries(["autoDealerships"]);
      setSelectedDealerships([]);
    },
    onError: (error) => {
      console.error("Delete auto dealership error:", error);
      alert("Failed to delete auto dealership. Please try again.");
    },
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      const allDealershipIds = dealerships.map(
        (dealership) => dealership._id || dealership.id
      );
      setSelectedDealerships(allDealershipIds);
    } else {
      setSelectedDealerships([]);
    }
  };

  const handleSelectDealership = (dealershipId, checked) => {
    if (checked) {
      setSelectedDealerships((prev) => [...prev, dealershipId]);
    } else {
      setSelectedDealerships((prev) =>
        prev.filter((id) => id !== dealershipId)
      );
    }
  };

  const handleBulkDelete = () => {
    if (selectedDealerships.length === 0) {
      alert("Please select dealerships to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedDealerships.length} selected dealership(s)?`
      )
    ) {
      selectedDealerships.forEach((id) => {
        deleteMutation.mutate(id);
      });
      setSelectedDealerships([]);
    }
  };

  const handleEdit = (dealership) => {
    setEditingDealership(dealership);
    setValue("title", dealership.title || "");
    setValue("description", dealership.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dealership?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    const requestData = {
      title: data.title || "Find your next job",
      description:
        data.description ||
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      everyThingHeading:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      promotedPlacementHeading:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };

    if (editingDealership) {
      console.log("Update dealership:", requestData);
    } else {
      createMutation.mutate(requestData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDealership(null);
    reset();
  };

  const getDealershipsArray = () => {
    if (!dealershipsData) return [];

    if (dealershipsData.status === 200 && dealershipsData.data) {
      if (Array.isArray(dealershipsData.data)) {
        return dealershipsData.data;
      }
      if (
        dealershipsData.data.dealerships &&
        Array.isArray(dealershipsData.data.dealerships)
      ) {
        return dealershipsData.data.dealerships;
      }
    }

    if (Array.isArray(dealershipsData)) return dealershipsData;
    if (dealershipsData.data && Array.isArray(dealershipsData.data))
      return dealershipsData.data;

    return [];
  };

  const dealerships = getDealershipsArray();
  const isAllSelected =
    selectedDealerships.length === dealerships.length && dealerships.length > 0;
  const isSomeSelected = selectedDealerships.length > 0;

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
            Failed to load auto dealerships
          </div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["autoDealerships"])}
            className="btn-primary"
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Auto dealership</h1>
            <p className="text-orange-100">Manage auto dealership listings</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSomeSelected && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Selected ({selectedDealerships.length})
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Auto dealership
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {dealerships.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              No auto dealerships found
            </div>
            <p className="text-gray-400">
              Click "Add Auto dealership" to create your first dealership
              listing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dealerships.map((dealership, index) => {
                  const dealershipId = dealership._id || dealership.id || index;
                  const isSelected = selectedDealerships.includes(dealershipId);

                  return (
                    <tr
                      key={dealershipId}
                      className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectDealership(
                              dealershipId,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={
                            dealership.image ||
                            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center"
                          }
                          alt={dealership.title || "Auto Dealership"}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=96&h=96&fit=crop&crop=center";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dealership.title || "Lorem Ipsum dolor sit amet"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {dealership.description ||
                            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(dealership)}
                            className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dealershipId)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                            title="Delete"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
              Showing 1-12 of 1,253
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingDealership ? "Edit Auto Dealership" : "Create Auto Dealership"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="input-field"
              placeholder="Enter dealership title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
              className="input-field"
              placeholder="Enter dealership description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary flex items-center space-x-2"
            >
              {createMutation.isPending ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {editingDealership
                    ? "Update Dealership"
                    : "Create Dealership"}
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AutoDealership;
