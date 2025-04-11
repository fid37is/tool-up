// src/firebase/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Create a new user with email and password
export const registerWithEmailAndPassword = async (
    email: string,
    password: string,
    displayName: string
): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile
        await updateProfile(user, { displayName });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email,
            displayName,
            createdAt: Timestamp.now(),
            shippingAddresses: [],
            phoneNumber: '',
            orderHistory: []
        });

        return user;
    } catch (error) {
        throw error;
    }
};

// Sign in with email and password
export const loginWithEmailAndPassword = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        // If it doesn't exist, create it
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                createdAt: Timestamp.now(),
                shippingAddresses: [],
                phoneNumber: user.phoneNumber || '',
                orderHistory: []
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Sign in with Facebook
export const signInWithFacebook = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;

        // Check if user document exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        // If it doesn't exist, create it
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                createdAt: Timestamp.now(),
                shippingAddresses: [],
                phoneNumber: user.phoneNumber || '',
                orderHistory: []
            });
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Sign out
export const logOut = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};