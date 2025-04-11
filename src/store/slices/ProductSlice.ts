import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../types/product';
import { getProducts, getProductById } from '../../firebase/firestore';

interface ProductState {
    items: Product[];
    selectedProduct: Product | null;
    filteredItems: Product[];
    loading: boolean;
    error: string | null;
    category: string | null;
    sortBy: string;
}

const initialState: ProductState = {
    items: [],
    selectedProduct: null,
    filteredItems: [],
    loading: false,
    error: null,
    category: null,
    sortBy: 'createdAt',
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (
        { category, sortBy, limit }: { category?: string; sortBy?: string; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const products = await getProducts(category, sortBy, limit);
            return products as Product[];
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId: string, { rejectWithValue }) => {
        try {
            const product = await getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product as Product;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.filteredItems = action.payload;
            state.loading = false;
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        filterByCategory: (state, action: PayloadAction<string | null>) => {
            state.category = action.payload;
            if (action.payload) {
                state.filteredItems = state.items.filter(
                    (item) => item.category === action.payload
                );
            } else {
                state.filteredItems = state.items;
            }
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.filteredItems = action.payload;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProduct = action.payload;
                state.loading = false;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setProducts,
    setSelectedProduct,
    setLoading,
    setError,
    filterByCategory,
    setSortBy,
} = productSlice.actions;
export default productSlice.reducer;