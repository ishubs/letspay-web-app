import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    signInWithPhoneNumber,
    RecaptchaVerifier,
    onAuthStateChanged,
    signOut,
    User,
} from 'firebase/auth';
import { auth } from './../firebase';

interface AuthContextType {
    currentUser: User | null;
    signInWithPhone: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<any>;
    logout: () => Promise<void>;
    setupRecaptcha: (elementId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(
        JSON.parse(localStorage.getItem('user') || 'null')
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
            } else {
                localStorage.removeItem('user');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithPhone = (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
        return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    };

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        localStorage.removeItem('user'); // Clear user from localStorage on logout
    };

    const setupRecaptcha = (elementId: string) => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            elementId,
            {
                size: 'invisible',
                callback: () => {
                    console.log('reCAPTCHA solved');
                },
            },
        );
    };

    const value: AuthContextType = {
        currentUser,
        signInWithPhone,
        logout,
        setupRecaptcha,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
