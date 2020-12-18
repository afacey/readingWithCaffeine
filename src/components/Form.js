import React, { Component } from 'react';
import Swal from 'sweetalert2';
import * as api from '../api';

import { connect } from 'react-redux';
import { getCoffeeShops } from '../actions/libraryActions';

// const mapStateToProps = state => ({
//   library: state.library,
//   coffeeShops: state.coffeeShops.list
// })

class Form extends Component {
  constructor() {
    super();
    this.state = {
      libraryInput: "",
      selectedLibrary: "",
      selectedRadius: 5,
      autoComplete: [],
      showSuggestions: false
    }
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

  // handle the user's input for the selected distance (radius)
  handleRadiusSelected = (event) => {
    const selectedRadius = event.target.value;
    this.setState({
      selectedRadius,
    });
  };

  // make api call to get prective search of user's search input
  getPredictiveSearch = () => {
    const { libraryInput } = this.state;

    if (libraryInput.length >= 3 && libraryInput.length < 25) {

      api.getPredictiveSearch(libraryInput)
        .then((res) => {
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

  validateFormValues = () => {
    const { libraryInput, selectedLibrary, selectedRadius } = this.state;

    if (libraryInput === "" || libraryInput !== selectedLibrary.name) {
      Swal.fire({
        title: 'Unable to search for coffee shops',
        text: 'Location input must be valid',
        icon: 'warning',
        confirmButtonText: 'OK',
      })
      return false;
    }

    if (selectedRadius < 1 || selectedRadius > 20) {
      Swal.fire({
        title: 'Unable to search for coffee shops',
        text: 'Maximum distance must be a value between 1 and 20.',
        icon: 'warning',
        confirmButtonText: 'OK',
      })
      return false;
    }

    else if (!selectedLibrary.name) {
      Swal.fire({
        title: 'Unable to search for coffee shops',
        text: 'A location must be selected',
        icon: 'warning',
        confirmButtonText: 'OK',
      })
      return false;
    }

    else {
      return true;
    }
  }

  // method to handle user submitting the library name and distance to find surrounding coffee shops
  handleFormSubmit = (event) => {
    // prevent form from refreshing page on submit
    event.preventDefault();
    
    if (this.validateFormValues()) {
      const { selectedLibrary, selectedRadius } = this.state;

      const library = {
        ...selectedLibrary,
        radius: selectedRadius
      }
  
      this.props.dispatch({
        type: 'SET_LIBRARY',
        payload: library
      })
  
      // this.setState({ showSuggestions: false}, () => {
      // });    
      
      this.props.dispatch(getCoffeeShops(library))
    }

  };

  // method to handle the user selecting (onClick) an autocomplete result
  handleLibraryInputSelected = (event) => {
    // store the value of the autocomplete for later
    const userSelectedLibrary = event.target.value;

    // map over the autoComplete array in state to return the properties of the userSelectedLibrary
    const [ library ] = this.state.autoComplete.filter((item) => item.name === userSelectedLibrary);

    // gather ther library's name, latitude, and longitude to be used for location searching
    const { name, displayString  } = library;
    const [ longitude, latitude ] = library.place.geometry.coordinates;
    const address = displayString.split(`${name}, `)[1];

    // store the library's name, latitude, and longitude in object
    const selectedLibrary = {
      name,
      latitude,
      longitude,
      address
    };

    this.setState({ 
      libraryInput: name, 
      selectedLibrary,
      showSuggestions: false
    })
    
  };
  
  render() {
    const { handleLibraryInputChange, handleRadiusSelected, handleFormSubmit, handleLibraryInputSelected } = this;
    const { libraryInput, selectedRadius, showSuggestions, autoComplete } = this.state;

    return (
      <form id='form' action='submit'>
        <div className='formTopSection'>

          <label htmlFor='inputLocation'>Find Library</label>
          <div className='inputLocationContainer'>
            <input
              type='text'
              id='inputLocation'
              className='inputLocation'
              value={libraryInput}
              onChange={handleLibraryInputChange}
              placeholder=''
              autoComplete='off'
            />

            {/* displaying autocomplete results / event handler on click */}
            {showSuggestions &&
            // if showSuggestions is true then display the list of autoCompleteResults
              <ul className='inputLocationAutoComplete'>
                {
                  autoComplete.length 
                  ? 
                  autoComplete.map((results) => {
                    return (
                      <li key={results.id} className='autoCompleteResults'>
                        <button
                          type='button'
                          key={results.id}
                          onClick={handleLibraryInputSelected}
                          value={results.name}
                        >
                          {results.name}
                        </button>
                      </li>
                    );
                  })
                  : <li className='autoCompleteResults'>
                  <button type='button' onClick={ () => this.setState({ libraryInput: '', showSuggestions: false })}>No results found. Click to clear search.</button>
                </li>
                }
              </ul>}
          </div>
        </div>

        <div className='formBottomSection'>
          <label htmlFor='inputRadius'>Maximum distance <span>(1 - 20km)</span></label>
          <input
            type='number'
            id='inputRadius'
            className='inputRadius'
            min='1'
            max='20'
            value={selectedRadius}
            onChange={handleRadiusSelected}
            placeholder=''
            autoComplete='off'
            required
          />

        <button className='formSubmitButton' type='submit' onClick={handleFormSubmit}>Go</button>

        </div>

      </form>
    );
  }
}    

// export default Form;
export default connect()(Form);
