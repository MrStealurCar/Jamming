import React from "react";
import styles from "./Track.module.css";

function Track({ track }) {
  return (
    <div>
      <div className={styles.track}>
        <div className={styles.trackInformation}>
          <h3>{track.name}</h3>
          <p>Artist: {track.artist}</p>
          <p>Album: {track.album}</p>
        </div>
        <button className={styles.trackAction}>+ or - will go here</button>
      </div>
    </div>
  );
}

export default Track;
