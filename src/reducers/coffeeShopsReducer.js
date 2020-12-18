import { GET_COFFEE_SHOPS, RANDOMIZE_COFFEE_SHOPS } from '../actions/types';

const initialState = {
  all: [],
  list: [],
  map: '',
}

const coffeeShopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COFFEE_SHOPS:
      return action.payload
    case RANDOMIZE_COFFEE_SHOPS:
      if (state.all.length > 0) {
        return {
          ...state,
          ...action.payload
        }
      }
      break;
    default:
      return state;
  }
}

export default coffeeShopsReducer;