import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import project from './project/sagas'
import record from './record/sagas'
import files from './files/sagas'

export default function* rootSaga() {
  yield all([user(), menu(), settings(), project(), record(), files()])
}
