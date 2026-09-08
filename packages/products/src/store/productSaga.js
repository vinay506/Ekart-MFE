import { call, put, takeLatest, debounce } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
} from './productSlice';

const BASE_URL = 'https://dummyjson.com/products';
const LIMIT = 20;

function* fetchProductsSaga(action) {
  try {
    const query = typeof action?.payload === 'string' ? action.payload : '';
    const url = query
      ? `${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${LIMIT}`
      : `${BASE_URL}?limit=${LIMIT}`;

    const { data } = yield call(axios.get, url);
    yield put(fetchProductsSuccess({ products: data.products, total: data.total }));
  } catch (err) {
    yield put(fetchProductsFailure(err.message));
  }
}

export function* watchFetchProducts() {
  // Full fetch triggered manually
  yield takeLatest(fetchProductsStart.type, fetchProductsSaga);
  // Debounced search as user types
  yield debounce(400, setSearchQuery.type, fetchProductsSaga);
}
