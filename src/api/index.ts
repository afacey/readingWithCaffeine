import axios from 'axios';
import { CoffeeShop } from '../types/coffeeShop';
import { TransportationMode } from '../types/direction';
import { Location, Library } from '../types/location';

const apiKey = 'dgYN9vqDVgOBOwNtvPlR14jKSxdi9dVa';

// make api call to get prective search of user's search input
export const getPredictiveSearch = (input: string) => {

  if (input.length >= 3 && input.length < 50) {
    // make axios call to get autoComplete text of the user's input
    return axios({
      url: 'https://www.mapquestapi.com/search/v3/prediction',
      params: {
        q: input,
        collection: 'poi',
        key: apiKey,
      },
    })
  } else {
    return Promise.reject("Input value is less than 3 charactors or greater than 50 charactors");
  }
}

export const getCoffeeShops = ({ longitude, latitude, radius }: Library) => {
  const urlSearch = 'https://www.mapquestapi.com/search/v4/place';

  // make api call providing selectedLibrary longitude and latitude with query of Coffee Shops
  // to find the surrounding coffee shops of the selected library
  return axios({
    url: urlSearch,
    params: {
      key: apiKey,
      circle: `${longitude},${latitude},${radius! * 1000}`,
      sort: 'relevance',
      q: 'Coffee Shop',
      pageSize: 50,
    },
  })
}

// getting directions from the selectedLibrary to the selectedCoffeeShop
export const getSelectedTransportation = (library: Library, coffeeShop: Location, mode: TransportationMode) => {
  // api request to grab directions from the selectedLibrary to the selectedCoffeeShop
  return axios({
    url: 'https://www.mapquestapi.com/directions/v2/route',
    params: {
      key: apiKey,
      from: `${library.latitude},${library.longitude}`,
      to: `${coffeeShop.latitude},${coffeeShop.longitude}`,
      routeType: mode,
      scalebar: 'true|bottom',
      size: '600,600',
      type: 'light',
    }
  })
}

export const getRadiusMap = ({ latitude, longitude, radius }: Library, coffeeShops: CoffeeShop[]) => {
  // const { latitude, longitude, radius } = library;
  // reduce stored coffeeShops to a coordinates string needed for the static map API call
  // ex. ['43.653427,-79.380764|marker-md-1|', '43.650378,-79.380355|marker-md-2|']
  const coffeeShopCords = coffeeShops.reduce((cordsString, coffeeShop, index) => {
    const [longitude, latitude] = coffeeShop.place.geometry.coordinates;
    cordsString += `${latitude},${longitude}|marker-md-${index + 1}||`;

    return cordsString
  }, "")

  // construct the selectedLibrary marker's string
  const libraryMarker = `${latitude},${longitude}|marker-md-350482||`;

  // store the static map url to update the displayedMap in state
  return `https://www.mapquestapi.com/staticmap/v5/map?key=${apiKey}&scalebar=true|bottom&locations=${libraryMarker}${coffeeShopCords}&size=500,600&type=light&shape=radius:${radius}km|${latitude},${longitude}`;

}

export const getDirectionsMap = (session: string) => {
  return `https://www.mapquestapi.com/staticmap/v5/map?session=${session}&key=${apiKey}&scalebar=true|bottom&size=500,600&type=light&traffic=flow|cons|inc`;
}