import { notification } from 'antd'
import { firebaseAuth } from './user'

export default async function UPDATE_PROFILE() {
  try {
    const user = firebaseAuth().currentUser
   
  } catch (error) {
    notification.warning({
      message: error.code,
      description: error.message,
    })
  }
}
