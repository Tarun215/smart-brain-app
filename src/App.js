import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/navigation';
import Signin from './components/signin/signin';
import Register from './components/register/register';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform';
import Rank from './components/rank/rank';
import FaceRecognition from './components/facerecognition/facerecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '6441fe8a3f6a4418b960acf1d122074b'
});

const particleOptions= {
  particles: {
    number:{
      value: 80,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      token : '',
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
      },
    }
  };

   loadUser = (data) => {
    this.setState({user: {
      id: data._id,
      name: data.name,
      email: data.email,
      entries: data.entries
    }})
  }

  authToken = (data) => {
    this.setState({token : ('' + data)});
  }

  calculateFaceLocation = (regions) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const data = []
    regions.forEach(region =>{
      const clarifaiFace = region.region_info.bounding_box;
      const border = {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
      }
      data.push(border)
    })
    return data
  }

  displayFaceBox = (data) => {
    this.setState({box: data});
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
         )
      .then((response) => {
        if (response) {
          fetch('http://localhost:3000/findface', {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'authorization': 'Bearer '+this.state.token}})
              .then(response => response.json())
              .then(user => {
                this.setState(Object.assign(this.state.user, { entries: user.entries}))
             })
              const regions = response.outputs[0].data.regions
                this.displayFaceBox(this.calculateFaceLocation(regions))               
              // [0].region_info.bounding_box
         // this.displayFaceBox(this.calculateFaceLocation(data))
        }
      })
      .catch(err => console.log(err));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      fetch('http://localhost:3000/users/logout', {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'authorization': 'Bearer '+this.state.token}}
            )
          .then(res => {
            if(res.status === 200){
              this.setState({isSignedIn: false})
              this.setState({route: 'signin'})
            }
          })
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
      this.setState({route: 'home'})
    } else this.setState({route : route})
  }

  render() {
    return (
      <div className="App">
         <Particles className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
            </div>
          : (
             this.state.route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} authToken={this.authToken}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} authToken={this.authToken}/>
            )
        }
      </div>
    );
  }
}


export default App;