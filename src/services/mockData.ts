import { QCItem, QCChecklistItem } from 'types/qc';

// Mock data for testing
export const mockQCItems: QCItem[] = [
  {
    id: 'qc-001',
    toolId: 'tool-001',
    toolName: 'Electric Drill HD250',
    returnDate: '2025-10-01T10:30:00Z',
    serialNumber: 'EDH250-2024-001',
    category: 'Power Tools',
    lastUsedBy: 'John Smith',
    returnReason: 'Job completion - routine return',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'qc-002',
    toolId: 'tool-002',
    toolName: 'Safety Harness Pro',
    returnDate: '2025-10-01T14:15:00Z',
    serialNumber: 'SHP-2024-045',
    category: 'Safety Equipment',
    lastUsedBy: 'Mike Johnson',
    returnReason: 'Possible wear on straps - requires inspection',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'qc-003',
    toolId: 'tool-003',
    toolName: 'Laser Level LX300',
    returnDate: '2025-10-02T09:00:00Z',
    serialNumber: 'LLX300-2024-012',
    category: 'Measuring Tools',
    lastUsedBy: 'Sarah Wilson',
    returnReason: 'Job completion - normal use',
    status: 'pending',
    priority: 'low'
  },
  {
    id: 'qc-004',
    toolId: 'tool-004',
    toolName: 'Impact Wrench IW500',
    returnDate: '2025-10-02T11:20:00Z',
    serialNumber: 'IW500-2024-089',
    category: 'Power Tools',
    lastUsedBy: 'David Brown',
    returnReason: 'Making unusual noise - needs check',
    status: 'pending',
    priority: 'high'
  },
  {
    id: 'qc-005',
    toolId: 'tool-005',
    toolName: 'Work Gloves Heavy Duty',
    returnDate: '2025-10-02T16:45:00Z',
    serialNumber: 'WGHD-2024-203',
    category: 'Safety Equipment',
    lastUsedBy: 'Lisa Anderson',
    returnReason: 'End of shift return',
    status: 'pending',
    priority: 'low'
  }
];

export const mockChecklists: Record<string, QCChecklistItem[]> = {
  'Power Tools': [
    {
      id: 'pt-001',
      category: 'Power Tools',
      description: 'Check power cord and plug for damage',
      requiresPhoto: true,
      isCritical: true
    },
    {
      id: 'pt-002',
      category: 'Power Tools',
      description: 'Test motor operation and unusual noises',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'pt-003',
      category: 'Power Tools',
      description: 'Inspect housing for cracks or damage',
      requiresPhoto: true,
      isCritical: true
    },
    {
      id: 'pt-004',
      category: 'Power Tools',
      description: 'Check safety guards and switches',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'pt-005',
      category: 'Power Tools',
      description: 'Verify all labels and warnings are intact',
      requiresPhoto: false,
      isCritical: false
    }
  ],
  'Safety Equipment': [
    {
      id: 'se-001',
      category: 'Safety Equipment',
      description: 'Inspect for cuts, tears, or fraying',
      requiresPhoto: true,
      isCritical: true
    },
    {
      id: 'se-002',
      category: 'Safety Equipment',
      description: 'Check hardware (buckles, D-rings, etc.)',
      requiresPhoto: true,
      isCritical: true
    },
    {
      id: 'se-003',
      category: 'Safety Equipment',
      description: 'Verify certification tags and dates',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'se-004',
      category: 'Safety Equipment',
      description: 'Test all adjustment mechanisms',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'se-005',
      category: 'Safety Equipment',
      description: 'Check for proper cleaning and sanitization',
      requiresPhoto: false,
      isCritical: false
    }
  ],
  'Measuring Tools': [
    {
      id: 'mt-001',
      category: 'Measuring Tools',
      description: 'Calibration accuracy test',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'mt-002',
      category: 'Measuring Tools',
      description: 'Check display/readout functionality',
      requiresPhoto: false,
      isCritical: true
    },
    {
      id: 'mt-003',
      category: 'Measuring Tools',
      description: 'Inspect physical condition and housing',
      requiresPhoto: true,
      isCritical: false
    },
    {
      id: 'mt-004',
      category: 'Measuring Tools',
      description: 'Verify battery life and charging',
      requiresPhoto: false,
      isCritical: false
    },
    {
      id: 'mt-005',
      category: 'Measuring Tools',
      description: 'Check carrying case and accessories',
      requiresPhoto: false,
      isCritical: false
    }
  ]
};