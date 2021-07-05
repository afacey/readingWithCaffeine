import React, { Component } from 'react';
import Swal from 'sweetalert2';
import * as api from '../api';

import { connect } from 'react-redux';
import { getCoffeeShops, randomizeCoffeeShops } from '../actions';

import { Library } from '../types/location';
import { CoffeeShopsState } from '../types/coffeeShop';
import { Dispatch } from 'redux';

const mapStateToProps = (state: { library: Library, coffeeShops: CoffeeShopsState }) => ({
  library: state.library,
  coffeeShops: state.coffeeShops
})

interface IProps {
  library: Library;
  coffeeShops: CoffeeShopsState;
  dispatch: Dispatch<any>;
}

interface IState {
  libraryInput: string;
  selectedLibrary: Library | null;
  selectedRadius: number;
  autoComplete: any[];
  showSuggestions: boolean;
  noResultsAtChar: number | null;
}

class Form extends Component<IProps, IState> {
  libraryInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      libraryInput: "",
      selectedLibrary: null,
      selectedRadius: 5,
      autoComplete: [],
      showSuggestions: false,
      noResultsAtChar: null,
    }

    this.libraryInputRef = React.createRef()
  }

  // method to handle library input change
  handleLibraryInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const libraryInput = event.target.value;
    const { noResultsAtChar } = this.state;

    // prevent unnecessary api calls if no results are found with previous input
    if (noResultsAtChar) {
      if (libraryInput.length < noResultsAtChar) {
        this.setState({ libraryInput, noResultsAtChar: null }, this.getPredictiveSearch);
      } else {
        this.setState({ libraryInput })
      }
    } else {
      this.setState({ libraryInput }, this.getPredictiveSearch);
    }
  };

  handleRadiusSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRadius = parseInt(event.target.value, 10);
    this.setState({
      selectedRadius,
    });
  };

  getPredictiveSearch = () => {
    const { libraryInput } = this.state;
    
    if (libraryInput?.length >= 3) {
      api.getPredictiveSearch(libraryInput)
        .then((res) => {
          const { results } = res.data;
          
          this.setState({
            showSuggestions: true,
            autoComplete: [...results],
            noResultsAtChar: results.length === 0 ? libraryInput.length : null,
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Oops!',
            text: `There was an error! ${error}. Try searching at a later time.`,
            icon: 'warning',
            confirmButtonText: 'OK',
          })
        })
    } else {
      this.setState({ showSuggestions: false });
    }
  }

  validateFormValues = () => {
    const { libraryInput, selectedLibrary, selectedRadius } = this.state;

    if (libraryInput === "" || libraryInput !== selectedLibrary?.name) {
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
  handleFormSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (this.validateFormValues()) {
      const { selectedLibrary, selectedRadius } = this.state;

      if (!selectedLibrary?.name) return false;

      const library = {
        ...selectedLibrary,
        radius: selectedRadius
      }

      if (JSON.stringify(library) === JSON.stringify(this.props.library)) {
        this.props.dispatch(randomizeCoffeeShops(library, this.props.coffeeShops.all));
      }

      else {
        this.props.dispatch({
          type: 'SET_LIBRARY',
          payload: library
        })

        this.props.dispatch(getCoffeeShops(library))
      }
    }
  };

  // method to handle the user selecting (onClick) an autocomplete result
  handleLibraryInputSelected = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const userSelectedLibrary = target.value;

    // map over the autoComplete array in state to return the properties of the userSelectedLibrary
    const [library] = this.state.autoComplete.filter((item) => item.name === userSelectedLibrary);

    // gather ther library's name, latitude, and longitude to be used for location searching
    const { name, displayString } = library;
    const [longitude, latitude] = library.place.geometry.coordinates;
    const address = displayString.split(`${name}, `)[1];

    // store the library's name, latitude, and longitude in object
    const selectedLibrary: Library = {
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

  getAutoComplete = () => {
    const { showSuggestions, autoComplete } = this.state;

    return showSuggestions ?
      (<ul className='inputLocationAutoComplete'>
        {
          autoComplete.length
            ?
            autoComplete.map((results) => {
              return (
                <li key={results.id} className='autoCompleteResults'>
                  <button
                    type='button'
                    key={results.id}
                    onClick={this.handleLibraryInputSelected}
                    value={results.name}
                  >
                    {results.name}
                  </button>
                </li>
              );
            })
            : <li className='autoCompleteResults'>
              <button type='button' onClick={this.clearSearch}>No results found. Click to clear search.</button>
            </li>
        }
      </ul>)
      : null;
  }

  clearSearch = () => this.setState({ libraryInput: '', showSuggestions: false, noResultsAtChar: null }, () => this.libraryInputRef.current?.focus());

  render() {
    const { libraryInputRef, handleLibraryInputChange, handleRadiusSelected, handleFormSubmit, getAutoComplete } = this;
    const { libraryInput, selectedRadius } = this.state;

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
              ref={libraryInputRef}
            />
            {getAutoComplete()}
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

export default connect(mapStateToProps)(Form);
