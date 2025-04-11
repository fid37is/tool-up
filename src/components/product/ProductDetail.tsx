import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

// Define Product type
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    discountPercentage: number;
    stock: number;
    features?: string[];
}

// Define CartItem type - actually used when calling addToCart
interface CartItem extends Product {
    quantity: number;
}

const ProductDetail: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { items, loading, error } = useSelector((state: RootState) => state.products);
    const product = items.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error || "Product not found"}</span>
                    <button
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => navigate('/products')}
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        // Explicitly use the CartItem type by creating a proper cart item
        const cartItem: CartItem = {
            ...product,
            quantity
        };
        addToCart(cartItem);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={product.images?.[selectedImage] || product.imageUrl}
                            alt={product.name}
                            className="h-96 w-full object-cover object-center"
                        />
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`overflow-hidden rounded-md ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <img src={image} alt={`${product.name} view ${index + 1}`} className="h-16 w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                    <div className="mt-2 flex items-center">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.reviewCount} reviews)</span>
                    </div>

                    <div className="mt-4">
                        {product.discountPercentage > 0 ? (
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(product.price * (1 - product.discountPercentage / 100))}
                                </span>
                                <span className="text-lg text-gray-500 line-through ml-3">
                                    {formatCurrency(product.price)}
                                </span>
                                <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                    Save {product.discountPercentage}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900">Description</h3>
                        <div className="mt-2 text-sm text-gray-600 space-y-4">
                            <p>{product.description}</p>
                        </div>
                    </div>

                    {product.features && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900">Features</h3>
                            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                                {product.features.map((feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-8">
                        <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900 mr-3">Quantity</h3>
                            <div className="flex items-center">
                                <button title='setQuantity' type='button'
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                                >
                                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M20 12H4"></path>
                                    </svg>
                                </button>
                                <input title='quantity'
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="mx-2 border rounded text-center w-14 py-1"
                                />
                                <button title='setQuantity' type='button'
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                                >
                                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {product.stock > 0 ? (
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        // Also use CartItem type here
                                        const cartItem: CartItem = {
                                            ...product,
                                            quantity
                                        };
                                        addToCart(cartItem);
                                        navigate('/cart');
                                    }}
                                    className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ) : (
                            <button
                                disabled
                                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-md cursor-not-allowed"
                            >
                                Out of Stock
                            </button>
                        )}
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
                        </div>

                        <div className="mt-2 flex items-center">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                            </svg>
                            <p className="ml-2 text-sm text-gray-500">Free returns within 30 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;