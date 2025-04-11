// src/components/cart/CartItem.tsx
import React from 'react';
import { CartItem as CartItemType } from '../../types/product';
import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../../store/slices/CartSlice';

interface Props {
    item: CartItemType;
}

const CartItem: React.FC<Props> = ({ item }) => {
    const dispatch = useDispatch();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        if (quantity > 0) {
            dispatch(updateQuantity({ id: item.id, quantity }));
        }
    };

    const handleRemove = () => dispatch(removeItem(item.id));

    return (
        <div className="flex items-center justify-between border-b py-4">
            <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <input title='Quantity'
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="w-16 px-2 py-1 border rounded"
                />
                <button onClick={handleRemove} className="text-red-600 hover:underline">Remove</button>
            </div>
        </div>
    );
};

export default CartItem;
