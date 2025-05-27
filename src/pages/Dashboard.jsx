import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CustomLineChart from "../components/charts/LineChart";
import CustomAreaChart from "../components/charts/AreaChart";
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: authService.getDashboard,
  });

  const { data: graphData, isLoading: graphLoading } = useQuery({
    queryKey: ["graphData"],
    queryFn: () =>
      authService.getGraphData({ filterType: "year", value: "2025" }),
  });

  const getSalesData = () => {
    if (graphData?.data) {
      return [
        { name: "Jan", sales: graphData.data.january || 4000 },
        { name: "Feb", sales: graphData.data.february || 3000 },
        { name: "Mar", sales: graphData.data.march || 5000 },
        { name: "Apr", sales: graphData.data.april || 4500 },
        { name: "May", sales: graphData.data.may || 6000 },
        { name: "Jun", sales: graphData.data.june || 5500 },
      ];
    }
    return [
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 4500 },
      { name: "May", sales: 6000 },
      { name: "Jun", sales: 5500 },
    ];
  };

  const getRevenueData = () => {
    if (graphData?.data?.revenue) {
      return graphData.data.revenue;
    }
    return [
      { name: "Week 1", revenue: 12000 },
      { name: "Week 2", revenue: 15000 },
      { name: "Week 3", revenue: 18000 },
      { name: "Week 4", revenue: 22000 },
    ];
  };

  const getStats = () => {
    if (dashboardData?.data) {
      return [
        {
          title: "Active Users",
          value: dashboardData.data.activeUsers || "40,689",
          change: dashboardData.data.activeUsersChange || "+8.5%",
          changeType: "positive",
          icon: UsersIcon,
          color: "bg-blue-500",
        },
        {
          title: "Total Buyers",
          value: dashboardData.data.totalBuyers || "10,293",
          change: dashboardData.data.totalBuyersChange || "+1.3%",
          changeType: "positive",
          icon: UserPlusIcon,
          color: "bg-yellow-500",
        },
        {
          title: "Total Sellers",
          value: dashboardData.data.totalSellers || "2,040",
          change: dashboardData.data.totalSellersChange || "+1.8%",
          changeType: "positive",
          icon: ShoppingBagIcon,
          color: "bg-orange-500",
        },
        {
          title: "Total Sales",
          value: dashboardData.data.totalSales || "$89,000",
          change: dashboardData.data.totalSalesChange || "-4.3%",
          changeType: dashboardData.data.totalSalesChange?.includes("-")
            ? "negative"
            : "positive",
          icon: CurrencyDollarIcon,
          color: "bg-green-500",
        },
      ];
    }

    return [
      {
        title: "Active Users",
        value: "40,689",
        change: "+8.5%",
        changeType: "positive",
        icon: UsersIcon,
        color: "bg-blue-500",
      },
      {
        title: "Total Buyers",
        value: "10,293",
        change: "+1.3%",
        changeType: "positive",
        icon: UserPlusIcon,
        color: "bg-yellow-500",
      },
      {
        title: "Total Sellers",
        value: "2,040",
        change: "+1.8%",
        changeType: "positive",
        icon: ShoppingBagIcon,
        color: "bg-orange-500",
      },
      {
        title: "Total Sales",
        value: "$89,000",
        change: "-4.3%",
        changeType: "negative",
        icon: CurrencyDollarIcon,
        color: "bg-green-500",
      },
    ];
  };

  const stats = getStats();
  const salesData = getSalesData();
  const revenueData = getRevenueData();

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-orange-100">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {stat.changeType === "positive"
                    ? "Up from yesterday"
                    : "Down from yesterday"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sales Details
          </h3>
          {graphLoading ? (
            <div className="h-72 flex items-center justify-center">
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <CustomLineChart data={salesData} dataKey="sales" />
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
          {graphLoading ? (
            <div className="h-72 flex items-center justify-center">
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <CustomAreaChart data={revenueData} dataKey="revenue" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
