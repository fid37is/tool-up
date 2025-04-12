export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'paypal';
    isDefault: boolean;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    paypalEmail?: string;
}

export interface NotificationPreferences {
    emailOffers: boolean;
    emailOrderUpdates: boolean;
    emailDisputes: boolean;
    pushNotifications: boolean;
    smsUpdates: boolean;
}

export interface User {
    id: string;
    email: string;
    displayName: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    createdAt: string;
    updatedAt: string;
    addresses: Address[];
    defaultAddressId: string | null;
    paymentMethods: PaymentMethod[];
    defaultPaymentMethodId: string | null;
    notificationPreferences: NotificationPreferences;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethodId: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    fulfillmentType: 'delivery' | 'pickup';
    createdAt: string;
    updatedAt: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface Dispute {
    id: string;
    userId: string;
    orderId: string;
    orderItemId: string;
    reason: string;
    description: string;
    status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    resolution?: string;
    refundAmount?: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    imageUrls: string[];
    category: string;
    subcategory?: string;
    featured: boolean;
    inStock: boolean;
    stockQuantity: number;
    sku: string;
    tags: string[];
    specs: Record<string, string>;
    avgRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}