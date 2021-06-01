import * as SparkMD5 from 'spark-md5'
import { notification } from 'antd'
import * as platform from 'platform'
// import { logs } from '../../services/defineRoles'
import { logs } from '../../Models'

export const handleTimeStamp = time => {
  const utcSeconds = time
  const d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds)

  const date = new Date(d).getDate()
  const month = new Date(d).getMonth()
  const year = new Date(d).getFullYear()

  const timeValue = d.toString().slice(16, 24)
  const timeStandard = d.toString().slice(34)

  return `${date}.${month + 1}.${year} ${timeValue} ${timeStandard}`
}

export const role = (id, projectRole) => {
  const uid = id || ''
  const rolesArray = (projectRole && projectRole) || []
  let data = ''
  rolesArray.forEach(rolesId => {
    if (rolesId && rolesId.users && rolesId.users.includes(uid)) {
      data = rolesId.rolesRule
    }
  })
  return data
}

export const getLocation = (param, dispatch, setState) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (param === 'componentDidMount') {
          setState({ location: position.coords })
          dispatch({ type: 'records/Location', payload: { location: position.coords } })
        } else {
          dispatch({ type: 'records/Location', payload: { location: position.coords } })
          resolve({ location: position.coords })
        }
      },
      () => {
        notification.error({ message: 'Please Enable geoLocation For Use this Feature' })
        reject()
      },
    )
  })
}

export const computeChecksumMd5 = file => {
  return new Promise((resolve, reject) => {
    const chunkSize = 2097152 // Read in chunks of 2MB
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    let cursor = 0 // current cursor in file

    fileReader.onerror = error => {
      notification.error(error.message || 'Some Thing Went Wrong')
      reject(error)
    }

    // read chunk starting at `cursor` into memory
    const processChunk = chunkStart => {
      const chunkEnd = Math.min(file.size, chunkStart + chunkSize)
      fileReader.readAsArrayBuffer(file.slice(chunkStart, chunkEnd))
    }

    fileReader.onload = e => {
      spark.append(e.target.result) // Accumulate chunk to md5 computation
      cursor += chunkSize // Move past this chunk

      if (cursor < file.size) {
        processChunk(cursor)
      } else {
        resolve(spark.end())
      }
    }

    processChunk(0)
  })
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  // const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / (k * i)).toFixed(dm))
}

// ** Demo code **

export const DownloadPdf = (dispatch, record, from, records) => {
  if (record) dispatch({ type: 'records/DOWNLOADPDF', payload: { record, from, records } })
}

export const getTime = time => {
  const utcSeconds = time
  const param = new Date(0) // The 0 there is the key, which sets the date to the epoch
  param.setUTCSeconds(utcSeconds)
  let isFound = false

  let message = ''
  if (new Date(param).getFullYear() !== new Date().getFullYear()) {
    isFound = true
    message = `${new Date().getFullYear() - new Date(param).getFullYear()} years ago`
  } else {
    const d1 = new Date(param)
    const d2 = new Date(new Date())
    const date = new Date(d2 - d1)
    const hour = date.getUTCHours()
    const min = date.getUTCMinutes()
    const sec = date.getUTCSeconds()
    const day = date.getUTCDate() - 1
    const month = date.getUTCMonth()

    if (month && !isFound) {
      isFound = true
      message = `${month} months ago`
    }

    if (day && !isFound) {
      isFound = true
      message = `${day} days ago`
    }

    if (hour && !isFound) {
      isFound = true
      message = `${hour} hours ago`
    }

    if (min && !isFound) {
      isFound = true
      message = `${min} minutes ago`
    }

    if (sec && !isFound) {
      isFound = true
      message = `${sec} seconds ago`
    }
  }
  return message
}

export const LOGS = (ref, Id, entityRef, refId, userProject, location, timeStamp) => {
  const log = { ...logs }
  log.ref = `${ref}/${Id}`
  log.ID = Id
  log.userID = userProject && userProject.userID
  log.userName = userProject && userProject.userName
  log.location = location
  log.timestamp = timeStamp
  log.createdAt = timeStamp
  log.updatedAt = timeStamp
  log.entityRef = `${entityRef}/${refId}`
  log.entityRefID = refId
  log.projectID = (userProject && userProject.projectID) || userProject.projectID
  log.platform = platform && platform.description
  return log
}

export const customNotification = (type, message, desc) => {
  notification[type]({
    message: message || 404,
    description: desc || 'Unknown Error',
  })
}
