import React from 'react';
import './imagelinkform.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return(
	<div className='ma4 mt0'>
		<p className='f3'>
			{'This Magic Brain will detect faces in your pictures.Give it a try!!'}
		</p>
		<div className='center pa4 br3 shadow-5 form'>
			<input className='pa2 f4 w-70 center ' type='text' onChange={onInputChange}/>
			<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
				onClick={onButtonSubmit}
				>Detect</button>
		</div>
	</div>
	);
}

export default ImageLinkForm;

