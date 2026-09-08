import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

/**
 * Factory — called once per server request (prevents state leaking between requests)
 * and once on the client at startup.
 *
 * RTK's getDefaultMiddleware() already includes redux-thunk.
 * We add redux-saga on top of it.
 */
export const createStore = (preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
    preloadedState,
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

// Client singleton
export default createStore();
