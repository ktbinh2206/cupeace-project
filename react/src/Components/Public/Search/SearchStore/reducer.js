import {
  SET_SEARCH_DATA,
  SET_SEARCH_VALUE,
} from './constants'

const initState = {
  searchValue: '',
  searchData: null,
}

function reducer(state, action) {
  switch (action.type) {
    case SET_SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload
      }
    case SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload
      }
    default:
      throw new Error('Invalid action')
  }
}
export { initState }
export default reducer
