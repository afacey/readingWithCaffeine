import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SET_DIRECTIONS_MODE } from '../actions/types';

import { Direction } from '../types/direction';

const mapStateToProps = (state: { directions: Direction }) => ({
	directions: state.directions
});

interface IProps {
	directions: Direction;
	handleBackButton: () => void;
	dispatch: Dispatch;
}

const Directions = (props: IProps) => {

	const { directions, handleBackButton } = props;

	return (
		<div className='transportationAndDirections'>
			<button className='transportationButton' onClick={handleBackButton}>⬅ to Coffee Shops</button>
			<h2>Directions to:</h2>
			<div className="coffeeShop">
				<p className="coffeeShopName">{directions.location.name}</p>
				<p className="coffeeShopAddress">{directions.location.address}</p>
			</div>
			<div className='directionMarkers' aria-hidden='true'>
				<div className='directionMarkerContainer'>
					<img src='https://assets.mapquestapi.com/icon/v2/marker-start.png' alt='' />
					<p>Start</p>
				</div>
				<div className='directionMarkerContainer'>
					<img src='https://assets.mapquestapi.com/icon/v2/marker-end.png' alt='' />
					<p>End</p>
				</div>
			</div>

			<div className='modeOfTransportationInputContainer'>
				<label htmlFor='modeOfTransportation'>Choose a mode of transportation:</label>
				<select id='modeOfTransportation' value={directions.mode} onChange={(e) => props.dispatch({ type: SET_DIRECTIONS_MODE, payload: e.target.value })}>
					<option value='fastest'>Drive</option>
					<option value='pedestrian'>Walk</option>
					<option value='bicycle'>Bike</option>
				</select>
			</div>

			<ol className='directionsToCoffeeShopOl'>
				{/* map over directions array to display ordered list of coffee shop directions */}
				{directions.instructions.map((direction, index) => {
					return (
						<li key={index}>
							{direction}
						</li>
					);
				})}
			</ol>
		</div>
	)
};

export default connect(mapStateToProps)(Directions);