import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conditionService } from "../../services/conditionService";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { useForm } from "react-hook-form";

const Conditions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: conditionsData, isLoading } = useQuery({
    queryKey: ["conditions"],
    queryFn: conditionService.getConditions,
  });

  const createMutation = useMutation({
    mutationFn: conditionService.createCondition,
    onSuccess: () => {
      queryClient.invalidateQueries(["conditions"]);
      setIsModalOpen(false);
      reset();
      alert("Condition created successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create condition");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => conditionService.updateCondition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["conditions"]);
      setIsModalOpen(false);
      setEditingCondition(null);
      reset();
      alert("Condition updated successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update condition");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: conditionService.deleteCondition,
    onSuccess: () => {
      queryClient.invalidateQueries(["conditions"]);
      alert("Condition deleted successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete condition");
    },
  });

  const handleEdit = (condition) => {
    setEditingCondition(condition);
    setValue("name", condition.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this condition?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingCondition) {
      updateMutation.mutate({ id: editingCondition._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getConditionsArray = () => {
    if (!conditionsData) return [];
    if (Array.isArray(conditionsData)) return conditionsData;
    if (conditionsData.data && Array.isArray(conditionsData.data))
      return conditionsData.data;
    return [];
  };

  const conditions = getConditionsArray();

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
            <h1 className="text-3xl font-bold mb-2">Conditions</h1>
            <p className="text-orange-100">Manage product conditions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center cursor-pointer"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add new condition
          </button>
        </div>
      </div>

      <div className="card">
        {conditions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">
              No conditions found
            </div>
            <p className="text-gray-400">
              Click "Add new condition" to create your first condition.
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
                    Old
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conditions.map((condition, index) => (
                  <tr
                    key={condition._id || condition.id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {condition.name || "Lorem Ipsum"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">3 Days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(condition)}
                          className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(condition._id || condition.id)
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
          setEditingCondition(null);
          reset();
        }}
        title={editingCondition ? "Edit Condition" : "Create Condition"}
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
              placeholder="Enter condition name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCondition(null);
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
              ) : editingCondition ? (
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

export default Conditions;
