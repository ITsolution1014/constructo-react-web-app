import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import CircularJSON from 'circular-json'
import * as Services from '../../services/files'
import action from './actions'

export function* CREATEFOLDER({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { loading: true } })
  const response = yield call(Services.CREATE, payload)
  if (response) {
    console.log(response, '12121')
    const updatedFolders = payload.folders ? [...payload.folders] : []
    updatedFolders.push(response)
    yield put({ type: 'files/SET_STATE', payload: { loading: false, folders: updatedFolders } })
    notification.success({
      message: 'Folder Message',
      description: 'Folder Is Successfully Added',
    })
  } else yield put({ type: 'files/SET_STATE', payload: { loading: false } })
}

export function* GET_FILES_DATA_BY_ID({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { loading: true } })
  const data = yield call(Services.FOLDER_BY_PROJECT_ID, payload)
  if (data) yield put({ type: 'files/SET_STATE', payload: { loading: false, folders: data } })
  else yield put({ type: 'files/SET_STATE', payload: { loading: false } })
}

export function* GET_FILES_BY_ID({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { loading: true } })
  const data = yield call(Services.FOLDER_BY_FILES_ID, payload)
  if (data) yield put({ type: 'files/SET_STATE', payload: { loading: false, folders: data } })
  else yield put({ type: 'files/SET_STATE', payload: { loading: false } })
}
export function* GET_FOLDER_DATA_BY_ID({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { loading: true } })
  const data = yield call(Services.FOLDER_BY_ID, payload)
  if (data) yield put({ type: 'files/SET_STATE', payload: { loading: false, folders: data } })
  else yield put({ type: 'files/SET_STATE', payload: { loading: false } })
}
export function* UPDATE_FOLDER({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { loading: true } })
  const success = yield call(Services.UPDATE_FOLDER_NAME, payload)
  if (success) {
    const { folders, folderData, folderName } = payload
    const updatedFolders = [...folders]
    updatedFolders.forEach(ele => {
      if (ele.ref === folderData.ref) {
        ele.name = folderName
      }
    })
    notification.success({
      message: 'Folder Message',
      description: 'Folder Name Is Successfully Updated',
    })
    yield put({
      type: 'files/SET_STATE',
      payload: { loading: false, folders: updatedFolders, updated: true },
    })
    yield put({ type: 'files/SET_STATE', payload: { updated: false } })
  } else yield put({ type: 'files/SET_STATE', payload: { loading: false } })
}

export function* UPLOAD({ payload }) {
  yield put({ type: 'files/SET_STATE', payload: { uploading: true } })
  const response = yield call(Services.UPLOAD_FILES, payload)
  if (response) {
    const updatedFolders = payload.folders ? [...payload.folders] : []
    response.forEach(file => updatedFolders.push(file))
    const backData = CircularJSON.parse(localStorage.getItem('back'))
    if (backData) localStorage.setItem('back', CircularJSON.stringify(updatedFolders))
    const listData = CircularJSON.parse(localStorage.getItem('list'))
    if (listData) localStorage.setItem('list', CircularJSON.stringify(updatedFolders))

    yield put({
      type: 'files/SET_STATE',
      payload: { uploading: false, folders: updatedFolders, uploaded: true },
    })

    if (response && response.length - 1 === payload.files.length - 1) {
      notification.success({
        message: 'File Message',
        description: 'File Is Successfully Uploaded',
      })
    }
    yield put({ type: 'files/SET_STATE', payload: { uploaded: false } })
  } else yield put({ type: 'files/SET_STATE', payload: { uploading: false } })
}

export function* DELETE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })

  const { file, folders } = payload || {}
  const response = yield call(Services.SOFT_DELETE, payload)
  if (response) {
    const filteredData = folders && folders.filter(ele => ele.ref !== file.ref)

    const backData = CircularJSON.parse(localStorage.getItem('back'))
    if (backData) localStorage.setItem('back', CircularJSON.stringify(filteredData))

    yield put({ type: 'files/SET_STATE', payload: { loading: false, folders: filteredData } })
    notification.success({
      message: 'File Message',
      description: !file.isFolder
        ? 'File Is Successfully Deleted'
        : 'Folder Is Successfully Deleted',
    })
  } else yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export default function* rootSaga() {
  yield all([
    takeEvery(action.CREATE, CREATEFOLDER),
    takeEvery(action.GET_FOLDERS, GET_FILES_DATA_BY_ID),
    takeEvery(action.GET_FOLDER, GET_FOLDER_DATA_BY_ID),
    takeEvery(action.GET_FOLDER_BY_FILES_ID, GET_FILES_BY_ID),
    takeEvery(action.UPLOAD_FILES, UPLOAD),
    takeEvery(action.UPDATE_NAME, UPDATE_FOLDER),
    takeEvery(action.DELETE_FILE, DELETE),
  ])
}
