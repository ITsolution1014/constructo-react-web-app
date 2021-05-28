import { all, takeEvery, put, call } from 'redux-saga/effects'
import * as Services from 'services/user'
import actions from './actions'

import { customNotification } from '../../components/helpers'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })
  const success = yield call(Services.login, email, password)
  if (success) {
    yield put({ type: 'user/LOAD_CURRENT_ACCOUNT' })
    customNotification('success', 'Logged In', 'You have successfully logged in to Constructo')
  } else {
    yield put({ type: 'user/SET_STATE', payload: { loading: false } })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })
  const response = yield call(Services.currentAccount)

  if (response) {
    const { uid: id } = response
    const userData = yield call(Services.GET_USER, id)
    if (Object.keys(userData)?.length) {
      const { name, surname, email, projectID, projects, phone, title, ID } = userData
      yield put({
        type: 'user/SET_STATE',
        payload: {
          ID,
          name,
          surname,
          email,
          projectID,
          projects,
          phone,
          title,
          authorized: true,
          loading: false,
        },
      })
    }
  } else {
    yield put({ type: 'user/SET_STATE', payload: { loading: false } })
  }
}

export function* LOGOUT() {
  yield call(Services.logout)
  yield put({ type: 'CURRENTSTATE' })
  yield put({ type: 'CURRENTSTATE/Project' })
}

export function* SIGNUP({ payload }) {
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })
  const { email, password } = payload
  const response = yield call(Services.signUp, email, password)
  const User = yield call(Services.CREATE_USER, response?.user?.uid, payload)
  const response2 = yield call(Services.SearchEmail, email)
  const { emailData, rolesId } =
    response2 && response2.emailData && response2.rolesId ? response2 : {}

  if (emailData !== undefined && rolesId !== undefined) {
    yield call(Services.addUserToProject, emailData.id, rolesId, response?.user?.uid, email)
  }
  if (User) {
    customNotification('success', 'SignUp', 'You have successfully SignUp in to Constructo')
    yield call(Services.logout)
    yield put({ type: 'user/SET_STATE', payload: { signUp: true, loading: false } })
    yield put({ type: 'CURRENTSTATE' })
  } else {
    yield call(Services.logout)
    yield put({ type: 'CURRENTSTATE' })
  }
}

export function* RESET({ payload }) {
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })
  const { email } = payload
  const response = yield call(Services.reset, email)
  if (response) {
    yield put({ type: 'user/SET_STATE', payload: { reset: true } })
    yield put({ type: 'CURRENTSTATE' })
    customNotification(
      'success',
      'Password Reset',
      'New password link has been sent to given email',
    )
  } else {
    yield put({ type: 'user/SET_STATE', payload: { loading: false } })
  }
}

export function* PROFILE({ payload }) {
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })
  const { name, surname, title, phone } = payload
  const user = yield call(Services.UPDATE_PROFILE, name, surname, title, phone)
  if (user) {
    yield put({
      type: 'user/SET_STATE',
      payload: { loading: false, profile: true, name, surname, title, phone },
    })
    customNotification('success', 'Profile Message', 'Profile successfully Update')
    yield put({ type: 'user/SET_STATE', payload: { profile: false } })
  } else {
    yield put({ type: 'user/SET_STATE', payload: { loading: false } })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.SIGN_UP, SIGNUP),
    takeEvery(actions.RESET, RESET),
    takeEvery(actions.PROFILE_UPDATE, PROFILE),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),

    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
