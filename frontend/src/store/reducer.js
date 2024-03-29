import axiosClient from '../axios'
import {
  SET_CURRENT_USER_ID,
  SET_CURRENT_TOKEN,
  LOGOUT,
  SET_NOTIFICATION_POPUP,
  SET_CURRENT_PLAYLIST,
  SET_CURRENT_SONG,
} from './constants'

const initState = {
  currentUserID: localStorage.getItem('USERID') || null,
  currentToken: localStorage.getItem('TOKEN') || null,
  notification: null,
  currentPlaylist: null,
  currentSong: null,
}

function reducer(state, action) {
  switch (action.type) {
    case SET_CURRENT_USER_ID:
      localStorage.setItem('USERID', JSON.stringify(action.payload))
      return {
        ...state,
        currentUserID: action.payload
      }
    case SET_CURRENT_TOKEN:
      localStorage.setItem('TOKEN', action.payload)
      return {
        ...state,
        currentToken: action.payload
      }
    case LOGOUT:
      localStorage.removeItem('TOKEN')
      localStorage.removeItem('USERID')
      return {
        ...state,
        currentToken: null,
        currentUserID: null,
      }
    case SET_NOTIFICATION_POPUP:
      return {
        ...state,
        notification: action.payload,
      }
    case SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.payload,
      }
    case SET_CURRENT_PLAYLIST:
      return {
        ...state,
        currentPlaylist: action.payload,
      };
    default:
      throw new Error('Invalid action')

  }
}

export { initState }
export default reducer
