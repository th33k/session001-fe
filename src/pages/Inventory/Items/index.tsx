import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "../../../components/shared";
import { Plus, Search, Filter, Edit, Trash2, AlertTriangle } from "lucide-react";

// Temporary mock data
const mockItems = [
  { id: 1, name: "Office Chair - Ergonomic", sku: "FRN-0023", category: "Furniture", stock: 15, minStock: 5, price: 299.99 },
  { id: 2, name: "Dell Monitor 24\"", sku: "ELC-0145", category: "Electronics", stock: 8, minStock: 10, price: 249.99 },
  { id: 3, name: "Wireless Keyboard", sku: "ELC-0067", category: "Electronics", stock: 23, minStock: 15, price: 59.99 },
  { id: 4, name: "Office Desk - Standard", sku: "FRN-0012", category: "Furniture", stock: 7, minStock: 3, price: 349.99 },
  { id: 5, name: "Printer Paper - 500 sheets", sku: "SUP-0098", category: "Office Supplies", stock: 45, minStock: 20, price: 12.99 },
];

const InventoryItems: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState(mockItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // In a real implementation, we'd fetch from Redux store
  // const { items, loading, error } = useSelector((state) => state.inventory);
  
  useEffect(() => {
    // Fetch items from API
    // dispatch(loadInventoryItems());
    
    // Filter items based on search term and category
    const filteredItems = mockItems.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "" || 
        item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setItems(filteredItems);
  }, [searchTerm, selectedCategory, dispatch]);

  const handleAddItem = () => {
    setCurrentItem(null);
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setShowAddModal(true);
  };

  const handleDeleteItem = (id) => {
    // In a real app, we'd dispatch a delete action
    // dispatch(deleteInventoryItem(id));
    
    // For now, just filter out the item
    setItems(items.filter(item => item.id !== id));
  };

  // Extract unique categories for the filter dropdown
  const categories = Array.from(new Set(mockItems.map(item => item.category)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Items</h1>
        <Button onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 h-5 w-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Items Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.stock < item.minStock ? (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      <span className={`text-sm ${item.stock < item.minStock ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                        {item.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Item Modal would go here in a real implementation */}
    </div>
  );
};

export default InventoryItems;