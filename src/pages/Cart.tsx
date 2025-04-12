// src/pages/Cart.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeItem, updateQuantity } from '../store/slices/CartSlice';
import CartItem from '../components/cart/CartItem';

const Cart: React.FC = () => {
    const dispatch = useDispatch();
    const { items, total, itemCount, loading } = useSelector((state: RootState) => state.cart);

    // Calculate tax amount (assuming tax rate of 10%)
    const taxAmount = total * 0.1;

    // Fixed shipping fee
    const shippingFee = total > 0 ? 5.99 : 0;

    // Calculate order total
    const orderTotal = total + taxAmount + shippingFee;

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeItem(itemId));
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        dispatch(updateQuantity({ id: itemId, quantity }));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading cart...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <Link
                        to="/products"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-3 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Items ({itemCount})</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (10%)</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    to="/checkout"
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-center block hover:bg-blue-700 transition"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    to="/products"
                                    className="w-full text-blue-600 py-3 px-4 rounded-md font-medium text-center block hover:bg-gray-100 mt-3 transition"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;