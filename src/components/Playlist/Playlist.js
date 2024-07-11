import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
function Playlist({
  playlistTitle,
  playlistDesc,
  privatePlaylist,
  playlistTracks,
  setPlaylistTitle,
  setPlaylistTracks,
  onRemove,
  onSave,

  setPlaylistDesc,
}) {
  const handlePlaylistNameChange = (e) => {
    setPlaylistTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setPlaylistDesc(e.target.value);
  };

  return (
    <div>
      <div className={styles.Playlist}>
        <input
          id="playlistTitle"
          value={playlistTitle}
          onChange={handlePlaylistNameChange}
          type="text"
        />

        <input
          id="playlistDescription"
          onChange={handleDescriptionChange}
          value={playlistDesc}
        />

        {/* <label for="privatePlaylist"></label>
          <input value={privatePlaylist} id="privatePlaylist" type="checkbox" /> */}

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
