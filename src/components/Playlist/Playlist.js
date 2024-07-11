import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
function Playlist({
  playlistTitle,
  playlistTracks,
  setPlaylistTitle,
  setPlaylistTracks,
  onRemove,
  onSave,
}) {
  const handlePlaylistNameChange = (e) => {
    setPlaylistTitle(e.target.value);
  };

  return (
    <div>
      <div className={styles.Playlist}>
        <input value={playlistTitle} onChange={handlePlaylistNameChange} />

        <Tracklist
          tracks={playlistTracks}
          isRemoval={true}
          onRemove={onRemove}
        />
        <button onClick={onSave} className={styles.PlaylistSave}>
          SAVE TO SPOTIFY
        </button>
      </div>
    </div>
  );
}

export default Playlist;
