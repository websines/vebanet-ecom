import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Product,
  CartItem,
  User,
  Address,
  WishlistItem,
  Order,
  CheckoutStep,
  ShippingMethod,
  Notification,
} from '@/types';

// ==================== CART STORE ====================
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price || 0;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'vebanet-cart',
    }
  )
);

// ==================== UI STORE ====================
interface UIState {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register' | 'forgot-password';
  activeCategory: string | null;
  setMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean, view?: 'login' | 'register' | 'forgot-password') => void;
  setActiveCategory: (category: string | null) => void;
  toggleMenu: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
  authModalView: 'login',
  activeCategory: null,

  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setAuthModalOpen: (open, view = 'login') =>
    set({ isAuthModalOpen: open, authModalView: view }),
  setActiveCategory: (category) => set({ activeCategory: category }),

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

// ==================== AUTH STORE ====================
interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: Address[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Mock user for demo
const mockUser: User = {
  id: 'user-1',
  email: 'demo@vebanet.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 234 567 890',
  createdAt: new Date().toISOString(),
};

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'United States',
    phone: '+1 234 567 890',
    isDefault: true,
  },
];

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      addresses: [],

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock login - accept any email/password for demo
        set({
          user: { ...mockUser, email },
          isAuthenticated: true,
          isLoading: false,
          addresses: mockAddresses,
        });
        return true;
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({
          user: {
            id: `user-${Date.now()}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
          addresses: [],
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
        });
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
          isLoading: false,
        }));
        return true;
      },

      addAddress: (address) => {
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
          userId: get().user?.id || '',
        };
        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }));
      },

      updateAddress: (id, address) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...address } : a
          ),
        }));
      },

      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },
    }),
    {
      name: 'vebanet-auth',
    }
  )
);

// ==================== WISHLIST STORE ====================
interface WishlistState {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (!get().isInWishlist(productId)) {
          set((state) => ({
            items: [
              ...state.items,
              { productId, addedAt: new Date().toISOString() },
            ],
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      toggleItem: (productId) => {
        if (get().isInWishlist(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'vebanet-wishlist',
    }
  )
);

// ==================== CHECKOUT STORE ====================
interface CheckoutStoreState {
  step: CheckoutStep;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  sameAsShipping: boolean;
  shippingMethod: ShippingMethod | null;
  paymentIntentId: string | null;
  clientSecret: string | null;
  isProcessing: boolean;
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: Address | null) => void;
  setBillingAddress: (address: Address | null) => void;
  setSameAsShipping: (same: boolean) => void;
  setShippingMethod: (method: ShippingMethod | null) => void;
  setPaymentIntent: (id: string, clientSecret: string) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;
  canProceed: () => boolean;
}

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivered in 5-7 business days',
    price: 9.99,
    estimatedDays: '5-7 days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivered in 2-3 business days',
    price: 19.99,
    estimatedDays: '2-3 days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Delivered next business day',
    price: 39.99,
    estimatedDays: '1 day',
  },
];

export const useCheckoutStore = create<CheckoutStoreState>((set, get) => ({
  step: 'cart',
  shippingAddress: null,
  billingAddress: null,
  sameAsShipping: true,
  shippingMethod: null,
  paymentIntentId: null,
  clientSecret: null,
  isProcessing: false,

  setStep: (step) => set({ step }),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setBillingAddress: (address) => set({ billingAddress: address }),
  setSameAsShipping: (same) => set({ sameAsShipping: same }),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  setPaymentIntent: (id, clientSecret) =>
    set({ paymentIntentId: id, clientSecret }),
  setProcessing: (processing) => set({ isProcessing: processing }),

  reset: () =>
    set({
      step: 'cart',
      shippingAddress: null,
      billingAddress: null,
      sameAsShipping: true,
      shippingMethod: null,
      paymentIntentId: null,
      clientSecret: null,
      isProcessing: false,
    }),

  canProceed: () => {
    const state = get();
    switch (state.step) {
      case 'cart':
        return true;
      case 'shipping':
        return state.shippingAddress !== null && state.shippingMethod !== null;
      case 'payment':
        return state.sameAsShipping || state.billingAddress !== null;
      case 'review':
        return true;
      default:
        return false;
    }
  },
}));

// ==================== ORDER STORE ====================
interface OrderStoreState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  getOrder: (orderId: string) => Order | undefined;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Orders will be populated from mock data
    set({ isLoading: false });
  },

  getOrder: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  createOrder: async (orderData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `VEB-${Date.now().toString().slice(-8)}`,
      userId: orderData.userId || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      status: 'confirmed',
      paymentStatus: 'succeeded',
      paymentMethod: orderData.paymentMethod || 'card',
      shippingAddress: orderData.shippingAddress!,
      billingAddress: orderData.billingAddress!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      currentOrder: newOrder,
      isLoading: false,
    }));

    return newOrder;
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),
}));

// ==================== NOTIFICATION STORE ====================
interface NotificationStoreState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notif-${Date.now()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 5000);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
