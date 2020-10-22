import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';
import Header from './components/Header';
import Instructions from './components/Instructions';
import Form from './components/Form';
import CoffeeShopsList from './components/CoffeeShopsList';
import Footer from './components/Footer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      libraryInput: '', // register change of library selection
      autoComplete: [], // results from the prediction text
      selectedLibrary: {}, // grab value of library // pop in here
      showSuggestions: false, // detect whether to show the autocomplete results
      selectedRadius: 5, // grab value on radius input (default is 5 km)
      coffeeShops: [], // store the random coffee shops
      selectedCoffeeShop: '', // grab value of coffee shop from list of results
      displayedMap: '', // grap the image src of the displayed map
      directionsToCoffeeShop: [], // grab the directions to the selected coffee shop
      modeOfTransportation: 'fastest', // to set default mode to driving directions 
      directionsSessionID: '', // store the API directions session ID 
      coffeeShopClicked: false, // grab directions of the selected coffee shops 
      isLoading: 'true', // detect whether map is loading for spinner
    };
  }

  // method to handle library input change
  handleLibraryInputChange = (event) => {
    // if auto complete list is not showing update state to true
    if (!this.state.showSuggestions) {
      this.setState({ showSuggestions: true });
    }

    // store user input to set in state
    const libraryInput = event.target.value;

    // update state with the libraryInput
    // then call api to get search ahead (predictive) results
    this.setState({ libraryInput }, this.getPredictiveSearch);
  };

  // method to handle the user selecting (onClick) an autocomplete result
  handleLibraryInputSelected = (event) => {
    // store the value of the autocomplete for later
    const userSelectedLibrary = event.target.value;

    // map over the autoComplete array in state to return the properties of the userSelectedLibrary
    const finalLibrary = this.state.autoComplete.filter((item) => item.name === userSelectedLibrary)[0];

    // gather ther library's name, latitude, and longitude to be used for location searching
    const { name  } = finalLibrary;
    const [ longitude, latitude ] = finalLibrary.place.geometry.coordinates;

    // store the library's name, latitude, and longitude in object
    const selectedLibrary = {
      name,
      latitude,
      longitude,
    };

    // update state with the selectedLibrary object
    this.setState({selectedLibrary}, () => {
      // then update the library input to the userSelectedLibraryName, and hide the autocomplete list
      this.setState({
        libraryInput: name,
        showSuggestions: false,
      });
    });
  };

  // method to handle user submitting the library name and distance to find surrounding coffee shops
  handleFormSubmit = (event) => {
    // prevent form from refreshing page on submit
    event.preventDefault();

    // if user's libraryInput is less than 3 characters display an alert
    this.state.libraryInput.length < 3 ? Swal.fire({
      title: 'No results',
      text: 'Library name must be greater than 3 characters.',
      icon: 'warning',
      confirmButtonText: 'Okay',
    })

    :
    // if there are no autoComplete results OR the selected radius distance is less than 1 or greater than 20
    // display an alert
    this.state.autoComplete.length === 0 || this.state.selectedRadius < 1 || this.state.selectedRadius > 20 ?

      Swal.fire({
        title: 'No results',
        text: 'Try another search.',
        icon: 'warning',
        confirmButtonText: 'Okay',
      })

      :
      // if user does not click on an autocomplete result but types in a direct match
      this.state.libraryInput.toLowerCase() === this.state.autoComplete[0].name.toLowerCase() ?
        // store the library information needed for the mapquest calls in state and make api call to get the coffee shops
        this.setState({
          selectedLibrary: {
            name: this.state.autoComplete[0].name,
            latitude: this.state.autoComplete[0].place.geometry.coordinates[1],
            longitude: this.state.autoComplete[0].place.geometry.coordinates[0],
          },
          showSuggestions: false,
        }, this.getCoffeeShops)
        // else (user clicked on autocomplete suggestion), make api call to get the surrounding coffee shops
        : this.getCoffeeShops();
  };

  // make api call to get prective search of user's search input
  getPredictiveSearch = () => {
    const { libraryInput } = this.state;

    if (libraryInput.length >= 3 && libraryInput.length < 25) {
      const apiKey = 'dgYN9vqDVgOBOwNtvPlR14jKSxdi9dVa';

      // make axios call to get autoComplete text of the user's input
      axios({
        url: 'https://www.mapquestapi.com/search/v3/prediction',
        params: {
          q: libraryInput,
          collection: 'poi',
          key: apiKey,
        },
      }).then((res) => {
        //update autoComplete state with the returned search ahead results
        this.setState({ autoComplete: [...res.data.results] });
      })
      .catch(error => {
        // if there's an error with the api call display an alert
        Swal.fire({
          title: 'Oops!',
          text: `There was an error! ${error}. Try searching at a later time.`,
          icon: 'warning',
          confirmButtonText: 'OK',
        })
      })
    } else if (libraryInput.length < 3) {
      // if libraryInput is less than 3 hide the autocomplete results
      this.setState({ showSuggestions: false });
    }
  }

  // getting surrounding coffee shops of the selected library and storing them in state
  getCoffeeShops = () => {
    const apiKey = 'dgYN9vqDVgOBOwNtvPlR14jKSxdi9dVa';
    const urlSearch = 'https://www.mapquestapi.com/search/v4/place';

    // make api call providing selectedLibrary longitude and latitude with query of Coffee Shops
    // to find the surrounding coffee shops of the selected library
    axios({
      url: urlSearch,
      params: {
        key: apiKey,
        circle: `${this.state.selectedLibrary.longitude},${this.state.selectedLibrary.latitude},${this.state.selectedRadius * 1000}`,
        sort: 'relevance',
        q: 'Coffee Shop',
        pageSize: 50,
      },
    })
      .then((response) => {
        // store returned results for later
        const returnedCoffeeShops = response.data.results;

        // if no results are returned then display an alert
        if (returnedCoffeeShops.length === 0) {
          Swal.fire({
            title: 'No results',
            text: 'Try another search',
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
          this.setState({ coffeeShops: randomCoffeeShops }, this.displayCoffeeShops);
        }
      })
      .catch(() => {
        // if an error occurs during the api call display an alert
        Swal.fire({
          title: 'No response',
          text: 'Try searching again later.',
          icon: 'warning',
          confirmButtonText: 'Okay',
        });
      });
  }

  // get the static map of the coffeeShops and the selectedLibrary and update the map image
  displayCoffeeShops = () => {
    const { selectedRadius, coffeeShops, selectedLibrary: { latitude, longitude } } = this.state;
    
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
    const apiKey = 'dgYN9vqDVgOBOwNtvPlR14jKSxdi9dVa';
    const mapWithoutRoute = `https://www.mapquestapi.com/staticmap/v5/map?key=${apiKey}&scalebar=true|bottom&locations=${libraryMarker}${coffeeShopCords}&size=500,600&type=light&shape=radius:${selectedRadius}km|${latitude},${longitude}`;

    // update the displayedMap's state with the constructed src url
    this.setState({
      displayedMap: mapWithoutRoute,
      coffeeShopClicked: false,
    }, () => {
      // once the displayedMap has been updated, smooth scroll to the mapAndResults section
      let mapAndResults = document.querySelector('#mapAndResults');
      mapAndResults.scrollIntoView();

      // add a 1.2s delay to allow the image to load and then set isLoading to false
      setTimeout(() => {
        this.setState({
          isLoading: false,
        })
      }, 1200)
    })
  }

  // handle button click to go back to the list of surrounding coffeeShops
  handleBackButton = () => {
    // display the list and map of the surrounding coffee shops
    this.displayCoffeeShops();
  }

  // handle when the user selects a coffee shop from the list to get the directions
  handleCoffeeShopSelected = (event) => {
    // to prevent event bubbling down to the h3/p contained in the button
    // use event.currentTarget to target the button where the onClick event is attached to
    const userSelectedCoffeeShop = event.currentTarget.value;

    // filter the selected coffeeShop from state
    const finalCoffeeShop = this.state.coffeeShops.filter(
      (item) => item.id === userSelectedCoffeeShop
    )[0];

    // gather the selectedCoffeeShop name, latitude, and longitude for later
    const { name } = finalCoffeeShop;
    const [ longitude, latitude ] = finalCoffeeShop.place.geometry.coordinates;
    
    // store the selectedCoffeeShop name, latitude, and longitude in an object
    const selectedCoffeeShop = {
      name,
      latitude,
      longitude,
    }

    // set coffeeShopClicked to false to update state later
    const coffeeShopClicked = !this.state.coffeeShopClicked

    // update state with the selectedCoffeeShop
    // clear the directionsSessionID from the directions API call
    // set coffeeShopClicked to false
    this.setState({
      selectedCoffeeShop,
      directionsSessionID: '',
      coffeeShopClicked,
    },
      // after the selectedCoffeeShop is set in state,
      // call this.getSelectedTransportation to populate the results of the directions (map and list of directions)
      this.getSelectedTransportation
    );

  }

  // getting directions from the selectedLibrary to the selectedCoffeeShop
  getSelectedTransportation = () => {

    const apiKey = 'dgYN9vqDVgOBOwNtvPlR14jKSxdi9dVa';
    const { selectedLibrary, selectedCoffeeShop, modeOfTransportation } = this.state;

    // api request to grab directions from the selectedLibrary to the selectedCoffeeShop
    axios({
      url: 'https://www.mapquestapi.com/directions/v2/route',
      params: {
        key: apiKey,
        from: `${selectedLibrary.latitude},${selectedLibrary.longitude}`,
        to: `${selectedCoffeeShop.latitude},${selectedCoffeeShop.longitude}`,
        routeType: modeOfTransportation,
        scalebar: 'true|bottom',
        size: '600,600',
        type: 'light',
      }
    }).then(results => {
      // store directions array from results
      const directions = results.data.route.legs[0].maneuvers;

      // map over directions array to get the narrative text of each direction
      const directionsToCoffeeShop = directions.map(direction => {
        return direction.narrative;
      })

      // store the sessionId of the api call to use for the map of directions
      const directionsSessionID = results.data.route.sessionId;

      // update state with the directionsToCoffeeShop, and the directionsSessionID
      this.setState({ directionsToCoffeeShop, directionsSessionID }, () => {
        // once state has been changed, update mapWithRoute img src to display the visual directions using the sessionID of the directions api call
        const mapWithRoute = `https://www.mapquestapi.com/staticmap/v5/map?session=${this.state.directionsSessionID}&key=${apiKey}&scalebar=true|bottom&size=500,600&type=light&traffic=flow|cons|inc`;
        this.setState({ displayedMap: mapWithRoute });
      })
    })
  }

  // handle the user's input for the selected distance (radius)
  handleRadiusSelected = (event) => {
    const selectedRadius = event.target.value;
    this.setState({
      selectedRadius,
    });
  };

  // handle the user changing the modeOfTransportation dropdown menu
  handleTransportationChange = (event) => {
    const modeOfTransportation = event.target.value;

    this.setState({ modeOfTransportation }, this.getSelectedTransportation);
  }

  render() {
    const {
      handleLibraryInputChange,
      handleLibraryInputSelected,
      handleFormSubmit,
      handleRadiusSelected,
      handleCoffeeShopSelected,
      handleTransportationChange,
      handleBackButton,
      state: {
        libraryInput,
        autoComplete,
        showSuggestions,
        displayedMap,
        coffeeShops,
        selectedCoffeeShop,
        modeOfTransportation,
        directionsToCoffeeShop,
        coffeeShopClicked,
        selectedRadius,
      },
    } = this;
    return (
      <div className='App'>
        <a href='#form' className='skipLink'>Skip to main</a>
        <Header />
        <main className='mainContainer'>
          <div className='wrapper'>
            <Instructions />
            <Form
              libraryInput={libraryInput}
              handleLibraryInputChange={handleLibraryInputChange}
              handleFormSubmit={handleFormSubmit}
              handleRadiusSelected={handleRadiusSelected}
              handleTransportationChange={handleTransportationChange}
              showSuggestions={showSuggestions}
              autoComplete={autoComplete}
              handleLibraryInputSelected={handleLibraryInputSelected}
              selectedRadius={selectedRadius}
            />
          </div>

          {/* If there are coffeeShops then display the list of coffeeShops and the map */}
          {this.state.coffeeShops.length > 0 ?
              <div className='mapAndCoffeeShopBackground' id='mapAndResults'>
                <div className='mapAndCoffeeShopContainer wrapper'>
                  <div className='map'>
                    {/* If state isLoading then display loader...otherise display the map */}
                    {this.state.isLoading ? <div className='spinnerContainer'><div className='loadingSpinner'></div></div> :
                      <img src={displayedMap} alt='map of selected library and coffee shops' />}
                  </div>

                  <CoffeeShopsList
                    handleCoffeeShopSelected={handleCoffeeShopSelected}
                    coffeeShops={coffeeShops}
                    coffeeShopClicked={coffeeShopClicked}
                    selectedCoffeeShop={selectedCoffeeShop}
                    modeOfTransportation={modeOfTransportation}
                    handleTransportationChange={handleTransportationChange}
                    directionsToCoffeeShop={directionsToCoffeeShop}
                    handleBackButton={handleBackButton} 
                  />
                </div>
              </div>
            : null}

        </main>
        <Footer />
      </div >
    );
  }
}
export default App;
