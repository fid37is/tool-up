// src/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a file to Firebase Storage
export const uploadFile = async (
    file: File,
    path: string
): Promise<string> => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        throw error;
    }
};

// Upload a product image
export const uploadProductImage = async (
    file: File,
    productId: string,
    index: number = 0
): Promise<string> => {
    const extension = file.name.split('.').pop();
    const path = `products/${productId}/image_${index}.${extension}`;
    return uploadFile(file, path);
};

// Upload a user profile image
export const uploadProfileImage = async (
    file: File,
    userId: string
): Promise<string> => {
    const extension = file.name.split('.').pop();
    const path = `users/${userId}/profile.${extension}`;
    return uploadFile(file, path);
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
    try {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
    } catch (error) {
        throw error;
    }
};