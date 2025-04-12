import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/cart/Checkout';

const Checkout: React.FC = () => {
    const { itemCount } = useSelector((state: RootState) => state.cart);
    const navigate = useNavigate();

    // Redirect to cart if there are no items
    React.useEffect(() => {
        if (itemCount === 0) {
            navigate('/cart');
        }
    }, [itemCount, navigate]);

    if (itemCount === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="container mx-auto p-4">
            <CheckoutForm />
        </div>
    );
};

export default Checkout;
