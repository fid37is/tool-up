// src/firebase/auth.ts
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    UserCredential,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

// Email/Password Authentication
export const registerWithEmailPassword = async (
    email: string,
    password: string,
    displayName: string
): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    // Update display name
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
    }

    // Create user document in Firestore
    await createUserProfile(userCredential.user.uid, {
        email,
        displayName,
        createdAt: serverTimestamp(),
        provider: "email",
    });

    return userCredential;
};

export const loginWithEmailPassword = (
    email: string,
    password: string
): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Google Authentication
export const loginWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
        // Create user profile if it doesn't exist
        await createUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            createdAt: serverTimestamp(),
            provider: "google",
        });
    }

    return userCredential;
};

// Facebook Authentication
export const loginWithFacebook = async (): Promise<UserCredential> => {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
        // Create user profile if it doesn't exist
        await createUserProfile(userCredential.user.uid, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            createdAt: serverTimestamp(),
            provider: "facebook",
        });
    }

    return userCredential;
};

// Create user profile in Firestore
export const createUserProfile = async (userId: string, userData: any) => {
    const userRef = doc(db, "users", userId);
    await setDoc(
        userRef,
        {
            ...userData,
            role: "customer", // Default role
        },
        { merge: true }
    );
};

// Sign out
export const logoutUser = (): Promise<void> => {
    return signOut(auth);
};
