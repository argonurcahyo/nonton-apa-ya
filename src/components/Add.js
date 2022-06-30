import React, { useState } from "react";

export const Add = () => {
  const [query, setQuery] = useState("");
  // const [results, setResults] = useState([]);

  const onChange = e => {
    e.preventDefault();

    setQuery(e.target.value);

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${e.target.value}`,
      {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*'
        }
      })
      .then(res => {
        console.log(res);
        return res.json;
      })
      .then(data => {
        if (!data.errors) {
          // setResults(data.results);
          // console.log(data);
        }
        // else {
        //   setResults([]);
        // }
      });
  }

  return (
    <div className="add-page">
      <div className="container">
        <div className="add-content">
          <div className="input-wrapper">
            <input type="text"
              placeholder="Cari film"
              value={query}
              onChange={onChange}
            />
          </div>

          {/* {results.length > 0 && (
            <ul className="results">
              {results.map(movie => (
                <li>{movie.title}</li>
              ))}
            </ul>
          )} */}
        </div>
      </div>
    </div>
  );
};
