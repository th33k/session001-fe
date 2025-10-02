import React from "react";
import { Outlet } from "react-router-dom";
import { Button } from "../../components/shared";
import { 
  LayoutGrid, 
  Package, 
  Tags, 
  BarChart3, 
  ClipboardList
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const InventoryLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Dashboard",
      path: "/inventory",
      icon: <LayoutGrid className="h-5 w-5" />,
      exact: true
    },
    {
      name: "Items",
      path: "/inventory/items",
      icon: <Package className="h-5 w-5" />
    },
    {
      name: "Categories",
      path: "/inventory/categories",
      icon: <Tags className="h-5 w-5" />
    },
    {
      name: "Reports",
      path: "/inventory/reports",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Activity",
      path: "/inventory/activity",
      icon: <ClipboardList className="h-5 w-5" />
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button
                  variant={isActive(item.path, item.exact) ? "primary" : "outline"}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default InventoryLayout;