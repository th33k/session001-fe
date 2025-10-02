import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card } from "../../../components/shared";
import { Search, Filter, Calendar } from "lucide-react";

// Temporary mock data
const mockActivities = [
  { id: 1, action: "Item Added", name: "Office Chair", user: "John Smith", date: "2025-10-01 09:15:22" },
  { id: 2, action: "Stock Updated", name: "Monitor 24\"", quantity: "+5", user: "Jane Doe", date: "2025-10-01 10:30:45" },
  { id: 3, action: "Item Removed", name: "Keyboard", user: "Michael Brown", date: "2025-09-30 15:22:17" },
  { id: 4, action: "Category Added", name: "IT Equipment", user: "Sarah Wilson", date: "2025-09-30 11:05:33" },
  { id: 5, action: "Stock Updated", name: "Office Desk", quantity: "-2", user: "John Smith", date: "2025-09-29 14:45:12" },
  { id: 6, action: "Item Added", name: "Printer Paper", user: "Jane Doe", date: "2025-09-28 09:10:25" },
  { id: 7, action: "Stock Updated", name: "Wireless Mouse", quantity: "+10", user: "Michael Brown", date: "2025-09-27 16:35:41" },
  { id: 8, action: "Category Modified", name: "Electronics", user: "Sarah Wilson", date: "2025-09-26 13:20:08" },
  { id: 9, action: "Item Removed", name: "Filing Cabinet", user: "John Smith", date: "2025-09-25 10:55:37" },
  { id: 10, action: "Stock Updated", name: "Desk Lamp", quantity: "+3", user: "Jane Doe", date: "2025-09-24 14:30:19" },
];

const InventoryActivity: React.FC = () => {
  const dispatch = useDispatch();
  const [activities, setActivities] = useState(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    // In a real app, we'd fetch activity logs from API
    // dispatch(fetchInventoryActivity(dateRange));
    
    // Filter activities based on search and filters
    const filteredActivities = mockActivities.filter(activity => {
      const matchesSearch = searchTerm === "" || 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = actionFilter === "" || activity.action === actionFilter;
      
      // Date filtering would go here in a real implementation
      
      return matchesSearch && matchesAction;
    });
    
    setActivities(filteredActivities);
  }, [searchTerm, actionFilter, dateRange, dispatch]);

  // Extract unique actions for the filter dropdown
  const actions = Array.from(new Set(mockActivities.map(activity => activity.action)));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Activity Log</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by item or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 h-5 w-5" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by action"
          >
            <option value="">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400 h-5 w-5" />
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Start date"
            />
            <span className="self-center text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="End date"
            />
          </div>
        </div>
      </div>
      
      {/* Activity List */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center border-b pb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      activity.action.includes("Added") ? "bg-green-100 text-green-800" :
                      activity.action.includes("Updated") ? "bg-blue-100 text-blue-800" :
                      activity.action.includes("Removed") ? "bg-red-100 text-red-800" :
                      "bg-purple-100 text-purple-800"
                    }`}>
                      {activity.action}
                    </span>
                    <span className="font-medium">{activity.name}</span>
                    {activity.quantity && (
                      <span className={`text-sm ${
                        activity.quantity.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}>
                        {activity.quantity}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    By {activity.user}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination would go here in a real implementation */}
          <div className="mt-4 flex justify-center">
            <nav className="inline-flex space-x-1" aria-label="Pagination">
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-500 bg-white hover:bg-gray-50"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button 
                className="px-3 py-1 border rounded text-sm text-white bg-blue-600"
                aria-label="Page 1"
              >
                1
              </button>
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-500 bg-white hover:bg-gray-50"
                aria-label="Page 2"
              >
                2
              </button>
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-500 bg-white hover:bg-gray-50"
                aria-label="Page 3"
              >
                3
              </button>
              <button 
                className="px-3 py-1 border rounded text-sm text-gray-500 bg-white hover:bg-gray-50"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventoryActivity;