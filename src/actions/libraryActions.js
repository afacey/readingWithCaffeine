import Swal from 'sweetalert2';
import * as api from '../api';

import { GET_COFFEE_SHOPS } from './types';

 // getting surrounding coffee shops of the selected library and storing them in state
export const getCoffeeShops = (location) => dispatch => {
  
  api.getCoffeeShops(location)
    .then((response) => {
      // store returned results for later
      const returnedCoffeeShops = response.data.results;

      // if no results are returned then display an alert
      if (returnedCoffeeShops.length === 0) {
        Swal.fire({
          title: 'No results',
          text: 'Try another search please',
          icon: 'warning',
          confirmButtonText: 'Okay.',
        })
      } else {
        // creating a copy of the array to randomize and reduce to 10
        let randomCoffeeShops = [...returnedCoffeeShops]

        // standard fisher-yates randomizer to randomize entire array and prevent duplicates
        for (let i = randomCoffeeShops.length - 1; i > 0; i--) {
          const compareIndex = Math.floor(Math.random() * (i + 1));
          let temp = randomCoffeeShops[i];
          randomCoffeeShops[i] = randomCoffeeShops[compareIndex];
          randomCoffeeShops[compareIndex] = temp;
        }

        // to reduce array to 10 shops -- removing everything from index 10 and beyond
        randomCoffeeShops.splice(10);

        // store the randomCoffeeShops in state, and then display them
        dispatch({
          type: GET_COFFEE_SHOPS,
          payload: {
            list: randomCoffeeShops,
            map: api.getRadiusMap(location, randomCoffeeShops)
          }
        })
      }
    })
    .catch((error) => {
      // if an error occurs during the api call display an alert
      Swal.fire({
        title: 'No response',
        text: 'Try searching again later sir.',
        icon: 'warning',
        confirmButtonText: 'Okay',
      });
    });
}