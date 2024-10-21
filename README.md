# Jammming

This is a personal project coded in React that uses Spotify's API to search for songs, create playlists, and save them to your Spotify account. It showcases integration with third-party APIs and dynamic user interaction through React.

## Features
- Search for songs by artist, track, or album.
- Create and manage playlists.
- Save playlists directly to your Spotify account.

## Getting Started

### Prerequisites
- Node.js (>= 14.x.x)
- npm (>= 6.x.x)

### Spotify API Setup
1. Sign up or log in to your Spotify Developer account.
2. Create an application and retrieve your Client ID and Secret.
3. Create a `.env` file in the root directory with your API credentials:
    ```
    REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
    REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/
    ```

### Installation
1. Clone the repository: `git clone <repo_url>`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
