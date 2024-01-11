import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './SingleCharacter.css';

const SingleCharacter = ({ addToFavorites, removeFromFavorites }) => {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/${characterId}`
        );

        setCharacter({ ...response.data });
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching character:", error);
        setError(error); // Set error state if fetching fails
        setLoading(false); // Set loading to false even if fetching fails
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching character: {error.message}</p>;
  }

  return (
    <div className="character">
      {character && (
        <div className="details">
          <h2>{character.name}</h2>
          <p>Status: {character.status}</p>
          <p>Species: {character.species}</p>
          <p>Type: {character.type}</p>
          <p>Gender: {character.gender}</p>
          <div className="imgAndButtons">
            <img
              src={character.image}
              alt={`Character ${character.name}`}
              style={{ maxWidth: "100%", height: "auto" }}
            />
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
        </div>
      )}
    </div>
  );
};

export default SingleCharacter;
