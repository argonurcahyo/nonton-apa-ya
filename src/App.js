import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Watchlist } from "./components/Watchlist";
import { Watched } from "./components/Watched";
import { Add } from "./components/Add";
import "./App.css";
import "./lib/fontawesome6/css/all.min.css";
import { GlobalProvider } from "./context/GlobalState";
import { Popular } from "./components/Popular";
import Upcoming from "./components/Upcoming";
import TopRated from "./components/TopRated";
import TVSearch from "./components/TVSearch";

function App() {
  useTitle("NontonApaYa");

  return (
    <GlobalProvider>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Watchlist />} />
          <Route exact path="/watched" element={<Watched />} />
          <Route exact path="/add" element={<Add />} />
          <Route exact path="/popular" element={<Popular />} />
          <Route exact path="/upcoming" element={<Upcoming />} />
          <Route exact path="/toprated" element={<TopRated />} />
          <Route exact path="/tvsearch" element={<TVSearch />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

const useTitle = (title) => {
  React.useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default App;
