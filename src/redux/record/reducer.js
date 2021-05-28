import actions from './action'

const initialState = {
  loading: false,
  create: false,
  created: false,
  signing: false,
  sign: false,
  recordId: '',
  records: '',
  recordDetails: '',
  files: [],
  downloading: false,
  download: false,
  isVerified: false,
  isSent: false,
  verificationCode: '',
}

export default function recordReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    case actions.WEAHER_REMOVE:
      return { ...state, weathers: '', recordId: '' }
    default:
      return state
  }
}
