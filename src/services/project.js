import { notification } from 'antd'
import * as firebase from 'firebase'
import App, { firebaseAuth, analytics } from './user'
import { getLocation, LOGS } from '../components/helpers'
// import { guestRoles, ordinaryRole, systemAdminRole, projectCreatorRole } from './defineRoles'
import { RoleModels } from '../Models'

export async function CREATE_PROJECT(data) {
  // project create and update handel here
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const projectData = { ...data }
    const db = App.firestore()
    const batch = db.batch()
    const Timestamp = firebase.firestore.Timestamp.now()
    const { uid } = firebaseAuth().currentUser
    const ref = projectData.projectID
      ? db.collection('projects').doc(projectData.projectID)
      : db.collection('projects').doc()
    projectData.userID = projectData.userID || uid
    projectData.createdAt = projectData.createdAt || Timestamp
    projectData.updatedAt = Timestamp
    projectData.timestamp = Timestamp
    projectData.projectID = ref.id
    projectData.ID = ref.id
    projectData.ref = `/projects/${ref.id}`
    const { _lat, _long } = projectData?.location || {}
    projectData.location = projectData.location
      ? new firebase.firestore.GeoPoint(_lat, _long)
      : projectData.location
    projectData.estimatedStart = firebase.firestore.Timestamp.fromDate(projectData.estimatedStart)
    projectData.estimatedFinish = firebase.firestore.Timestamp.fromDate(projectData.estimatedFinish)

    batch.set(ref, projectData)

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()
    batch.set(logRef, LOGS('logs', logRef.id, 'projects', ref.id, projectData, geoPoint, Timestamp))

    batch.commit()
    analytics.logEvent('WEB_PROJECTS_CREATE_BATCH', projectData)
    return ref.id
  } catch (error) {
    if (error) {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    }
  }
}

export async function GET_USER_PROJECT() {
  // get User current assign projectID
  try {
    const { uid } = firebaseAuth().currentUser
    const projectID = await App.firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        return doc.data().projectID
      })
    analytics.logEvent('WEB_USERS_GET_PROJECT_ID_QUERY', { projectID })
    if (projectID) return projectID
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function REMOVE_PENDING_REQUEST(projectId, pendingEmail, userProjects) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()
    const Timestamp = firebase.firestore.Timestamp.now()
    const arrayRef = db.collection('projects').doc(projectId)

    batch.update(arrayRef, {
      pendingRegistrations: firebase.firestore.FieldValue.arrayRemove(pendingEmail),
    })

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'projects', arrayRef.id, userProjects, geoPoint, Timestamp),
    )

    await batch.commit()
    analytics.logEvent('WEB_PROJECTS_DELETE_PENDING_QUERY', { projectId, pendingEmail })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function REMOVE_USERS_FROM_PROJECT(projectId, userId, userProjects) {
  // Remove User from project Users Array
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()

    const users = db.collection('projects').doc(projectId)

    batch.update(users, { users: firebase.firestore.FieldValue.arrayRemove(userId) })
    await App.firestore()
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .get()
      .then(snapShot => {
        snapShot.forEach(async doc => {
          if (doc.data().roleName === 'ORDINARY' || doc.data().roleName === 'PROJECT_CREATOR') {
            const roles = db
              .collection('projects')
              .doc(projectId)
              .collection('roles')
              .doc(doc.id)
            batch.update(roles, { users: firebase.firestore.FieldValue.arrayRemove(userId) })
          }
        })
      })
    const user = db.collection('users').doc(userId)
    batch.update(user, { projects: firebase.firestore.FieldValue.arrayRemove(projectId) })
    const Timestamp = firebase.firestore.Timestamp.now()

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()

    batch.set(logRef, LOGS('logs', logRef.id, 'users', user.id, userProjects, geoPoint, Timestamp))

    batch.commit().then(() => {
      console.log('REMOVED SUCCESSFULLY')
    })
    analytics.logEvent('WEB_PROJECTS_REMOVE_USER_BATCH', { projectId, userId })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function UPDATE_OLD_ROLE_USERS(payload) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const { newRole, oldRole, projectID: projectId, userIdToRemove, userProjects } = payload
    const db = App.firestore()
    const batch = db.batch()
    const Timestamp = firebase.firestore.Timestamp.now()
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    await db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .where('roleName', '==', oldRole)
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(async doc => {
          const role = db
            .collection('projects')
            .doc(projectId)
            .collection('roles')
            .doc(doc.id)
          batch.update(role, { users: firebase.firestore.FieldValue.arrayRemove(userIdToRemove) })
        })
      })

    await App.firestore()
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .where('roleName', '==', newRole)
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(async doc => {
          const newRoleToUpdate = db
            .collection('projects')
            .doc(projectId)
            .collection('roles')
            .doc(doc.id)
          batch.update(newRoleToUpdate, {
            users: firebase.firestore.FieldValue.arrayUnion(userIdToRemove),
          })
          if (userProjects) {
            const logRef = db.collection('logs').doc()
            batch.set(
              logRef,
              LOGS(
                'logs',
                logRef.id,
                'roles',
                newRoleToUpdate.id,
                userProjects,
                geoPoint,
                Timestamp,
              ),
            )
          }
          analytics.logEvent('WEB_PROJECTS_ROLES_SET_USERS_QUERY', { data: payload })
        })
      })

    batch.commit().then(() => console.log('Update Role SuccessFully'))
    analytics.logEvent('WEB_PROJECTS_UPDATE_OLD_ROLE_USERS_BATCH', { data: payload })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function DELETE_ROLE(projectId, roleId, Users, userProjects) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()

    const deleted = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc(roleId)
    batch.delete(deleted)

    let roles
    await db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .where('roleName', '==', 'ORDINARY')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          roles = { id: doc.id, ...doc.data() }
        })
      })
    const array = roles.users ? roles.users : []
    const arr = roles.users.length > 0 ? roles.users : Users
    const updated = array.length > 0 && Users.length > 0 ? [...array, ...Users] : arr

    const update = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc(roles.id)
    batch.update(update, { users: updated })

    if (userProjects) {
      const Timestamp = firebase.firestore.Timestamp.now()

      const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

      const logRef = db.collection('logs').doc()
      batch.set(
        logRef,
        LOGS('logs', logRef.id, 'roles', deleted.id, userProjects, geoPoint, Timestamp),
      )
    }

    batch.commit().then(() => console.log('role SuccessFully Deleted'))
    analytics.logEvent('WEB_PROJECTS_DELETE_ROLE_BATCH', { projectId, roleId, Users, userProjects })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function UPDATE_OLD_ROLE(projectId, roleId, roleData, userProjects) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()

    const {
      users,
      createdAt,
      filesDeleteRule,
      diaryRule,
      filesRule,
      projectRule,
      roleName,
      rolesRule,
      signingRule,
      updatedAt,
      versionsRule,
      deleted,
    } = roleData || {}

    const data = {
      users,
      createdAt,
      filesDeleteRule,
      diaryRule,
      filesRule,
      projectRule,
      roleName,
      rolesRule,
      signingRule,
      updatedAt,
      versionsRule,
      deleted,
    }
    const roleRef = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc(roleId)
    batch.update(roleRef, data)

    if (userProjects) {
      const Timestamp = firebase.firestore.Timestamp.now()

      const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

      const logRef = db.collection('logs').doc()
      batch.set(
        logRef,
        LOGS('logs', logRef.id, 'roles', roleRef.id, userProjects, geoPoint, Timestamp),
      )
    }

    await batch.commit()
    analytics.logEvent('WEB_PROJECTS_UPDATE_OLD_ROLE_QUERY', data)
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}
export async function SET_ROLE_TO_OLD_PROJECT(projectId) {
  try {
    const Timestamp = firebase.firestore.Timestamp.now()
    const db = App.firestore()
    const batch = db.batch()
    const { uid } = firebaseAuth().currentUser
    const updatedprojectCreatorRole = { ...RoleModels.ProjectCreatorRole }
    updatedprojectCreatorRole.createdAt = Timestamp
    updatedprojectCreatorRole.updatedAt = Timestamp
    updatedprojectCreatorRole.users = [uid]
    // updated guest role
    const updateguestRoles = { ...RoleModels.GuestRole }
    updateguestRoles.createdAt = Timestamp
    updateguestRoles.updatedAt = Timestamp
    // update ordinaryRole
    const updateordinaryRole = { ...RoleModels.OrdinaryRole }
    updateordinaryRole.createdAt = Timestamp
    updateordinaryRole.updatedAt = Timestamp
    // update systemAdminRole
    const updatesystemAdminRole = { ...RoleModels.SuperSystemAdminRole }
    updatesystemAdminRole.createdAt = Timestamp
    updatesystemAdminRole.updatedAt = Timestamp
    updatesystemAdminRole.userID = uid
    const Roles = []
    const creater = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc()
    batch.set(creater, updatedprojectCreatorRole)
    const guest = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc()
    batch.set(guest, updateguestRoles)
    const system = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc()
    batch.set(system, updatesystemAdminRole)
    const ordinary = db
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .doc()
    batch.set(ordinary, updateordinaryRole)
    await App.firestore()
      .collection('users')
      .doc(uid)
      .update({ projects: firebase.firestore.FieldValue.arrayUnion(projectId) })
    batch.commit().then(async () => {
      await db
        .collection('projects')
        .doc(projectId)
        .collection('roles')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            Roles.push({ id: doc.id, ...doc.data() })
          })
        })
    })
    return Roles
  } catch (error) {
    console.log(error, 'ERRO')
  }
}
export async function SET_NEW_ROLE(id, roleData, userProjects) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const { uid } = firebaseAuth().currentUser
    const Timestamp = firebase.firestore.Timestamp.now()
    const db = App.firestore()
    const batch = db.batch()
    if (!roleData) {
      const updatedprojectCreatorRole = { ...RoleModels.ProjectCreatorRole }
      updatedprojectCreatorRole.createdAt = Timestamp
      updatedprojectCreatorRole.updatedAt = Timestamp
      updatedprojectCreatorRole.users = [uid]
      // updated guest role
      const updateguestRoles = { ...RoleModels.GuestRole }
      updateguestRoles.createdAt = Timestamp
      updateguestRoles.updatedAt = Timestamp
      // update ordinaryRole
      const updateordinaryRole = { ...RoleModels.OrdinaryRole }
      updateordinaryRole.createdAt = Timestamp
      updateordinaryRole.updatedAt = Timestamp
      // update systemAdminRole
      const updatesystemAdminRole = { ...RoleModels.SuperSystemAdminRole }
      updatesystemAdminRole.createdAt = Timestamp
      updatesystemAdminRole.updatedAt = Timestamp
      updatesystemAdminRole.userID = uid
      const creater = db
        .collection('projects')
        .doc(id)
        .collection('roles')
        .doc()
      batch.set(creater, updatedprojectCreatorRole)
      const guest = db
        .collection('projects')
        .doc(id)
        .collection('roles')
        .doc()
      batch.set(guest, updateguestRoles)
      const system = db
        .collection('projects')
        .doc(id)
        .collection('roles')
        .doc()
      batch.set(system, updatesystemAdminRole)
      const ordinary = db
        .collection('projects')
        .doc(id)
        .collection('roles')
        .doc()
      batch.set(ordinary, updateordinaryRole)

      analytics.logEvent('WEB_PROJECTS_CREATE_DEFAULT_ROLES_BATCH', {
        projectCreatorRole: updatedprojectCreatorRole,
        guestRole: updateguestRoles,
        systemAdminRole: updatesystemAdminRole,
        ordinaryRole: updateordinaryRole,
      })
    } else {
      const rolRef = db
        .collection('projects')
        .doc(id)
        .collection('roles')
        .doc()
      batch.set(rolRef, {
        ...roleData,
        createdAt: Timestamp,
        updatedAt: Timestamp,
        users: [],
      })

      if (userProjects) {
        const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

        const logRef = db.collection('logs').doc()
        batch.set(
          logRef,
          LOGS('logs', logRef.id, 'roles', rolRef.id, userProjects, geoPoint, Timestamp),
        )
      }
      analytics.logEvent('WEB_PROJECTS_UPDATE_NEW_ROLE_QUERY', {
        ...roleData,
        createdAt: Timestamp,
        updatedAt: Timestamp,
        users: [],
      })
    }
    batch.commit().then(() => {})
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function UPDATE_USER_PROJECTS(projectId) {
  try {
    const { uid } = firebaseAuth().currentUser
    if (uid) {
      await App.firestore()
        .collection('users')
        .doc(uid)
        .update({ projects: firebase.firestore.FieldValue.arrayUnion(projectId) })
      return true
    }
    analytics.logEvent('WEB_PROJECTS_UPDATE_USER_PROJECTS_QUERY', { projectId })
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function GET_PROJECT_BY_ID(projectId) {
  try {
    const project = await App.firestore()
      .collection('projects')
      .doc(projectId)
      .get()
      .then(doc => {
        return { id: doc.id, ...doc.data() }
      })
    const projectUsersData = []
    if (project?.users?.length > 0) {
      await App.firestore()
        .collection('users')
        .where('projects', 'array-contains-any', [projectId])
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id !== project.userID) projectUsersData.push({ id: doc.id, ...doc.data() })
          })
        })
    }

    analytics.logEvent('WEB_PROJECTS_GET_PROJECT_BY_ID_QUERY', { project, projectUsersData })
    return { project, projectUsersData }
  } catch (error) {
    console(error, 'ERROR in projectGET ID')
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function GET_PROJECT_ROLE_BY_ID(projectId) {
  try {
    const rolesArry = []
    await App.firestore()
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          rolesArry.push({ id: doc.id, ...doc.data() })
        })
      })
    analytics.logEvent('WEB_PROJECTS_GET_PROJECT_ROLE_BY_ID_QUERY', { roles: rolesArry })
    return rolesArry
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function GET_ALL_PROJECTS() {
  try {
    const { uid } = firebaseAuth().currentUser
    const userId = uid || ''
    const projectIdObj = await App.firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(item => {
        return {
          id: item.id,
          projectId: item.data().projectID,
          data: item.data().projects,
        }
      })
    const projectData = []
    if (projectIdObj && projectIdObj.data.length > 0) {
      await App.firestore()
        .collection('projects')
        .where('userID', 'in', [uid])
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            projectData.push({
              docId: projectIdObj.id,
              selected: doc.id === projectIdObj.projectId,
              ...doc.data(),
            })
          })
        })

      await App.firestore()
        .collection('projects')
        .where('users', 'array-contains-any', [uid])
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            projectData.push({
              docId: projectIdObj.id,
              selected: doc.id === projectIdObj.projectId,
              ...doc.data(),
            })
          })
        })
    }
    analytics.logEvent('WEB_PROJECTS_GET_ALL_PROJECTS_QUERY', { projects: projectData })
    return projectData
  } catch (error) {
    notification.error({
      message: error.code,
      description: error.message,
    })
  }
}

export async function SET_PROJECT_ID(userId, projectId) {
  try {
    // if (!userId || !projectId) throw Error('Unknow Error')
    const db = App.firestore()
    const batch = db.batch()
    const userRef = db.collection('users').doc(userId)
    batch.update(userRef, { projectID: projectId })
    await batch.commit()
    analytics.logEvent('WEB_PROJECTS_SET_PROJECT_ID_QUERY', { userId, projectId })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}
export async function RECOVER_PROJECT(projectId) {
  try {
    await App.firestore()
      .collection('projects')
      .doc(projectId)
      .update({
        deleted: false,
        active: true,
        deletedAt: null,
        updatedAt: firebase.firestore.Timestamp.now(),
      })
    return true
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}

export async function DELETE_PROJECT_BY_ID(projectId, uid, currentProject) {
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()
    const user = await db
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => doc.data())
    const Timestamp = firebase.firestore.Timestamp.now()

    if (user.projectId === projectId) {
      const users = db.collection('users').doc(uid)
      batch.update(users, { projectID: firebase.firestore.FieldValue.delete() })
    }

    const projects = db.collection('projects').doc(projectId)
    batch.update(projects, {
      deleted: true,
      active: false,
      deletedAt: Timestamp,
    })

    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const logRef = db.collection('logs').doc()
    batch.set(
      logRef,
      LOGS('logs', logRef.id, 'projects', projects.id, currentProject, geoPoint, Timestamp),
    )

    await batch.commit().then(() => console.log(' Project successfully Deleted '))
    analytics.logEvent('WEB_PROJECTS_DELETE_PROJECT_BY_ID_BATCH', { projectId, uid })
    return true
  } catch (error) {
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}
export async function SearchUser(payload) {
  const { email, Users, projectID, pendingRegistrations, project } = payload
  try {
    const { location } =
      (await getLocation(
        '',
        () => {},
        () => {},
      )) || {}
    const db = App.firestore()
    const batch = db.batch()
    const finaldata = {}
    let data
    await db
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(async doc => {
          data = { id: doc.id, data: doc.data() }
        })
      })

    const myRoles = []
    await db
      .collection('projects')
      .doc(projectID)
      .collection('roles')
      .get()
      .then(async querySnap => {
        querySnap.forEach(async doc => {
          myRoles.push(doc.data())
        })
      })

    // const roleNew = myRoles.filter(item => {
    //   return item.roleName === 'ORDINARY' || undefined
    // })
    // if (roleNew === undefined) {
    //   const updatedprojectCreatorRole = { ...RoleModels.ProjectCreatorRole }
    //   updatedprojectCreatorRole.createdAt = Timestamp
    //   updatedprojectCreatorRole.updatedAt = Timestamp
    //   updatedprojectCreatorRole.users = [project.userID]
    //   // updated guest role
    //   const updateguestRoles = { ...RoleModels.GuestRole }
    //   updateguestRoles.createdAt = Timestamp
    //   updateguestRoles.updatedAt = Timestamp
    //   // update ordinaryRole
    //   const updateordinaryRole = { ...RoleModels.OrdinaryRole }
    //   updateordinaryRole.createdAt = Timestamp
    //   updateordinaryRole.updatedAt = Timestamp
    //   // update systemAdminRole
    //   const updatesystemAdminRole = { ...RoleModels.SuperSystemAdminRole }
    //   updatesystemAdminRole.createdAt = Timestamp
    //   updatesystemAdminRole.updatedAt = Timestamp
    //   const NewRole = await db
    //     .collection('projects')
    //     .doc(projectID)
    //     .collection('roles')
    //     .doc()
    //   batch.set(NewRole, {
    //     updatedprojectCreatorRole,
    //     updateguestRoles,
    //     updateordinaryRole,
    //     updatesystemAdminRole,
    //   })
    //   batch.commit().then(() => {
    //     console.log('ROLE CREATED')
    //   })
    // }

    let role
    await db
      .collection('projects')
      .doc(projectID)
      .collection('roles')
      .where('roleName', '==', 'ORDINARY')
      .get()
      .then(async querySnapshot => {
        querySnapshot.forEach(async doc => {
          role = { id: doc.id, data: doc.data() }
        })
      })
    const users = role && role.data && role.data.users ? role.data.users : []
    const id = data && data.id ? data.id : ''
    if (users.includes(id)) throw Error('You Can not Add PROJECT_CREATOR To Project')
    const Timestamp = firebase.firestore.Timestamp.now()
    const geoPoint = new firebase.firestore.GeoPoint(location.latitude, location.longitude)

    const projectsdata = Users && data && data.id ? Users.includes(data.id) : true

    if (data && !projectsdata) {
      const usersUpdate = db.collection('projects').doc(projectID)
      batch.update(usersUpdate, { users: firebase.firestore.FieldValue.arrayUnion(data.id) })
      const projects = db.collection('users').doc(data.id)

      batch.update(projects, { projects: firebase.firestore.FieldValue.arrayUnion(projectID) })

      let roles
      await db
        .collection('projects')
        .doc(projectID)
        .collection('roles')
        .where('roleName', '==', 'ORDINARY')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            roles = { id: doc.id, ...doc.data() }
          })
        })
      const updateUsers = roles && roles.users ? [...roles.users] : []
      updateUsers.push(data.id)
      const projectUser = db
        .collection('projects')
        .doc(projectID)
        .collection('roles')
        .doc(roles.id)
      batch.update(projectUser, { users: firebase.firestore.FieldValue.arrayUnion(data.id) })
      const dataRef = { ...data.data }
      dataRef.userID = data.id
      dataRef.projectID = projectID
      dataRef.userName = project.userName
      const logRef = db.collection('logs').doc()
      batch.set(logRef, LOGS('logs', logRef.id, 'users', data.id, dataRef, geoPoint, Timestamp))
      batch.commit().then(() => console.log('User Successfully Added to project'))
      analytics.logEvent('WEB_PROJECTS_USER_SEARCH_BATCH', {
        email,
        Users,
        projectID,
        pendingRegistrations,
      })
      finaldata.updateUsers = updateUsers
    } else if (projectsdata && data !== undefined) return { name: 'DuplicateUsers' }
    else {
      const arry = pendingRegistrations || []
      const filterd = arry.includes(email)
      if (!filterd) {
        arry.push(email)
        const projectRef = db.collection('projects').doc(projectID)
        batch.update(projectRef, {
          pendingRegistrations: firebase.firestore.FieldValue.arrayUnion(email),
        })

        const logRef = db.collection('logs').doc()
        batch.set(
          logRef,
          LOGS('logs', logRef.id, 'projects', projectRef.id, project, geoPoint, Timestamp),
        )

        await batch.commit()
        analytics.logEvent('WEB_PROJECTS_SEARCH_FOR_PENDINGS_QUERY', {
          email,
          projectID,
          pendingRegistrations: arry,
        })
        return { name: 'pending', arry }
      }
      return { name: 'DuplicatePending' }
    }

    return { name: 'userSuccessfullyAdded', finaldata }
  } catch (error) {
    console.log(error, 'CATch of SERACH USER')
    if (error)
      notification.warning({
        message: error.code,
        description: error.message,
      })
  }
}

export async function GET_CURRENT_ROLE(projectId) {
  try {
    const roles = []
    await App.firestore()
      .collection('projects')
      .doc(projectId)
      .collection('roles')
      .get()
      .then(snapShot => {
        snapShot.forEach(ele => {
          const data = { ...ele.data() }
          data.id = ele.id
          roles.push(data)
        })
      })
    return roles
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
