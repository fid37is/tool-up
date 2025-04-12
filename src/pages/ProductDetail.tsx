// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/CartSlice';
import { AppDispatch, RootState } from '../store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { CartItem, Product } from '../types/product';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    // Get related products from store
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const isInCart = cartItems.some(item => item.id === id);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const productDoc = await getDoc(doc(db, 'products', id));

                if (productDoc.exists()) {
                    setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Error loading product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            const cartItem: CartItem = {
                ...product,            
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                quantity: quantity
            };
    
            dispatch(addItem(cartItem));
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    {error || 'Product not found'}
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[activeImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${index === activeImageIndex ? 'border-blue-500' : 'border-transparent'
                                        }`}
                                    onClick={() => setActiveImageIndex(index)}
                                >
                                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-600 ml-2">
                            {product.rating?.toFixed(1) || 'No ratings'}
                            {product.reviewCount && ` (${product.reviewCount} reviews)`}
                        </span>
                    </div>

                    <div className="text-2xl font-bold text-blue-600 mb-4">
                        ${product.price.toFixed(2)}
                        {product.oldPrice && (
                            <span className="text-gray-500 text-lg line-through ml-2">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">{product.description}</p>

                        {product.features && product.features.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-bold text-lg mb-2">Key Features:</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center mb-6">
                            <label htmlFor="quantity" className="font-medium mr-4">Quantity:</label>
                            <select
                                id="quantity"
                                className="border rounded-md p-2"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center"
                            >
                                {isInCart ? 'Update Cart' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 transition"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional sections can be added here (reviews, related products, etc.) */}
        </div>
    );
};

export default ProductDetail;