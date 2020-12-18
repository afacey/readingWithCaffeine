import { combineReducers } from 'redux';
import libraryReducer from './libraryReducer';
import coffeeShopsReducer from './coffeeShopsReducer';
import directionsReducer from './directionsReducer';

const rootReducer = combineReducers({
  library: libraryReducer,
  coffeeShops: coffeeShopsReducer,
  directions: directionsReducer
})

export default rootReducer;