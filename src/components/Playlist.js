import React, { useState, useEffect } from "react";
import Track from "./Track";
import axios from "axios";
import styles from "../styles/Playlist.module.css";
import qs from "qs";

function Playlist({ playlist, setPlaylist, removePlaylist }) {
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [accessToken, setAccessToken] = useState();

  const redirectToSpotifyAuth = () => {
    const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI; // Your app's redirect URI
    const scopes = "playlist-modify-private playlist-modify-public"; // Required scopes

    // Redirect the user to Spotify authorization
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`;
  };

  const getAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("code"); // Extracts 'code' parameter from the URL
  };

  const getAccessTokenFromCode = async (code) => {
    const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;

    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        qs.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri,
          client_id: client_id,
          client_secret: client_secret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;
      setAccessToken(accessToken); // Save the token in state or local storage
      return accessToken;
    } catch (error) {
      console.error(
        "Error exchanging authorization code for access token:",
        error
      );
    }
  };

  useEffect(() => {
    const code = getAuthorizationCode(); // Extract the code from the URL
    if (code) {
      getAccessTokenFromCode(code); // Exchange code for an access token
    }
  }, []);

  const saveToSpotify = async (e) => {
    const getAccessToken = async () => {
      if (!accessToken) {
        // Only fetch a new token if none exists
        try {
          const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
          const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

          const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            qs.stringify({
              grant_type: "client_credentials",
              client_id: client_id,
              client_secret: client_secret,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const newToken = tokenResponse.data.access_token;
          setAccessToken(newToken); // Save token for future use
          return newToken; // Return token to be used immediately
        } catch (error) {
          console.error("Error fetching access token:", error);
          return null;
        }
      } else {
        return accessToken; // Use the stored token
      }
    };
    try {
      const playlistMap = playlist.map((track) => track.uri);
      const user_id = process.env.REACT_APP_USER_ID;
      const token = await getAccessToken();
      console.log(playlistMap);
      // Corrected config with proper headers and data
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Data for the playlist creation
      const data = {
        name: playlistName,
        description:
          "This playlist was created by my project 'Jammming'. A spotify API that searches for tracks and creates playlists from them.",
        public: false,
      };

      // API call with correct data and headers
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        data,
        config
      );

      console.log("Playlist created:", response.data);
      const playlist_id = response.data.id;

      const trackData = {
        uris: playlistMap, // Assign playlistMap directly to uris field
      };
      const addPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        trackData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure the access token is passed
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Tracks added to playlist:", addPlaylistResponse.data);
      alert("Playlist successfully created!")
      setPlaylist([]);
    } catch (error) {
      redirectToSpotifyAuth(); // Redirect to spotify auth
    }
  };

  return (
    <div className={styles.playlist}>
      <button className={styles.spotifyButton} onClick={redirectToSpotifyAuth}>
        <img className={styles.img} src={require("./pngegg.png")}></img>
        <p className={styles.buttonText}>
          <b>Login with Spotify</b>
        </p>
      </button>

      <ul className={styles.tracklist}>
        {playlist.map((track) => (
          <Track
            track={track}
            trackName={track.name}
            artistName={track.artists[0].name}
            removePlaylist={removePlaylist}
          />
        ))}
      </ul>
      <div className={styles.div}>
        <input
          className={styles.playlistInput}
          name="playlistName"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button className={styles.saveButton} onClick={saveToSpotify}>
          Save to Spotify
        </button>
      </div>
    </div>
  );
}

export default Playlist;
