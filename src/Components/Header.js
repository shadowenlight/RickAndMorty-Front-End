import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const currentPage = location.pathname;

      if (currentPage === '/episode') {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/episode/?name=${searchTerm}`
        );

        const firstEpisode = response.data.results[0];

        if (firstEpisode) {
          // Redirect to the SingleEpisode page with the matched episode ID
          navigate(`/single-episode/${firstEpisode.id}`);
        } else {
          console.log('No matching episode found.');
        }
      } else if (currentPage === '/character') {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${searchTerm}`
        );

        const firstCharacter = response.data.results[0];

        if (firstCharacter) {
          // Redirect to the SingleCharacter page with the matched character ID
          navigate(`/single-character/${firstCharacter.id}`);
        } else {
          console.log('No matching character found.');
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="home">
      <header className="header">
        <div className="input-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <nav className="nav">
          <Link to="/episode">Episodes</Link>
          <Link to="/character">Characters</Link>
          <Link to="/favorites">Favorites</Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
