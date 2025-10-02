import React from 'react';
import { CheckSquare, Square, Clock, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { QCItem } from 'types/qc';

interface QCItemsListProps {
  items: QCItem[];
  selectedItems: QCItem[];
  onSelectionChange: (selectedItems: QCItem[]) => void;
  onStartInspection: (item: QCItem) => void;
}

const QCItemsList: React.FC<QCItemsListProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onStartInspection
}) => {
  const handleSelectItem = (item: QCItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...items]);
    }
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-600" />,
    'qc-passed': <CheckCircle className="h-4 w-4 text-green-600" />,
    'damage-found': <AlertTriangle className="h-4 w-4 text-red-600" />,
    'damage-assessment': <Camera className="h-4 w-4 text-orange-600" />
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No items pending QC
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          All returned tools have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {selectedItems.length === items.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Select All ({items.length})
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedItems.length} of {items.length} selected
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {items.map((item) => {
          const isSelected = selectedItems.some(selected => selected.id === item.id);
          
          return (
            <div
              key={item.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSelectItem(item)}
                    className="flex-shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.toolName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[item.priority]}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        {statusIcons[item.status]}
                        {item.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Serial Number:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{item.serialNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Last Used By:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{item.lastUsedBy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Return Date:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(item.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="text-gray-500 dark:text-gray-400">Return Reason:</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.returnReason}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartInspection(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Start QC
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QCItemsList;