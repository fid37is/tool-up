import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types/product';

const Home: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const featuredQuery = query(
                    collection(db, 'products'),
                    orderBy('rating', 'desc'),
                    limit(4)
                );

                const newArrivalsQuery = query(
                    collection(db, 'products'),
                    orderBy('createdAt', 'desc'),
                    limit(4)
                );

                const [featuredSnapshot, newArrivalsSnapshot] = await Promise.all([
                    getDocs(featuredQuery),
                    getDocs(newArrivalsQuery)
                ]);

                const featuredData = featuredSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];

                const newArrivalsData = newArrivalsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];

                setFeaturedProducts(featuredData);
                setNewArrivals(newArrivalsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mb-16">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 md:p-16 rounded-lg shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ToolUp</h1>
                    <p className="text-xl md:text-2xl mb-8">Your one-stop shop for gadgets and phone accessories</p>
                    <Link
                        to="/products"
                        className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold shadow-md hover:bg-gray-100 transition duration-300"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Featured Products</h2>
                    <Link to="/products" className="text-blue-600 hover:underline">View All</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-pulse text-xl">Loading products...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">New Arrivals</h2>
                    <Link to="/products" className="text-blue-600 hover:underline">View All</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-pulse text-xl">Loading products...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newArrivals.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section className="mb-16">
                <div className="bg-gray-100 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Why Choose ToolUp?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-md shadow">
                            <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                            <p>We offer only the best quality gadgets and accessories from trusted brands.</p>
                        </div>
                        <div className="bg-white p-6 rounded-md shadow">
                            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                            <p>Get your orders quickly with our reliable shipping options.</p>
                        </div>
                        <div className="bg-white p-6 rounded-md shadow">
                            <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                            <p>Our dedicated team is always ready to assist you with any questions.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;