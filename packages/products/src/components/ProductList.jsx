import React, { useEffect } from 'react';
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

const CART_KEY = 'ekart_cart';

const addToCart = (product) => {
  // Persist to localStorage so Cart picks it up even if not yet loaded
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const found = items.find((i) => i.id === product.id);
    if (found) { found.quantity += 1; } else {
      items.push({ id: product.id, title: product.title, price: product.price,
        thumbnail: product.thumbnail, quantity: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
  // Notify Cart remote if it's already loaded
  window.dispatchEvent(new CustomEvent('ekart:addToCart', { detail: product }));
};
import { watchFetchProducts } from '../store/productSaga';
import './ProductList.css';

// Module-level store — created once when this MFE chunk is loaded.
// Self-contained so ProductList works whether hosted standalone or inside a host shell.
const sagaMiddleware = createSagaMiddleware();
const productsStore = configureStore({
  reducer: { products: productReducer },
  middleware: (gDM) => gDM().concat(sagaMiddleware),
});
sagaMiddleware.run(watchFetchProducts);

const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card" data-testid="product-card">
    <img
      src={product.thumbnail}
      alt={product.title}
      className="product-thumb"
      loading="lazy"
    />
    <div className="product-body">
      <p className="product-brand">{product.brand}</p>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">
        {product.description?.slice(0, 80)}...
      </p>
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

const ProductListContent = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading  = useSelector(selectProductsLoading);
  const error    = useSelector(selectProductsError);
  const query    = useSelector(selectSearchQuery);

  useEffect(() => {
    dispatch(fetchProductsStart());
  }, [dispatch]);

  return (
    <div className="products-page" data-testid="product-list">
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

      {loading && (
        <div className="status-message" data-testid="loading">
          Loading products…
        </div>
      )}

      {!loading && error && (
        <div className="status-message error" data-testid="error">
          ⚠ {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="status-message" data-testid="no-results">
          No products found for "{query}".
        </div>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={addToCart}
          />
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
