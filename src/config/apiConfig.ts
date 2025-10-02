// Backend Configuration for .NET API
export const API_CONFIG = {
  // Base URL for the .NET backend API
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile'
    },
    
    // QC (Quality Control) endpoints
    QC: {
      BASE: '/api/qc',
      PENDING_ITEMS: '/api/qc/pending',
      ITEM_BY_ID: (id: string) => `/api/qc/items/${id}`,
      CHECKLIST: (category: string) => `/api/qc/checklist/${category}`,
      SUBMIT_RESULT: '/api/qc/results',
      BULK_RESULTS: '/api/qc/bulk-results',
      UPLOAD_PHOTO: '/api/qc/upload-photo',
      DAMAGE_ASSESSMENTS: '/api/qc/damage-assessments',
      HISTORY: '/api/qc/history',
      STATISTICS: '/api/qc/statistics'
    },
    
    // Tools management
    TOOLS: {
      BASE: '/api/tools',
      LIST: '/api/tools',
      BY_ID: (id: string) => `/api/tools/${id}`,
      CREATE: '/api/tools',
      UPDATE: (id: string) => `/api/tools/${id}`,
      DELETE: (id: string) => `/api/tools/${id}`,
      CATEGORIES: '/api/tools/categories',
      SEARCH: '/api/tools/search'
    },
    
    // Users management
    USERS: {
      BASE: '/api/users',
      LIST: '/api/users',
      BY_ID: (id: string) => `/api/users/${id}`,
      CREATE: '/api/users',
      UPDATE: (id: string) => `/api/users/${id}`,
      DELETE: (id: string) => `/api/users/${id}`
    },
    
    // Reports and analytics
    REPORTS: {
      BASE: '/api/reports',
      QC_SUMMARY: '/api/reports/qc-summary',
      DAMAGE_TRENDS: '/api/reports/damage-trends',
      INSPECTOR_PERFORMANCE: '/api/reports/inspector-performance',
      EXPORT: '/api/reports/export'
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000
  },
  
  // File upload configuration
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    CHUNK_SIZE: 1024 * 1024 // 1MB chunks for large files
  }
};

// Environment-specific configurations
export const ENV_CONFIG = {
  DEVELOPMENT: {
    API_BASE_URL: 'https://localhost:7001',
    ENABLE_MOCK_DATA: true,
    DEBUG_MODE: true
  },
  
  STAGING: {
    API_BASE_URL: 'https://staging-api.yourdomain.com',
    ENABLE_MOCK_DATA: false,
    DEBUG_MODE: true
  },
  
  PRODUCTION: {
    API_BASE_URL: 'https://api.yourdomain.com',
    ENABLE_MOCK_DATA: false,
    DEBUG_MODE: false
  }
};

// Get current environment configuration
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV as keyof typeof ENV_CONFIG;
  return ENV_CONFIG[env] || ENV_CONFIG.DEVELOPMENT;
};