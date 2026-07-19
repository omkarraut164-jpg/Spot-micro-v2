import React from 'react';
import Navbar from './components/Navbar';
import ScrollCanvas from './components/ScrollCanvas';
import SpecsSection from './components/SpecsSection';
import ReserveSection from './components/ReserveSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <ScrollCanvas />
        <SpecsSection />
        <ReserveSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
