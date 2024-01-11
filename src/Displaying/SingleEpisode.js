import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './SingleEpisode.css';

const SingleEpisode = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(0);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodeId}`
        );

        const characterDetails = await Promise.all(
          response.data.characters.map(async (characterURL) => {
            const characterResponse = await axios.get(characterURL);
            return characterResponse.data;
          })
        );

        setEpisode({ ...response.data, characters: characterDetails });
      } catch (error) {
        console.error("Error fetching episode:", error);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  const handleNextCharacter = () => {
    if (currentCharacter < episode.characters.length - 1) {
      setCurrentCharacter((prevCharacter) => prevCharacter + 1);
    }
  };

  const handlePrevCharacter = () => {
    if (currentCharacter > 0) {
      setCurrentCharacter((prevCharacter) => prevCharacter - 1);
    }
  };

  return (
    <div className="episode">
      {episode && (
        <div className="details">
          <h2>{episode.name}</h2>
          <p>Air Date: {episode.air_date}</p>
          <p>Episode: {episode.episode}</p>
          <p>Characters:</p>
          <ul>
            {episode.characters &&
              episode.characters.length > 0 &&
              episode.characters[currentCharacter] && (
                <li key={episode.characters[currentCharacter].id}>
                  <p>Name: {episode.characters[currentCharacter].name}</p>
                  <img
                    src={episode.characters[currentCharacter].image}
                    alt={`Character ${currentCharacter + 1}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </li>
              )}
          </ul>
          <Pagination style={{ marginTop: "10px" }}>
            <Pagination.Prev onClick={handlePrevCharacter} />
            <Pagination.Next onClick={handleNextCharacter} />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SingleEpisode;
