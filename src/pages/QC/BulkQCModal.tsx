import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, AlertTriangle, FileText, Package } from 'lucide-react';
import { QCItem, QCChecklistItem, QCResult, QCChecklistResult } from 'types/qc';
import { QCApiService } from 'services/qcApi';

interface BulkQCModalProps {
  items: QCItem[];
  onClose: () => void;
  onComplete: () => void;
}

const BulkQCModal: React.FC<BulkQCModalProps> = ({
  items,
  onClose,
  onComplete
}) => {
  const [commonChecklist, setCommonChecklist] = useState<QCChecklistItem[]>([]);
  const [bulkResults, setBulkResults] = useState<Record<string, QCChecklistResult[]>>({});
  const [commonNotes, setCommonNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'overview' | 'checklist' | 'review'>('overview');

  const loadCommonChecklist = useCallback(async () => {
    try {
      setLoading(true);
      // Get the most common category for bulk checklist
      const categories = items.map(item => item.category);
      const categoryCount = categories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommonCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0][0];

      const checklistData = await QCApiService.getChecklist(mostCommonCategory);
      setCommonChecklist(checklistData);
      
      // Initialize results for all items
      const initialResults: Record<string, QCChecklistResult[]> = {};
      items.forEach(item => {
        initialResults[item.id] = checklistData.map(checklistItem => ({
          checklistItemId: checklistItem.id,
          passed: false,
          notes: '',
          photoUrl: ''
        }));
      });
      setBulkResults(initialResults);
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  }, [items]);

  useEffect(() => {
    loadCommonChecklist();
  }, [loadCommonChecklist]);

  const updateItemResult = (itemId: string, checklistItemId: string, updates: Partial<QCChecklistResult>) => {
    setBulkResults(prev => ({
      ...prev,
      [itemId]: prev[itemId].map(result =>
        result.checklistItemId === checklistItemId
          ? { ...result, ...updates }
          : result
      )
    }));
  };

  const applyToAllItems = (checklistItemId: string, passed: boolean) => {
    setBulkResults(prev => {
      const updated = { ...prev };
      items.forEach(item => {
        updated[item.id] = updated[item.id].map(result =>
          result.checklistItemId === checklistItemId
            ? { ...result, passed }
            : result
        );
      });
      return updated;
    });
  };

  const getItemStatus = (itemId: string): 'pass' | 'damage-found' => {
    const results = bulkResults[itemId] || [];
    return results.some(result => !result.passed) ? 'damage-found' : 'pass';
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const qcResults: QCResult[] = items.map(item => ({
        itemId: item.id,
        checklistResults: bulkResults[item.id],
        overallStatus: getItemStatus(item.id),
        inspectorId: 'current-user-id', // Replace with actual user ID
        inspectionDate: new Date().toISOString(),
        notes: commonNotes,
        photos: bulkResults[item.id].map(r => r.photoUrl).filter((url): url is string => Boolean(url))
      }));

      await QCApiService.submitBulkQCResults(qcResults);
      onComplete();
    } catch (error) {
      console.error('Error submitting bulk QC results:', error);
      alert('Failed to submit bulk QC results. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-2 text-gray-600 dark:text-gray-400">Loading checklist...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bulk QC Inspection
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You are about to perform quality control on {items.length} items. 
          The common checklist will be applied to all selected items.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-white">Selected Items:</h4>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {items.map(item => (
            <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{item.toolName}</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Serial: {item.serialNumber} | Category: {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep('checklist')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Start Bulk Inspection
        </button>
      </div>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {commonChecklist.map((checklistItem) => (
          <div key={checklistItem.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {checklistItem.description}
                  </h4>
                  {checklistItem.isCritical && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {checklistItem.category}
                </p>
              </div>
            </div>

            {/* Bulk Action Buttons */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => applyToAllItems(checklistItem.id, true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                Pass All
              </button>
              <button
                onClick={() => applyToAllItems(checklistItem.id, false)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Fail All
              </button>
            </div>

            {/* Individual Item Results */}
            <div className="space-y-2">
              {items.map(item => {
                const result = bulkResults[item.id]?.find(r => r.checklistItemId === checklistItem.id);
                
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.toolName} ({item.serialNumber})
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemResult(item.id, checklistItem.id, { passed: true })}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            result?.passed
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => updateItemResult(item.id, checklistItem.id, { passed: false })}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            result?.passed === false
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common Notes (Applied to all items)
        </label>
        <textarea
          value={commonNotes}
          onChange={(e) => setCommonNotes(e.target.value)}
          placeholder="Add notes that apply to all items..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('overview')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep('review')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Review Results
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bulk QC Results Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => getItemStatus(item.id) === 'pass').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Items Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {items.filter(item => getItemStatus(item.id) === 'damage-found').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Damage Found</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.toolName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Serial: {item.serialNumber}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium text-sm ${
                getItemStatus(item.id) === 'pass'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {getItemStatus(item.id) === 'pass' ? 'QC PASSED' : 'DAMAGE FOUND'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('checklist')}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
        >
          Back to Checklist
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Submit Bulk Results
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Bulk QC Inspection
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {items.length} items selected for inspection
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center space-x-8">
            {(['overview', 'checklist', 'review'] as const).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : index < (['overview', 'checklist', 'review'] as const).indexOf(currentStep)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'overview' && renderOverview()}
          {currentStep === 'checklist' && renderChecklist()}
          {currentStep === 'review' && renderReview()}
        </div>
      </div>
    </div>
  );
};

export default BulkQCModal;