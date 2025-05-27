import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subCategoryService } from "../../services/subCategoryService";
import { categoryService } from "../../services/categoryService";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useForm } from "react-hook-form";

const SubCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: subCategoriesData, isLoading } = useQuery({
    queryKey: ["subCategories"],
    queryFn: subCategoryService.getSubCategories,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: subCategoryService.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["subCategories"]);
      setIsModalOpen(false);
      reset();
      alert("Sub-category created successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create sub-category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      subCategoryService.updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["subCategories"]);
      setIsModalOpen(false);
      setEditingSubCategory(null);
      reset();
      alert("Sub-category updated successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update sub-category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subCategoryService.deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["subCategories"]);
      alert("Sub-category deleted successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete sub-category");
    },
  });

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setValue("name", subCategory.name);
    setValue(
      "categoryId",
      subCategory.categoryId?._id || subCategory.categoryId
    );
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sub-category?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    if (editingSubCategory) {
      updateMutation.mutate({ id: editingSubCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getSubCategoriesArray = () => {
    if (!subCategoriesData) return [];
    if (Array.isArray(subCategoriesData)) return subCategoriesData;
    if (subCategoriesData.data && Array.isArray(subCategoriesData.data))
      return subCategoriesData.data;
    return [];
  };

  const getCategoriesArray = () => {
    if (!categoriesData) return [];
    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData.data && Array.isArray(categoriesData.data))
      return categoriesData.data;
    return [];
  };

  const subCategories = getSubCategoriesArray();
  const categories = getCategoriesArray();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sub-Categories</h1>
            <p className="text-orange-100">Manage product sub-categories</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center cursor-pointer"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add new sub-category
          </button>
        </div>
      </div>

      <div className="card">
        {subCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              No sub-categories found
            </div>
            <p className="text-gray-400">
              Click "Add new sub-category" to create your first sub-category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCategories.map((subCategory, index) => (
                  <tr
                    key={subCategory._id || subCategory.id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subCategory.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subCategory.categoryId?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subCategory.createdAt
                        ? new Date(subCategory.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(subCategory)}
                          className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(subCategory._id || subCategory.id)
                          }
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Delete
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubCategory(null);
          reset();
        }}
        title={editingSubCategory ? "Edit Sub-Category" : "Create Sub-Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input-field"
              placeholder="Enter sub-category name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId", { required: "Category is required" })}
              className="input-field cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="input-field cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSubCategory(null);
                reset();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn-primary cursor-pointer"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <LoadingSpinner size="small" />
              ) : editingSubCategory ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubCategories;
