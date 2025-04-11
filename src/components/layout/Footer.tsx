import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">GadgetStore</h3>
                        <p className="text-gray-300 text-sm">
                            Your one-stop shop for the latest gadgets and phone accessories.
                            Quality products at competitive prices.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/products/smartphones" className="text-gray-300 hover:text-white text-sm">
                                    Smartphones
                                </Link>
                            </li>
                            <li>
                                <Link to="/products/accessories" className="text-gray-300 hover:text-white text-sm">
                                    Accessories
                                </Link>
                            </li>
                            <li>
                                <Link to="/products/wearables" className="text-gray-300 hover:text-white text-sm">
                                    Wearables
                                </Link>
                            </li>
                            <li>
                                <Link to="/products/audio" className="text-gray-300 hover:text-white text-sm">
                                    Audio
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-white text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-300 hover:text-white text-sm">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-300 hover:text-white text-sm">
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link to="/disputes" className="text-gray-300 hover:text-white text-sm">
                                    Disputes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white"
                            >
                                Facebook
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white"
                            >
                                Twitter
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <p className="text-gray-300 text-sm text-center">
                        &copy; {currentYear} GadgetStore. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;