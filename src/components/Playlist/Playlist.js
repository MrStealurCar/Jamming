import React from "react";
import styles from "./Playlist.module.css";
import Tracklist from "../Tracklist/Tracklist";
function Playlist({
  playlistTitle,
  playlistDesc,
  isPrivate,
  playlistTracks,
  setPlaylistTitle,
  setIsPrivate,
  onRemove,
  onSave,
  setPlaylistDesc,
}) {
  const handlePlaylistNameChange = (e) => setPlaylistTitle(e.target.value);
  const handleDescriptionChange = (e) => setPlaylistDesc(e.target.value);

  const handlePrivateToggleChange = (e) => setIsPrivate(e.target.checked);

  return (
    <div>
      <div className={styles.Playlist}>
        <input
          id="playlistTitle"
          value={playlistTitle}
          onChange={handlePlaylistNameChange}
          type="text"
          placeholder="New Playlist"
        />

        <input
          id="playlistDescription"
          onChange={handleDescriptionChange}
          value={playlistDesc}
          placeholder="Add an Optional Description"
          type="text"
        />
        <label htmlFor="privatePlaylist">Private Playlist</label>
        <input
          checked={isPrivate}
          id="privatePlaylist"
          type="checkbox"
          onChange={handlePrivateToggleChange}
        />

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
