import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { syncStart, syncSuccess, syncFailure } from './cartSlice';

function* syncCartSaga() {
  try {
    // Replace with a real API call: yield call(api.syncCart, items)
    yield delay(500);
    yield put(syncSuccess());
  } catch (err) {
    yield put(syncFailure(err.message));
  }
}

export function* watchCartSaga() {
  yield takeLatest(syncStart.type, syncCartSaga);
}
