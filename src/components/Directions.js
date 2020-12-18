import React from 'react';
import { connect } from 'react-redux';
import { SET_DIRECTIONS_MODE } from '../actions/types';

const mapStateToProps = state => ({
	directions: state.directions
});

const Directions = (props) => {

	const { directions, handleBackButton } = props;

	return (
		<div className='transportationAndDirections'>
			<button className='transportationButton' onClick={handleBackButton}>⬅ to Coffee Shops</button>
			<h2>Directions to {directions.location.name}</h2>

			<div className='directionMarkers' aria-hidden='true'>
				<div className='directionMarkerContainer'>
					<img src='https://assets.mapquestapi.com/icon/v2/marker-start.png' alt='' />
					<p>Start</p>
				</div>
				<div className='directionMarkerContainer'>
					<img src='https://assets.mapquestapi.com/icon/v2/marker-end.png' alt=''/>
					<p>End</p>
				</div>
			</div>
			
			<div className='modeOfTransportationInputContainer'>
				<label htmlFor='modeOfTransportation'>Choose a mode of transportation:</label>
				<select id='modeOfTransportation' value={directions.mode} onChange={(e) => props.dispatch({ type: SET_DIRECTIONS_MODE, payload: e.target.value})}>
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