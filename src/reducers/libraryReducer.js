import { SET_LIBRARY } from "../actions/types";

const initialState = {
  name: '',
  latitude: '',
  longitude: '',
  radius: ''
}

const libraryReducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_LIBRARY:
      return action.payload
    default:
      return state;
  }
}

export default libraryReducer;