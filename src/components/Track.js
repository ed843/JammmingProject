import React from 'react';
import styles from '../styles/Track.module.css'

function Track({track, trackName, artistName, setPlaylist, removePlaylist}) {
    const addToPlaylist = e => {
        setPlaylist(prev => [track, ...prev])
    }

    return(
        <div className={styles.container}>
            <div className={styles.thing}>
            <img className={styles.albumImage} src={track.album.images[2].url} alt={track.name} />
                <div className={styles.div}>
                    <h3>{trackName}</h3>
                    <p>{artistName}</p>
                </div>
                {setPlaylist && <button className={styles.addToPlaylistButton} onClick={addToPlaylist}></button>}
                {removePlaylist && <button onClick={removePlaylist} value={track.id}>-</button>}
            </div>

        </div>
    )
}

export default Track;