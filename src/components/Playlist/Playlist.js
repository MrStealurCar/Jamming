import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
function Playlist() {
  return (
    <div>
      <div className={styles.Playlist}>
        <input value="New Playlist" />
        <Tracklist />
        <button className={styles.PlaylistSave}>SAVE TO SPOTIFY</button>
      </div>
    </div>
  );
}

export default Playlist;
