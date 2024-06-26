import React from "react";
import styles from "./App.module.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";

function App() {
  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>
      <div className={styles.App}>
        <SearchBar />
        <div className={styles.appPlaylist}>
          <SearchResults />
          <Playlist />
        </div>
      </div>
    </div>
  );
}

export default App;
