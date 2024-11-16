import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from '../../../config/api-endpoint.config';
function Search() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length > 0) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(`${API_ENDPOINT.auth.base}/suggest_keywords?keyword=${query}`);
                    setSuggestions(response.data.data);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/post_search?query=${query}`);
    };
  

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title);
        setSuggestions([]);
        navigate(`/post_search?query=${suggestion.title}`);
    };

    return (
        <form onSubmit={handleSubmit} className="custom-form search-form flex-fill me-3" role="search">
            <div className="input-group input-group-lg">
                <input
                    type="search"
                    className="border-0 p-2 rounded-start"
                    placeholder="Tìm Kiếm..."
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="input-group-text">
                    <i className="bi bi-search"></i>
                </button>
            </div>
            {suggestions.length > 0 && (
                <div className="dropdown list-inline bg-gradient rounded-3" id="searchSuggestions">
                    <ul className="dropdown-menu show">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <img
                                        src={`https://firebasestorage.googleapis.com/v0/b/podcast-ba34e.appspot.com/o/upload%2F${suggestion.images}?alt=media`}
                                        alt={suggestion.title}
                                        style={{ height: '30px', marginRight: '10px' }}
                                    />
                                    {suggestion.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}

export default Search;
