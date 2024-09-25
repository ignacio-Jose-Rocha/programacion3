import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/navbar';
import Home from './components/home';
import './App.css';

function App() {

  return (
    <>
      <Navbar />
      <h1>Programacion 3</h1>
      <p className="read-the-docs">
        Sistema de gestion de autos
      </p>
      <Home />
    </>
  )
}

export default App
