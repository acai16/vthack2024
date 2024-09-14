import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import MainLanding from "./MainLanding";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BirdTracking from "./pages/BirdTracking";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<MainLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bird-tracking" element={<BirdTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;