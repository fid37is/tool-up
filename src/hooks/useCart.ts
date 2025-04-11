// src/hooks/useCart.ts
import { useContext } from 'react';
import { CartContext, CartItem } from '../contexts/CartContext';

export const useCart = () => {
    const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useContext(CartContext);

    // Add an item to cart or increase quantity if already exists
    const addToCart = (product: any, quantity: number = 1) => {
        const item: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            quantity
        };

        addItem(item);
    };

    // Calculate tax amount (assuming tax rate of 10%)
    const taxAmount = (subtotal * 0.1);

    // Fixed shipping fee
    const shippingFee = subtotal > 0 ? 5.99 : 0;

    // Calculate order total
    const total = subtotal + taxAmount + shippingFee;

    return {
        items,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        taxAmount,
        shippingFee,
        total
    };
};