import React from "react";
import styles from "./SearchResults.module.css";
import TrackList from "../Tracklist/Tracklist";

function SearchResults({ searchResults, onAdd, isRemoval }) {
  return (
    <div>
      <div className={styles.SearchResults}>
        <h2>Results:</h2>
        <TrackList tracks={searchResults} onAdd={onAdd} isRemoval={false} />
      </div>
    </div>
  );
}

export default SearchResults;
