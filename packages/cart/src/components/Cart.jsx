import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  removeItem,
  updateQuantity,
  clearCart,
  syncStart,
} from '../store/cartSlice';
import './Cart.css';

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

const Cart = () => {
  const dispatch = useDispatch();
  const items  = useSelector(selectCartItems);
  const total  = useSelector(selectCartTotal);
  const count  = useSelector(selectCartCount);

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
            <button
              className="btn-checkout"
              onClick={() => dispatch(syncStart())}
              data-testid="checkout-btn"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
