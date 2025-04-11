import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/product';

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
};

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === action.payload.id
            );

            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            state.total = calculateTotal(state.items);
            state.itemCount = calculateItemCount(state.items);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.total = calculateTotal(state.items);
            state.itemCount = calculateItemCount(state.items);
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.id === id);

            if (itemIndex >= 0) {
                state.items[itemIndex].quantity = quantity;
                state.total = calculateTotal(state.items);
                state.itemCount = calculateItemCount(state.items);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
        },
        setItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
            state.total = calculateTotal(action.payload);
            state.itemCount = calculateItemCount(action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setItems,
    setLoading,
    setError,
} = cartSlice.actions;
export default cartSlice.reducer;