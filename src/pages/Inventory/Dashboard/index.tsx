import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../../components/shared";
import { Link } from "react-router-dom";
import { PieChart, BarChart, LineChart } from "lucide-react";

// This will be replaced with actual Redux selectors once we set those up
const mockData = {
  totalItems: 253,
  totalCategories: 8,
  lowStockItems: 15,
  recentActivity: [
    { id: 1, action: "Item Added", name: "Office Chair", date: "2025-10-01" },
    { id: 2, action: "Stock Updated", name: "Monitor 24\"", date: "2025-10-01" },
    { id: 3, action: "Item Removed", name: "Keyboard", date: "2025-09-30" },
  ],
  valueDistribution: [
    { category: "Electronics", value: 45000 },
    { category: "Furniture", value: 28000 },
    { category: "Office Supplies", value: 12000 },
    { category: "IT Equipment", value: 65000 },
  ],
};

const InventoryDashboard: React.FC = () => {
  const dispatch = useDispatch();
  // In a real implementation, we'd fetch from Redux store
  // const { totalItems, categories } = useSelector((state) => state.inventory);
  
  useEffect(() => {
    // Fetch dashboard data from the API
    // dispatch(loadInventorySummary());
    // dispatch(loadRecentActivity());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total Items</h3>
              <p className="text-2xl font-bold">{mockData.totalItems}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <Link to="/inventory/items" className="text-blue-500 hover:underline">View All Items</Link>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Categories</h3>
              <p className="text-2xl font-bold">{mockData.totalCategories}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <PieChart className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <Link to="/inventory/categories" className="text-green-500 hover:underline">Manage Categories</Link>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Low Stock Items</h3>
              <p className="text-2xl font-bold">{mockData.lowStockItems}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <LineChart className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <Link to="/inventory/items?filter=low-stock" className="text-red-500 hover:underline">View Low Stock</Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {mockData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <Link to="/inventory/activity" className="text-blue-500 hover:underline">View All Activity</Link>
          </div>
        </Card>

        {/* Value Distribution */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Inventory Value Distribution</h2>
            <div className="space-y-3">
              {mockData.valueDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.category}</span>
                    <span className="font-medium">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(item.value / mockData.valueDistribution.reduce((a, b) => a + b.value, 0)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 text-sm">
            <Link to="/inventory/reports" className="text-blue-500 hover:underline">View Detailed Reports</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;