import { GET_COFFEE_SHOPS } from '../actions/types';

const initialState = {
  list: [],
  map: '',
}

const coffeeShopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COFFEE_SHOPS:
      return action.payload
    default:
      return state;
  }
}

export default coffeeShopsReducer;