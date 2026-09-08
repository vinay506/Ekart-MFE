import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import Cart from './Cart';
import cartReducer from '../store/cartSlice';

const item = { id: 1, title: 'iPhone 15', price: 999, thumbnail: '' };

const buildStore = (preloadedState) => {
  const saga = createSagaMiddleware();
  return configureStore({
    reducer: { cart: cartReducer },
    middleware: (g) => g().concat(saga),
    preloadedState,
  });
};

const wrap = (ui, store) => render(<Provider store={store}>{ui}</Provider>);

describe('Cart component', () => {
  it('shows empty state when cart is empty', () => {
    const store = buildStore({ cart: { items: [], syncing: false, error: null } });
    wrap(<Cart />, store);
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('renders a cart item', () => {
    const store = buildStore({
      cart: { items: [{ ...item, quantity: 1 }], syncing: false, error: null },
    });
    wrap(<Cart />, store);
    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
  });

  it('calculates total correctly for multiple quantities', () => {
    const store = buildStore({
      cart: { items: [{ ...item, quantity: 3 }], syncing: false, error: null },
    });
    wrap(<Cart />, store);
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$2997.00');
  });

  it('shows correct item count badge', () => {
    const store = buildStore({
      cart: {
        items: [{ ...item, quantity: 2 }, { id: 2, title: 'Laptop', price: 500, thumbnail: '', quantity: 1 }],
        syncing: false,
        error: null,
      },
    });
    wrap(<Cart />, store);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3 items');
  });

  it('removes item on Remove button click', () => {
    const store = buildStore({
      cart: { items: [{ ...item, quantity: 1 }], syncing: false, error: null },
    });
    wrap(<Cart />, store);
    fireEvent.click(screen.getByTestId('remove-1'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('clears all items on Clear Cart click', () => {
    const store = buildStore({
      cart: {
        items: [
          { ...item, quantity: 1 },
          { id: 2, title: 'Laptop', price: 500, thumbnail: '', quantity: 1 },
        ],
        syncing: false,
        error: null,
      },
    });
    wrap(<Cart />, store);
    fireEvent.click(screen.getByTestId('clear-cart'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
  });

  it('dispatches syncStart on Checkout click', () => {
    const store = buildStore({
      cart: { items: [{ ...item, quantity: 1 }], syncing: false, error: null },
    });
    const spy = jest.spyOn(store, 'dispatch');
    wrap(<Cart />, store);
    fireEvent.click(screen.getByTestId('checkout-btn'));
    expect(spy).toHaveBeenCalled();
  });
});
