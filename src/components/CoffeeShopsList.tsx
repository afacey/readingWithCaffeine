import React from 'react';
import { connect } from 'react-redux';
import { CoffeeShop, CoffeeShopsState } from '../types/coffeeShop';
import { Library } from '../types/location';
import marker from './../assets/marker.png';

interface IMapStateToProps {
  coffeeShops: CoffeeShop[];
  library: Library;
}

const mapStateToProps = (state: { coffeeShops: CoffeeShopsState; library: Library; }) => ({
  coffeeShops: state.coffeeShops.list,
  library: state.library
})

interface IProps {
  library: Library;
  coffeeShops: CoffeeShop[];
  handleCoffeeShopSelected: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const CoffeeShopsList = (props: IProps) => {
  const { library, coffeeShops, handleCoffeeShopSelected } = props

  return (
    <div className='coffeeShops'>
      <h2>Coffee Shops In The Area:</h2>
      <div className="library">
        <img className="markerImg" src={marker} alt="" />
        <div>
          <p className="libraryName">{library.name}</p>
          <p className="libraryAddress">{library.address}</p>
        </div>
      </div>
      <ol className='coffeeShopsContainer'>
        {
          coffeeShops.map((results: CoffeeShop, index: number) => {
            return (
              <li key={results.id}>
                <button
                  className='coffeeShopButton'
                  type='button'
                  key={results.id}
                  onClick={handleCoffeeShopSelected}

                  value={results.id}>
                  <div className='coffeeShopNumber'><p>{index + 1}</p></div>
                  <div className='coffeeShopText'>
                    <h3>{results.name}</h3>
                    <p>{results.place.properties.street}</p>
                  </div>
                </button>
              </li>
            );
          })
        }
      </ol>
    </div>
  );
};

export default connect(mapStateToProps)(CoffeeShopsList);