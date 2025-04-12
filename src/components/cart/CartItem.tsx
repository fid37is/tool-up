// src/components/cart/CartItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '../../types/product';

interface CartItemProps {
    item: CartItemType;
    onRemove: (id: string) => void;
    onQuantityChange: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = parseInt(e.target.value, 10);
        onQuantityChange(item.id, newQuantity);
    };

    return (
        <div className="p-4 flex items-center">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No image</span>
                    </div>
                )}
            </div>

            <div className="ml-4 flex-grow">
                <Link to={`/products/${item.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {item.name}
                </Link>
                <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center">
                <select title='Select quantity'
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="border rounded-md p-1 mr-4"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CartItem;