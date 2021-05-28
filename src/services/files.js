import * as firebase from 'firebase'
import { notification } from 'antd'
import CircularJSON from 'circular-json'
import App, { analytics } from './user'
import { FolderModel, FileModel } from '../Models'
import { LOGS, getLocation } from '../components/helpers'

export async function CREATE(payload) {
  try {
    const { location, userProjects, folderName, ref, currentId, folder } = payload || {}
    const db = App.firestore()
    const batch = db.batch()
    const upd = ref.split('/')
    upd.splice(0, 2)
    const result = upd.join('/files/')
    let newRef = '/files/'
    newRef = newRef.concat(result)
    const TimeStamp = firebase.firestore.Timestamp.now()
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const flEntity = { ...FolderModel }
    const documentReference = db.collection(upd.length > 0 ? `${newRef}/files` : 'files').doc()

    flEntity.ref = documentReference.id
    flEntity.userID = userProjects.userID
    flEntity.userName = userProjects.userName
    flEntity.projectID = userProjects.projectID
    flEntity.createdAt = TimeStamp
    flEntity.updatedAt = TimeStamp
    flEntity.timestamp = TimeStamp
    flEntity.name = folderName
    flEntity.module = 'files'
    flEntity.position = geoPoint
    flEntity.parentRelatedRef = currentId === 'files' ? null : currentId || null
    flEntity.isFolder = folder

    const projectRef = db.collection('projects').doc(userProjects.projectID)

    batch.set(documentReference, flEntity)
    batch.update(projectRef, { updatedAt: TimeStamp })

    const logRef = db.collection('logs').doc()

    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'files', documentReference.id, userProjects, geoPoint, TimeStamp),
    )

    await batch.commit()
    analytics.logEvent('WEB_FILES_CREATE_FOLDER_BATCH', flEntity)
    return flEntity
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
export async function FOLDER_BY_PROJECT_ID({ projectId }) {
  try {
    const data = []
    await App.firestore()
      .collection('files')
      .where('deleted', '==', false)
      .where('projectID', '==', projectId)
      .get()
      .then(querSnapShot => {
        querSnapShot.forEach(doc => {
          const response = { ...doc.data() }
          response.id = doc.id
          data.push(response)
        })
      })
    analytics.logEvent('WEB_FILES_GET_FOLDER_BY_PROJECT_ID_QUERY', { data })
    return data
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
export async function FOLDER_BY_FILES_ID({ Id }) {
  try {
    const data = []
    await App.firestore()
      .collection('files')
      .doc(Id)
      .get()
      .then(doc => {
        const response = { ...doc.data() }
        response.id = doc.id
        data.push(response)
      })
    analytics.logEvent('WEB_FILES_GET_FOLDER_BY_FILES_ID_QUERY', { data })
    return data
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function FOLDER_BY_ID(payload) {
  try {
    const data = []
    const upd = payload.Id.split('/')
    upd.splice(0, 2)
    const result = upd.join('/files/')
    let newRef = '/files/'
    newRef = newRef.concat(result)

    await App.firestore()
      .collection(`${newRef}/files`)
      .where('deleted', '==', false)
      .get()
      .then(querSnapShot => {
        querSnapShot.forEach(doc => {
          const response = { ...doc.data() }
          response.id = doc.id
          data.push(response)
        })
      })
    analytics.logEvent('WEB_FILES_GET_FOLDER_BY_ID_QUERY', { data })
    return data
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function UPLOAD_FILES(payload) {
  try {
    const db = App.firestore()
    const batch = db.batch()
    const { location, userProjects, ref, currentId, files } = payload || {}
    const upd = ref.split('/')
    upd.splice(0, 2)
    const result = upd.join('/files/')
    let newRef = '/files/'
    newRef = newRef.concat(result)
    const updated = []
    const projectget = await db
      .collection('projects')
      .doc(userProjects.projectID)
      .get()
      .then(doc => doc.data())

    const limit = projectget.spaceLimit
    const spaceUsed = projectget && projectget.spaceUsed

    let fileSize = 0

    files.forEach(ele => {
      fileSize += ele.size / 1000000 / 1024
    })

    const updatedSpace = spaceUsed + fileSize

    if (parseInt(updatedSpace, 0) >= limit) throw Error('Your Cloud Limit Over')
    const TimeStamp = firebase.firestore.Timestamp.now()
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    await Promise.all(
      files.map(async item => {
        const flEntity = { ...FileModel }
        const { type, size, name } = item || {}
        const documentReference = db.collection(upd.length > 0 ? `${newRef}/files` : 'files').doc()
        flEntity.ref = documentReference.id
        flEntity.userID = userProjects.userID
        flEntity.userName = userProjects.userName
        flEntity.projectID = userProjects.projectID
        flEntity.createdAt = TimeStamp
        flEntity.updatedAt = TimeStamp
        flEntity.timestamp = TimeStamp
        flEntity.name = name || 'document'
        flEntity.ext = type || null
        flEntity.type = type || null
        flEntity.mime = type || null
        flEntity.position = geoPoint
        flEntity.parentRelatedRef = currentId === 'files' ? null : currentId || null
        flEntity.sizeInGb = (size && size / 1000000) / 1024 || null
        const storageRef = firebase
          .storage()
          .ref(`bucket/projects/${userProjects.projectId}/files/${documentReference.id}`)
        const uploadTask = await storageRef.child(item.name || 'document').put(item.originFileObj)
        const url = await uploadTask.ref.getDownloadURL().then(downloadURL => downloadURL)
        // updatedSpace += size / 1000000

        flEntity.storageUrl = url

        const logRef = db.collection('logs').doc()

        batch.set(
          logRef,
          LOGS('logs', logRef.id, 'files', documentReference.id, userProjects, geoPoint, TimeStamp),
        )

        updated.push(flEntity)

        batch.set(documentReference, flEntity)
      }),
    )
    const project = db.collection('projects').doc(userProjects.projectID)
    batch.update(project, { spaceUsed: updatedSpace, updatedAt: TimeStamp })
    analytics.logEvent('WEB_FILES_CREATE_FILE_BATCH', { files: CircularJSON.stringify(updated) })
    await batch.commit()
    return updated
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function UPDATE_FOLDER_NAME(payload) {
  try {
    const db = App.firestore()
    const batch = db.batch()
    const TimeStamp = firebase.firestore.Timestamp.now()
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const { folderData, url, folderName, userProjects } = payload
    const upd = url.split('/')
    upd.splice(0, 2)
    const result = upd.join('/files/')
    let newRef = '/files/'
    newRef = newRef.concat(result)
    const documentReference = db
      .collection(upd.length > 0 ? `${newRef}/files` : 'files')
      .doc(folderData.ref)
    batch.update(documentReference, { name: folderName, updatedAt: TimeStamp })
    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'files', documentReference.id, userProjects, geoPoint, TimeStamp),
    )
    analytics.logEvent('WEB_FILES_UPDATE_NAME_QUERY', { name: folderName, updatedAt: TimeStamp })
    await batch.commit()
    return true
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function SOFT_DELETE({ file, url, userProjects }) {
  try {
    const db = App.firestore()
    const batch = db.batch()
    const upd = url.split('/')
    upd.splice(0, 2)
    const result = upd.join('/files/')
    let newRef = '/files/'
    newRef = newRef.concat(result)

    const TimeStamp = firebase.firestore.Timestamp.now()
    const deleteRef = db.collection('deletions').doc()
    const documentReference = db
      .collection(upd.length > 0 ? `${newRef}/files` : 'files')
      .doc(file.ref)
    batch.update(documentReference, { deleted: true, deletedAt: TimeStamp })
    batch.set(deleteRef, {
      ref: deleteRef.id,
      userID: file.userID,
      module: file.module,
      projectID: file.projectID,
      deletionRef: newRef,
      deletionID: file.ref,
      deletionAt: TimeStamp,
    })

    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'files', documentReference.id, userProjects, geoPoint, TimeStamp),
    )

    await batch.commit()
    analytics.logEvent('WEB_FILES_SOFT_DELETE_BATCH', {
      ref: deleteRef.id,
      userID: file.userID,
      module: file.module,
      projectID: file.projectID,
      deletionRef: newRef,
      deletionID: file.ref,
      deletionAt: TimeStamp,
    })
    return true
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
