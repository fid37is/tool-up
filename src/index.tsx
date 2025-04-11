import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './components/auth/AuthProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <AuthProvider>
                <Elements stripe={stripePromise}>
                    <App />
                </Elements>
            </AuthProvider>
        </ReduxProvider>
    </React.StrictMode>
);