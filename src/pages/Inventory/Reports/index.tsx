import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card } from "../../../components/shared";
import { BarChart, Download } from "lucide-react";

// Temporary mock data for reports
const mockReportData = {
  inventoryValue: {
    total: 150000,
    byCategory: [
      { name: "Electronics", value: 45000, percentage: 30 },
      { name: "Furniture", value: 28000, percentage: 19 },
      { name: "Office Supplies", value: 12000, percentage: 8 },
      { name: "IT Equipment", value: 65000, percentage: 43 },
    ]
  },
  stockLevels: {
    totalItems: 253,
    inStock: 187,
    lowStock: 36,
    outOfStock: 30,
  },
  valueChange: [
    { month: "Jan", value: 142000 },
    { month: "Feb", value: 145000 },
    { month: "Mar", value: 148000 },
    { month: "Apr", value: 140000 },
    { month: "May", value: 143000 },
    { month: "Jun", value: 147000 },
    { month: "Jul", value: 145000 },
    { month: "Aug", value: 146000 },
    { month: "Sep", value: 149000 },
    { month: "Oct", value: 150000 }
  ]
};

const InventoryReports: React.FC = () => {
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState("value");
  const [reportData, setReportData] = useState(mockReportData);
  
  useEffect(() => {
    // In a real app, we'd fetch report data based on the type
    // dispatch(fetchInventoryReport(reportType));
  }, [reportType, dispatch]);

  const handleExportReport = (format) => {
    // In a real app, this would trigger a report download
    alert(`Exporting ${reportType} report as ${format}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Reports</h1>
        <div className="flex gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select report type"
          >
            <option value="value">Inventory Value</option>
            <option value="stock">Stock Levels</option>
            <option value="movement">Inventory Movement</option>
          </select>
          <button
            onClick={() => handleExportReport("pdf")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Export report as PDF"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Inventory Value Report */}
      {reportType === "value" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Total Inventory Value</h2>
              <div className="flex items-end gap-4">
                <div className="text-3xl font-bold">${reportData.inventoryValue.total.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mb-1">across {reportData.stockLevels.totalItems} items</div>
              </div>
              
              <h3 className="text-md font-semibold mt-6 mb-3">Value by Category</h3>
              <div className="space-y-4">
                {reportData.inventoryValue.byCategory.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span className="font-medium">${category.value.toLocaleString()} ({category.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Value Trend (Last 10 Months)</h2>
              <div className="h-64 flex items-end justify-between gap-1">
                {reportData.valueChange.map((month) => {
                  const maxValue = Math.max(...reportData.valueChange.map(m => m.value));
                  const heightPercentage = (month.value / maxValue) * 100;
                  
                  return (
                    <div key={month.month} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${heightPercentage}%` }}
                      ></div>
                      <div className="text-xs mt-1">{month.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Stock Levels Report */}
      {reportType === "stock" && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Stock Level Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Items</div>
                <div className="text-2xl font-bold">{reportData.stockLevels.totalItems}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">In Stock</div>
                <div className="text-2xl font-bold text-green-600">{reportData.stockLevels.inStock}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((reportData.stockLevels.inStock / reportData.stockLevels.totalItems) * 100)}% of inventory
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Low Stock</div>
                <div className="text-2xl font-bold text-yellow-600">{reportData.stockLevels.lowStock}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((reportData.stockLevels.lowStock / reportData.stockLevels.totalItems) * 100)}% of inventory
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Out of Stock</div>
                <div className="text-2xl font-bold text-red-600">{reportData.stockLevels.outOfStock}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((reportData.stockLevels.outOfStock / reportData.stockLevels.totalItems) * 100)}% of inventory
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-md font-semibold mb-4">Stock Status Distribution</h3>
              <div className="h-6 flex rounded-full overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ width: `${(reportData.stockLevels.inStock / reportData.stockLevels.totalItems) * 100}%` }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ width: `${(reportData.stockLevels.lowStock / reportData.stockLevels.totalItems) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500"
                  style={{ width: `${(reportData.stockLevels.outOfStock / reportData.stockLevels.totalItems) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">In Stock</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">Low Stock</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Out of Stock</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Placeholder for Inventory Movement Report */}
      {reportType === "movement" && (
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Inventory Movement</h2>
            <div className="h-64 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BarChart className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">Movement report data will appear here</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InventoryReports;