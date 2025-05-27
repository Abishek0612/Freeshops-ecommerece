import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "../services/articleService";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";
import { useForm } from "react-hook-form";

const Articles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: articlesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: () => articleService.getArticles(),
    onSuccess: (data) => {
      console.log("Articles API Response:", data);
    },
    onError: (error) => {
      console.error("Articles fetch error:", error);
    },
  });

  const createMutation = useMutation({
    mutationFn: articleService.createArticle,
    onSuccess: (data) => {
      console.log("Article created successfully:", data);
      queryClient.invalidateQueries(["articles"]);
      setIsModalOpen(false);
      reset();
      alert("Article created successfully!");
    },
    onError: (error) => {
      console.error("Create article error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create article. Please try again.";
      alert(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => articleService.updateArticle(id, data),
    onSuccess: (data) => {
      console.log("Article updated successfully:", data);
      queryClient.invalidateQueries(["articles"]);
      setIsModalOpen(false);
      setEditingArticle(null);
      reset();
      alert("Article updated successfully!");
    },
    onError: (error) => {
      console.error("Update article error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update article. Please try again.";
      alert(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: articleService.deleteArticle,
    onSuccess: (data) => {
      console.log("Article deleted successfully:", data);
      queryClient.invalidateQueries(["articles"]);
      setSelectedArticles([]);
    },
    onError: (error) => {
      console.error("Delete article error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete article. Please try again.";
      alert(errorMessage);
    },
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      const allArticleIds = articles.map(
        (article) => article._id || article.id
      );
      setSelectedArticles(allArticleIds);
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSelectArticle = (articleId, checked) => {
    if (checked) {
      setSelectedArticles((prev) => [...prev, articleId]);
    } else {
      setSelectedArticles((prev) => prev.filter((id) => id !== articleId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) {
      alert("Please select articles to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedArticles.length} selected article(s)?`
      )
    ) {
      selectedArticles.forEach((id) => {
        deleteMutation.mutate(id);
      });
      setSelectedArticles([]);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setValue("title", article.title || "");
    setValue("description", article.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    console.log("Form data:", data);

    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
      console.log("Image file:", data.image[0]);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    if (editingArticle) {
      updateMutation.mutate({
        id: editingArticle._id || editingArticle.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    reset();
  };

  const getArticlesArray = () => {
    if (!articlesData) return [];

    console.log("Raw articles data:", articlesData);

    if (articlesData.status === 200 && articlesData.data) {
      if (Array.isArray(articlesData.data)) {
        return articlesData.data;
      }
      if (
        articlesData.data.articles &&
        Array.isArray(articlesData.data.articles)
      ) {
        return articlesData.data.articles;
      }
      if (articlesData.data.docs && Array.isArray(articlesData.data.docs)) {
        return articlesData.data.docs;
      }
      if (
        articlesData.data.results &&
        Array.isArray(articlesData.data.results)
      ) {
        return articlesData.data.results;
      }
    }

    if (Array.isArray(articlesData)) return articlesData;
    if (articlesData.data && Array.isArray(articlesData.data))
      return articlesData.data;
    if (articlesData.articles && Array.isArray(articlesData.articles))
      return articlesData.articles;

    return [];
  };

  const articles = getArticlesArray();
  const isAllSelected =
    selectedArticles.length === articles.length && articles.length > 0;
  const isSomeSelected = selectedArticles.length > 0;

  console.log("Processed articles array:", articles);
  console.log("Selected articles:", selectedArticles);

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
            Failed to load articles
          </div>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["articles"])}
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
            <h1 className="text-3xl font-bold mb-2">Articles</h1>
            <p className="text-orange-100">Manage your articles and content</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSomeSelected && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                disabled={deleteMutation.isPending}
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Selected ({selectedArticles.length})
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add new article
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {articles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No articles found</div>
            <p className="text-gray-400">
              Click "Add new article" to create your first article.
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article, index) => {
                  const articleId = article._id || article.id || index;
                  const isSelected = selectedArticles.includes(articleId);

                  return (
                    <tr
                      key={articleId}
                      className={isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectArticle(articleId, e.target.checked)
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          src={
                            article.image ||
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center"
                          }
                          alt={article.title || "Article"}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop&crop=center";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title || "Lorem Ipsum dolor sit amet"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {article.description ||
                            "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-2 py-1 rounded text-xs font-medium transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(articleId)}
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

            {/* Pagination Info */}
            <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
              Showing 1-12 of 1,253
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Article Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingArticle ? "Edit Article" : "Create Article"}
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
              placeholder="Enter article title"
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
              placeholder="Enter article description"
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
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="input-field"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload an image for the article (optional)
            </p>
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
                  {editingArticle ? "Update Article" : "Create Article"}
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Articles;
