import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    return (
        <div className="max-w-2xl mx-auto p-6 text-center">
            <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-2">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>
                <p className="text-lg font-medium">Order Number: {orderNumber}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-medium mb-2">What's Next?</h2>
                <p className="text-gray-600 mb-4">
                    You will receive an email confirmation shortly with your order details.
                    We will notify you when your order has shipped.
                </p>
            </div>

            <div className="flex justify-center space-x-4">
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Continue Shopping
                </Link>
                <Link
                    to="/account/orders"
                    className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
                >
                    View Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;