import React, { useState } from "react";
import styles from "./App.module.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";

function App() {
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "Everybody Wants to Rule the World",
      artist: "Tears for Fears",
      album: "Songs from the Big Chair",
    },
    {
      id: 2,
      name: "I Ran (So Far Away)",
      artist: "A Flock of Seagulls",
      album: "A Flock of Seagulls",
    },
    {
      id: 3,
      name: "Disco Inferno",
      artist: "The Trammps",
      album: "Disco Inferno",
    },
  ]);
  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>
      <div className={styles.App}>
        <SearchBar />
        <div className={styles.appPlaylist}>
          <SearchResults searchResults={searchResults} />
          <Playlist />
        </div>
      </div>
    </div>
  );
}

export default App;
