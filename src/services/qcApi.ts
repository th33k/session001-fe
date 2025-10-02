import { axiosInstance } from 'config/axios';
import { QCItem, QCResult, QCChecklistItem, DamageAssessment } from 'types/qc';
import { mockQCItems, mockChecklists } from './mockData';

// Enable mock mode for development
const USE_MOCK_DATA = true;

export class QCApiService {
  private static readonly BASE_URL = '/api/qc';

  // Get pending QC items
  static async getPendingQCItems(): Promise<QCItem[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockQCItems.filter(item => item.status === 'pending');
    }
    
    const response = await axiosInstance.get(`${this.BASE_URL}/pending`);
    return response.data;
  }

  // Get QC item by ID
  static async getQCItem(id: string): Promise<QCItem> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = mockQCItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      return item;
    }
    
    const response = await axiosInstance.get(`${this.BASE_URL}/items/${id}`);
    return response.data;
  }

  // Get checklist for a tool category
  static async getChecklist(category: string): Promise<QCChecklistItem[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockChecklists[category] || [];
    }
    
    const response = await axiosInstance.get(`${this.BASE_URL}/checklist/${category}`);
    return response.data;
  }

  // Submit QC result
  static async submitQCResult(qcResult: QCResult): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock: QC result submitted:', qcResult);
      return;
    }
    
    await axiosInstance.post(`${this.BASE_URL}/results`, qcResult);
  }

  // Submit bulk QC results
  static async submitBulkQCResults(results: QCResult[]): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Mock: Bulk QC results submitted:', results);
      return;
    }
    
    await axiosInstance.post(`${this.BASE_URL}/bulk-results`, { results });
  }

  // Upload photo
  static async uploadPhoto(file: File, itemId: string, checklistItemId: string): Promise<string> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Return a mock photo URL
      return `https://mock-storage.example.com/photos/${itemId}/${checklistItemId}/${file.name}`;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('itemId', itemId);
    formData.append('checklistItemId', checklistItemId);

    const response = await axiosInstance.post(`${this.BASE_URL}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.photoUrl;
  }

  // Create damage assessment
  static async createDamageAssessment(assessment: Omit<DamageAssessment, 'id'>): Promise<DamageAssessment> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `damage-${Date.now()}`,
        ...assessment
      };
    }
    
    const response = await axiosInstance.post(`${this.BASE_URL}/damage-assessments`, assessment);
    return response.data;
  }

  // Get QC history
  static async getQCHistory(page: number = 1, limit: number = 20): Promise<{ items: QCItem[]; total: number }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const allItems = mockQCItems.filter(item => item.status !== 'pending');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return {
        items: allItems.slice(startIndex, endIndex),
        total: allItems.length
      };
    }
    
    const response = await axiosInstance.get(`${this.BASE_URL}/history`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Get QC statistics
  static async getQCStatistics(dateRange?: { from: string; to: string }): Promise<{
    totalInspected: number;
    passRate: number;
    damageRate: number;
    avgInspectionTime: number;
  }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        totalInspected: 156,
        passRate: 87,
        damageRate: 13,
        avgInspectionTime: 8
      };
    }
    
    const response = await axiosInstance.get(`${this.BASE_URL}/statistics`, {
      params: dateRange
    });
    return response.data;
  }
}