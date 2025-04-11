// src/components/cart/Cart.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import CartItem from './CartItem';
import { clearCart } from '../../store/slices/CartSlice';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { items, total, itemCount } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClear = () => dispatch(clearCart());

    const goToCheckout = () => navigate('/checkout');

    if (itemCount === 0) {
        return <div className="p-4 text-center text-gray-600">Your cart is empty.</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {items.map(item => (
                <CartItem key={item.id} item={item} />
            ))}
            <div className="mt-6 flex justify-between items-center">
                <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
                <div>
                    <button onClick={handleClear} className="mr-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Clear Cart</button>
                    <button onClick={goToCheckout} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
