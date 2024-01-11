// FavoriteCharacterList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoriteCharacterList.css';

const FavoriteCharacterList = ({ favorites, removeFromFavorites }) => {
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);

  useEffect(() => {
    const fetchFavoriteCharacters = async () => {
      try {
        const favoriteCharacterDetails = await Promise.all(
          favorites.map(async (characterId) => {
            const characterResponse = await axios.get(
              `https://rickandmortyapi.com/api/character/${characterId}`
            );
            return characterResponse.data;
          })
        );

        setFavoriteCharacters(favoriteCharacterDetails);
      } catch (error) {
        console.error('Error fetching favorite characters:', error);
      }
    };

    fetchFavoriteCharacters();
  }, [favorites]);

  return (
    <div className="character-list">
      <h2>Favorite Characters</h2>
      <ul className="characters">
        {favoriteCharacters.map((character) => (
          <li key={character.id}  className="character-item">
            <div className='details'>
                <p>Name: {character.name}</p>
                <p>Status: {character.status}</p>
                <p>Species: {character.species}</p>
                <p>Type: {character.type}</p>
                <p>Gender: {character.gender}</p>
            </div>
            <div className='imgAndButton'>
                <img src={character.image} alt={character.name} />
                <div className='favButton'>
                    <button className='removeFavorite' onClick={() => removeFromFavorites(character.id)}>
                    Remove from Favorites
                    </button>
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteCharacterList;
