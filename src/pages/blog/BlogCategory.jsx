import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import {
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useForm } from "react-hook-form";

const BlogCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: () => blogService.getBlogCategories(),
    onError: (error) => {
      console.error("Blog categories fetch error:", error);
    },
  });

  const createMutation = useMutation({
    mutationFn: blogService.createBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogCategories"]);
      setIsModalOpen(false);
      reset();
      alert("Blog category created successfully!");
    },
    onError: (error) => {
      console.error("Create blog category error:", error);
      alert("Failed to create blog category. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.updateBlogCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogCategories"]);
      setIsModalOpen(false);
      setEditingCategory(null);
      reset();
      alert("Blog category updated successfully!");
    },
    onError: (error) => {
      console.error("Update blog category error:", error);
      alert("Failed to update blog category. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogCategories"]);
      setSelectedCategories([]);
    },
    onError: (error) => {
      console.error("Delete blog category error:", error);
      alert("Failed to delete blog category. Please try again.");
    },
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      const allCategoryIds = categories.map(
        (category) => category._id || category.id
      );
      setSelectedCategories(allCategoryIds);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) {
      alert("Please select categories to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCategories.length} selected category(s)?`
      )
    ) {
      selectedCategories.forEach((id) => {
        deleteMutation.mutate(id);
      });
      setSelectedCategories([]);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue("title", category.title || "");
    setValue("description", category.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory._id || editingCategory.id,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const getCategoriesArray = () => {
    if (!categoriesData) return [];

    if (categoriesData.status === 200 && categoriesData.data) {
      if (Array.isArray(categoriesData.data)) {
        return categoriesData.data;
      }
      if (
        categoriesData.data.categories &&
        Array.isArray(categoriesData.data.categories)
      ) {
        return categoriesData.data.categories;
      }
    }

    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData.data && Array.isArray(categoriesData.data))
      return categoriesData.data;

    return [];
  };

  const categories = getCategoriesArray();
  const isAllSelected =
    selectedCategories.length === categories.length && categories.length > 0;
  const isSomeSelected = selectedCategories.length > 0;

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
            Failed to load blog categories
          </div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["blogCategories"])}
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
            <h1 className="text-3xl font-bold mb-2">Blog Category</h1>
            <p className="text-orange-100">Manage your blog categories</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSomeSelected && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Selected ({selectedCategories.length})
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add new Blog
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              No blog categories found
            </div>
            <p className="text-gray-400">
              Click "Add new Blog" to create your first blog category.
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
                {categories.map((category, index) => {
                  const categoryId = category._id || category.id || index;
                  const isSelected = selectedCategories.includes(categoryId);

                  return (
                    <tr
                      key={categoryId}
                      className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectCategory(categoryId, e.target.checked)
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.title || "Lorem Ipsum dolor sit amet"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description ||
                            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(categoryId)}
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
        title={editingCategory ? "Edit Blog Category" : "Create Blog Category"}
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
              placeholder="Enter category title"
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
              placeholder="Enter category description"
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn-primary flex items-center space-x-2"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {editingCategory ? "Update Category" : "Create Category"}
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogCategory;
