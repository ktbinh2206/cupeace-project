import { useEffect, useRef, useState } from "react";
import { actions, useStore } from "../../../store";

import "./audio.css"
import SongInformation from "./SongInformation";
import CenterField from "./CenterField";
import RightFunctionButton from "./RightFunctionButton";
import axiosClient from "../../../axios"



export default function MusicPlay() {
  const [state, dispatch] = useStore();

  const [position, setPosition] = useState(0)
  const [src, setSrc] = useState();
  const [image, setImage] = useState();
  const [currentSong, setCurrentSong] = useState();

  const [streamingSession, setStreamingSession] = useState(null)
  //Store previous song for send to backend
  const [prevSong, setPrevSong] = useState(null);

  //use for center and left
  const [volume, setVolume] = useState(76);
  const [mute, setMute] = useState(false);

  //When component mount and unmount
  useEffect(() => {

    setImage(`${import.meta.env.VITE_GET_IMAGE_URL}/` + state.currentPlaylist[0].image)
    setSrc(`${import.meta.env.VITE_GET_SONG_URL}/` + state.currentPlaylist[0].link)
    setCurrentSong(state.currentPlaylist[0])
    if (!prevSong) {
      setPrevSong(state.currentPlaylist[0])
    }

  }, [state.currentPlaylist]);

  const handleNextSong = () => {
    try {

      setPrevSong(currentSong)
      setImage(`${import.meta.env.VITE_GET_IMAGE_URL}/` + state.currentPlaylist[position + 1].image)
      setSrc(`${import.meta.env.VITE_GET_SONG_URL}/` + state.currentPlaylist[position + 1].link)
      setCurrentSong(state.currentPlaylist[position + 1])
      dispatch(actions.setCurrentSong(state.currentPlaylist[position + 1]))
      setPosition(position + 1)
    } catch (error) {
      console.log(error);
    }
  }

  const handlePreviousSong = () => {
    if (position > 0) {
      setPrevSong(currentSong)
      setImage(`${import.meta.env.VITE_GET_IMAGE_URL}/` + state.currentPlaylist[position - 1].image)
      setSrc(`${import.meta.env.VITE_GET_SONG_URL}/` + state.currentPlaylist[position - 1].link)
      setCurrentSong(state.currentPlaylist[position - 1])
      dispatch(actions.setCurrentSong(state.currentPlaylist[position - 1]))

      setPosition(position - 1)
    }
  }



  const handleSendLog = (duration) => {
    console.log(streamingSession);
    console.log(currentSong);
    axiosClient.post('/song/logs',
      {
        duration: duration,
        songId: currentSong.id,
        streamingSession: streamingSession,
      })
      .then((data) => { console.log(data); })
      .catch(err => console.log(err))
  }
  
  const handleSendFinalLog = (duration) => {
    console.log(streamingSession);
    console.log(prevSong);
    axiosClient.post('/song/logs',
      {
        duration: duration,
        songId: prevSong.id,
        streamingSession: streamingSession,
      })
      .then((data) => { console.log(data); })
      .catch(err => console.log(err))
  }

  const updateIsFollowedById = (songId, isFollowed) => {
    const updatedSongs = state.currentPlaylist?.map(song => {
      if (song.id === songId) {
        return { ...song, is_followed: isFollowed };
      }
      return song;
    });
    return updatedSongs;
  };


  // Create AbortController ref
  const abortControllerRef = useRef(null);

  const handleFollow = () => {
    console.log('follow');

    // Update local state
    setCurrentSong({ ...currentSong, is_followed: false });
    dispatch(actions.setCurrentPlaylist(updateIsFollowedById(currentSong.id, true)));

    // Make API request with AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    axiosClient
      .post('/song/follow?songId=' + currentSong.id, {}, { signal })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => {
        // Cleanup function (optional)
        abortControllerRef.current?.abort();
      });

    // Cleanup function on unmount (optional)
    useEffect(() => {
      return () => abortControllerRef.current?.abort();
    }, []); // Empty dependency array ensures cleanup on unmount
  };

  const handleUnfollow = () => {
    console.log('unfollow');

    // Update local state
    setCurrentSong({ ...currentSong, is_followed: false });
    dispatch(actions.setCurrentPlaylist(updateIsFollowedById(currentSong.id, false)));

    // Make API request with AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    axiosClient
      .post('/song/unfollow?songId=' + currentSong.id, {}, { signal })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => {
        // Cleanup function (optional)
        abortControllerRef.current?.abort();
      });

    // Cleanup function on unmount (optional)
    useEffect(() => {
      return () => abortControllerRef.current?.abort();
    }, []); // Empty dependency array ensures cleanup on unmount
  };

  return (
    <>
      <div id="music-play" className="flex justify-between min-w-[817px] items-center h-20 w-screen fixed bottom-0 bg-[black] border-t border-slate-600">
        <SongInformation
          currentSong={currentSong}
          image={image}
          handleUnfollow={handleUnfollow}
          handleFollow={handleFollow}
        />
        <CenterField
          src={src}
          mute={mute}
          volume={volume}
          handleNextSong={handleNextSong}
          handlePreviousSong={handlePreviousSong}
          position={position}
          handleSendLog={handleSendLog}
          currentSong={currentSong}
          setStreamingSession={setStreamingSession}
          handleSendFinalLog={handleSendFinalLog}
        />
        <RightFunctionButton
          volume={volume}
          setVolume={setVolume}
          mute={mute}
          setMute={setMute}
        />
      </div>
    </>
  )
}
