# CURSOR Integration Guide - Backend API Development

## 🎯 Overview
This guide provides comprehensive instructions for CURSOR to integrate the frontend components with the backend Node.js + PostgreSQL + Redis system.

## 🔧 API Client Setup

### **Base Configuration**
\`\`\`typescript
// File: lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
\`\`\`

## 🔐 Authentication Integration

### **Login API Integration**
\`\`\`typescript
// File: lib/auth.ts
interface LoginCredentials {
  email: string;
  password: string;
  company: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
  permissions: string[];
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  
  // Store tokens
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  
  return response.data;
};

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  
  localStorage.setItem('authToken', response.data.token);
  return response.data.token;
};
\`\`\`

## 📊 Module-Specific Integration

### **Financial Management APIs**
\`\`\`typescript
// File: lib/api/financial.ts
export const financialAPI = {
  // Chart of Accounts
  getAccounts: () => apiClient.get('/financial/accounts'),
  createAccount: (data: ChartOfAccount) => apiClient.post('/financial/accounts', data),
  updateAccount: (id: string, data: Partial<ChartOfAccount>) => 
    apiClient.put(`/financial/accounts/${id}`, data),
  deleteAccount: (id: string) => apiClient.delete(`/financial/accounts/${id}`),
  
  // Financial Metrics
  getMetrics: () => apiClient.get('/financial/metrics'),
  
  // Journal Entries
  getJournalEntries: (params?: any) => apiClient.get('/financial/journal-entries', { params }),
  createJournalEntry: (data: JournalEntry) => apiClient.post('/financial/journal-entries', data),
};
\`\`\`

### **Master Data Management APIs**
\`\`\`typescript
// File: lib/api/mdm.ts
export const mdmAPI = {
  // Generic MDM operations
  getDomainData: (domain: string, params?: any) => 
    apiClient.get(`/mdm/${domain}`, { params }),
  createRecord: (domain: string, data: any) => 
    apiClient.post(`/mdm/${domain}`, data),
  updateRecord: (domain: string, id: string, data: any) => 
    apiClient.put(`/mdm/${domain}/${id}`, data),
  deleteRecord: (domain: string, id: string) => 
    apiClient.delete(`/mdm/${domain}/${id}`),
  
  // Approval workflow
  approveRecord: (domain: string, id: string) => 
    apiClient.post(`/mdm/${domain}/${id}/approve`),
  rejectRecord: (domain: string, id: string, reason: string) => 
    apiClient.post(`/mdm/${domain}/${id}/reject`, { reason }),
  
  // Bulk operations
  bulkImport: (domain: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/mdm/${domain}/bulk-import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Audit trail
  getAuditTrail: (domain: string, id: string) => 
    apiClient.get(`/mdm/${domain}/${id}/audit`),
};
\`\`\`

### **Materials Management APIs**
\`\`\`typescript
// File: lib/api/materials.ts
export const materialsAPI = {
  // Inventory Management
  getInventory: (params?: any) => apiClient.get('/materials/inventory', { params }),
  getStockLevels: (materialId: string) => 
    apiClient.get(`/materials/inventory/${materialId}`),
  recordStockMovement: (data: StockMovement) => 
    apiClient.post('/materials/stock-movement', data),
  
  // Batch Tracking
  getBatchTracking: (params?: any) => 
    apiClient.get('/materials/batch-tracking', { params }),
  getExpiryAlerts: () => apiClient.get('/materials/expiry-alerts'),
  
  // Procurement
  getRequisitions: (params?: any) => 
    apiClient.get('/procurement/requisitions', { params }),
  createRequisition: (data: PurchaseRequisition) => 
    apiClient.post('/procurement/requisitions', data),
  
  // Purchase Orders
  getPurchaseOrders: (params?: any) => 
    apiClient.get('/procurement/purchase-orders', { params }),
  createPurchaseOrder: (data: PurchaseOrder) => 
    apiClient.post('/procurement/purchase-orders', data),
  
  // Goods Receipt
  getGoodsReceipts: (params?: any) => 
    apiClient.get('/procurement/goods-receipt', { params }),
  processGoodsReceipt: (data: GoodsReceipt) => 
    apiClient.post('/procurement/goods-receipt', data),
  
  // Vendor Performance
  getVendorPerformance: (vendorId?: string) => 
    apiClient.get('/procurement/vendor-performance', { 
      params: vendorId ? { vendorId } : {} 
    }),
  
  // Warehouse Management
  getWarehouseLocations: () => apiClient.get('/warehouse/locations'),
  getWarehouseTasks: (params?: any) => 
    apiClient.get('/warehouse/tasks', { params }),
  recordWarehouseMovement: (data: WarehouseMovement) => 
    apiClient.post('/warehouse/movements', data),
  getWarehouseCapacity: () => apiClient.get('/warehouse/capacity'),
  
  // Advanced Features
  getMRPData: () => apiClient.get('/materials/mrp'),
  getReorderPoints: () => apiClient.get('/materials/reorder-points'),
  getConsumptionPatterns: (materialId: string) => 
    apiClient.get(`/materials/consumption-patterns/${materialId}`),
  getMultiPlantInventory: () => apiClient.get('/materials/multi-plant'),
};
\`\`\`

## 🔄 Real-time Integration

### **WebSocket Setup**
\`\`\`typescript
// File: lib/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Real-time notifications
    this.socket.on('notification', (data) => {
      // Handle real-time notifications
      this.handleNotification(data);
    });

    // Inventory updates
    this.socket.on('inventory-update', (data) => {
      // Handle real-time inventory changes
      this.handleInventoryUpdate(data);
    });
  }

  private handleNotification(data: any) {
    // Implement notification handling
  }

  private handleInventoryUpdate(data: any) {
    // Implement inventory update handling
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
\`\`\`

## 📝 Data Validation

### **TypeScript Interfaces**
\`\`\`typescript
// File: types/api.ts
export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  level: number;
  hasChildren: boolean;
  parent?: string;
}

export interface PurchaseRequisition {
  id?: string;
  requestorId: string;
  departmentId: string;
  items: PRItem[];
  totalAmount: number;
  currency: string;
  requestDate: string;
  requiredDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvalWorkflow?: ApprovalStep[];
}

export interface StockMovement {
  materialId: string;
  locationId: string;
  movementType: 'receipt' | 'issue' | 'transfer' | 'adjustment';
  quantity: number;
  unit: string;
  batchNumber?: string;
  serialNumber?: string;
  referenceDocument?: string;
  notes?: string;
}
\`\`\`

## 🧪 Testing Integration

### **API Testing Setup**
\`\`\`typescript
// File: __tests__/api/financial.test.ts
import { financialAPI } from '@/lib/api/financial';
import { mockApiClient } from '@/lib/__mocks__/api-client';

jest.mock('@/lib/api-client');

describe('Financial API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch chart of accounts', async () => {
    const mockAccounts = [
      { id: '1', code: '1000', name: 'Cash', type: 'Asset' }
    ];
    
    mockApiClient.get.mockResolvedValue({ data: mockAccounts });
    
    const result = await financialAPI.getAccounts();
    
    expect(mockApiClient.get).toHaveBeenCalledWith('/financial/accounts');
    expect(result.data).toEqual(mockAccounts);
  });
});
\`\`\`

## 🚀 Deployment Configuration

### **Environment Variables**
\`\`\`bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.feebee-erp.com
NEXT_PUBLIC_WS_URL=wss://ws.feebee-erp.com
NEXT_PUBLIC_APP_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://erp.feebee-ae.com
\`\`\`

## 📋 Implementation Checklist

### **Phase 1: Authentication & Core Setup**
- [ ] Set up API client with interceptors
- [ ] Implement JWT authentication flow
- [ ] Add token refresh mechanism
- [ ] Create error handling patterns

### **Phase 2: Module Integration**
- [ ] Financial Management API integration
- [ ] Master Data Management API integration
- [ ] Materials Management API integration
- [ ] Dashboard metrics integration

### **Phase 3: Advanced Features**
- [ ] WebSocket real-time updates
- [ ] File upload handling
- [ ] Bulk operations support
- [ ] Audit trail integration

### **Phase 4: Testing & Optimization**
- [ ] Unit tests for API functions
- [ ] Integration tests for workflows
- [ ] Performance optimization
- [ ] Error boundary implementation

---

**Priority**: High | **Complexity**: Medium | **Timeline**: 2-3 weeks
