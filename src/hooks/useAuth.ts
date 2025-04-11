// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import * as authService from '../firebase/auth';
import { updateUserData } from '../firebase/firestore';

export const useAuth = () => {
    const { currentUser, userData, loading, setUserData } = useContext(AuthContext);

    const loginWithEmail = async (email: string, password: string) => {
        try {
            return await authService.loginWithEmailAndPassword(email, password);
        } catch (error) {
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            return await authService.registerWithEmailAndPassword(email, password, displayName);
        } catch (error) {
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            return await authService.signInWithGoogle();
        } catch (error) {
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        try {
            return await authService.signInWithFacebook();
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logOut();
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await authService.resetPassword(email);
        } catch (error) {
            throw error;
        }
    };

    const updateProfile = async (data: any) => {
        if (!currentUser) return;

        try {
            await updateUserData(currentUser.uid, data);

            // Update local userData state
            if (userData) {
                setUserData({ ...userData, ...data });
            }
        } catch (error) {
            throw error;
        }
    };

    const addShippingAddress = async (address: any) => {
        if (!currentUser || !userData) return;

        try {
            const addresses = userData.shippingAddresses || [];
            addresses.push(address);

            await updateUserData(currentUser.uid, { shippingAddresses: addresses });

            // Update local userData state
            setUserData({ ...userData, shippingAddresses: addresses });
        } catch (error) {
            throw error;
        }
    };

    return {
        currentUser,
        userData,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        resetPassword,
        updateProfile,
        addShippingAddress
    };
};