import React from "react";
import styles from "./SearchResults.module.css";
import TrackList from "../Tracklist/Tracklist"; // Corrected import statement

function SearchResults({ searchResults }) {
  return (
    <div>
      <div className={styles.SearchResults}>
        <h2>Results:</h2>
        <TrackList tracks={searchResults} /> {/* Corrected component name */}
      </div>
    </div>
  );
}

export default SearchResults;
