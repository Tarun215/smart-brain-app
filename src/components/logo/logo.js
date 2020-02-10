import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import Brain from './brain.png';

const Logo = () => {
	return(
	<div className='ma4 mt0'>
		<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 160, width: 150 }} >
 			<div className="Tilt-inner ">
 				<img alt='brain logo' src={Brain}/>
 				<p>face_recog by alpha_21</p>
			</div>
		</Tilt>
	</div>
	);
}

export default Logo;