import React from "react";
import "./App.css";
import "./lib/fontawesome6/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import Header from "./components/Header";
import Watchlist from "./pages/Watchlist";
import Watched from "./pages/Watched";
import Add from "./pages/Add";
import Popular from "./pages/Popular";
import Upcoming from "./pages/Upcoming";
import TopRated from "./pages/TopRated";
import TVSearch from "./pages/TVSearch";
import TVPopular from "./pages/TVPopular";
import Actor from "./pages/Actor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movie from "./pages/Movie";
import MovieByGenre from "./pages/MovieByGenre";
import Director from "./pages/Director";
import NotFound from "./pages/NotFound";
import MovieByKeyword from "./pages/MovieByKeyword";
import MovieByCompany from "./pages/MovieByCompany";
import MovieByNetwork from "./pages/MovieByNetwork";
import TVSeries from "./pages/TVSeries";
import Sync from "./pages/Sync";

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

          <Route path="/movie/:movieId" element={<Movie />} />
          <Route path="/movie/genre/:id" element={<MovieByGenre />} />
          <Route path="/movie/keyword/:id" element={<MovieByKeyword />} />
          <Route path="/movie/company/:id" element={<MovieByCompany />} />
          <Route path="/movie/network/:id" element={<MovieByNetwork />} />

          <Route exact path="/tv/search" element={<TVSearch />} />
          <Route exact path="/tv/popular" element={<TVPopular />} />
          <Route path="/tv/:id" element={<TVSeries />} />

          <Route path="/actor/:id" element={<Actor />} />
          <Route path="/director/:id" element={<Director />} />

          <Route exact path="/sync" element={<Sync />} />

          <Route path="*" element={<NotFound />} />

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
