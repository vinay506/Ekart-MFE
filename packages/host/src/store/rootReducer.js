import { combineReducers } from '@reduxjs/toolkit';

// The host shell only owns app-level state.
// Each remote injects its own reducer when it mounts.
const rootReducer = combineReducers({
  app: (state = { ready: true }, _action) => state,
});

export default rootReducer;
