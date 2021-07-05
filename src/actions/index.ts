import { Dispatch } from 'redux';
import Swal from 'sweetalert2';
import * as api from '../api';
import { randomizeArrayItems } from '../helpers';
import { CoffeeShop } from '../types/coffeeShop';
import { Library } from '../types/location';

import { GET_COFFEE_SHOPS, RANDOMIZE_COFFEE_SHOPS } from './types';

// getting surrounding coffee shops of the selected library and storing them in state
export const getCoffeeShops = (location: Library) => (dispatch: Dispatch) => {

  api.getCoffeeShops(location)
    .then((response) => {
      // store returned results for later
      const returnedCoffeeShops = response.data.results as CoffeeShop[];

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

export const randomizeCoffeeShops = (location: Library, coffeeShops: CoffeeShop[]) => (dispatch: Dispatch) => {
  const randomCoffeeShops = randomizeArrayItems(coffeeShops).splice(0, 10);

  return dispatch({
    type: RANDOMIZE_COFFEE_SHOPS,
    payload: {
      list: randomCoffeeShops,
      map: api.getRadiusMap(location, randomCoffeeShops)
    }
  })
}