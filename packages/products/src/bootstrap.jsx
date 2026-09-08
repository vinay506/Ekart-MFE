import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import ProductList from './components/ProductList';
import productReducer from './store/productSlice';
import { watchFetchProducts } from './store/productSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { products: productReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(watchFetchProducts);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ProductList />
  </Provider>
);
