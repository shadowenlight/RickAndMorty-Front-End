import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EpisodeList.css";

const EpisodeList = () => {
  const [episodes, setEpisodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCharacters, setCurrentCharacters] = useState(0);

  const fetchAllEpisodes = async () => {
    try {
      const firstPage = await axios.get("https://rickandmortyapi.com/api/episode");
      const totalPages = firstPage.data.info.pages;
  
      let allEpisodes = [];
  
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/episode?page=${currentPage}`
        );
  
        const episodeDetails = await Promise.all(
          response.data.results.map(async (episode) => {
            const characterDetails = await Promise.all(
              episode.characters.map(async (characterURL) => {
                const characterResponse = await axios.get(characterURL);
                return characterResponse.data;
              })
            );
            return { ...episode, characters: characterDetails };
          })
        );
  
        allEpisodes = allEpisodes.concat(episodeDetails);
      }
  
      await axios.post("http://localhost:5056/api/episode/save", {
        episodes: allEpisodes,
      });
  
      window.alert("All episodes have been cached!");
    } catch (error) {
      console.error("Error caching all episodes:", error);
      window.alert("Error caching all episodes. Please check the console for details.");
    }
  };

  useEffect(() => {
    fetchAllEpisodes();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/episode?page=${currentPage}`
        );

        const episodeDetails = await Promise.all(
          response.data.results.map(async (episode) => {
            const characterDetails = await Promise.all(
              episode.characters.map(async (characterURL) => {
                const characterResponse = await axios.get(characterURL);
                return characterResponse.data;
              })
            );
            return { ...episode, characters: characterDetails };
          })
        );

        setEpisodes(episodeDetails);
        setTotalPages(response.data.info.pages);
        const initialCharacters = {};
        response.data.results.forEach((episode) => {
          initialCharacters[episode.id] = 0;
        });
        setCurrentCharacters(initialCharacters);        
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextCharacter = (episodeId) => {
    if (
      currentCharacters[episodeId] <
      episodes.find((e) => e.id === episodeId)?.characters.length - 1
    ) {
      setCurrentCharacters((prevCharacters) => ({
        ...prevCharacters,
        [episodeId]: prevCharacters[episodeId] + 1,
      }));
    }
  };

  const handlePrevCharacter = (episodeId) => {
    if (currentCharacters[episodeId] > 0) {
      setCurrentCharacters((prevCharacters) => ({
        ...prevCharacters,
        [episodeId]: prevCharacters[episodeId] - 1,
      }));
    }
  };

  return (
    <div className="episode-list">
      <ul className="episodes">
        {episodes.map((episode) => (
          <li key={episode.id} className="episode-item">
            <div className="details">
              <h2>{episode.name}</h2>
              <p>Air Date: {episode.air_date}</p>
              <p>Episode: {episode.episode}</p>
            </div>
            <ul>
              {episode.characters &&
                episode.characters.length > 0 &&
                episode.characters[currentCharacters[episode.id]] && (
                  <li>
                    <p>
                      Name:{" "}
                      {episode.characters[currentCharacters[episode.id]].name}
                    </p>
                    <img
                      src={
                        episode.characters[currentCharacters[episode.id]].image
                      }
                      alt={`Character ${currentCharacters[episode.id] + 1}`}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </li>
                )}
            </ul>
            <Link
              to={`/single-episode/${episode.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Details
            </Link>
            <Pagination style={{ marginTop: "10px" }}>
              <button
                className="pagination-button"
                onClick={() => handlePrevCharacter(episode.id)}
              >
                {"<-"}
              </button>
              <button
                className="pagination-button"
                onClick={() => handleNextCharacter(episode.id)}
              >
                {"->"}
              </button>
            </Pagination>
          </li>
        ))}
      </ul>
      <Pagination>
        <Pagination.Prev onClick={handlePrevPage} />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next onClick={handleNextPage} />
      </Pagination>
    </div>
  );
};

export default EpisodeList;
