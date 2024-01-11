import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Characterlist.css";
import { Pagination } from "react-bootstrap";

const CharacterList = ({ addToFavorites, removeFromFavorites }) => {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 4;

  const handleSaveToDatabase = async () => {
    try {
      await axios.post("http://localhost:5056/api/characters/save", {
        characters: characters,
      });

      window.alert("All characters have been cached!");
    } catch (error) {
      console.error("Error caching all characters:", error);
      window.alert("Error caching all characters. Please check the console for details.");
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(
          "https://rickandmortyapi.com/api/character"
        );

        const charactersWithEpisodes = await Promise.all(
          response.data.results.map(async (character) => {
            const episodesDetails = await Promise.all(
              character.episode.map(async (episodeURL) => {
                const episodeResponse = await axios.get(episodeURL);
                return episodeResponse.data;
              })
            );

            return { ...character, episodes: episodesDetails };
          })
        );

        setCharacters(charactersWithEpisodes);
        handleSaveToDatabase();
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );

  const totalPages = Math.ceil(characters.length / charactersPerPage);

  return (
    <div className="character-list">
      <h2>Character List</h2>
      <ul className="characters">
        {currentCharacters.map((character) => (
          <li key={character.id} className="character-item">
            <div className="details">
              <p>Name: {character.name}</p>
              <p>Status: {character.status}</p>
              <p>Species: {character.species}</p>
              <p>Type: {character.type}</p>
              <p>Gender: {character.gender}</p>
              <p>Origin: {character.origin.name}</p>
              <p>Location: {character.location.name}</p>
            </div>
            <div className="imgAndButtons">
              <img src={character.image} alt={character.name} />
              <div className="favButtons">
                <button
                  className="addFav"
                  onClick={() => addToFavorites(character.id)}
                >
                  Add to Favorites
                </button>
                <button
                  className="removeFav"
                  onClick={() => removeFromFavorites(character.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
            <div className="episodes">
              <h4>Episodes:</h4>
              <ul>
                {character.episodes.map((episode) => (
                  <li key={episode.id}>
                    <p>Name: {episode.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <Pagination>
        <Pagination.Prev
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage > 1 ? prevPage - 1 : prevPage
            )
          }
          disabled={currentPage === 1}
        >
          &#9664; {/* Left arrow symbol */}
        </Pagination.Prev>

        <Pagination.Item active>{currentPage}</Pagination.Item>

        <Pagination.Next
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage < totalPages ? prevPage + 1 : prevPage
            )
          }
          disabled={currentPage === totalPages}
        >
          &#9654; {/* Right arrow symbol */}
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default CharacterList;
