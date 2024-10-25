import React, { useState } from 'react';
import TrackList from './TrackList';
import styles from '../styles/SearchBar.module.css';

function SearchBar({setPlaylist}) {
    const [songName, setSongName] = useState('');
    const [submittedSong, setSubmittedSong] = useState('');  // For storing the song after form submission

    const handleSubmit = e => {
        e.preventDefault();  // Prevent the form from refreshing the page
        setSubmittedSong(songName);  // Set the song name to pass to SearchResults
    };

    return (
        <div className={styles.div}>
            <form onSubmit={handleSubmit}>
                <div style={{display: 'flex'}}>
                    <input 
                        className={styles.input} 
                        type="text" 
                        value={songName} 
                        onChange={(e) => setSongName(e.target.value)}  // Update the song name on input change
                        placeholder="Search for a song"
                    />
                    <button className={styles.submit} type="submit">🔍</button>
                </div>
            </form>
            
            {submittedSong && <TrackList songName={submittedSong} setPlaylist={setPlaylist}/>}  {/* Only render results when submitted */}
        </div>
    );
}


export default SearchBar;
