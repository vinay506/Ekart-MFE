import React, { useEffect, useState, useCallback } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectSearchQuery,
  fetchProductsStart,
  setSearchQuery,
  default as productReducer,
} from '../store/productSlice';
import { watchFetchProducts } from '../store/productSaga';
import './ProductList.css';

// ── Module-level store ────────────────────────────────────────────────────────
const sagaMiddleware = createSagaMiddleware();
const productsStore = configureStore({
  reducer: { products: productReducer },
  middleware: (gDM) => gDM().concat(sagaMiddleware),
});
sagaMiddleware.run(watchFetchProducts);

// ── Cross-MFE cart helper ─────────────────────────────────────────────────────
const CART_KEY = 'ekart_cart';

const pushToCart = (product) => {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const found = items.find((i) => i.id === product.id);
    if (found) { found.quantity += 1; } else {
      items.push({ id: product.id, title: product.title, price: product.price,
        thumbnail: product.thumbnail, quantity: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('ekart:addToCart', { detail: product }));
};

// ── Components ────────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card" data-testid="product-card">
    <img src={product.thumbnail} alt={product.title} className="product-thumb" loading="lazy" />
    <div className="product-body">
      <p className="product-brand">{product.brand}</p>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">{product.description?.slice(0, 80)}...</p>
      <div className="product-meta">
        <span className="product-price">${product.price}</span>
        <span className="product-rating">⭐ {product.rating}</span>
      </div>
      <button
        className="btn-add-cart"
        onClick={() => onAddToCart(product)}
        data-testid={`add-to-cart-${product.id}`}
        aria-label={`Add ${product.title} to cart`}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

const Toast = ({ message, visible }) => (
  <div className={`cart-toast${visible ? ' cart-toast--visible' : ''}`} role="status" aria-live="polite">
    <span className="cart-toast-icon">🛒</span>
    {message}
  </div>
);

const ProductListContent = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading  = useSelector(selectProductsLoading);
  const error    = useSelector(selectProductsError);
  const query    = useSelector(selectSearchQuery);

  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    dispatch(fetchProductsStart());
  }, [dispatch]);

  const handleAddToCart = useCallback((product) => {
    pushToCart(product);
    setToast({ visible: true, message: `"${product.title}" added to cart` });
    // Auto-hide after 2.5 s
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  return (
    <div className="products-page" data-testid="product-list">
      <Toast visible={toast.visible} message={toast.message} />

      <div className="products-toolbar">
        <h2 className="products-heading">All Products</h2>
        <input
          type="search"
          className="search-box"
          placeholder="Search products…"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          data-testid="search-input"
          aria-label="Search products"
        />
      </div>

      {loading && <div className="status-message" data-testid="loading">Loading products…</div>}
      {!loading && error && <div className="status-message error" data-testid="error">⚠ {error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="status-message" data-testid="no-results">No products found for "{query}".</div>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

const ProductList = () => (
  <Provider store={productsStore}>
    <ProductListContent />
  </Provider>
);

export default ProductList;
