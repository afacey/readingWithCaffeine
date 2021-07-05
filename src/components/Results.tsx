import React, { Component } from 'react'
import CoffeeShopsList from './CoffeeShopsList';
import Directions from './Directions'
import Swal from 'sweetalert2';
import * as api from '../api';

import { connect } from 'react-redux';
import { SET_DIRECTIONS_INSTRUCTIONS, SET_DIRECTIONS_LOCATION } from '../actions/types';
import { arraysAreEqual } from '../helpers';
import { CoffeeShop, CoffeeShopsState } from '../types/coffeeShop';
import { Location, Library } from '../types/location';
import { Direction, TransportationMode } from '../types/direction';
import { Dispatch } from 'redux';

interface IMapState {
  coffeeShops: CoffeeShopsState;
  directions: Direction;
  library: Library;
}

const mapStateToProps = (state: IMapState) => ({
  coffeeShops: state.coffeeShops.list,
  radiusMap: state.coffeeShops.map,
  directionsMap: state.directions.map,
  selectedLibrary: state.library,
  selectedCoffeeShop: state.directions.location,
  modeType: state.directions.mode,
})

interface IProps {
  coffeeShops: CoffeeShop[];
  radiusMap: string;
  directionsMap: string;
  selectedLibrary: Library;
  selectedCoffeeShop: Location;
  modeType: TransportationMode;
  dispatch: Dispatch;
}

interface IState {
  displayDirections: boolean;
  isLoading: boolean;
}

class Results extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      displayDirections: false,
      isLoading: true, // detect whether map is loading for spinner
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.modeType !== this.props.modeType || JSON.stringify(prevProps.selectedCoffeeShop) !== JSON.stringify(this.props.selectedCoffeeShop)) {
      this.setState({ isLoading: true }, this.getSelectedTransportation);
    }


    if (arraysAreEqual(prevProps.coffeeShops, this.props.coffeeShops) === false) {
      this.setState({ displayDirections: false, isLoading: true })
    }

    if (this.props.coffeeShops && this.props.coffeeShops.length > 0) {
      const mapAndResults = document.querySelector('#mapAndResults')!;
      mapAndResults.scrollIntoView();
    }

  }

  // handle button click to go back to the list of surrounding coffeeShops
  handleBackButton = () => this.setState({ displayDirections: false, isLoading: true });

  // handle when the user selects a coffee shop from the list to get the directions
  handleCoffeeShopSelected = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const selectedLocationId = event.currentTarget.value;

    const selectedLocation = this.props.coffeeShops.reduce((locationObj, locationListItem) => {
      if (locationListItem.id === selectedLocationId) {
        locationObj = {
          name: locationListItem.name,
          longitude: +locationListItem.place.geometry.coordinates[0],
          latitude: +locationListItem.place.geometry.coordinates[1],
          address: locationListItem.displayString.split(`${locationListItem.name}, `)[1]
        }
      }

      return locationObj;
    }, {}) as Location;

    // if the selected location was previously loaded in state, just display the directions to prevent an unnecssary api call
    if (JSON.stringify(selectedLocation) === JSON.stringify(this.props.selectedCoffeeShop)) {
      this.setState({ displayDirections: true })
      return;
    }

    this.props.dispatch({ type: SET_DIRECTIONS_LOCATION, payload: selectedLocation })

  }

  // getting directions from the selectedLibrary to the selectedCoffeeShop
  getSelectedTransportation = async () => {
    const { selectedLibrary, selectedCoffeeShop, modeType } = this.props;
    // api request to grab directions from the selectedLibrary to the selectedCoffeeShop

    try {
      const results = await api.getSelectedTransportation(selectedLibrary, selectedCoffeeShop, modeType);

      // store directions array from results
      const directions = results.data.route.legs[0].maneuvers;

      // map over directions array to get the narrative text of each direction
      const directionsToCoffeeShop: string[] = directions.map((direction: any) => {
        return direction.narrative;
      })

      // store the sessionId of the api call to use for the map of directions
      const directionsSessionID: string = results.data.route.sessionId;

      this.props.dispatch({
        type: SET_DIRECTIONS_INSTRUCTIONS,
        payload: {
          instructions: [...directionsToCoffeeShop],
          session: directionsSessionID,
          map: api.getDirectionsMap(directionsSessionID)
        }
      })

      this.setState({ displayDirections: true });

    } catch (err) {
      Swal.fire({
        title: 'Oops!',
        text: 'There was an error retrieving the directions. Please try again later.',
        icon: 'warning',
        confirmButtonText: 'Okay',
      });
    }
  }

  render() {
    const { coffeeShops, radiusMap, directionsMap } = this.props;

    return (
      <>
        {/* If there are coffeeShops then display the list of coffeeShops and the map */}
        {
          coffeeShops.length > 0
            ?
            <div className='mapAndCoffeeShopBackground' id='mapAndResults'>
              <div className='mapAndCoffeeShopContainer wrapper'>
                <div className='map'>
                  {/* If state isLoading then display loader...otherise display the map */}
                  {
                    this.state.isLoading && <div className='spinnerContainer'><div className='loadingSpinner'></div></div>
                  }
                  <img
                    src={this.state.displayDirections ? directionsMap : radiusMap}
                    onLoad={() => this.setState({ isLoading: false })}
                    alt='map of selected library and coffee shops'
                  />
                </div>

                {
                  this.state.displayDirections
                    ? <Directions handleBackButton={this.handleBackButton} />
                    : <CoffeeShopsList handleCoffeeShopSelected={this.handleCoffeeShopSelected} />
                }

              </div>
            </div>
            :
            null
        }
      </>
    )
  }
}

export default connect(mapStateToProps)(Results);
