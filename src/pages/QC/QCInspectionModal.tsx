import React, { useState, useEffect, useCallback } from 'react';
import { X, Camera, Check, AlertTriangle, FileText } from 'lucide-react';
import { QCItem, QCChecklistItem, QCResult, QCChecklistResult } from 'types/qc';
import { QCApiService } from 'services/qcApi';

interface QCInspectionModalProps {
  item: QCItem;
  onClose: () => void;
  onComplete: () => void;
}

const QCInspectionModal: React.FC<QCInspectionModalProps> = ({
  item,
  onClose,
  onComplete
}) => {
  const [checklist, setChecklist] = useState<QCChecklistItem[]>([]);
  const [checklistResults, setChecklistResults] = useState<QCChecklistResult[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<Record<string, boolean>>({});

  const loadChecklist = useCallback(async () => {
    try {
      setLoading(true);
      const checklistData = await QCApiService.getChecklist(item.category);
      setChecklist(checklistData);
      
      // Initialize checklist results
      const initialResults: QCChecklistResult[] = checklistData.map(item => ({
        checklistItemId: item.id,
        passed: false,
        notes: '',
        photoUrl: ''
      }));
      setChecklistResults(initialResults);
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  }, [item.category]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const updateChecklistResult = (checklistItemId: string, updates: Partial<QCChecklistResult>) => {
    setChecklistResults(prev =>
      prev.map(result =>
        result.checklistItemId === checklistItemId
          ? { ...result, ...updates }
          : result
      )
    );
  };

  const handlePhotoUpload = async (checklistItemId: string, file: File) => {
    try {
      setUploadingPhotos(prev => ({ ...prev, [checklistItemId]: true }));
      const photoUrl = await QCApiService.uploadPhoto(file, item.id, checklistItemId);
      updateChecklistResult(checklistItemId, { photoUrl });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhotos(prev => ({ ...prev, [checklistItemId]: false }));
    }
  };

  const getOverallStatus = (): 'pass' | 'damage-found' => {
    const hasFailures = checklistResults.some(result => !result.passed);
    return hasFailures ? 'damage-found' : 'pass';
  };

  const canSubmit = () => {
    // Check that all required photos are uploaded for failed checks
    const failedChecks = checklistResults.filter(result => !result.passed);
    const requiredPhotos = failedChecks.filter(result => {
      const checklistItem = checklist.find(item => item.id === result.checklistItemId);
      return checklistItem?.requiresPhoto;
    });
    
    return requiredPhotos.every(result => result.photoUrl);
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      alert('Please upload required photos for failed checks.');
      return;
    }

    try {
      setSubmitting(true);
      
      const qcResult: QCResult = {
        itemId: item.id,
        checklistResults,
        overallStatus: getOverallStatus(),
        inspectorId: 'current-user-id', // Replace with actual user ID
        inspectionDate: new Date().toISOString(),
        notes,
        photos: checklistResults.map(r => r.photoUrl).filter((url): url is string => Boolean(url))
      };

      await QCApiService.submitQCResult(qcResult);
      onComplete();
    } catch (error) {
      console.error('Error submitting QC result:', error);
      alert('Failed to submit QC result. Please try again.');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                QC Inspection: {item.toolName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Serial: {item.serialNumber} | Category: {item.category}
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

        {/* Content */}
        <div className="p-6">
          {/* Item Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
              <div>
                <span className="text-gray-500 dark:text-gray-400">Return Reason:</span>
                <p className="font-medium text-gray-900 dark:text-white">{item.returnReason}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Priority:</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{item.priority}</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inspection Checklist
            </h3>
            
            {checklist.map((checklistItem) => {
              const result = checklistResults.find(r => r.checklistItemId === checklistItem.id);
              
              return (
                <div
                  key={checklistItem.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
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
                        {checklistItem.requiresPhoto && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Photo Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Category: {checklistItem.category}
                      </p>
                    </div>
                  </div>

                  {/* Pass/Fail Buttons */}
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => updateChecklistResult(checklistItem.id, { passed: true })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        result?.passed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                      Pass
                    </button>
                    <button
                      onClick={() => updateChecklistResult(checklistItem.id, { passed: false })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        result?.passed === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Fail
                    </button>
                  </div>

                  {/* Notes */}
                  <div className="mb-3">
                    <textarea
                      placeholder="Add notes for this check..."
                      value={result?.notes || ''}
                      onChange={(e) => updateChecklistResult(checklistItem.id, { notes: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>

                  {/* Photo Upload */}
                  {(checklistItem.requiresPhoto || result?.passed === false) && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePhotoUpload(checklistItem.id, file);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                            {uploadingPhotos[checklistItem.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Camera className="h-4 w-4" />
                            )}
                            Upload Photo
                          </div>
                        </label>
                        {result?.photoUrl && (
                          <span className="text-green-600 text-sm flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            Photo uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Inspection Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about the inspection..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          {/* Status Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Inspection Status</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getOverallStatus() === 'pass' ? 'All checks passed' : 'Damage found - will create assessment task'}
                </p>
              </div>
              <div className={`px-3 py-2 rounded-lg font-medium ${
                getOverallStatus() === 'pass'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {getOverallStatus() === 'pass' ? 'QC PASSED' : 'DAMAGE FOUND'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit() || submitting}
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
                  Submit QC Result
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCInspectionModal;