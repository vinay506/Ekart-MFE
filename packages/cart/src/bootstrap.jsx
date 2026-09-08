import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import Cart from './components/Cart';
import cartReducer from './store/cartSlice';
import { watchCartSaga } from './store/cartSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { cart: cartReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(watchCartSaga);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Cart />
  </Provider>
);
