const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = process.env.REACT_APP_SPOTIFY_AUTH_URL;

const RESPONSE_TYPE = "token";
export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=${RESPONSE_TYPE}&scope=playlist-modify-public playlist-modify-private user-read-private user-read-email`;

const getToken = () => {
    const token = localStorage.getItem("spotify_access_token");
    const expiresAt = localStorage.getItem("spotify_token_expires_at");

    if (new Date().getTime() / 1000 < parseInt(expiresAt)) {
      return token;
    } else {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_token_expires_at");
      window.location.href = loginUrl;
      return null;
    }
  };

export const getSearchResults = async (query) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      return data.tracks.items;
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  export const savePlaylist = async (playlistData) => {
    const token = getToken();
    try {
      // Makes request to get users profile
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await response.json();
      const user_id = profile.id; //Gets user ID

      //Create new playlist
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistData.title,
            description: playlistData.description,
            public: !playlistData.isPrivate,
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      const playlist = await createPlaylistResponse.json();
      const playlist_id = playlist.id;

      const trackUris = playlistData.tracks.map((track) => track.uri);

      //Add tracks to playlist
      const addTrackResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        }
      );

      if (!addTrackResponse.ok) {
        throw new Error("Failed to add track");
      }

      return addTrackResponse.json();
    } catch (error) {
      console.error("Error adding tracks:", error);
    }
  };