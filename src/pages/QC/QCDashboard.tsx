import React, { useState, useEffect } from 'react';
import { ClipboardCheck, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { QCItem } from 'types/qc';
import { QCApiService } from 'services/qcApi';
import QCItemsList from './QCItemsList';
import QCInspectionModal from './QCInspectionModal';
import BulkQCModal from './BulkQCModal';
import QCStatistics from './QCStatistics';

const QCDashboard: React.FC = () => {
  const [pendingItems, setPendingItems] = useState<QCItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<QCItem | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<QCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalInspected: 0,
    passRate: 0,
    damageRate: 0,
    avgInspectionTime: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, stats] = await Promise.all([
        QCApiService.getPendingQCItems(),
        QCApiService.getQCStatistics()
      ]);
      setPendingItems(items);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading QC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInspection = (item: QCItem) => {
    setSelectedItem(item);
    setShowInspectionModal(true);
  };

  const handleStartBulkInspection = () => {
    if (selectedItems.length === 0) {
      alert('Please select items for bulk inspection');
      return;
    }
    setShowBulkModal(true);
  };

  const handleInspectionComplete = () => {
    setShowInspectionModal(false);
    setShowBulkModal(false);
    setSelectedItem(null);
    setSelectedItems([]);
    loadData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Return Quality Control
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inspect returned tools to ensure they are safe for reuse
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending QC
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingItems.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pass Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.passRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Damage Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.damageRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.avgInspectionTime}m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={handleStartBulkInspection}
              disabled={selectedItems.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Bulk QC ({selectedItems.length})
            </button>
          </div>
        </div>

        {/* QC Items List */}
        <QCItemsList
          items={pendingItems}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          onStartInspection={handleStartInspection}
        />

        {/* QC Statistics Component */}
        <QCStatistics />

        {/* Modals */}
        {showInspectionModal && selectedItem && (
          <QCInspectionModal
            item={selectedItem}
            onClose={() => setShowInspectionModal(false)}
            onComplete={handleInspectionComplete}
          />
        )}

        {showBulkModal && (
          <BulkQCModal
            items={selectedItems}
            onClose={() => setShowBulkModal(false)}
            onComplete={handleInspectionComplete}
          />
        )}
      </div>
    </div>
  );
};

export default QCDashboard;