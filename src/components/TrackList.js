import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Track from './Track.js'
import qs from 'qs';

function TrackList({ songName, setPlaylist }) {
    const [tracks, setTracks] = useState([]);
    const [accessToken, setAccessToken] = useState();

    useEffect(() => {
        const getAccessToken = async () => {
            if (!accessToken) { // Only fetch a new token if none exists
                try {
                    const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
                    const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

                    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
                        qs.stringify({
                            grant_type: 'client_credentials',
                            client_id: client_id,
                            client_secret: client_secret
                        }),
                        {
                            headers: { 
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }
                    );

                    const newToken = tokenResponse.data.access_token;
                    setAccessToken(newToken); // Save token for future use
                    return newToken; // Return token to be used immediately

                } catch (error) {
                    console.error('Error fetching access token:', error);
                    return null;
                }
            } else {
                return accessToken; // Use the stored token
            }
        };

        const fetchData = async () => {
            try {
                const token = await getAccessToken(); // Ensure we have a valid token

                if (!token) {
                    throw new Error('No access token available');
                }

                const options = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        q: songName,
                        type: 'track',
                        market: 'US',
                        limit: '10'
                    }
                };

                const response = await axios.get('https://api.spotify.com/v1/search', options);
                setTracks(response.data.tracks.items); // Store the search results
            } catch (error) {
                console.error('Error fetching data from Spotify API:', error);
            }
        };

        if (songName) {
            fetchData();
        }
    }, [songName, accessToken]); // Add accessToken as a dependency to avoid refetching it unnecessarily

    return (
        <div>
            <h2 style={{color: 'white'}}>Search Results for "{songName}"</h2>
            <ul>
                {tracks.map((track) => (
                    <Track track={track} trackName={track.name} artistName={track.artists[0].name} setPlaylist={setPlaylist} key={track.id}/>
                ))}
            </ul>
        </div>
    );
}

export default TrackList;
