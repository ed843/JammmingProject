import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import React, { useState } from 'react';
import Playlist from './components/Playlist';

function App() {
  const [playlist, setPlaylist] = useState([]);

  const removePlaylist = e => {
    const newPlaylist = playlist.filter(track => track.id !== e.target.value);
    setPlaylist(newPlaylist);
  }

  return (
    <div className="App">
      <SearchBar setPlaylist={setPlaylist} />
      <Playlist setPlaylist={setPlaylist} playlist={playlist} removePlaylist={removePlaylist} />
    </div>
  );
}

export default App;
