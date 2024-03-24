import {
  SET_CURRENT_TOKEN,
  SET_CURRENT_USER_ID,
  LOGOUT,
  SET_NOTIFICATION_POPUP,
  SET_CURRENT_SONG,
  SET_CURRENT_SONG_IMAGE,
  SET_CURRENT_SONG_NAME,
} from './constants'

export const setCurrentUserID = payload => ({
  type: SET_CURRENT_USER_ID,
  payload
})
export const setCurrentToken = payload => ({
  type: SET_CURRENT_TOKEN,
  payload
})
export const logout = payload => ({
  type: LOGOUT,
  payload
})

export const setNotificationPopup = payload => ({
  type: SET_NOTIFICATION_POPUP,
  payload
})

export const setCurrentSong = payload => ({
  type: SET_CURRENT_SONG,
  payload
})

