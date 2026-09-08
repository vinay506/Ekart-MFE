import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  app:  (state = { ready: true }, _action) => state,
  auth: authReducer,
});

export default rootReducer;
