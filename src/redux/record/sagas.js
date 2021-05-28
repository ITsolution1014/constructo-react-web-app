import { all, takeEvery, call, put } from 'redux-saga/effects'
import { notification } from 'antd'
import actions from './action'
import * as Services from '../../services/record'

export function* CREATE_RECORD({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { create: true } })
  const response = yield call(Services.CREATE, payload, payload.recordId)
  const { Id, updatedRecordData } = response || {}
  let urls

  if (Id && payload.files) {
    yield put({ type: 'record/SET_STATE', payload: { loading: true } })
    urls = yield call(Services.UploadFiles, Id, payload.files, payload.projectID)
  }
  if (urls && urls.length > 0 && payload.files) {
    const file = yield call(Services.CREATEFILERECORD, Id, urls, payload)
    file.forEach(ele => {
      ele.recordId = Id
    })
    const recFiles = (payload.recordFiles && payload.recordFiles) || []
    const updatedFiles = [...recFiles, ...file]
    yield put({ type: 'record/SET_STATE', payload: { loading: false, files: updatedFiles } })
  }

  if (!payload.files && Id)
    yield put({ type: 'record/SET_STATE', payload: { create: false, recordId: Id, created: true } })
  if (!payload.deleted) {
    const rec = (payload.records && payload.records) || []
    rec.push(updatedRecordData)
    yield put({ type: 'record/SET_STATE', payload: { loading: false, records: rec } })
  }
  notification.success({
    message: 'Record Message',
    description:
      payload.files.length > 0 ? 'Files Upload Successfully ' : 'Record Successfully Created',
  })
  yield put({ type: 'record/SET_STATE', payload: { created: false, recordId: Id, create: false } })
}

export function* GET_RECORDS({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })
  let response
  if (payload.projects) response = yield call(Services.GetRecords, payload.projects)
  yield put({ type: 'record/SET_STATE', payload: { loading: false, records: response } })
}

export function* GET_RECORDS_BY_ID({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })
  let response
  if (payload.recordId) response = yield call(Services.GetRecordsByID, payload.recordId)
  let files
  if (payload.recordId && response !== undefined)
    files = yield call(Services.GetFilesByID, payload.recordId)
  let weathers
  if (payload.recordId)
    weathers = yield call(Services.GetWeathersByID, payload.recordId, response, payload.location)
  yield put({
    type: 'record/SET_STATE',
    payload: { loading: false, recordDetails: response, files, weathers },
  })
}

export function* UPDATE_RECORDS({ payload }) {
  const records = [...payload.records]
  let response
  if (payload.recordDetails.ID && !payload.filesData) {
    yield put({ type: 'record/SET_STATE', payload: { create: true } })
    yield call(Services.UpdateRecords, payload)
    if (records) {
      records.forEach(ele => {
        if (ele.ID === payload.recordDetails.ID) {
          ele.content = payload.content
          ele.category = payload.category
        }
      })
      response = records
    }
  }
  let urls
  if (payload.filesData) {
    yield put({ type: 'record/SET_STATE', payload: { loading: true } })
    urls = yield call(
      Services.UploadFiles,
      payload.recordDetails.ID,
      payload.filesData,
      payload.recordDetails.projectID,
    )
  }

  const data = {
    location: payload.recordDetails.positionIn || payload.recordDetails.positionOut,
    ID: payload.recordDetails.userID,
    userName: payload.recordDetails.userName,
    projectID: payload.recordDetails.projectID,
    userProjects: payload.userProjects,
  }
  let files

  if (urls && urls.length > 0 && payload.filesData) {
    const file = yield call(Services.CREATEFILERECORD, payload.recordDetails.ID, urls, data)

    if (file) {
      file.forEach(ele => {
        ele.recordId = payload.recordDetails.ID
      })
      const oldFiles = (payload.filesRecord && payload.filesRecord) || []
      files = [...oldFiles, ...file]
    }
  }

  if (!payload.filesData) {
    yield put({
      type: 'record/SET_STATE',
      payload: { create: false, recordDetails: response, created: true },
    })
    notification.success({
      message: 'Record Message',
      description: 'Record Successfully Updated',
    })
  }

  if (urls && urls.length > 0 && payload.filesData) {
    yield put({
      type: 'record/SET_STATE',
      payload: { create: false, files, loading: false, created: false },
    })
  } else {
    yield put({
      type: 'record/SET_STATE',
      payload: { create: false, loading: false, created: false },
    })
  }
}

export function* SOFT_DELETE_RECORD({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })

  const res = yield call(Services.SoftDeleteRecord, payload.recordId, payload.records)
  const updatedRecords = [...payload.records]
  updatedRecords.forEach(ele => {
    if (ele.ID === payload.recordId) {
      ele.deleted = true
      ele.deletedAt = res
    }
  })
  if (res)
    yield put({ type: 'record/SET_STATE', payload: { loading: false, records: updatedRecords } })
  else {
    yield put({ type: 'record/SET_STATE', payload: { loading: false } })
  }
}

export function* HARD_DELETE_RECORD({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })
  const res = yield call(Services.HardDeleteRecord, payload.recordId, payload.records)

  const updatedRecords = payload.records.filter(ele => ele.ID !== payload.recordId)
  if (res)
    yield put({ type: 'record/SET_STATE', payload: { loading: false, records: updatedRecords } })
  else {
    yield put({ type: 'record/SET_STATE', payload: { loading: false } })
  }
}

export function* SET_LOCATION({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { location: payload.location } })
}

export function* SIGN_RECORD_BY_ID({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { signing: true } })
  const signatureData = yield call(Services.SignRecordById, payload)

  const success = yield call(Services.CreateSignatureData, payload, signatureData)

  if (success) {
    const updatedRecords = [...payload.records]
    yield put({ type: 'record/SET_STATE', payload: { sign: true } })
    updatedRecords.forEach(ele => {
      if (ele.ID === payload.recordDetails.ID) {
        ele.signed = true
        ele.signedAt = success
      }
    })
    yield put({
      type: 'record/SET_STATE',
      payload: { signing: false, sign: false, records: updatedRecords, verificationCode: '' },
    })
    notification.success({
      message: 'Record Message',
      description: 'Record Successfully Signed',
    })
  }
  yield put({ type: 'record/SET_STATE', payload: { signing: false, sign: false } })
}

export function* DELETE_RECORD_FILE({ fileData, files }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })
  const deleteFileMessage = yield call(Services.DeleteFile, fileData)

  if (deleteFileMessage) {
    const updatedFiles = [...files]
    const removeFiles = updatedFiles.filter(ele => ele.ID !== fileData.ID)
    yield put({ type: 'record/SET_STATE', payload: { loading: false, files: removeFiles } })
    notification.success({
      message: 'File Message',
      description: 'File Delete Successfully',
    })
  } else {
    yield put({ type: 'record/SET_STATE', payload: { loading: false } })
  }
}

// export function* REMOVE_WEATHER() {
//   console.log('working')
//   yield put({ type: 'record/SET_STATE', payload: { weathers: '', recordId: '' } })
// }

export function* DOWNLOAD_PDF({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { downloading: true } })
  const record = { ...payload.record }
  const outPosition = {
    outLat: record.positionIn.latitude,
    outLong: record.positionOut.longitude,
    recordId: record.ID,
    record,
  }
  const { url } = yield call(Services.PDFfGenereator, outPosition) || {}

  if (payload.from === 'recordList' && payload.records) {
    const updatedRecords = [...payload.records]
    updatedRecords.forEach(ele => {
      if (ele.ID === record.ID) ele.signedUrl = url
    })

    yield put({
      type: 'record/SET_STATE',
      payload: { downloading: false, download: true, records: updatedRecords },
    })
  } else {
    record.signedUrl = url
    // setTimeout(()=>window.open(url,'_self'),3000)
    window.open(url, '_self')
    yield put({
      type: 'record/SET_STATE',
      payload: { downloading: false, download: true, records: record },
    })
  }

  yield put({ type: 'record/SET_STATE', payload: { downloading: false, download: false } })
}

export function* RECOVERRECORD({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { loading: true } })
  const { recordDetails, records } = payload
  const res = yield call(Services.RECOVER_RECORD, recordDetails)
  if (res) {
    const updatedRecords = [...records]
    updatedRecords.forEach(ele => {
      if (ele.ID === recordDetails.ID) {
        ele.deleted = false
        ele.deletedAt = null
      }
    })
    yield put({
      type: 'record/SET_STATE',
      payload: { loading: false, recoverd: true, records: updatedRecords },
    })
    notification.success({ message: 'Record Successfully Recover' })
  }
  yield put({ type: 'record/SET_STATE', payload: { loading: false, recoverd: false } })
}

export function* MESSAGESENT({ payload }) {
  yield put({ type: 'record/SET_STATE', payload: { signing: true } })
  const response = yield call(Services.SENT_MESSAGE, payload.phoneNumber, payload.locale)
  // console.log(response)
  if (response) {
    yield put({
      type: 'record/SET_STATE',
      payload: { verificationCode: response?.verifactionCode, signing: false, isSent: true },
    })
    yield put({ type: 'record/SET_STATE', payload: { isSent: false } })
  } else yield put({ type: 'record/SET_STATE', payload: { signing: false } })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE, CREATE_RECORD),
    takeEvery(actions.GET_RECORD, GET_RECORDS),
    takeEvery(actions.GET_RECORDBYID, GET_RECORDS_BY_ID),
    takeEvery(actions.UPDATE, UPDATE_RECORDS),
    takeEvery(actions.LOCATION, SET_LOCATION),
    takeEvery(actions.SOFTDELETERECORD, SOFT_DELETE_RECORD),
    takeEvery(actions.HARDDELETERECORD, HARD_DELETE_RECORD),
    takeEvery(actions.SIGN, SIGN_RECORD_BY_ID),
    takeEvery(actions.DELETE_RECORDS_FILE_BY_ID, DELETE_RECORD_FILE),
    // takeEvery(actions.WEAHER_REMOVE, REMOVE_WEATHER),
    takeEvery(actions.RECOVER, RECOVERRECORD),
    takeEvery(actions.PDF, DOWNLOAD_PDF),
    takeEvery(actions.MESSAGE, MESSAGESENT),
  ])
}
