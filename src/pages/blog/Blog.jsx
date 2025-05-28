import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../../services/blogService";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useForm } from "react-hook-form";

const Blog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: blogsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.getBlogs(),
    onError: (error) => {
      console.error("Blogs fetch error:", error);
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: () => blogService.getBlogCategories(),
  });

  const createMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      setIsModalOpen(false);
      reset();
      setImagePreview(null);
      alert("Blog created successfully!");
    },
    onError: (error) => {
      console.error("Create blog error:", error);
      alert("Failed to create blog. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      setIsModalOpen(false);
      setEditingBlog(null);
      reset();
      setImagePreview(null);
      alert("Blog updated successfully!");
    },
    onError: (error) => {
      console.error("Update blog error:", error);
      alert("Failed to update blog. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      setSelectedBlogs([]);
    },
    onError: (error) => {
      console.error("Delete blog error:", error);
      alert("Failed to delete blog. Please try again.");
    },
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      const allBlogIds = blogs.map((blog) => blog._id || blog.id);
      setSelectedBlogs(allBlogIds);
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (blogId, checked) => {
    if (checked) {
      setSelectedBlogs((prev) => [...prev, blogId]);
    } else {
      setSelectedBlogs((prev) => prev.filter((id) => id !== blogId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) {
      alert("Please select blogs to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBlogs.length} selected blog(s)?`
      )
    ) {
      selectedBlogs.forEach((id) => {
        deleteMutation.mutate(id);
      });
      setSelectedBlogs([]);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setValue("title", blog.title || "");
    setValue("description", blog.description || "");
    setValue(
      "blogCategoryId",
      blog.blogCategoryId?._id || blog.blogCategoryId || ""
    );
    if (blog.image) {
      setImagePreview(blog.image);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
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

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title || "Good Neighbor Report 2022");
    formData.append(
      "description",
      data.description ||
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    );
    formData.append("blogCategoryId", data.blogCategoryId);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    if (editingBlog) {
      updateMutation.mutate({
        id: editingBlog._id || editingBlog.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    setImagePreview(null);
    reset();
  };

  const getBlogsArray = () => {
    if (!blogsData) return [];

    if (blogsData.status === 200 && blogsData.data) {
      if (Array.isArray(blogsData.data)) {
        return blogsData.data;
      }
      if (blogsData.data.blogs && Array.isArray(blogsData.data.blogs)) {
        return blogsData.data.blogs;
      }
    }

    if (Array.isArray(blogsData)) return blogsData;
    if (blogsData.data && Array.isArray(blogsData.data)) return blogsData.data;

    return [];
  };

  const getCategoriesArray = () => {
    if (!categoriesData) return [];

    if (categoriesData.status === 200 && categoriesData.data) {
      if (Array.isArray(categoriesData.data)) {
        return categoriesData.data;
      }
    }

    if (Array.isArray(categoriesData)) return categoriesData;
    if (categoriesData.data && Array.isArray(categoriesData.data))
      return categoriesData.data;

    return [];
  };

  const blogs = getBlogsArray();
  const categories = getCategoriesArray();
  const isAllSelected =
    selectedBlogs.length === blogs.length && blogs.length > 0;
  const isSomeSelected = selectedBlogs.length > 0;

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
          <div className="text-red-500 text-lg mb-2">Failed to load blogs</div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["blogs"])}
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
            <h1 className="text-3xl font-bold mb-2">Blog</h1>
            <p className="text-orange-100">Manage your blog posts</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSomeSelected && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Selected ({selectedBlogs.length})
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
        {blogs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No blogs found</div>
            <p className="text-gray-400">
              Click "Add new Blog" to create your first blog post.
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
                    Id
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
                {blogs.map((blog, index) => {
                  const blogId = blog._id || blog.id || index;
                  const isSelected = selectedBlogs.includes(blogId);

                  return (
                    <tr
                      key={blogId}
                      className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectBlog(blogId, e.target.checked)
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={
                            blog.image ||
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center"
                          }
                          alt={blog.title || "Blog"}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {blog.id || blog._id || "98761"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {blog.title || "Lorem Ipsum dolor sit amet"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {blog.description ||
                            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blogId)}
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
        title={editingBlog ? "Edit Blog" : "Create Blog"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blog Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("blogCategoryId", {
                required: "Blog category is required",
              })}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.blogCategoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.blogCategoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="input-field"
              placeholder="Good Neighbor Report 2022"
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
              placeholder="Lorem Ipsum is simply dummy text..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
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
                    htmlFor="blog-image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <span>Upload an image</span>
                    <input
                      id="blog-image-upload"
                      type="file"
                      accept="image/*"
                      {...register("image")}
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
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
                <span>{editingBlog ? "Update Blog" : "Create Blog"}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blog;
