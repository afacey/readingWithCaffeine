import { SET_LIBRARY } from "../actions/types";
import { Library } from "../types/location";

const initialState: Library = {
  name: '',
  latitude: 0,
  longitude: 0,
  radius: 0,
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