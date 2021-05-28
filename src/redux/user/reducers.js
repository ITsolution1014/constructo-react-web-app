import actions from './actions'

const initialState = {
  authorized: false,
  loading: false,
  signUp: false,
  profile: false,
  reset: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case 'CURRENTSTATE':
      return initialState
    default:
      return state
  }
}
