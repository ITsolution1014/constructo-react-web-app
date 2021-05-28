import * as firebase from 'firebase'
import * as platform from 'platform'
import * as jsrsan from 'jsrsasign'
import { notification } from 'antd'
import CircularJSON from 'circular-json'
// import CryptoJS from 'crypto-js'
import App, { analytics } from './user'
// import { recordData, filesData, Signature, keyEntity } from './recordData'
import { FileModel, RecordModel, SignatureModel, KeyModel } from '../Models'
import { computeChecksumMd5, LOGS, getLocation } from '../components/helpers'

export async function CREATE(data, recordId) {
  try {
    const multiIds = recordId || data.ID
    const TimeStamp = firebase.firestore.Timestamp.now()
    const db = App.firestore()
    const batch = db.batch()
    const ref = data.recordId
      ? db.collection('records').doc(multiIds)
      : db.collection('records').doc()

    if (!data.deleted) {
      const weatherRef = db
        .collection('records')
        .doc(ref.id)
        .collection('weathers')
        .doc()
      batch.set(weatherRef, {
        ref: weatherRef.id,
        createdAt: TimeStamp,
        updatedAt: TimeStamp,
        ...data.weathers,
      })
    }
    // const { uid } = firebase.auth().currentUser
    // const userName = await db.collection("users").doc(uid).get().then(doc => doc.data())
    const updatedRecordData = { ...RecordModel }
    const geoPoint = data.location.latitude
      ? new firebase.firestore.GeoPoint(data.location.latitude, data.location.longitude)
      : ''
    updatedRecordData.ID = ref.id
    updatedRecordData.ref = `/records/${ref.id}`
    updatedRecordData.category = data.category || []
    updatedRecordData.userName = data.userName || ''
    updatedRecordData.userID = data.ID || ''
    updatedRecordData.createdAt = TimeStamp
    updatedRecordData.updatedAt = TimeStamp
    updatedRecordData.timestamp = TimeStamp
    updatedRecordData.positionIn = geoPoint || {}
    updatedRecordData.positionOut = geoPoint || {}
    updatedRecordData.deleted = data.deleted || false
    updatedRecordData.projectID = data.projectID || ''
    updatedRecordData.content = data.content || ''
    updatedRecordData.deleted = data.deleted || updatedRecordData.deleted
    batch.set(ref, updatedRecordData)
    const projectUpdateRef = db.collection('projects').doc(data.projectID)
    batch.update(projectUpdateRef, { updatedAt: TimeStamp })
    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'records', ref.id, updatedRecordData, geoPoint, TimeStamp),
    )

    batch.commit()
    analytics.logEvent('WEB_RECORDS_CREATE_RECORD_BATCH', updatedRecordData)
    return { Id: ref.id, updatedRecordData }
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function UploadFiles(recordId, files, projectId) {
  try {
    const projectget = await App.firestore()
      .collection('projects')
      .doc(projectId)
      .get()
      .then(doc => doc.data())

    const limit = projectget.spaceLimit
    const spaceUsed = projectget && projectget.spaceUsed

    let fileSize = 0

    files.forEach(ele => {
      fileSize += ele.originFileObj.size / 1000000 / 1024
    })

    const updatedSpace = spaceUsed + fileSize

    if (parseInt(updatedSpace, 0) >= limit) throw Error('Your Cloud Limit Over')

    const urls = []
    await Promise.all(
      files.map(async item => {
        const storageRef = firebase
          .storage()
          .ref(`bucket/projects/${projectId}/records/${recordId}/`)
        const hash = await computeChecksumMd5(item.originFileObj)
        const hashValue = await hash
        const uploadTask = await storageRef.child(item.name || 'document').put(item.originFileObj)
        const url = await uploadTask.ref.getDownloadURL().then(downloadURL => downloadURL)
        urls.push({
          url,
          name: item.originFileObj.name || 'document',
          type: item.originFileObj.type || 'document',
          size: item.originFileObj.size / 1000000 / 1024,
          hash: hashValue,
        })
      }),
    )
    analytics.logEvent('WEB_RECORDS_UPLOAD_FILE_QUERY', { files })
    return urls
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
export async function CREATEFILERECORD(Id, urls, data) {
  try {
    const db = App.firestore()
    const batch = db.batch()
    const TimeStamp = firebase.firestore.Timestamp.now()
    const geoPoint = data.location.latitude
      ? new firebase.firestore.GeoPoint(data.location.latitude, data.location.longitude)
      : ''
    const project = await db
      .collection('projects')
      .doc(data.projectID)
      .get()
      .then(doc => doc.data())

    let totalFileSize = project.spaceUsed
    const projectSpaceRef = db.collection('projects').doc(data.projectID)
    const FilesData = []
    urls.forEach(async (item, index) => {
      const ref = db
        .collection('records')
        .doc(Id)
        .collection('files')
        .doc()

      const FileData = { ...FileModel }
      FileData.storageUrl = item.url
      FileData.ref = `files/${ref.id}`
      FileData.ID = ref.id
      FileData.userID = data.ID
      FileData.userName = data.userName
      FileData.projectID = data.projectID
      FileData.position = geoPoint
      FileData.parentRelatedRef = `records/${Id}/files`
      FileData.parentVersionRef = null
      FileData.createdAt = TimeStamp
      FileData.updatedAt = TimeStamp
      FileData.timestamp = TimeStamp
      FileData.ref = `files/${ref.id}`
      FileData.ext = item.type
      FileData.mime = item.type
      FileData.name = item.name
      FileData.type = item.type
      FileData.sizeInGb = item.size
      FileData.hashValue = item.hash

      totalFileSize += item.size
      FilesData.push(FileData)
      batch.set(ref, FileData)
      // const logRef = db.collection('logs').doc()
      // batch.set(logRef, LOGS('logs', logRef.id, 'files', ref.id, FileData, geoPoint, TimeStamp))

      analytics.logEvent('WEB_RECORDS_CREATE_FILE_BATCH', FileData)

      if (urls && urls.length - 1 === index) {
        batch.update(projectSpaceRef, {
          spaceUsed: totalFileSize,
          updatedAt: TimeStamp,
        })
        batch.commit()
      }
    })
    const files = FilesData
    return files
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function GetRecords(projects) {
  try {
    const data = []
    await App.firestore()
      .collection('records')
      .where('projectID', 'in', [projects])
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          data.push(doc.data())
        })
      })
    analytics.logEvent('WEB_RECORDS_GET_RECORDS_QUERY', data)
    return data
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function GetRecordsByID(recordId) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const response = await App.firestore()
      .collection('records')
      .doc(recordId)
      .get()
      .then(doc => doc.data())
    if (response) {
      const TimeStamp = firebase.firestore.Timestamp.now()
      const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

      const logRef = App.firestore()
        .collection('logs')
        .doc()
      await logRef.set(
        LOGS('logs', logRef.id, 'records', response.ID, response, geoPoint, TimeStamp),
      )
    }

    analytics.logEvent('WEB_RECORDS_GET_RECORDS_BY_ID_QUERY', response)
    return response
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function UpdateRecords(data) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const { content, category, recordDetails } = data || {}
    const db = App.firestore()
    const batch = db.batch()
    const TimeStamp = firebase.firestore.Timestamp.now()
    const recordRef = db.collection('records').doc(recordDetails.ID)
    const projectUpdateRef = db.collection('projects').doc(recordDetails.projectID)
    batch.update(recordRef, {
      category: category || recordDetails.category,
      content: content || recordDetails.content,
      updatedAt: TimeStamp,
    })
    batch.update(projectUpdateRef, { updatedAt: TimeStamp })

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'records', recordRef.id, recordDetails, geoPoint, TimeStamp),
    )

    batch.commit()
    analytics.logEvent('WEB_RECORDS_UPDATE_RECORD_BATCH', {
      category: category || recordDetails.category,
      content: content || recordDetails.content,
      updatedAt: TimeStamp,
    })
    return true
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function GetFilesByID(recordId) {
  try {
    const response = []
    await App.firestore()
      .collection('records')
      .doc(recordId)
      .collection('files')
      .get()
      .then(snapShot => {
        snapShot.forEach(doc => {
          const file = doc.data()
          file.ID = doc.id
          file.recordID = recordId
          response.push(file)
        })
      })
    analytics.logEvent('WEB_RECORDS_GET_RECORD_FILES_QUERY', response)
    return response
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function GetWeathersByID(Id, res, location) {
  const TimeStamp = firebase.firestore.Timestamp.now()
  const weatherInfoPath = `${process.env.REACT_APP_FUNCTIONS_PATH}/weatherInfo`;

  try {
    let response
    if (res === undefined || res === null || res === '') {
      const raw = CircularJSON.stringify({
        lat: location.location.latitude,
        lng: location.location.longitude,
        date: new Date().toDateString(),
        projectId: Id,
        TimeStamp,
      })

      const requestOptions = {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: raw,
        redirect: 'follow',
      }

      const weather = await fetch(
        weatherInfoPath,
        requestOptions,
      ).then(data => data.json())
      const updatedWeather = await weather
      response = updatedWeather
      analytics.logEvent('WEB_RECORDS_WEATHER_FF_CALL', updatedWeather)
    } else {
      await App.firestore()
        .collection('records')
        .doc(Id)
        .collection('weathers')
        .get()
        .then(snapShot => {
          snapShot.forEach(doc => {
            response = doc.data()
          })
        })

      const geoPoint = new firebase.firestore.GeoPoint(
        location.location.latitude,
        location.location.longitude,
      )
      const logRef = App.firestore()
        .collection('logs')
        .doc()
      await logRef.set(LOGS('logs', logRef.id, 'records', res.ID, res, geoPoint, TimeStamp))
    }
    analytics.logEvent('WEB_RECORDS_WEATHER_FF_CALL', response)
    return response
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function SignRecordById({ files, location, recordDetails, userProjects, weathers }) {
  try {
    const position = location.latitude
      ? new firebase.firestore.GeoPoint(location.latitude, location.longitude)
      : location
    const weather = {
      temperature: (weathers && weathers.mainTemperature.max) || null,
      rain: (weathers && weathers.rain) || null,
      windSpeed: (weathers && weathers.windSpeed) || null,
      humidity: (weathers && weathers.humidity) || null,
      pressure: (weathers && weathers.pressure) || null,
    }
    const sortWeather = CircularJSON.stringify(weather, Object.keys(weather).sort())
    const sortFiles = []
    files.forEach(item => sortFiles.push(CircularJSON.stringify(item, Object.keys(item).sort())))
    const parseFiles = []
    sortFiles.forEach((ele, i) => {
      const parseItem = CircularJSON.parse(ele)
      if (parseItem.ID === files[i].ID) {
        parseItem.createdAt = files[i].createdAt
        // parseItem.updatedAt = files[i].updatedAt
        parseItem.position = files[i].position
        parseItem.timestamp = files[i].timestamp
        parseFiles.push(parseItem)
      }
    })

    const signedPdfData = {
      createdAt: userProjects.createdAt || null,
      content: recordDetails.content || null,
      category: recordDetails.category || [],
      deleted: false,
      files: parseFiles || [],
      ID: recordDetails.ID,
      name: userProjects.name || null,
      projectID: userProjects.ID || null,
      positionIn: recordDetails.positionIn || null,
      positionOut: position || null,
      userName: userProjects.userName || null,
      userID: recordDetails.userID,
      signed: true,
      signedAt: firebase.firestore.Timestamp.now(),
      // street:userProjects.street||null,
      // state:userProjects.state||null,
      weathers: CircularJSON.parse(sortWeather),
    }

    const Keypair = jsrsan.KEYUTIL.generateKeypair('RSA', 512)

    Keypair.prvKeyObj.isPrivate = true
    const privateKey = jsrsan.KEYUTIL.getPEM(Keypair.prvKeyObj, 'PKCS1PRV')
    const publicKey = jsrsan.KEYUTIL.getPEM(Keypair.prvKeyObj)

    const sig = new jsrsan.KJUR.crypto.Signature({ alg: 'SHA1withRSA' })
    sig.init(privateKey)
    sig.updateString(signedPdfData)
    const signature = sig.sign()

    const TimeStamp = firebase.firestore.Timestamp.now()
    const logRef = App.firestore()
      .collection('logs')
      .doc()
    await logRef.set(
      LOGS('logs', logRef.id, 'records', recordDetails.ID, userProjects, position, TimeStamp),
    )

    analytics.logEvent('WEB_RECORDS_SIGN_RECORD_QUERY', signedPdfData)
    return { privateKey, publicKey, signature }
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function PDFfGenereator(data) {
  const generatePdfPath = `${process.env.REACT_APP_FUNCTIONS_PATH}/generateRecordPDF`;

  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = CircularJSON.stringify(data)
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }
    const url = await fetch(
      generatePdfPath,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => result)

    const recordRef = db.collection('records').doc(data.recordId)

    const TimeStamp = firebase.firestore.Timestamp.now()
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const logRef = App.firestore()
      .collection('logs')
      .doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'records', recordRef.id, data.record, geoPoint, TimeStamp),
    )
    batch.update(recordRef, { signedUrl: url.url })

    await batch.commit()
    return url
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function CreateSignatureData(payload, signatureData) {
  try {
    const { publicKey, privateKey, signature } = signatureData
    const { location, recordDetails, verificationCode } = payload

    const signatureEntity = { ...SignatureModel }
    const timeStamp = firebase.firestore.Timestamp.now()
    const position = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const db = App.firestore()
    const batch = db.batch()
    const signRef = db
      .collection('records')
      .doc(recordDetails.ID)
      .collection('signatures')
      .doc()
    signatureEntity.ref = `signatures/${signRef.id}`
    signatureEntity.ID = signRef.id
    signatureEntity.userID = recordDetails.userID
    signatureEntity.userName = recordDetails.userName
    signatureEntity.projectID = recordDetails.projectID
    signatureEntity.createdAt = timeStamp
    signatureEntity.updatedAt = timeStamp
    signatureEntity.timestamp = timeStamp
    signatureEntity.parentRef = `records/${recordDetails.ID}`
    signatureEntity.parentID = recordDetails.ID
    signatureEntity.signature = signature
    signatureEntity.position = position
    signatureEntity.verificationKey = verificationCode
    signatureEntity.verificationMethod = 'sms'

    batch.set(signRef, signatureEntity)

    const privatekeyRef = db
      .collection('users')
      .doc(recordDetails.userID)
      .collection('keys')
      .doc()

    const privateKeyEntity = { ...KeyModel }

    privateKeyEntity.ref = `keys/${privatekeyRef.id}`
    privateKeyEntity.ID = privatekeyRef.id
    privateKeyEntity.userID = recordDetails.userID
    privateKeyEntity.userName = recordDetails.userName
    privateKeyEntity.projectID = recordDetails.projectID
    privateKeyEntity.createdAt = timeStamp
    privateKeyEntity.updatedAt = timeStamp
    privateKeyEntity.timestamp = timeStamp
    privateKeyEntity.signatureRef = `keys/${privatekeyRef.id}`
    privateKeyEntity.signatureID = signRef.id
    privateKeyEntity.signature = signature
    privateKeyEntity.key = privateKey
    privateKeyEntity.keyType = 'private'
    privateKeyEntity.position = position
    privateKeyEntity.platform = platform.description

    batch.set(privatekeyRef, privateKeyEntity)

    const publicKeyEntity = { ...KeyModel }

    const publicKeyRef = db
      .collection('projects')
      .doc(recordDetails.projectID)
      .collection('keys')
      .doc()

    publicKeyEntity.ref = `keys/${publicKeyRef.id}`
    publicKeyEntity.ID = publicKeyRef.id
    publicKeyEntity.userID = recordDetails.userID
    publicKeyEntity.userName = recordDetails.userName
    publicKeyEntity.projectID = recordDetails.projectID
    publicKeyEntity.createdAt = timeStamp
    publicKeyEntity.updatedAt = timeStamp
    publicKeyEntity.timestamp = timeStamp
    publicKeyEntity.signatureRef = `keys/${publicKeyRef.id}`
    publicKeyEntity.signatureID = signRef.id
    publicKeyEntity.signature = signature
    publicKeyEntity.key = publicKey
    publicKeyEntity.keyType = 'public'
    publicKeyEntity.position = position
    publicKeyEntity.platform = platform.description

    batch.set(publicKeyRef, publicKeyEntity)

    const recordRef = db.collection('records').doc(recordDetails.ID)

    batch.update(recordRef, {
      signedUrl: null,
      signedAt: timeStamp,
      signed: true,
      updatedAt: timeStamp,
    })

    const projectRef = db.collection('projects').doc(recordDetails.projectID)

    batch.update(projectRef, {
      updatedAt: timeStamp,
    })

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'records', recordRef.id, recordDetails, position, timeStamp),
    )

    batch.commit()
    analytics.logEvent('WEB_RECORDS_CREATE_SIGNATURE_DATA_BATCH', {
      signatureEntity,
      privateKeyEntity,
      publicKeyEntity,
    })

    return timeStamp
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function SoftDeleteRecord(recordId, records) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()
    const TimeStamp = firebase.firestore.Timestamp.now()
    const recordRef = db.collection('records').doc(recordId)
    batch.update(recordRef, {
      deleted: true,
      deletedAt: TimeStamp,
    })

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const record = records.filter(ele => ele.ID === recordId)

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'records', recordRef.id, record[0], geoPoint, TimeStamp),
    )

    batch.commit()
    analytics.logEvent('WEB_RECORDS_SOFT_DELETE_RECORD_QUERY', { recordId })
    return TimeStamp
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function HardDeleteRecord(recordId, records) {
  const deleteRecordPath = `${process.env.REACT_APP_FUNCTIONS_PATH}/deleteOneRecord`;

  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const raw = CircularJSON.stringify({
      recordId,
    })

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: raw,
      redirect: 'follow',
    }

    const res = await fetch(
      deleteRecordPath,
      requestOptions,
    ).then(data => data.json())

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const TimeStamp = firebase.firestore.Timestamp.now()
    const record = records.filter(ele => ele.ID === recordId)
    const logRef = App.firestore()
      .collection('logs')
      .doc()
    await logRef.set(LOGS('logs', logRef.id, 'records', recordId, record[0], geoPoint, TimeStamp))

    analytics.logEvent('WEB_RECORDS_DELETE_RECORD_FF_CALL', { recordId })
    if (res) return true
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function DeleteFile(file) {
  const deleteSingleFilePath = `${process.env.REACT_APP_FUNCTIONS_PATH}/deleteSingleFile\n`;

  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = CircularJSON.stringify({ recordId: file.recordId, fileId: file.ID })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    await fetch(
      deleteSingleFilePath,
      requestOptions,
    ).then(data => data.json())

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)
    const TimeStamp = firebase.firestore.Timestamp.now()
    const logRef = App.firestore()
      .collection('logs')
      .doc()
    await logRef.set(LOGS('logs', logRef.id, 'records', file.recordId, file, geoPoint, TimeStamp))

    analytics.logEvent('WEB_RECORDS_DELETE_FILE_FF_CALL', file)
    return true
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function RECOVER_RECORD(record) {
  // console.log({record})
  try {
    const db = App.firestore()
    const batch = db.batch()
    const TimeStamp = firebase.firestore.Timestamp.now()
    const recordRef = db.collection('records').doc(record.ID)
    batch.update(recordRef, { deleted: false, deletedAt: null, updatedAt: TimeStamp })

    const projectRef = db.collection('projects').doc(record.projectID)
    batch.update(projectRef, { updatedAt: TimeStamp })

    batch.commit()
    return true
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function SENT_MESSAGE(phoneNumber, language) {
  const smsVerificationPath = `${process.env.REACT_APP_FUNCTIONS_PATH}/SmsVerification`;

  try {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: CircularJSON.stringify({ phoneNumber, language }),
      redirect: 'follow',
    }

    const Sent = await fetch(
      smsVerificationPath,
      requestOptions,
    )

    const response = await Sent.json()
    if (response?.error) {
      notification.warning({
        message: response?.error.code,
        description: response?.error.moreInfo,
      })

      return false
    }
    return response
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message || error.moreInfo,
    })
  }
}
