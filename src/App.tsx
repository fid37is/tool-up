import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import './firebase/config'; 

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <Toaster position="top-right" />
            </AuthProvider>
        </Router>
    );
};

export default App;