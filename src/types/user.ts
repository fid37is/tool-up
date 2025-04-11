export interface User {
    uid: string; // Firebase Auth UID
    displayName: string;
    email: string;
    photoURL?: string;
    phoneNumber?: string;
    address?: string; // Delivery address
    role: 'customer' | 'admin'; // You can extend this later
    createdAt: string; // ISO string or Firestore timestamp converted
    updatedAt?: string;
    provider: 'google' | 'facebook' | 'password'; // Login method
    [key: string]: any; // Optional extensibility
}
