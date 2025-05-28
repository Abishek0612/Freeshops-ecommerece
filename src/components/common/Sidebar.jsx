import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ShoppingBagIcon,
  CogIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  TruckIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({ Product: true });

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Article", href: "/articles", icon: DocumentTextIcon },
    { name: "Auto dealership", href: "/auto-dealership", icon: TruckIcon },
    { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
    {
      name: "Blog",
      icon: DocumentTextIcon,
      expandable: true,
      subItems: [
        { name: "Blog Category", href: "/blog-categories" },
        { name: "Blog Page", href: "/blog" },
      ],
    },
    {
      name: "Product",
      icon: ShoppingBagIcon,
      expandable: true,
      subItems: [
        { name: "Product", href: "/products" },
        { name: "Category", href: "/products/categories" },
        { name: "Sub-category", href: "/products/sub-categories" },
        { name: "Conditions", href: "/products/conditions" },
      ],
    },
    { name: "User Management", href: "/users", icon: UsersIcon },
    { name: "Order", href: "/orders", icon: ShoppingCartIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
  ];

  const isActive = (href) => location.pathname === href;
  const isParentActive = (subItems) =>
    subItems?.some((item) => isActive(item.href));

  return (
    <div className="bg-white w-64 shadow-lg h-full overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">FS</span>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-800">Free Shops</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedMenus[item.name];
          const isItemActive = hasSubItems
            ? isParentActive(item.subItems)
            : isActive(item.href);

          return (
            <div key={item.name}>
              {hasSubItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors cursor-pointer rounded-r-2xl mr-4 ${
                      isItemActive
                        ? "bg-teal-50 text-teal-600 border-r-2 border-teal-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="bg-gray-50 border-l-2 border-gray-200 ml-6">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.href}
                          className={({ isActive }) =>
                            `block px-6 py-2 text-sm ${
                              isActive
                                ? "text-teal-600 font-semibold"
                                : "text-gray-600 hover:text-gray-800"
                            }`
                          }
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 text-sm font-medium rounded-r-2xl mr-4 transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-600 border-r-2 border-teal-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
