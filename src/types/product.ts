export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string; // ISO date string
    helpful?: number;
    images?: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    discountPercentage: number;
    stock: number;
    createdAt: string; // ISO date string or Firebase Timestamp.toDate().toISOString()
    updatedAt?: string;
    category: string;
    tags?: string[];
    colors?: string[];
    features?: string[];
    specifications?: { [key: string]: string | number };
    brand?: string;
    warranty?: string;
    oldPrice?: number;
    isFeatured?: boolean;
    shipping?: {
        freeShipping: boolean;
        estimatedDelivery: string; // ISO date string or Firebase Timestamp.toDate().toISOString()
    };
    reviews?: Review[];
}

export interface CartItem extends Product {
    image: string | undefined;
    quantity: number;
}