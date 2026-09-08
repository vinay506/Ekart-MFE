import React, { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  removeItem,
  updateQuantity,
  clearCart,
  syncStart,
  addItem,
  default as cartReducer,
} from '../store/cartSlice';
import { watchCartSaga } from '../store/cartSaga';
import './Cart.css';

// ── Module-level store (created once when this MFE chunk loads) ──────────────
const STORAGE_KEY = 'ekart_cart';

const loadPersistedItems = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
};

const sagaMiddleware = createSagaMiddleware();
const cartStore = configureStore({
  reducer: { cart: cartReducer },
  middleware: (gDM) => gDM().concat(sagaMiddleware),
  preloadedState: { cart: { items: loadPersistedItems(), syncing: false, error: null } },
});
sagaMiddleware.run(watchCartSaga);

// Persist cart changes to localStorage
cartStore.subscribe(() => {
  const { items } = cartStore.getState().cart;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
});

// Cross-MFE: receive add-to-cart events from the products remote
window.addEventListener('ekart:addToCart', (e) => {
  cartStore.dispatch(addItem(e.detail));
});

// ── Components ────────────────────────────────────────────────────────────────
const CartItem = ({ item, onRemove, onQuantityChange }) => (
  <div className="cart-item" data-testid="cart-item">
    <img src={item.thumbnail} alt={item.title} className="cart-item-img" />
    <div className="cart-item-info">
      <h4 className="cart-item-title">{item.title}</h4>
      <p className="cart-item-unit">${item.price} each</p>
    </div>
    <div className="cart-item-controls">
      <input
        type="number"
        min="1"
        value={item.quantity}
        className="qty-input"
        onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
        data-testid={`quantity-${item.id}`}
        aria-label={`Quantity for ${item.title}`}
      />
      <button
        className="btn-remove"
        onClick={() => onRemove(item.id)}
        data-testid={`remove-${item.id}`}
        aria-label={`Remove ${item.title}`}
      >
        ✕
      </button>
    </div>
    <span className="cart-item-subtotal" data-testid={`subtotal-${item.id}`}>
      ${(item.price * item.quantity).toFixed(2)}
    </span>
  </div>
);

const CartContent = () => {
  const dispatch = useDispatch();
  const items  = useSelector(selectCartItems);
  const total  = useSelector(selectCartTotal);
  const count  = useSelector(selectCartCount);

  // Read role from localStorage — auth lives in the host but Cart is isolated.
  const [userRole] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ekart_auth'))?.user?.role ?? null; }
    catch { return null; }
  });

  const isAdmin = userRole === 'admin';

  return (
    <div className="cart-wrapper" data-testid="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <span className="cart-badge" data-testid="cart-count">
          {count} item{count !== 1 ? 's' : ''}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty" data-testid="cart-empty">
          Your cart is empty. <a href="/">Start shopping →</a>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={(id) => dispatch(removeItem(id))}
                onQuantityChange={(id, qty) =>
                  dispatch(updateQuantity({ id, quantity: qty }))
                }
              />
            ))}
          </div>

          <div className="cart-footer">
            <button
              className="btn-clear"
              onClick={() => dispatch(clearCart())}
              data-testid="clear-cart"
            >
              Clear Cart
            </button>
            <div className="cart-summary">
              <span>Total</span>
              <strong data-testid="cart-total">${total.toFixed(2)}</strong>
            </div>
            {isAdmin ? (
              <button
                className="btn-checkout"
                onClick={() => dispatch(syncStart())}
                data-testid="checkout-btn"
              >
                Checkout
              </button>
            ) : (
              <button className="btn-checkout btn-checkout--disabled" disabled data-testid="checkout-btn">
                Checkout (Admin only)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Cart = () => (
  <Provider store={cartStore}>
    <CartContent />
  </Provider>
);

export default Cart;
