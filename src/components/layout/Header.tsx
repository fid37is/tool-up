import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase/config';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const db = getFirestore(app);

    React.useEffect(() => {
        const fetchCartCount = async () => {
            if (currentUser) {
                try {
                    const cartRef = doc(db, 'carts', currentUser.uid);
                    const cartSnap = await getDoc(cartRef);

                    if (cartSnap.exists()) {
                        const cartData = cartSnap.data();
                        const count = cartData.items ? cartData.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;
                        setCartCount(count);
                    } else {
                        setCartCount(0);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    setCartCount(0);
                }
            } else {
                setCartCount(0);
            }
        };

        fetchCartCount();
        // In a real app, you would set up a real-time listener for cart changes
    }, [currentUser, db]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-indigo-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-white font-bold text-xl">GadgetStore</Link>
                        </div>
                        <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/products" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                Products
                            </Link>
                            {currentUser && (
                                <Link to="/orders" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    My Orders
                                </Link>
                            )}
                            <Link to="/contact" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                Contact
                            </Link>
                        </nav>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/cart" className="relative text-white hover:text-gray-200">
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="relative">
                                    <Link to="/profile" className="text-white hover:text-gray-200">
                                        <User className="h-6 w-6" />
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        {currentUser && (
                            <Link
                                to="/orders"
                                className="text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Orders
                            </Link>
                        )}
                        <Link
                            to="/contact"
                            className="text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {currentUser ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="text-white flex items-center px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" /> Cart ({cartCount})
                                </Link>
                                <Link
                                    to="/profile"
                                    className="text-white flex items-center px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="h-5 w-5 mr-2" /> Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;