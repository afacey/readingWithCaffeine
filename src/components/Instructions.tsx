import React from 'react';

const Instructions = () => {
    return (
			<section className='instructionsSection'>
				<h2>Instructions</h2>
				<p>Picking up books from your local library? Use this tool to locate a coffee shop nearby where you can relax and read in peace.</p>
				<ol>
					<li>Enter your library, set your preferred distance, and click GO!</li>
					<li>A map will appear with a list of 10 coffee shops around the library.</li>
					<li>Select your preferred coffee shop from the list and choose a mode of transportation to get directions.</li>
				</ol>
			</section>
    )
};

export default Instructions;