import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "../services/jobService";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";
import {
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const queryClient = useQueryClient();

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => jobService.getJobs(filters),
    retry: 2,
    onError: (error) => {
      console.error("Jobs fetch error:", error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => jobService.updateJob(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      alert("Job status updated successfully!");
    },
    onError: (error) => {
      console.error("Update status error:", error);
      alert("Failed to update job status. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      alert("Job deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete job error:", error);
      alert("Failed to delete job. Please try again.");
    },
  });

  const handleStatusChange = (jobId, newStatus) => {
    if (
      window.confirm(
        `Are you sure you want to change the status to ${newStatus}?`
      )
    ) {
      updateStatusMutation.mutate({ id: jobId, status: newStatus });
    }
  };

  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteMutation.mutate(jobId);
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      [JOB_STATUS.VACANT]: "bg-yellow-100 text-yellow-800",
      [JOB_STATUS.FILLED]: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "Vacant"}
      </span>
    );
  };

  const getJobsArray = () => {
    if (!jobsData) return [];

    if (jobsData.status === 200 && jobsData.data) {
      if (Array.isArray(jobsData.data)) {
        return jobsData.data;
      }
      if (jobsData.data.jobs && Array.isArray(jobsData.data.jobs)) {
        return jobsData.data.jobs;
      }
      if (jobsData.data.docs && Array.isArray(jobsData.data.docs)) {
        return jobsData.data.docs;
      }
    }

    if (Array.isArray(jobsData)) return jobsData;
    if (jobsData.data && Array.isArray(jobsData.data)) return jobsData.data;
    if (Array.isArray(jobsData.jobs)) return jobsData.jobs;

    return [];
  };

  const jobs = getJobsArray();

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
          <div className="text-red-500 text-lg mb-2">Failed to load jobs</div>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Jobs</h1>
            <p className="text-orange-100">
              Manage job listings and applications
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
              placeholder="Search jobs..."
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
              <option value={JOB_STATUS.VACANT}>Vacant</option>
              <option value={JOB_STATUS.FILLED}>Filled</option>
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

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No jobs found</div>
            <p className="text-gray-400">Job listings will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type of job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <tr
                    key={job._id || job.id || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.id || job._id || `#${8765 + index}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title || "Lorem Ipsum"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {job.description ||
                          "consectetur adipiscing elit, sed do"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.salary || "8-9 LPA"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.location || "Pune"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.typeOfJob || job.jobType || "Remote"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={job.status || JOB_STATUS.VACANT}
                        onChange={(e) =>
                          handleStatusChange(job._id || job.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                        disabled={updateStatusMutation.isPending}
                      >
                        <option value={JOB_STATUS.VACANT}>Vacant</option>
                        <option value={JOB_STATUS.FILLED}>Filled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(job)}
                          className="text-teal-600 hover:text-teal-900 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id || job.id)}
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

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
              Showing 1-12 of 1,253
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Job Details"
        size="xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Job Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <strong>Job ID:</strong> {selectedJob.id || selectedJob._id}
                  </p>
                  <p>
                    <strong>Title:</strong> {selectedJob.title}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedJob.status)}
                  </p>
                  <p>
                    <strong>Salary:</strong> {selectedJob.salary}
                  </p>
                  <p>
                    <strong>Job Type:</strong>{" "}
                    {selectedJob.typeOfJob || selectedJob.jobType}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Location & Details
                </h4>
                <div className="space-y-2">
                  <p>
                    <strong>Location:</strong> {selectedJob.location}
                  </p>
                  <p>
                    <strong>Posted Date:</strong>{" "}
                    {selectedJob.createdAt
                      ? new Date(selectedJob.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {selectedJob.description && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Description:
                </p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
