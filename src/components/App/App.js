import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import { getSearchResults, loginUrl, savePlaylist } from "../../api/spotify";



function App() {
  const [token, setToken] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    // Get the hash from the URL
    const { hash } = window.location;
    // Parse the query string
    const tokenParams = new URLSearchParams(hash.substring(1)); // Remove the leading '#' and parse the parameters

    // Check if the access token is present in the query string
    const access_token = tokenParams.get("access_token");
    const expires_in = tokenParams.get("expires_in");

    if (access_token && expires_in) {
      const expiresAt = new Date().getTime() / 1000 + parseInt(expires_in);
      // Store the access token in localStorage

      localStorage.setItem("spotify_access_token", access_token);
      localStorage.setItem("spotify_token_expires_at", expiresAt);
      setToken(access_token);
      window.location.hash = ""; //Remove token from URL
    } else {
      const storedToken = localStorage.getItem("spotify_access_token");
      const storedExpiresAt = localStorage.getItem("spotify_token_expires_at");

      if (
        storedToken &&
        storedExpiresAt &&
        new Date().getTime() / 1000 < parseInt(storedExpiresAt)
      ) {
        setToken(storedToken);
      } else {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expires_at");
      }
    }
  }, []);

  const addTrack = (track) => {
    // If track is not already in playlist add it to playlist
    if (!playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const handleGetSearchResults = async (query) => {
    const searchResults = await getSearchResults(query);
    setSearchResults(searchResults);
  }

  const handleSavePlaylist = async () => {
    const trackUris = playlistTracks.map((track) => track.uri);

    const playlistData = {
      title: playlistTitle,
      description: playlistDesc,
      isPrivate: isPrivate,
      tracks: trackUris,
    };

    const response = await savePlaylist(playlistData);

    if (response) {
      setPlaylistTitle("");
      setPlaylistDesc("");
      setPlaylistTracks([]);
      setIsPrivate(false);
    }
  }

  const handleSearchChange = (e) => setQuery(e.target.value);

  

  return token ? (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>

      <div className={styles.App}>
        <div>
          <SearchBar
            value={query}
            onChange={handleSearchChange}
            getSearchResults={handleGetSearchResults}
            setSearchResults={setSearchResults}
          />
        </div>

        <div className={styles.appPlaylist}>
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistTitle={playlistTitle}
            playlistDesc={playlistDesc}
            isPrivate={isPrivate}
            playlistTracks={playlistTracks}
            setPlaylistTitle={setPlaylistTitle}
            setPlaylistDesc={setPlaylistDesc}
            setIsPrivate={setIsPrivate}
            onRemove={removeTrack}
            onSave={handleSavePlaylist}
          />
        </div>
      </div>
    </div>
  ) : (
    <a href={loginUrl}>Login to Spotify</a>
  );
}

export default App;
