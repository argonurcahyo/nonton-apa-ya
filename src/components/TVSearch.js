import React, { useState } from 'react'
import Transitions from './Transition';
import tmdb from '../apis/tmdb';
import TVCard from './TVCard';

const TVSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const onChange = (e) => {
        e.preventDefault();

        setQuery(e.target.value);

        const fetchTVSeries = async () => {
            try {
                const fetchedTVSeries = await tmdb.get("search/tv", {
                    params: {
                        language: "en-US",
                        include_adult: "true",
                        query: e.target.value,
                    }
                });
                setResults(fetchedTVSeries.data.results);
            } catch (error) {
                console.log(error);
                setResults([]);
            }
        }

        fetchTVSeries();
    }

    return (
        <Transitions>
            <div className="add-page">
                <div className="container">
                    <div className="add-content">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Search tv series..."
                                value={query}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        {results.length > 0 ? (
                            <div className="movie-grid">
                                {results.map((tv, index) => (
                                    <TVCard
                                        tv={tv}
                                        index={index}
                                        key={tv.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <h2 className="no-movies">Search something...</h2>
                        )}
                    </div>
                </div>
            </div>
        </Transitions>
    )
}

export default TVSearch;