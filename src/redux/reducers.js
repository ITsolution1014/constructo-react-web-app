import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import project from './project/reducer'
import record from './record/reducer'
import files from './files/reducer'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    project,
    record,
    files,
  })
