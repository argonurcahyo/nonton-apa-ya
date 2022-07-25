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
import { TVPopular } from "./components/TVPopular";
import Actor from "./components/Actor";
import Login from "./components/Login";
import Register from "./components/Register";
import Movie from "./components/Movie";
import MovieByGenre from "./components/MovieByGenre";

function App() {
  useTitle("NontonApaYa");

  return (
    <GlobalProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route exact path="/" element={<Watchlist />} />
          <Route exact path="/movie" element={<Watchlist />} />
          <Route exact path="/movie/watched" element={<Watched />} />
          <Route exact path="/movie/search" element={<Add />} />
          <Route exact path="/movie/popular" element={<Popular />} />
          <Route exact path="/movie/upcoming" element={<Upcoming />} />
          <Route exact path="/movie/toprated" element={<TopRated />} />
          <Route exact path="/tv/search" element={<TVSearch />} />
          <Route exact path="/tv/popular" element={<TVPopular />} />

          <Route path="/actor/:id" element={<Actor />} />
          <Route path="/movie/:movieId" element={<Movie />} />
          <Route path="/movie/genre/:id" element={<MovieByGenre />} />
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
