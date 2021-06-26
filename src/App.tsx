import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Instructions from './components/Instructions';
import Form from './components/Form';
import Footer from './components/Footer';

import Results from './components/Results';
class App extends Component {
  
  render() {
    return (
      <div className='App'>
        <a href='#form' className='skipLink'>Skip to main</a>
        <Header />
        <main className='mainContainer'>
          <div className='wrapper'>
            <Instructions />
            <Form/>
          </div>

          <Results />

        </main>
        <Footer />
      </div >
    );
  }
}

export default App;
