import { SET_LIBRARY } from "../actions/types";
import { Library } from "../types/library";

const initialState = {
  name: '',
  latitude: '',
  longitude: '',
  radius: ''
}

interface IAction {
  type: string;
  payload: Library;
}

const libraryReducer = (state = initialState, action: IAction) => {

  switch (action.type) {
    case SET_LIBRARY:
      return action.payload
    default:
      return state;
  }
}

export default libraryReducer;