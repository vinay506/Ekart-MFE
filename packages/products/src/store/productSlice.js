import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://dummyjson.com/products';

// --- Thunk example: add product to cart ---
export const addToCartThunk = createAsyncThunk(
  'products/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      // In a real app this posts to a cart API; here we return the product
      return product;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: '',
    currentPage: 1,
    totalProducts: 0,
  },
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.items = action.payload.products;
      state.totalProducts = action.payload.total;
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.fulfilled, (_state, _action) => {
        // Cart state lives in the cart remote; nothing to update here
      });
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
  setPage,
} = productSlice.actions;

// Selectors
export const selectProducts = createSelector(
  (state) => state.products?.items,
  (items) => items ?? []
);
export const selectProductsLoading = (state) => state.products?.loading ?? false;
export const selectProductsError = (state) => state.products?.error ?? null;
export const selectSearchQuery   = (state) => state.products?.searchQuery ?? '';
export const selectTotalProducts = (state) => state.products?.totalProducts ?? 0;

export default productSlice.reducer;
