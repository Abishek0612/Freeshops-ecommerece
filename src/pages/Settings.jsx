import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { TrashIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const {
    register: registerGeneral,
    handleSubmit: handleGeneralSubmit,
    formState: { errors: generalErrors },
  } = useForm({
    defaultValues: {
      websiteName: "Free Shops",
      tags: "#shopping #free #freeshoppingapp",
      phone: "+91-398 142 234",
      email: "freeshopsapp@gmail.com",
      currency: "disable",
    },
  });

  const {
    register: registerNotification,
    handleSubmit: handleNotificationSubmit,
    formState: { errors: notificationErrors },
  } = useForm();

  const updateSettingsMutation = useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      alert("Settings updated successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to update settings");
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: settingsService.sendNotification,
    onSuccess: () => {
      alert("Notification sent successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to send notification");
    },
  });

  const onGeneralSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    if (data.logo?.[0]) {
      formData.append("logo", data.logo[0]);
    }

    updateSettingsMutation.mutate(formData);
  };

  const onNotificationSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key]);
    });

    if (data.banner?.[0]) {
      formData.append("image", data.banner[0]);
    }

    sendNotificationMutation.mutate(formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-orange-100">Manage your application settings</p>
          </div>
          <TrashIcon className="w-6 h-6 text-white cursor-pointer hover:text-red-200" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6">
          <form
            onSubmit={handleGeneralSubmit(onGeneralSubmit)}
            className="space-y-6"
          >
            {/* Website Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Website Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-red-300">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">FS</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    {...registerGeneral("logo")}
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl cursor-pointer transition-colors"
                  >
                    Change Logo
                  </label>
                </div>
              </div>
            </div>

            {/* Website Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website Name
              </label>
              <input
                type="text"
                {...registerGeneral("websiteName", {
                  required: "Website name is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Free Shops"
              />
              {generalErrors.websiteName && (
                <p className="mt-1 text-sm text-red-600">
                  {generalErrors.websiteName.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                {...registerGeneral("tags")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="#shopping #free #freeshoppingapp"
              />
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contact
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  {...registerGeneral("phone")}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+91-398 142 234"
                />
                <input
                  type="email"
                  {...registerGeneral("email")}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="freeshopsapp@gmail.com"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Currency
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...registerGeneral("currency")}
                    value="enable"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...registerGeneral("currency")}
                    value="disable"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disable</span>
                </label>
              </div>
            </div>

            {/* Payment Gateway Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                enable/disable payment gateways
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Push Notification  */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Push Notification
          </h3>

          <form
            onSubmit={handleNotificationSubmit(onNotificationSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                {...registerNotification("headline", {
                  required: "Headline is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Headline"
              />
              {notificationErrors.headline && (
                <p className="mt-1 text-sm text-red-600">
                  {notificationErrors.headline.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...registerNotification("subHeadline")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Sub headline"
              />
            </div>

            <div>
              <textarea
                {...registerNotification("description")}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Description"
              />
            </div>

            {/* Upload Banner */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
              <div className="text-center">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="mx-auto max-h-40 rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400">
                    <p className="text-sm">No banner selected</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  {...registerNotification("banner")}
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="mt-4 inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl cursor-pointer transition-colors"
                >
                  Upload Banner
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sendNotificationMutation.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-medium transition-colors cursor-pointer flex items-center space-x-2"
              >
                {sendNotificationMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Push Notification</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing 1-12 of 1,253
        </div>
      </div>
    </div>
  );
};

export default Settings;
