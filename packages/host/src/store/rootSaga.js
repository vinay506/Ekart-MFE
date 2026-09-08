import { all } from 'redux-saga/effects';

// Remote sagas are forked here after being loaded via Module Federation
export default function* rootSaga() {
  yield all([]);
}
