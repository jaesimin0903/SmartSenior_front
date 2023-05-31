
import './App.css';
import { BrowserRouter as Router, Route,Routes, Link } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import { Home } from './components/Home';
import {Talk} from './components/Talk';
import { Img } from './components/Img';
import { Work } from './components/Work';
import axios from 'axios'
import React from 'react'

function App() {


  

  return (
    <div className='App justify-content-center'>
      <Router>
        
        <Routes>
        <Route path="/img" element={<Img />}></Route>
        <Route path="/work" element={<Work />}></Route>
        <Route path="/talk" element={<Talk />}></Route>
        <Route path="/"  element={<Home />}></Route>
        </Routes>
        
        </Router>
        </div>
    
  );
}

export default App;
