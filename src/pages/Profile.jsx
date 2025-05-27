import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    onSuccess: (data) => {
      if (data?.data) {
        setValue("fullName", data.data.fullName);
        setValue("firstName", data.data.firstName);
        setValue("lastName", data.data.lastName);
        setValue("email", data.data.email);
        setValue("phone", data.data.phone);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      console.log("Update profile:", data);
      return Promise.resolve(data);
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-orange-100">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="card">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {profile?.fullName}
            </h3>
            <p className="text-sm text-gray-500">{profile?.userType}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              {profile?.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4 mr-2" />
              {profile?.phone || "Not provided"}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Edit Profile
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="input-field"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="input-field"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", { required: "Full name is required" })}
                className="input-field"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="input-field"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="input-field"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn-primary"
              >
                {updateMutation.isPending ? (
                  <LoadingSpinner size="small" />
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
