import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import { QCApiService } from 'services/qcApi';

const QCStatistics: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0] // today
  });
  const [statistics, setStatistics] = useState({
    totalInspected: 0,
    passRate: 0,
    damageRate: 0,
    avgInspectionTime: 0
  });
  const [loading, setLoading] = useState(false);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await QCApiService.getQCStatistics(dateRange);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            QC Statistics
          </h3>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {statistics.totalInspected}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Inspected</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {statistics.passRate}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {statistics.damageRate}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Damage Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {statistics.avgInspectionTime}m
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Time</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QCStatistics;