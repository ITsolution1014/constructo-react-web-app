import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firebase'
// import 'firebase/app'
import 'firebase/storage'
import 'firebase/analytics'

import { customNotification } from '../components/helpers/index'
import { UserModel } from '../Models'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
export const analytics = firebase.analytics()

export const cloudStorage = firebaseApp.storage()
export const firebaseAuth = firebase.auth

export async function login(email, password) {
  // analytics.logEvent('WEB_FIREBASE_USER_LOGIN', { email })
  return firebaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(error => customNotification('warn', error?.code, error?.message))
}

export async function reset(email) {
  analytics.logEvent('WEB_FIREBASE_USER_RESET', { email })
  return firebaseAuth()
    .sendPasswordResetEmail(email)
    .then(() => true)
    .catch(error => customNotification('warn', error?.codel, error?.message))
}

export async function signUp(email, password) {
  analytics.logEvent('WEB_FIREBASE_USER_CREATE', { email, password })
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, password)
    .then(res => res)
    .catch(error => customNotification('warn', error?.codel, error?.message))
}

export async function currentAccount() {
  let userLoaded = false
  const getCurrentUser = auth => {
    return new Promise((resolve, reject) => {
      if (userLoaded) {
        analytics.logEvent('WEB_FIREBASE_USER_GET_CURRENT', { User: firebaseAuth.currentUser })
        resolve(firebaseAuth.currentUser)
      }
      const unsubscribe = auth.onAuthStateChanged(user => {
        userLoaded = true
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }
  return getCurrentUser(firebaseAuth())
}

export async function logout() {
  analytics.logEvent('WEB_FIREBASE_USER_LOGOUT')
  localStorage.clear()
  return firebaseAuth()
    .signOut()
    .then(() => true)
}

export async function CREATE_USER(uid, data) {
  try {
    const updatedData = { ...UserModel }
    updatedData.userID = uid
    updatedData.ID = uid
    updatedData.createdAt = firebase.firestore.Timestamp.now()
    updatedData.name = data.firstname
    updatedData.surname = data.lastname
    updatedData.title = data.title
    updatedData.phone = data.phone
    updatedData.email = data.email

    const response = firebaseApp
      .firestore()
      .collection('users')
      .doc(uid)
      .set(updatedData)
      .then(() => true)
    analytics.logEvent('WEB_USERS_CREATE_QUERY', updatedData)
    return response
  } catch (error) {
    customNotification('warn', error.code, error.message)
  }
}

export async function GET_USER(uid) {
  try {
    const userData = firebaseApp
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => doc.data())
    analytics.logEvent('WEB_USERS_GET_QUERY', userData)
    return userData
  } catch (error) {
    customNotification('warn', error?.code, error?.message)
  }
}

export async function UPDATE_PROFILE(name, surname, title, phone) {
  try {
    const { uid } = firebaseAuth().currentUser
    const userData = firebaseApp
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        name,
        surname,
        title,
        phone,
      })
      .then(() => true)
    analytics.logEvent('WEB_USERS_UPDATE_QUERY', { name, surname, title, phone })
    return userData
  } catch (error) {
    customNotification('warn', error?.code, error?.message)
  }
}

export async function SearchEmail(email) {
  try {
    const res = await firebase
      .firestore()
      .collection('projects')
      .where('pendingRegistrations', 'array-contains-any', [email])
      .get()
      .then(querySnapshot => {
        let obj
        querySnapshot.forEach(doc => {
          obj = {
            ...doc.data(),
          }
          obj.id = doc.id
        })
        return obj
      })
    analytics.logEvent('WEB_PROJECTS_SEARCH_FOR_PENDINGS_QUERY', { emailData: res })

    if (res !== undefined) {
      const roleResponse = await firebase
        .firestore()
        .collection('projects')
        .doc(res.id)
        .collection('roles')
        .where('roleName', '==', 'ORDINARY')
        .get()
        .then(querySnapshot => {
          let roleId
          querySnapshot.forEach(doc => {
            roleId = doc.id
          })
          return roleId
        })
      analytics.logEvent('WEB_PROJECTS_SEARCH_USER_QUERY', {
        emailData: res,
        rolesId: roleResponse,
      })
      return { emailData: res, rolesId: roleResponse }
    }
  } catch (error) {
    customNotification('warn', error?.code, error?.message)
  }
}

export async function addUserToProject(id, rolesId, uid, email) {
  try {
    // await firebase
    //   .firestore()
    //   .collection('projects')
    //   .doc(id)
    //   .collection('roles')
    //   .doc(rolesId)
    //   .set({ Users: firebase.firestore.FieldValue.arrayUnion(uid) }, { merge: true })

    // analytics.logEvent('WEB_PROJECTS_ROLES_SET_USERS_QUERY', { id, rolesId, uid, email })

    // await firebase
    //   .firestore()
    //   .collection('projects')
    //   .doc(id)
    //   .set(
    //     { pendingRegistrations: firebase.firestore.FieldValue.arrayRemove(email) },
    //     { merge: true },
    //   )

    // analytics.logEvent('WEB_PROJECTS_SET_PENDINGS_QUERY', { id, rolesId, uid, email })

    // await firebase
    //   .firestore()
    //   .collection('projects')
    //   .doc(id)
    //   .set({ Users: firebase.firestore.FieldValue.arrayUnion(uid) }, { merge: true })

    // analytics.logEvent('WEB_PROJECTS_SET_USERS_QUERY', { id, rolesId, uid, email })

    // await firebase
    //   .firestore()
    //   .collection('users')
    //   .doc(uid)
    //   .set({ projects: firebase.firestore.FieldValue.arrayUnion(id) }, { merge: true })

    const db = firebase.firestore()
    const batch = db.batch()
    const rolesRef = db
      .collection('projects')
      .doc(id)
      .collection('roles')
      .doc(rolesId)
    batch.set(rolesRef, { users: firebase.firestore.FieldValue.arrayUnion(uid) }, { merge: true })

    analytics.logEvent('WEB_PROJECTS_ROLES_SET_USERS_QUERY', { id, rolesId, uid, email })

    const projectRef = db.collection('projects').doc(id)

    batch.set(
      projectRef,
      {
        pendingRegistrations: firebase.firestore.FieldValue.arrayRemove(email),
        users: firebase.firestore.FieldValue.arrayUnion(uid),
      },
      { merge: true },
    )

    analytics.logEvent('WEB_PROJECTS_SET_PENDINGS_QUERY', { id, rolesId, uid, email })
    analytics.logEvent('WEB_PROJECTS_SET_USERS_QUERY', { id, rolesId, uid, email })

    const userRef = db.collection('users').doc(uid)

    batch.set(userRef, { projects: firebase.firestore.FieldValue.arrayUnion(id) }, { merge: true })

    analytics.logEvent('WEB_USERS_SET_PROJECTS_QUERY', { id, rolesId, uid, email })
    await batch.commit().then(() => console.log('DONE'))
  } catch (error) {
    customNotification('warn', error?.code, error?.message)
  }
}
export default firebaseApp
