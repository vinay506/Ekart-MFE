import { createSlice, createSelector } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],        // { id, title, price, thumbnail, quantity }
    syncing: false,
    error: null,
  },
  reducers: {
    addItem(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = Math.max(1, quantity);
    },
    clearCart(state) {
      state.items = [];
    },
    syncStart(state) {
      state.syncing = true;
      state.error = null;
    },
    syncSuccess(state) {
      state.syncing = false;
    },
    syncFailure(state, action) {
      state.syncing = false;
      state.error = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  syncStart,
  syncSuccess,
  syncFailure,
} = cartSlice.actions;

const selectCartState = (state) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cart) => cart?.items ?? []
);

export const selectCartTotal = createSelector(
  selectCartState,
  (cart) => (cart?.items ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0)
);

export const selectCartCount = createSelector(
  selectCartState,
  (cart) => (cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0)
);

export default cartSlice.reducer;
