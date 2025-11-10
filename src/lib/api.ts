/**
 * Centralized API client for FastAPI backend
 */

// API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  'https://jamii-backend-production.up.railway.app';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('jamii_token');
}

/**
 * Base fetch wrapper with auth headers
 */
async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response;
}

// API Client
const api = {
  // Authentication
  async login(email: string, password: string) {
    const response = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('jamii_token', data.access_token);
      if (data.user) {
        localStorage.setItem('jamii_user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  async register(userData: any) {
    const response = await apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('jamii_token', data.access_token);
      if (data.user) {
        localStorage.setItem('jamii_user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  async getCurrentUser() {
    const response = await apiFetch('/api/v1/auth/me');
    return response.json();
  },

  async logout() {
    const response = await apiFetch('/api/v1/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('jamii_token');
    localStorage.removeItem('jamii_user');
    return response.json();
  },

  // Jobs
  async getJobs(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    const response = await apiFetch(`/api/v1/jobs${query ? `?${query}` : ''}`);
    return response.json();
  },

  async getJob(jobId: string) {
    const response = await apiFetch(`/api/v1/jobs/${jobId}`);
    return response.json();
  },

  async createJob(jobData: any) {
    const response = await apiFetch('/api/v1/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return response.json();
  },

  async acceptJob(jobId: string) {
    const response = await apiFetch(`/api/v1/jobs/${jobId}/accept`, {
      method: 'POST',
    });
    return response.json();
  },

  async completeJob(jobId: string, completionData: any) {
    const response = await apiFetch(`/api/v1/jobs/${jobId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
    return response.json();
  },

  // Users
  async getUserProfile() {
    const response = await apiFetch('/api/v1/users/profile');
    return response.json();
  },

  async updateUserProfile(profileData: any) {
    const response = await apiFetch('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  async getHelpers() {
    const response = await apiFetch('/api/v1/users/helpers');
    return response.json();
  },

  async getHelperProfile(helperId: string) {
    const response = await apiFetch(`/api/v1/users/helpers/${helperId}`);
    return response.json();
  },

  async getUserStats() {
    const response = await apiFetch('/api/v1/users/stats');
    return response.json();
  },

  // Payments
  async getTransactions() {
    const response = await apiFetch('/api/v1/payments/transactions');
    return response.json();
  },

  async getPayouts() {
    const response = await apiFetch('/api/v1/payments/payouts');
    return response.json();
  },

  // Messaging
  async getConversations() {
    const response = await apiFetch('/api/v1/messaging/conversations');
    return response.json();
  },

  async getConversationMessages(conversationId: string) {
    const response = await apiFetch(`/api/v1/messaging/conversations/${conversationId}/messages`);
    return response.json();
  },

  async sendMessage(messageData: { recipient_id: string; job_id?: string; content: string }) {
    const response = await apiFetch('/api/v1/messaging/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.json();
  },

  async markMessageRead(messageId: string) {
    const response = await apiFetch('/api/v1/messaging/messages/mark-read', {
      method: 'PUT',
      body: JSON.stringify({ message_id: messageId }),
    });
    return response.json();
  },
};

export default api;

