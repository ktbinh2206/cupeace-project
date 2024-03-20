import {
  SET_SEARCH_DATA,
  SET_SEARCH_VALUE,
} from './constants'

export const setSearchData= payload => ({
  type: SET_SEARCH_DATA,
  payload
})
export const setSearchValue= payload => ({
  type: SET_SEARCH_VALUE,
  payload
})
