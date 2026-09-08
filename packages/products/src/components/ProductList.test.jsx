import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import ProductList from './ProductList';
import productReducer from '../store/productSlice';

const mockProducts = [
  {
    id: 1,
    title: 'iPhone 15',
    brand: 'Apple',
    description: 'Flagship smartphone from Apple with excellent camera system.',
    price: 999,
    rating: 4.5,
    thumbnail: 'https://dummyjson.com/icon/1',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24',
    brand: 'Samsung',
    description: 'Top Android phone with a great display and performance.',
    price: 799,
    rating: 4.3,
    thumbnail: 'https://dummyjson.com/icon/2',
  },
];

const buildStore = (preloadedState) => {
  const saga = createSagaMiddleware();
  return configureStore({
    reducer: { products: productReducer },
    middleware: (g) => g().concat(saga),
    preloadedState,
  });
};

const wrap = (ui, store) => render(<Provider store={store}>{ui}</Provider>);

describe('ProductList component', () => {
  it('shows loading indicator when loading=true', () => {
    const store = buildStore({
      products: { items: [], loading: true, error: null, searchQuery: '', currentPage: 1, totalProducts: 0 },
    });
    wrap(<ProductList />, store);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders a card for each product', () => {
    const store = buildStore({
      products: { items: mockProducts, loading: false, error: null, searchQuery: '', currentPage: 1, totalProducts: 2 },
    });
    wrap(<ProductList />, store);
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
  });

  it('shows product titles and prices', () => {
    const store = buildStore({
      products: { items: mockProducts, loading: false, error: null, searchQuery: '', currentPage: 1, totalProducts: 2 },
    });
    wrap(<ProductList />, store);
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('$799')).toBeInTheDocument();
  });

  it('shows error message when error is set', () => {
    const store = buildStore({
      products: { items: [], loading: false, error: 'Network error', searchQuery: '', currentPage: 1, totalProducts: 0 },
    });
    wrap(<ProductList />, store);
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('shows "no results" when items are empty and not loading', () => {
    const store = buildStore({
      products: { items: [], loading: false, error: null, searchQuery: 'xyz', currentPage: 1, totalProducts: 0 },
    });
    wrap(<ProductList />, store);
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  it('dispatches setSearchQuery when user types in search box', () => {
    const store = buildStore({
      products: { items: mockProducts, loading: false, error: null, searchQuery: '', currentPage: 1, totalProducts: 2 },
    });
    const spy = jest.spyOn(store, 'dispatch');
    wrap(<ProductList />, store);
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'iPhone' } });
    expect(spy).toHaveBeenCalled();
  });

  it('dispatches addToCartThunk when "Add to Cart" is clicked', () => {
    const store = buildStore({
      products: { items: mockProducts, loading: false, error: null, searchQuery: '', currentPage: 1, totalProducts: 2 },
    });
    const spy = jest.spyOn(store, 'dispatch');
    wrap(<ProductList />, store);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(spy).toHaveBeenCalled();
  });
});
