import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useForm } from "react-hook-form";

const BlogPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newsImagePreview, setNewsImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: pagesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogPages"],
    queryFn: () => blogService.getBlogPages(),
    onError: (error) => {
      console.error("Blog pages fetch error:", error);
    },
  });

  const createMutation = useMutation({
    mutationFn: blogService.createBlogPage,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogPages"]);
      setIsModalOpen(false);
      reset();
      setImagePreview(null);
      setNewsImagePreview(null);
      alert("Blog page created successfully!");
    },
    onError: (error) => {
      console.error("Create blog page error:", error);
      alert("Failed to create blog page. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlogPage,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogPages"]);
    },
    onError: (error) => {
      console.error("Delete blog page error:", error);
      alert("Failed to delete blog page. Please try again.");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog page?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewsImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title || "HOW IT WORKS");
    formData.append("heading", data.heading || "Buy. Sell. Simple");
    formData.append(
      "description",
      data.description ||
        "Freeshopps is the simplest, most trusted way to buy and sell locally"
    );
    formData.append(
      "newsTitle",
      data.newsTitle ||
        "A Letter From Our CEO: A Profitable Year and Our Path Forward"
    );
    formData.append(
      "newsDescription",
      data.newsDescription ||
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    );

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.newsImage?.[0]) {
      formData.append("newsImage", data.newsImage[0]);
    }

    createMutation.mutate(formData);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setImagePreview(null);
    setNewsImagePreview(null);
    reset();
  };

  const getPagesArray = () => {
    if (!pagesData) return [];

    if (pagesData.status === 200 && pagesData.data) {
      if (Array.isArray(pagesData.data)) {
        return pagesData.data;
      }
      if (pagesData.data.pages && Array.isArray(pagesData.data.pages)) {
        return pagesData.data.pages;
      }
    }

    if (Array.isArray(pagesData)) return pagesData;
    if (pagesData.data && Array.isArray(pagesData.data)) return pagesData.data;

    return [];
  };

  const pages = getPagesArray();

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
            Failed to load blog pages
          </div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["blogPages"])}
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
            <h1 className="text-3xl font-bold mb-2">Blog Page</h1>
            <p className="text-orange-100">Manage your blog pages</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add new Blog
          </button>
        </div>
      </div>

      <div className="card">
        {pages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              No blog pages found
            </div>
            <p className="text-gray-400">
              Click "Add new Blog" to create your first blog page.
            </p>
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
                {pages.map((page, index) => {
                  const pageId = page._id || page.id || index;

                  return (
                    <tr key={pageId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={
                            page.image ||
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center"
                          }
                          alt={page.title || "Blog Page"}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title || "Lorem Ipsum dolor sit amet"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {page.description ||
                            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(pageId)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                          title="Delete"
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
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

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create Blog Page"
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="input-field"
                placeholder="HOW IT WORKS"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("heading", { required: "Heading is required" })}
                className="input-field"
                placeholder="Buy. Sell. Simple"
              />
              {errors.heading && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.heading.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              {...register("description", {
                required: "Description is required",
              })}
              className="input-field"
              placeholder="Freeshopps is the simplest, most trusted way to buy and sell locally"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <span>Upload main image</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                News Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("newsTitle", {
                  required: "News title is required",
                })}
                className="input-field"
                placeholder="A Letter From Our CEO..."
              />
              {errors.newsTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newsTitle.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                News Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {newsImagePreview ? (
                    <div className="mb-4">
                      <img
                        src={newsImagePreview}
                        alt="News Preview"
                        className="mx-auto h-20 w-20 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-xs text-gray-600">
                    <label
                      htmlFor="news-image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload news image</span>
                      <input
                        id="news-image-upload"
                        type="file"
                        accept="image/*"
                        {...register("newsImage")}
                        onChange={handleNewsImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              News Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("newsDescription", {
                required: "News description is required",
              })}
              className="input-field"
              placeholder="Lorem Ipsum is simply dummy text..."
            />
            {errors.newsDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newsDescription.message}
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
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Blog Page</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogPage;
