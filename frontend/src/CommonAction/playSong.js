import { actions, useStore } from "~/store"
import axiosClient from "./axios"
import { setCurrentSong } from "~/store/action"



function playSong(playlist = null, song, currentController = null, state, dispatch) {


    if (playlist) {
        dispatch(actions.setCurrentPlaylist(playlist))
        dispatch(actions.setCurrentSong(song))
    } else if (playlist == null) {
        setCurrentSong(song)
        if (currentController) {
            // If there's a previous request, abort it
            currentController.abort();
        }
        currentController = new AbortController();
        const signal = currentController.signal;
        if (state.currentSong?.id != song.id) {
            axiosClient
                .get('/song/get-playlists?songId=' + song.id, { signal })
                .then(({ data }) => {
                    dispatch(actions.setCurrentPlaylist(data.playlist));
                })
                .catch(err => {
                    if (err.name !== 'AbortError') {
                        console.error(err);
                        // Handle other errors (not abort errors) if needed
                    }
                });
        }
    }
}

export { playSong }