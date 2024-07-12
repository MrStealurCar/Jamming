import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
// import queryString from "query-string";
// import TrackList from "../Tracklist/Tracklist";

const CLIENT_ID = "99cba05dd73c4108ad55b782e8072e25";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public playlist-modify-private user-read-private user-read-email`;

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

  const getToken = () => {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_token_expires_at");

    if (new Date().getTime() / 1000 < parseInt(expiresAt)) {
      return token;
    } else {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_token_expires_at");
      window.location.href = loginUrl;
      return null;
    }
  };
  const getSearchResults = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

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

  const handleSearchChange = (e) => setQuery(e.target.value);

  const savePlaylist = async () => {
    try {
      // Makes request to get users profile
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await response.json();
      const user_id = profile.id; //Gets user ID

      //Create new playlist
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistTitle,
            description: playlistDesc,
            public: !isPrivate,
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      const playlist = await createPlaylistResponse.json();
      const playlist_id = playlist.id;

      const trackUris = playlistTracks.map((track) => track.uri);

      //Add tracks to playlist
      const addTrackResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      if (!addTrackResponse.ok) {
        throw new Error("Failed to add track");
      }

      //Clears playlist, makes playlist public again (if user checked box), and reverts back to placeholder title and description
      setPlaylistTitle("");
      setPlaylistDesc("");
      setPlaylistTracks([]);
      setIsPrivate(false);
    } catch (error) {
      console.error("Error adding tracks:", error);
    }
  };

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
            getSearchResults={getSearchResults}
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
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  ) : (
    <a href={loginUrl}>Login to Spotify</a>
  );
}

export default App;
