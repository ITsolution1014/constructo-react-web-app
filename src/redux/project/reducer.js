import actions from './action'

const initialState = {
  loading: false,
  create: false,
  delete: false,
  currentProject: '',
  added: false,
  Users: '',
  pendingRegistrations: '',
  projectUsersData: '',
  projectsData: [],
  projectRole: '',
  projectId: '',
  allProjects: '',
  userProjects: '',
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case 'CURRENTSTATE/Project':
      return { state: initialState }
    case 'project/CLEAR_OLD_PROJECT':
      return {
        ...state,
        currentProject: '',
        pendingRegistrations: '',
        Users: '',
        projectRole: '',
        projectUsersData: '',
      }
    case 'CURRENTSTATE':
      return initialState
    default:
      return state
  }
}
