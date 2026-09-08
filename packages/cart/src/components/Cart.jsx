import React, { useState, useRef, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartSyncing,
  selectCartError,
  removeItem,
  updateQuantity,
  clearCart,
  syncStart,
  addItem,
  default as cartReducer,
} from '../store/cartSlice';
import { watchCartSaga } from '../store/cartSaga';
import './Cart.css';

// ── Module-level store ────────────────────────────────────────────────────────
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

cartStore.subscribe(() => {
  const { items } = cartStore.getState().cart;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
});

window.addEventListener('ekart:addToCart', (e) => {
  cartStore.dispatch(addItem(e.detail));
});

// ── Sub-components ────────────────────────────────────────────────────────────
const CartItem = ({ item, onRemove, onQuantityChange }) => (
  <div className="cart-item" data-testid="cart-item">
    <img src={item.thumbnail} alt={item.title} className="cart-item-img" />
    <div className="cart-item-info">
      <h4 className="cart-item-title">{item.title}</h4>
      <p className="cart-item-unit">${item.price} each</p>
    </div>
    <div className="cart-item-controls">
      <input
        type="number" min="1" value={item.quantity}
        className="qty-input"
        onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
        data-testid={`quantity-${item.id}`}
        aria-label={`Quantity for ${item.title}`}
      />
      <button className="btn-remove" onClick={() => onRemove(item.id)}
        data-testid={`remove-${item.id}`} aria-label={`Remove ${item.title}`}>
        ✕
      </button>
    </div>
    <span className="cart-item-subtotal" data-testid={`subtotal-${item.id}`}>
      ${(item.price * item.quantity).toFixed(2)}
    </span>
  </div>
);

const OrderSuccess = ({ orderNum, onContinue, onViewOrders }) => (
  <div className="order-success" data-testid="order-success">
    <div className="order-success-icon">✓</div>
    <h2>Order Placed!</h2>
    <p className="order-success-num">Order <strong>{orderNum}</strong></p>
    <p className="order-success-msg">
      Your order has been confirmed. You'll receive a confirmation shortly.
    </p>
    <div className="order-success-actions">
      <button className="btn-view-orders" onClick={onViewOrders}>View Orders</button>
      <button className="btn-continue" onClick={onContinue}>Continue Shopping</button>
    </div>
  </div>
);

const CartContent = () => {
  const dispatch = useDispatch();
  const items   = useSelector(selectCartItems);
  const total   = useSelector(selectCartTotal);
  const count   = useSelector(selectCartCount);
  const syncing = useSelector(selectCartSyncing);
  const error   = useSelector(selectCartError);

  const [userRole] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ekart_auth'))?.user?.role ?? null; }
    catch { return null; }
  });
  const [orderNum, setOrderNum] = useState(null);
  const prevSyncing = useRef(false);

  // Detect when saga finishes processing checkout
  useEffect(() => {
    if (prevSyncing.current && !syncing) {
      const num = `ORD-${Date.now().toString().slice(-6)}`;
      setOrderNum(num);
      dispatch(clearCart());
      localStorage.removeItem(STORAGE_KEY);
    }
    prevSyncing.current = syncing;
  }, [syncing, dispatch]);

  const isAdmin = userRole === 'admin';

  if (orderNum) {
    return (
      <div className="cart-wrapper">
        <OrderSuccess
          orderNum={orderNum}
          onContinue={() => window.dispatchEvent(new CustomEvent('ekart:navigate', { detail: '/' }))}
          onViewOrders={() => window.dispatchEvent(new CustomEvent('ekart:navigate', { detail: '/orders' }))}
        />
      </div>
    );
  }

  return (
    <div className="cart-wrapper" data-testid="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <span className="cart-badge" data-testid="cart-count">
          {count} item{count !== 1 ? 's' : ''}
        </span>
      </div>

      {error && <p className="cart-error">⚠ {error}</p>}

      {items.length === 0 ? (
        <div className="cart-empty" data-testid="cart-empty">
          Your cart is empty.{' '}
          <button
            className="btn-start-shopping"
            onClick={() => window.dispatchEvent(new CustomEvent('ekart:navigate', { detail: '/' }))}
          >
            Start shopping →
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={(id) => dispatch(removeItem(id))}
                onQuantityChange={(id, qty) => dispatch(updateQuantity({ id, quantity: qty }))}
              />
            ))}
          </div>

          <div className="cart-footer">
            <button className="btn-clear" onClick={() => dispatch(clearCart())} data-testid="clear-cart">
              Clear Cart
            </button>
            <div className="cart-summary">
              <span>Total</span>
              <strong data-testid="cart-total">${total.toFixed(2)}</strong>
            </div>
            {isAdmin ? (
              <button
                className={`btn-checkout${syncing ? ' btn-checkout--loading' : ''}`}
                onClick={() => dispatch(syncStart())}
                disabled={syncing}
                data-testid="checkout-btn"
              >
                {syncing ? 'Placing order…' : 'Checkout'}
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
