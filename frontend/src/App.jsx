import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlantScanner from "./pages/PlantScanner";
import SeedIdentification from "./pages/SeedIdentification";
import PlantHealth from "./pages/PlantHealth";
import PlantDetails from "./pages/PlantDetails";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<PlantScanner />} />
          <Route path="/seed-identification" element={<SeedIdentification />} />
          <Route path="/health" element={<PlantHealth />} />
          <Route path="/details" element={<PlantDetails />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
