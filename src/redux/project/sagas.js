import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import * as Services from '../../services/project'
import actions from './action'

export function* CREATE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const projectId = yield call(Services.CREATE_PROJECT, payload)
  if (projectId) {
    const project = !payload.createdAt ? yield call(Services.SET_NEW_ROLE, projectId) : true
    if (project) {
      if (!payload.createdAt) yield call(Services.UPDATE_USER_PROJECTS, projectId)
      notification.success({
        message: 'Project Message',
        description: payload.createdAt
          ? 'Project Successfully Updated'
          : 'Project Successfully Created',
      })
      yield put({ type: 'project/SET_STATE', payload: { loading: false, create: true } })
      yield put({ type: 'CURRENTSTATE/Project' })
    }
    yield put({ type: 'project/SET_STATE', payload: { loading: false } })
  } else {
    yield put({ type: 'project/SET_STATE', payload: { loading: false } })
  }
}

export function* REMOVEPENDINGREQUEST({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })

  const { projectId, pendingEmail, userProjects } = payload

  const res = yield call(Services.REMOVE_PENDING_REQUEST, projectId, pendingEmail, userProjects)

  if (res) yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* REMOVEUSERSFROMPROJECT({ payload }) {
  console.log(payload, 'PAYLOAD REMOVE')
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })

  const { projectID, userId, currentProject } = payload

  const res = yield call(Services.REMOVE_USERS_FROM_PROJECT, projectID, userId, currentProject)

  if (res) yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* UPLOADNEWROLE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const res = yield call(
    Services.SET_NEW_ROLE,
    payload.obj.projectID,
    payload.obj,
    payload.userProjects,
  )

  if (res) yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* UPDATEOLDROLE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const res = yield call(
    Services.UPDATE_OLD_ROLE,
    payload.obj.projectID,
    payload.obj.id,
    payload.obj,
    payload.userProjects,
  )

  if (res) yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}
export function* GET_CURRENT_ROLES({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const res = yield call(Services.GET_CURRENT_ROLE, payload.projectId)
  // const roleName = res.filter((ele) => {
  //   console.log(ele , "EKEEELEE")
  //   return ele.name === "ORDINARY"
  // })

  if (res)
    yield put({
      type: 'project/SET_STATE',
      payload: { loading: false, projectRole: res, authRole: res },
    })
}

export function* UPDATEOLDROLEUSERS({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const res = yield call(Services.UPDATE_OLD_ROLE_USERS, payload)
  const roles = [...payload.projectRole]
  roles.forEach(ele => {
    if (ele.roleName === payload.oldRole) {
      ele.users = ele.users.filter(ele1 => ele1 !== payload.userIdToRemove)
    }
    if (ele.roleName === payload.newRole) {
      const newUsers = [...ele.users]
      newUsers.push(payload.userIdToRemove)
      ele.users = newUsers
    }
  })

  if (res) {
    yield put({
      type: 'project/SET_STATE',
      payload: { loading: false, projectRole: roles, authRole: roles },
    })
    notification.success({ message: 'Roles Successfully Update' })
  } else yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* DELETEROLE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })

  const { projectId, roleId, Users, userProjects } = payload

  const res = yield call(Services.DELETE_ROLE, projectId, roleId, Users, userProjects)

  if (res) yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* GETALLPROJECTS() {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })

  const allProjects = yield call(Services.GET_ALL_PROJECTS)
  if (allProjects)
    yield put({ type: 'project/SET_STATE', payload: { loading: false, allProjects } })
  else yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* SETPROJECTID({ payload }) {
  const { userID, projectId } = payload

  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  yield call(Services.SET_PROJECT_ID, userID, projectId)
  yield put({
    type: 'project/SET_STATE',
    payload: { loading: false, user: { projectID: projectId } },
  })
  yield put({ type: 'user/SET_STATE', payload: { projectID: projectId } })
}
export function* RECOVERPROJECT({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const { projectId } = payload
  const res = yield call(Services.RECOVER_PROJECT, projectId)
  if (res) {
    yield put({ type: 'project/SET_STATE', payload: { loading: false, recoverd: true } })
    notification.success({ message: 'Project Successfully Recover' })
  }
  yield put({ type: 'project/SET_STATE', payload: { loading: false, recoverd: false } })
}

export function* GETUSERPROJECT() {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const projectId = yield call(Services.GET_USER_PROJECT)
  if (projectId) {
    const roles = yield call(Services.GET_PROJECT_ROLE_BY_ID, projectId)

    const myRoles = roles.filter(ele => {
      return ele.roleName === 'ORDINARY'
    })
    if (myRoles.length >= 1) {
      const response = yield call(Services.GET_PROJECT_BY_ID, projectId)
      const { project, projectUsersData } = response || {}
      const { pendingRegistrations } = project || {}
      yield put({
        type: 'project/SET_STATE',
        payload: {
          loading: false,
          userProjects: project,
          projectUsersData,
          projectRole: roles,
          authRole: roles,
          pendingRegistrations,
        },
      })
    } else {
      const Roles = yield call(Services.SET_ROLE_TO_OLD_PROJECT, projectId)
      const response = yield call(Services.GET_PROJECT_BY_ID, projectId)
      const { project, projectUsersData } = response || {}
      const { pendingRegistrations } = project || {}
      yield put({
        type: 'project/SET_STATE',
        payload: {
          loading: false,
          userProjects: project,
          projectUsersData,
          projectRole: Roles,
          authRole: Roles,
          pendingRegistrations,
        },
      })
    }
    // if (myRoles.length === 0) {
    //   const Roles = yield call(Services.SET_ROLE_TO_OLD_PROJECT, projectId)
    //   const response = yield call(Services.GET_PROJECT_BY_ID, projectId)
    //   const { project, projectUsersData } = response || {}
    //   const { pendingRegistrations } = project || {}
    //   yield put({
    //     type: 'project/SET_STATE',
    //     payload: {
    //       loading: false,
    //       userProjects: project,
    //       projectUsersData,
    //       projectRole: Roles,
    //       authRole: Roles,
    //       pendingRegistrations,
    //     },
    //   })
    // } else {
    //   const response = yield call(Services.GET_PROJECT_BY_ID, projectId)
    //   const { project, projectUsersData } = response || {}
    //   const { pendingRegistrations } = project || {}
    //   yield put({
    //     type: 'project/SET_STATE',
    //     payload: {
    //       loading: false,
    //       userProjects: project,
    //       projectUsersData,
    //       projectRole: roles,
    //       authRole: roles,
    //       pendingRegistrations,
    //     },
    //   })
    // }
  } else {
    yield put({ type: 'project/SET_STATE', payload: { loading: false } })
  }
}

export function* GETPROJECT({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const response = yield call(Services.GET_PROJECT_BY_ID, payload)

  const { project, projectUsersData } = response || {}
  const projectRole = yield call(Services.GET_PROJECT_ROLE_BY_ID, payload)
  const { users, pendingRegistrations } = project || {}
  if (project && projectRole) {
    yield put({
      type: 'project/SET_STATE',
      payload: {
        loading: false,
        currentProject: project,
        projectRole,
        authRole: projectRole,
        Users: users,
        pendingRegistrations,
        projectUsersData: projectUsersData || [],
      },
    })
  } else {
    yield put({ type: 'project/SET_STATE', payload: { loading: false } })
  }
}

export function* DELETE({ payload }) {
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const { projectId, uid, currentProject } = payload
  const response = yield call(Services.DELETE_PROJECT_BY_ID, projectId, uid, currentProject)
  if (response) {
    notification.success({
      message: 'Project Message',
      description: 'Project Successfully Delete',
    })
    yield put({ type: 'project/SET_STATE', payload: { loading: false, delete: true } })
    yield put({ type: 'project/SET_STATE', payload: { delete: false } })
  }
  yield put({ type: 'project/SET_STATE', payload: { loading: false } })
}

export function* ADD_USERS({ payload }) {
  console.log(payload, 'PAYLOAD')
  yield put({ type: 'project/SET_STATE', payload: { loading: true } })
  const searchResault = yield call(Services.SearchUser, payload)

  const { name } = searchResault || {}

  if (name === 'DuplicatePending') {
    notification.success({
      message: 'Add Users',
      description: 'Email is Already Save in PendingRegistrations',
    })
    yield put({ type: 'project/SET_STATE', payload: { loading: false, added: true } })
    yield put({ type: 'project/SET_STATE', payload: { added: false } })
  } else if (name === 'DuplicateUsers') {
    notification.success({
      message: 'Add Users',
      description: 'User is Already Save in Project',
    })
    yield put({ type: 'project/SET_STATE', payload: { loading: false, added: true } })
    yield put({ type: 'project/SET_STATE', payload: { added: false } })
  } else if (name === 'pending') {
    notification.success({
      message: 'Add Users',
      description: 'Email Is Successfully Added in PendingRegistrations',
    })

    yield put({
      type: 'project/SET_STATE',
      payload: { loading: false, pendingRegistrations: searchResault.arry, added: true },
    })
    yield put({ type: 'project/SET_STATE', payload: { added: false } })
  } else if (name === 'userSuccessfullyAdded') {
    const roles = yield call(Services.GET_PROJECT_ROLE_BY_ID, payload.projectID)
    const { projectUsersData } = yield call(Services.GET_PROJECT_BY_ID, payload.projectID)
    const { updateUsers } = (searchResault && searchResault.finaldata) || {}
    notification.success({
      message: 'Add Users',
      description: 'User Is Successfully Added to Project',
    })
    yield put({
      type: 'project/SET_STATE',
      payload: {
        loading: false,
        Users: updateUsers,
        projectUsersData,
        updatedRoles: roles,
        added: true,
      },
    })
    yield put({ type: 'project/SET_STATE', payload: { added: false } })
  } else {
    yield put({ type: 'project/SET_STATE', payload: { loading: false } })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE, CREATE),
    takeEvery(actions.DELETE_PROJECT, DELETE),
    takeEvery(actions.ADD_USER_TO_PROJECT, ADD_USERS),
    takeEvery(actions.GET_PROJECT_BY_ID, GETPROJECT),
    takeEvery(actions.GET_ALL_PROJECTS, GETALLPROJECTS),
    takeEvery(actions.SET_PROJECT_ID, SETPROJECTID),
    takeEvery(actions.GET_USER_PROJECT, GETUSERPROJECT),
    takeEvery(actions.UPLOAD_NEW_ROLE, UPLOADNEWROLE),
    takeEvery(actions.UPDATE_OLD_ROLE, UPDATEOLDROLE),
    takeEvery(actions.UPDATE_OLD_ROLE_USERS, UPDATEOLDROLEUSERS),
    takeEvery(actions.DELETE_ROLE, DELETEROLE),
    takeEvery(actions.REMOVE_PENDING_REQUEST, REMOVEPENDINGREQUEST),
    takeEvery(actions.REMOVE_USERS_FROM_PROJECT, REMOVEUSERSFROMPROJECT),
    takeEvery(actions.RECOVER_PROJECT, RECOVERPROJECT),
    takeEvery(actions.CURRENT_PROJECT_ROLE, GET_CURRENT_ROLES),
  ])
}
