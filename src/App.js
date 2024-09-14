import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from '@propelauth/react';
import NavBar from "./components/NavBar";
import MainLanding from "./MainLanding";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BirdTracking from "./pages/BirdTracking";
import Login from "./pages/Login";

const authUrl = process.env.REACT_APP_PROPELAUTH_AUTH_URL;

function App() {
  if (!authUrl) {
    return <div>Error: PropelAuth URL is not set</div>;
  }

  return (
    <AuthProvider 
      authUrl={authUrl}
      onError={(error) => {
        console.error("PropelAuth Error:", error);
      }}
    >
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<MainLanding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bird-tracking" element={<BirdTracking />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;