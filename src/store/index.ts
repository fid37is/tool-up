import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/CartSlice';
import productReducer from './slices/ProductSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these paths to avoid issues with Firebase Timestamp objects
                ignoredActions: ['auth/setUser', 'cart/setItems', 'products/setProducts'],
                ignoredPaths: ['auth.user', 'cart.items', 'products.items'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;