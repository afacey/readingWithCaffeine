import { Directions } from '../types/directions';
import { SET_DIRECTIONS_INSTRUCTIONS, SET_DIRECTIONS_LOCATION, SET_DIRECTIONS_MODE } from '../actions/types';

const initialState = {
  session: '',
  location: {},
  map: '',
  instructions: [],
  mode: 'fastest'
}

interface IAction {
  type: string;
  payload: Directions
}

const directionsReducer = (state = initialState, action: IAction) => {

  switch (action.type) {
    case SET_DIRECTIONS_INSTRUCTIONS:
      return {
        ...state,
        ...action.payload
      };
    case SET_DIRECTIONS_LOCATION:
      return {
        ...state,
        location: action.payload
      }
    case SET_DIRECTIONS_MODE:
      return {
        ...state,
        mode: action.payload
      }
    default:
      return state;
  }
}

export default directionsReducer