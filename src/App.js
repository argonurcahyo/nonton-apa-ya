import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Watchlist } from "./components/Watchlist";
import { Watched } from "./components/Watched";
import { Add } from "./components/Add";
import "./App.css";
import "./lib/fontawesome6/css/all.min.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Watchlist />} />
        <Route exact path="/watched" element={<Watched />} />
        <Route exact path="/add" element={<Add />} />        
      </Routes>
    </Router>
  );
}

export default App;
