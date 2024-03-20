import { PlayCircleIcon, ForwardIcon, BackwardIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import VolumeMuteIcon from "@mui/icons-material/VolumeMute"
import VolumeDownIcon from "@mui/icons-material/VolumeDown"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"

import { useEffect, useRef, useState } from "react";
import { Slider } from "@mui/material";
import { actions, useStore } from "../../store";
import axiosClient from "../../axios";

function OutlineHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>

  )
}
function SolidHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
  )
}

const SliderStyles = {
  width: 100,
  color: 'white',
  '& .MuiSliderThumb': {
    width: '13px',
    height: '13px'
  },
  '&:hover': {
    cursor: 'auto',
  }
}


function FollowButton() {

  const [isFollowed, setIsFollowed] = useState();
  const [state, dispatch] = useStore();

  useEffect(() => {
    if (state.currentSong?.id && state.currentUserID) {
      axiosClient
        .get(`/song/follow/${state.currentSong.id}`,)
        .then(({ data }) => {
          if (data.songId) {
            setIsFollowed(true)
          } else {
            setIsFollowed(false)
          }
        })
        .catch(error => {
          console.error('Error checking follow status:', error);
        })
    }
  }, [state.currentSongId])

  function handleFollow() {
    setIsFollowed(true)
    axiosClient
      .post(`/song/follow?songId=${state.currentSong.id}`)
      .then(() => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `FOLLOW SONG SUCCESS`,
          content: `You have just follow song " ${state.currentSong.name}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }
  function handleUnfollow() {
    setIsFollowed(false)
    axiosClient
      .post(`/song/unfollow?songId=${state.currentSong.id}`)
      .then(data => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `UNFOLLOW SONG SUCCESS`,
          content: `You have just unfollow song " ${state.currentSongName}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }


  return (
    <div>{
      isFollowed == true
        ? <div onClick={handleUnfollow}>
          <SolidHeart />
        </div>
        :
        <div onClick={handleFollow}>
          <OutlineHeart />
        </div>
    }
    </div>
  )
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function MusicPlay() {

  const [state, dispatch] = useStore();
  const src = state.currentSong?.link;
  const image = state.currentSong?.image;
  const prevId = usePrevious(state.currentSong?.id);

  const [streamingTime, setStreamingTime] = useState(0)

  const audioPlayer = useRef();
  const progressBar = useRef();

  const [mute, setMute] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(76);
  const [timestamp, setTimestamp] = useState(0)
  const [totalTime, setTotalTime] = useState(0)


  useEffect(() => {
    if (isPlaying) {
      setInterval(() => {
        const duration = Math.floor(audioPlayer?.current?.duration)
        const elapsedTime = Math.floor(audioPlayer?.current?.currentTime)

        setDuration(duration)
        setElapsed(elapsedTime)

        if (elapsedTime === duration) {
          setIsPlaying(false)
          audioPlayer?.current.pause()
        }
      }, 1);
    }

    if (audioPlayer) {
      audioPlayer.current.volume = volume / 100;
    }

  }, [volume, audioPlayer]);

  useEffect(() => {
    let finalDuration = (totalTime + streamingTime);

    if (state?.currentSong?.link) {
      audioPlayer.current.src = state?.currentSong?.link; // Update audio source when currentSong changes
      setIsPlaying(true); // Start playing
      audioPlayer.current.play()
    }

    setTimestamp(0)
    setTotalTime(0)
    return () => {
      if (finalDuration > 30) {
        axiosClient
          .post('/song/stream', { 'id': prevId, 'duration': finalDuration })
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
          })
        console.log('Check duration: ' + finalDuration > 2);
      }
    }
  }, [state.currentSong?.id, state.currentSong?.link, state.currentSong?.name]);

  const calculateTime = (value) => {
    if (isNaN(value) || !isFinite(value) || value === 0) {
      return '00:00'; // Return a default value or handle the case appropriately
    }
    const minutes = Math.floor(value / 60) < 10 ? `0${Math.floor(value / 60)}` : Math.floor(value / 60)

    const seconds = Math.floor(value % 60) < 10 ? `0${Math.floor(value % 60)}` : Math.floor(value % 60)

    return `${minutes}:${seconds}`
  }

  const togglePlay = () => {
    if (!isPlaying) {
      audioPlayer.current.play()
    } else {
      audioPlayer.current.pause()
    }
    setIsPlaying(prev => !prev)
  }

  function VolumeBtns() {
    return mute
      ? <VolumeOffIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
      : volume <= 20 ? <VolumeMuteIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
        : volume <= 75 ? <VolumeDownIcon style={{ height: 36, width: 30 }} xs={{ color: 'lwhiteme', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
          : <VolumeUpIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
  }

  const timeUpdate = (e) => {
    setStreamingTime(e.target.currentTime - timestamp);
  }

  const handleProgressChange = (e) => {
    let value = e.target.value
    audioPlayer.current.currentTime = value
    setTimestamp(value)
    setElapsed(value);
    setTotalTime(prev => prev + streamingTime)
  }

  return (
    <>
      <audio src={src} ref={audioPlayer} muted={mute} onTimeUpdate={timeUpdate} />
      <div id="music-play" className="flex items-center justify-between h-32 w-full fixed bottom-0 bg-black border-t border-gray-400">
        <div className="left-item text-white w-1/5 pl-6 flex justify-between items-center">
          {state?.currentSong?.image ?
            <div className="flex items-center  gap-5">
              <img src={image || ``}
                alt="" className="h-1/2 w-20 object-cover rounded-xl hover:scale-[102%] duration-200" />
              <div className="font-bold">{state?.currentSong?.name}</div>
            </div>
            :
            <span className="text-3xl">--:--</span>
          }
          <FollowButton />
        </div>
        <div className="center-item text-white h-full w-2/5 ">
          <div className="h-20 flex justify-center items-center gap-4 mt-2">
            <div className="flex flex-grow justify-end">
              <div className="backward">
                <button className="w-16">
                  <BackwardIcon className="transition-all transform hover:scale-105 active:scale-95" />
                </button>
              </div>
            </div>
            <div className="basis-16 mt-2">
              <button className="w-full" onClick={() => isPlaying ? setIsPlaying(false) : setIsPlaying(true)}>

                {!isPlaying
                  ? <PlayCircleIcon className="transition-all transform hover:scale-110" onClick={togglePlay} />
                  : <PauseCircleIcon className="transition-all transform hover:scale-110" onClick={togglePlay} />
                }

              </button>
            </div>
            <div className="flex flex-grow">
              <div className="forward">
                <button className="w-16">
                  <ForwardIcon className="transition-all transform hover:scale-105 active:scale-95" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4 mb-8">
            <div className="flex-grow text-center">
              {calculateTime(elapsed)}
            </div>
            <div className="basis-9/12 flex items-center justify-center">
              <Slider
                type="range"
                value={isNaN(elapsed) ? 0 : elapsed}
                max={isNaN(duration) ? 0 : duration}
                defaultValue={0}
                ref={progressBar}
                onChange={handleProgressChange} />
            </div>
            <div className="flex-grow text-center">
              {calculateTime(duration)}
            </div>
          </div>
        </div>

        <div className="w-1/5 pl-9 right_item text-white flex items-center gap-3 mr-10">
          <VolumeBtns />
          <Slider style={SliderStyles} aria-label="Volume" value={volume} onChange={(e, v) => setVolume(v)} />
        </div>
      </div>
    </>
  )
}
