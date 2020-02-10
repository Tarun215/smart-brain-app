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
      box: {},
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
    console.log("token : ", this.state.token)
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (data) => {
    this.setState({box: data});
  }

onInputChange = (event) => {
  this.setState({input : event.target.value})
}

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    console.log(this.state.authToken)
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
         )
      .then((response) => {
        if (response) {
          fetch('http://localhost:3000/findface', {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer '+this.state.authToken}})
              .then(response => response.json())
              .then(user => {
                console.log(user)
                this.setState(Object.assign(this.state.user, { entries: user.user.entries}))
             })
          console.log(response)
         this.displayFaceBox(this.calculateFaceLocation(response))
        }
      })
      .catch(err => console.log(err));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
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

// import React, { Component } from 'react';
// import Particles from 'react-particles-js';
// import Clarifai from 'clarifai';
// import FaceRecognition from './components/FaceRecognition/FaceRecognition';
// import Navigation from './components/Navigation/Navigation';
// import Signin from './components/Signin/Signin';
// import Register from './components/Register/Register';
// import Logo from './components/Logo/Logo';
// import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
// import Rank from './components/Rank/Rank';
// import './App.css';

// //You must add your own API key here from Clarifai.
// const app = new Clarifai.App({
//  apiKey: 'YOUR_API_HERE'
// });

// const particlesOptions = {
//   particles: {
//     number: {
//       value: 30,
//       density: {
//         enable: true,
//         value_area: 800
//       }
//     }
//   }
// }

// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       input: '',
//       imageUrl: '',
//       box: {},
//       route: 'signin',
//       isSignedIn: false,
//       user: {
//         id: '',
//         name: '',
//         email: '',
//         entries: 0,
//         joined: ''
//       }
//     }
//   }

//   loadUser = (data) => {
//     this.setState({user: {
//       id: data.id,
//       name: data.name,
//       email: data.email,
//       entries: data.entries,
//       joined: data.joined
//     }})
//   }

//   calculateFaceLocation = (data) => {
//     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
//     const image = document.getElementById('inputimage');
//     const width = Number(image.width);
//     const height = Number(image.height);
//     return {
//       leftCol: clarifaiFace.left_col * width,
//       topRow: clarifaiFace.top_row * height,
//       rightCol: width - (clarifaiFace.right_col * width),
//       bottomRow: height - (clarifaiFace.bottom_row * height)
//     }
//   }

//   displayFaceBox = (box) => {
//     this.setState({box: box});
//   }

//   onInputChange = (event) => {
//     this.setState({input: event.target.value});
//   }

//   onButtonSubmit = () => {
//     this.setState({imageUrl: this.state.input});
//     app.models
//       .predict(
//         Clarifai.FACE_DETECT_MODEL,
//         this.state.input)
//       .then(response => {
//         if (response) {
//           fetch('http://localhost:3000/image', {
//             method: 'put',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//               id: this.state.user.id
//             })
//           })
//             .then(response => response.json())
//             .then(count => {
//               this.setState(Object.assign(this.state.user, { entries: count}))
//             })

//         }
//         this.displayFaceBox(this.calculateFaceLocation(response))
//       })
//       .catch(err => console.log(err));
//   }

//   onRouteChange = (route) => {
//     if (route === 'signout') {
//       this.setState({isSignedIn: false})
//     } else if (route === 'home') {
//       this.setState({isSignedIn: true})
//     }
//     this.setState({route: route});
//   }

//   render() {
//     const { isSignedIn, imageUrl, route, box } = this.state;
//     return (
//       <div className="App">
//          <Particles className='particles'
//           params={particlesOptions}
//         />
//         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
//         { route === 'home'
//           ? <div>
//               <Logo />
//               <Rank
//                 name={this.state.user.name}
//                 entries={this.state.user.entries}
//               />
//               <ImageLinkForm
//                 onInputChange={this.onInputChange}
//                 onButtonSubmit={this.onButtonSubmit}
//               />
//               <FaceRecognition box={box} imageUrl={imageUrl} />
//             </div>
//           : (
//              route === 'signin'
//              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
//              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
//             )
//         }
//       </div>
//     );
//   }
// }