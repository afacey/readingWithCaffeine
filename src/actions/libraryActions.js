import Swal from 'sweetalert2';
import * as api from '../api';
import { randomizeArrayItems } from '../helpers';

import { GET_COFFEE_SHOPS, RANDOMIZE_COFFEE_SHOPS } from './types';

 // getting surrounding coffee shops of the selected library and storing them in state
export const getCoffeeShops = (location) => dispatch => {
  
  api.getCoffeeShops(location)
    .then((response) => {
      // store returned results for later
      const returnedCoffeeShops = response.data.results;

      // if no results are returned then display an alert
      if (returnedCoffeeShops.length === 0) {
        throw new Error('No coffee shops found')
      } else {
        
        const randomCoffeeShops = randomizeArrayItems(returnedCoffeeShops);
        
        randomCoffeeShops.splice(10);

        // store the randomCoffeeShops in state, and then display them
        dispatch({
          type: GET_COFFEE_SHOPS,
          payload: {
            all: returnedCoffeeShops,
            list: randomCoffeeShops,
            map: api.getRadiusMap(location, randomCoffeeShops)
          }
        })
      }
    })
    .catch(error => {
      // if an error occurs during the api call display an alert
      Swal.fire({
        title: 'No coffee shops found',
        text: 'Try searching for another location or increasing the maximum distance',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    });
}

export const randomizeCoffeeShops = (location, coffeeShops) => dispatch => {
  const randomCoffeeShops = randomizeArrayItems(coffeeShops).splice(0, 10);
  
  dispatch({
    type: RANDOMIZE_COFFEE_SHOPS,
    payload: {
      list: randomCoffeeShops,
      map: api.getRadiusMap(location, randomCoffeeShops)
    }
  })
}