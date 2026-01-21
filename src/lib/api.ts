// API Client Configuration
// This file sets up the base API client for connecting to Medusa backend

const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Products
  async getProducts(params?: { limit?: number; offset?: number; category_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.category_id) searchParams.set('category_id', params.category_id);

    return this.request(`/store/products?${searchParams.toString()}`);
  }

  async getProduct(id: string) {
    return this.request(`/store/products/${id}`);
  }

  // Categories
  async getCategories() {
    return this.request('/store/product-categories');
  }

  async getCategory(id: string) {
    return this.request(`/store/product-categories/${id}`);
  }

  // Cart
  async createCart() {
    return this.request('/store/carts', { method: 'POST' });
  }

  async getCart(cartId: string) {
    return this.request(`/store/carts/${cartId}`);
  }

  async addToCart(cartId: string, variantId: string, quantity: number) {
    return this.request(`/store/carts/${cartId}/line-items`, {
      method: 'POST',
      body: { variant_id: variantId, quantity },
    });
  }

  async updateCartItem(cartId: string, lineId: string, quantity: number) {
    return this.request(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'POST',
      body: { quantity },
    });
  }

  async removeCartItem(cartId: string, lineId: string) {
    return this.request(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: 'DELETE',
    });
  }

  // Customer Auth
  async login(email: string, password: string) {
    return this.request('/store/auth/token', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: { email: string; password: string; first_name: string; last_name: string }) {
    return this.request('/store/customers', {
      method: 'POST',
      body: data,
    });
  }

  async getCustomer() {
    return this.request('/store/customers/me');
  }

  async updateCustomer(data: Partial<{ first_name: string; last_name: string; phone: string }>) {
    return this.request('/store/customers/me', {
      method: 'POST',
      body: data,
    });
  }

  // Addresses
  async getAddresses() {
    return this.request('/store/customers/me/addresses');
  }

  async addAddress(data: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    postal_code: string;
  }) {
    return this.request('/store/customers/me/addresses', {
      method: 'POST',
      body: data,
    });
  }

  async updateAddress(addressId: string, data: Partial<{
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postal_code: string;
  }>) {
    return this.request(`/store/customers/me/addresses/${addressId}`, {
      method: 'POST',
      body: data,
    });
  }

  async deleteAddress(addressId: string) {
    return this.request(`/store/customers/me/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Checkout
  async setCartShippingAddress(cartId: string, address: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    postal_code: string;
  }) {
    return this.request(`/store/carts/${cartId}`, {
      method: 'POST',
      body: { shipping_address: address },
    });
  }

  async getShippingOptions(cartId: string) {
    return this.request(`/store/shipping-options/${cartId}`);
  }

  async setShippingMethod(cartId: string, optionId: string) {
    return this.request(`/store/carts/${cartId}/shipping-methods`, {
      method: 'POST',
      body: { option_id: optionId },
    });
  }

  async createPaymentSession(cartId: string) {
    return this.request(`/store/carts/${cartId}/payment-sessions`, {
      method: 'POST',
    });
  }

  async setPaymentSession(cartId: string, providerId: string) {
    return this.request(`/store/carts/${cartId}/payment-session`, {
      method: 'POST',
      body: { provider_id: providerId },
    });
  }

  async completeCart(cartId: string) {
    return this.request(`/store/carts/${cartId}/complete`, {
      method: 'POST',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/store/customers/me/orders');
  }

  async getOrder(orderId: string) {
    return this.request(`/store/orders/${orderId}`);
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
