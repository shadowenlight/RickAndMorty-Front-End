// App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import EpisodeList from "./Listing/EpisodeList";
import SingleEpisode from "./Displaying/SingleEpisode";
import SingleCharacter from "./Displaying/SingleCharacter";
import CharacterList from "./Listing/CharacterList";
import FavoriteCharacterList from "./Listing/FavoriteCharacterList";

function App() {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (characterId) => {
    if (favorites.length < 10 && !favorites.includes(characterId)) {
      setFavorites([...favorites, characterId]);
    } else {
      console.error("Error favorite character limit exceeded.");
    }
  };

  const removeFromFavorites = (characterId) => {
    setFavorites(favorites.filter((id) => id !== characterId));
  };

  return (
    <div className="App">
      <Router>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/episode" replace />} />
            <Route
              path="/episode"
              element={<EpisodeList addToFavorites={addToFavorites} />}
            />
            <Route
              path="/single-episode/:episodeId"
              element={<SingleEpisode />}
            />
            <Route
              path="/single-character/:characterId"
              element={
                <SingleCharacter
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                />
              }
            />
            <Route
              path="/character"
              element={
                <CharacterList
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoriteCharacterList
                  favorites={favorites}
                  removeFromFavorites={removeFromFavorites}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
