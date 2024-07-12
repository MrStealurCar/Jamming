import React from "react";
import Track from "../Track/Track";
import styles from "./Tracklist.module.css";
const TrackList = ({ tracks = [], onAdd, onRemove, isRemoval }) => {
  return (
    <div className={styles.TrackList}>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;
