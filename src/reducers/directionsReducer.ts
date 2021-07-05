import { Direction } from '../types/direction';
import { SET_DIRECTIONS_INSTRUCTIONS, SET_DIRECTIONS_LOCATION, SET_DIRECTIONS_MODE } from '../actions/types';

const initialState: Direction = {
  session: '',
  location: {
    name: '',
    longitude: 0,
    latitude: 0,
    address: '',
  },
  map: '',
  instructions: [],
  mode: 'fastest'
}

interface IAction {
  type: string;
  payload: Direction
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