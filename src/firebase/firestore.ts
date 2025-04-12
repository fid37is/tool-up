// src/firebase/firestore.ts
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    Timestamp,
    addDoc,
} from 'firebase/firestore';
import { db } from './config';

// User related operations
export const getUserData = async (userId: string): Promise<DocumentData | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const updateUserData = async (userId: string, data: Partial<DocumentData>): Promise<void> => {
    try {
        await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
        throw error;
    }
};

export const addShippingAddress = async (userId: string, address: any): Promise<void> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const addresses = userData.shippingAddresses || [];
            addresses.push(address);
            await updateDoc(doc(db, 'users', userId), { shippingAddresses: addresses });
        }
    } catch (error) {
        throw error;
    }
};

// Product related operations
export const getProducts = async (
    categoryFilter?: string,
    sortBy: string = 'createdAt',
    limitCount: number = 20
): Promise<DocumentData[]> => {
    try {
        let productsQuery;

        if (categoryFilter) {
            productsQuery = query(
                collection(db, 'products'),
                where('category', '==', categoryFilter),
                orderBy(sortBy),
                limit(limitCount)
            );
        } else {
            productsQuery = query(
                collection(db, 'products'),
                orderBy(sortBy),
                limit(limitCount)
            );
        }

        const querySnapshot = await getDocs(productsQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (productId: string): Promise<DocumentData | null> => {
    try {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
            return {
                id: productDoc.id,
                ...productDoc.data()
            };
        }
        return null;
    } catch (error) {
        throw error;
    }
};

// Order related operations
export const createOrder = async (orderData: any): Promise<string> => {
    try {
        const orderRef = await addDoc(collection(db, 'orders'), {
            ...orderData,
            createdAt: Timestamp.now(),
            status: 'pending',
            paymentStatus: 'pending'
        });

        return orderRef.id;
    } catch (error) {
        throw error;
    }
};

export const getOrderById = async (orderId: string): Promise<DocumentData | null> => {
    try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
            return {
                id: orderDoc.id,
                ...orderDoc.data()
            };
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const getUserOrders = async (userId: string): Promise<DocumentData[]> => {
    try {
        const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(ordersQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

// Dispute related operations
export const createDispute = async (disputeData: any): Promise<string> => {
    try {
        const disputeRef = await addDoc(collection(db, 'disputes'), {
            ...disputeData,
            createdAt: Timestamp.now(),
            status: 'open'
        });

        return disputeRef.id;
    } catch (error) {
        throw error;
    }
};

export const getUserDisputes = async (userId: string): Promise<DocumentData[]> => {
    try {
        const disputesQuery = query(
            collection(db, 'disputes'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(disputesQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw error;
    }
};

export { db };
