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

// reusable function to fetch data from Spotify API
const fetchSpotify = async (method, path, body) => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.spotify.com/v1${path}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getSearchResults = async (query) => {
  const data = await fetchSpotify("GET", `/search?q=${query}&type=track`);
  return data.tracks.items;
};

export const savePlaylist = async (playlistData) => {
  // we need the user id to create a playlist
  const userProfile = await fetchSpotify("GET", "/me");
  if (!userProfile?.id) return null;

  // create playlist WITHOUT tracks
  const newPlaylist = await fetchSpotify(
    "POST",
    `/users/${userProfile.id}/playlists`,
    {
      name: playlistData.title,
      description: playlistData.description,
      public: !playlistData.isPrivate,
    }
  );
  if (!newPlaylist?.id) return null;

  // Add tracks to newly created playlist, this endpoint does not return the updated playlist
  const response = await fetchSpotify(
    "POST",
    `/playlists/${newPlaylist.id}/tracks`,
    {
      uris: playlistData.tracks,
    }
  );
  if (!response?.snapshot_id) return null;

  // get the updated playlist so i can return it
  const updatedPlaylist = await fetchSpotify(
    "GET",
    `/playlists/${newPlaylist.id}`
  );

  return updatedPlaylist;
};
