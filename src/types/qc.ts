// QC System Types
export interface QCItem {
  id: string;
  toolId: string;
  toolName: string;
  returnDate: string;
  serialNumber: string;
  category: string;
  lastUsedBy: string;
  returnReason: string;
  status: 'pending' | 'qc-passed' | 'damage-found' | 'damage-assessment';
  priority: 'low' | 'medium' | 'high';
}

export interface QCChecklistItem {
  id: string;
  category: string;
  description: string;
  requiresPhoto: boolean;
  isCritical: boolean;
  passed?: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface QCResult {
  itemId: string;
  checklistResults: QCChecklistResult[];
  overallStatus: 'pass' | 'damage-found';
  inspectorId: string;
  inspectionDate: string;
  notes?: string;
  photos: string[];
}

export interface QCChecklistResult {
  checklistItemId: string;
  passed: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface DamageAssessment {
  id: string;
  qcResultId: string;
  damageType: string;
  severity: 'minor' | 'moderate' | 'severe';
  repairEstimate?: number;
  repairNotes?: string;
  recommendedAction: 'repair' | 'replace' | 'dispose';
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface BulkQCSelection {
  selectedItems: QCItem[];
  commonChecklist: QCChecklistItem[];
}