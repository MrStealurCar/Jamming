import React from "react";
import styles from "./App.module.css";

function App() {
  return (
    <div>
      <h1>
        Ja<span className={styles.highlight}>mmm</span>ing
      </h1>
      <div className={styles.App}>
        {/* SearchBar component  */}
        <div className={styles.appPlaylist}>
          {/* SearchResults component */}
          {/* Playlist component */}
        </div>
      </div>
    </div>
  );
}

export default App;
