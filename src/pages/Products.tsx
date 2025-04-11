import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ProductList from '../components/product/ProductList';
import { fetchProducts } from '../store/slices/ProductSlice';
import { AppDispatch } from '../store';

const Products: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'newest'>('newest');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Fetch products and categories
        const loadProducts = async () => {
            try {
                // Dispatch the fetchProducts thunk action
                // This will set loading state, fetch products, and update Redux store
                await dispatch(fetchProducts({ 
                    sortBy: mapSortByToApiParameter(sortBy)
                }));
                
                // You might want to fetch categories from Firestore if they're not embedded in products
                // For now, we'll assume you'd get them after products are loaded
                fetchCategories();
            } catch (error) {
                console.error('Error initializing products page:', error);
            }
        };

        loadProducts();
    }, [dispatch, sortBy]);

    // Effect for when filters change
    useEffect(() => {
        dispatch(fetchProducts({ 
            category: selectedCategory || undefined,
            sortBy: mapSortByToApiParameter(sortBy),
        }));
    }, [dispatch, selectedCategory, sortBy]);

    // Map UI sort options to backend sort parameters
    const mapSortByToApiParameter = (sortOption: string): string => {
        switch (sortOption) {
            case 'newest':
                return 'createdAt';
            case 'price-asc':
                return 'price';
            case 'price-desc':
                return '-price'; // Assuming your API uses - prefix for descending order
            case 'rating':
                return '-rating';
            default:
                return 'createdAt';
        }
    };

    // This would be implemented based on how you get categories
    const fetchCategories = () => {
        // Example implementation - you might get these from Firestore
        // or extract them from the products after they're loaded
        const uniqueCategories = ['Electronics', 'Clothing', 'Home', 'Books'];
        setCategories(uniqueCategories);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'rating' | 'newest');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSortBy('newest');
        setSearchTerm('');
        
        // Reset to default products
        dispatch(fetchProducts({}));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>

            <div className="bg-gray-100 p-4 mb-8 rounded-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="block mb-1 font-medium">Search</label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="w-full md:w-48">
                        <label htmlFor="category" className="block mb-1 font-medium">Category</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-48">
                        <label htmlFor="sort" className="block mb-1 font-medium">Sort By</label>
                        <select
                            id="sort"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>

                    <div className="w-full md:w-32 flex items-end">
                        <button
                            onClick={handleClearFilters}
                            className="w-full p-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Using ProductList with the props it expects */}
            <ProductList 
                category={selectedCategory}
                searchTerm={searchTerm}
                sortBy={sortBy}
            />
        </div>
    );
};

export default Products;