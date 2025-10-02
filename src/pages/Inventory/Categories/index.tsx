import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "../../../components/shared";
import { Plus, Edit, Trash2 } from "lucide-react";

// Temporary mock data
const mockCategories = [
  { id: 1, name: "Electronics", description: "Electronic devices and accessories", itemCount: 45 },
  { id: 2, name: "Furniture", description: "Office furniture and fixtures", itemCount: 23 },
  { id: 3, name: "Office Supplies", description: "General office supplies", itemCount: 67 },
  { id: 4, name: "IT Equipment", description: "Computer hardware and networking", itemCount: 31 },
];

const InventoryCategories: React.FC = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // In a real implementation, we'd fetch from Redux store
  // const { categories, loading, error } = useSelector((state) => state.inventory);
  
  useEffect(() => {
    // Fetch categories from API
    // dispatch(loadInventoryCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (id) => {
    // In a real app, we'd dispatch a delete action
    // dispatch(deleteInventoryCategory(id));
    
    // For now, just filter out the category
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Categories</h1>
        <Button onClick={handleAddCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditCategory(category)} 
                    className="text-blue-600 hover:text-blue-900"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Items in this category</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {category.itemCount}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Category Modal would go here in a real implementation */}
    </div>
  );
};

export default InventoryCategories;