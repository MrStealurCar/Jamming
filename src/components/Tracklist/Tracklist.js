import React from "react";
import Track from "../Track/Track";
import styles from "./Tracklist.module.css";
const TrackList = ({ tracks = [] }) => {
  return (
    <div className={styles.TrackList}>
      {tracks.map((track) => (
        <Track key={track.id} track={track} />
      ))}
    </div>
  );
};

export default TrackList;
