/**
 * Spud Center API SDK
 * 
 * Usage:
 * const sdk = new SpudCenterSDK('https://api.your-domain.com', 'your-auth-token');
 * 
 * Or use without token for public endpoints:
 * const sdk = new SpudCenterSDK('https://api.your-domain.com');
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface NodeData {
  name: string;
  url: string;
  description?: string;
  tags?: string[];
  status?: string;
  metadata?: Record<string, any>;
}

export interface Node extends NodeData {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreviewData {
  nodeId: string;
  url: string;
}

export interface Preview {
  _id: string;
  nodeId: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  createdAt: string;
}

export interface APIError {
  message: string;
  status: number;
  data?: any;
}

export class SpudCenterSDK {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.token = token || null;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      const error: APIError = {
        message: result.message || 'API Error',
        status: response.status,
        data: result,
      };
      throw error;
    }

    return result as T;
  }

  // ========== AUTH ENDPOINTS ==========

  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/auth/register', {
      email,
      password,
    });
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('POST', '/auth/login', {
      email,
      password,
    });
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    return this.request<User>('GET', '/auth/me');
  }

  /**
   * Logout
   */
  async logout(): Promise<{ message: string }> {
    return this.request('POST', '/auth/logout');
  }

  // ========== NODE ENDPOINTS ==========

  /**
   * Create a new node
   */
  async createNode(data: NodeData): Promise<Node> {
    return this.request<Node>('POST', '/nodes', data);
  }

  /**
   * Get all nodes
   */
  async listNodes(): Promise<Node[]> {
    return this.request<Node[]>('GET', '/nodes');
  }

  /**
   * Get node by ID
   */
  async getNode(nodeId: string): Promise<Node> {
    return this.request<Node>('GET', `/nodes/${nodeId}`);
  }

  /**
   * Update node
   */
  async updateNode(nodeId: string, data: Partial<NodeData>): Promise<Node> {
    return this.request<Node>('PUT', `/nodes/${nodeId}`, data);
  }

  /**
   * Delete node
   */
  async deleteNode(nodeId: string): Promise<{ message: string }> {
    return this.request('DELETE', `/nodes/${nodeId}`);
  }

  // ========== PREVIEW ENDPOINTS ==========

  /**
   * Create a preview for a node
   */
  async createPreview(nodeId: string, url: string): Promise<Preview> {
    return this.request<Preview>('POST', '/preview', {
      nodeId,
      url,
    });
  }

  /**
   * Get preview for node
   */
  async getNodePreview(nodeId: string): Promise<Preview> {
    return this.request<Preview>('GET', `/preview/node/${nodeId}`);
  }

  /**
   * Get preview by ID
   */
  async getPreview(previewId: string): Promise<Preview> {
    return this.request<Preview>('GET', `/preview/${previewId}`);
  }

  /**
   * Update preview
   */
  async updatePreview(previewId: string, url: string): Promise<Preview> {
    return this.request<Preview>('PUT', `/preview/${previewId}`, { url });
  }

  /**
   * Delete preview
   */
  async deletePreview(previewId: string): Promise<{ message: string }> {
    return this.request('DELETE', `/preview/${previewId}`);
  }
}

// Export for use in different environments
export default SpudCenterSDK;
