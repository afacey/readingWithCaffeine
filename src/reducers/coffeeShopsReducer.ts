import { GET_COFFEE_SHOPS, RANDOMIZE_COFFEE_SHOPS } from '../actions/types';
import { CoffeeShop } from '../types/coffeeShop';

const initialState = {
  all: [],
  list: [],
  map: '',
}

interface IAction {
  type: string;
  payload: CoffeeShop[];
}

const coffeeShopsReducer = (state = initialState, action: IAction) => {
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