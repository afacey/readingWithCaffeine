import { GET_COFFEE_SHOPS, RANDOMIZE_COFFEE_SHOPS } from '../actions/types';
import { CoffeeShop, CoffeeShopsState } from '../types/coffeeShop';
interface IAction {
  type: string;
  payload: CoffeeShop[];
}

const initialState: CoffeeShopsState = {
  all: [],
  list: [],
  map: '',
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