// src/contexts/AuthContext.tsx
import React from 'react';
import { auth } from '../firebase/config';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../firebase/firestore';

interface UserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    shippingAddresses?: any[];
    orderHistory?: any[];
    [key: string]: any;
}

interface AuthContextType {
    currentUser: User | null;
    userData: UserData | null;
    loading: boolean;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userData: null,
    loading: true,
    setUserData: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                try {
                    const data = await getUserData(user.uid);
                    setUserData(data as UserData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        userData,
        loading,
        setUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};