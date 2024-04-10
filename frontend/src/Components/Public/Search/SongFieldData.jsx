import { PlayIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { actions, useStore } from "../../../store";
import axiosClient from "../../../CommonAction/axios";

function formatTime(time) {
  const [hh, mm, ss] = time.split(':');
  return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
}

function formatViews(view) {
  return view.toString().replace(/\B(?=((\d{3})*(\d{3}))+(?!\d))/g, '.');
}


const SongItem = ({ song, index }) => {
  const [globalState, globalDispatch] = useStore()

  const [hover, setHover] = useState(false)

  let currentController;

  const handleClick = () => {
    if (!globalState.currentUserID) {
      navigate('/login');
      dispatch(actions.setNotificationPopup([
        {
          type: 'warning',
          emphasize: 'LOGIN REQUIRED',
          content: 'You need to login first'
        }
      ]));
    } else {
      if (currentController) {
        // If there's a previous request, abort it
        currentController.abort();
      }
      currentController = new AbortController();
      const signal = currentController.signal;
      if (globalState.currentSong?.id != song.id) {
        console.log('click');
        axiosClient
          .get('/song/get-playlists?songId=' + song.id, { signal })
          .then(({ data }) => {
            globalDispatch(actions.setCurrentPlaylist(data.playlist));
            globalDispatch(actions.setCurrentSong(data.playlist[0]));
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              console.error(err);
              // Handle other errors (not abort errors) if needed
            }
          });
      }
    }
  };
  
  return (
    <div
      className=" mx-3 grid grid-cols-12 items-center hover:bg-slate-700 rounded-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="px-2 py-1 col-span-1 text-center text-slate-200 font-semibold">
        {index}
      </div>
      <div className="px-2 py-1 col-span-5">
        <div className="flex items-center">
          <div className="mr-2 flex-shrink-0 sm:mr-3 w-14 h-14">
            <img className=" object-cover rounded-xl w-14 h-14" src={`${import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`} />
            <Tooltip content="Play Song"
              placement="top"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}>
              <PlayIcon
                className={`${hover ? 'cursor-pointer' : 'hidden'} active:scale-95 relative w-10 h-10 -top-12 left-2 text-white`}
                onClick={handleClick}
              />
            </Tooltip>
          </div>
          <div>
            <Link to={'/song/' + song?.id} className="text-slate-100 font-[500] hover:underline hover:cursor-pointer">
              {song?.name}
            </Link>
            <div className="text-left text-slate-400 font-normal"> {
              song?.artists.map((artist, index) => {
                return (
                  <Link to={'/artist/' + artist.id} key={index} className="hover:underline">{artist.name}{
                    song?.artists.length - 1 === index ? `` : `, `}</Link>
                )
              }
              )
            }
            </div>
          </div>
        </div>
      </div>
      <div className="whitespace-nowrap ml-2 px-2 py-3 col-span-3">
        <div className="text-center text-slate-400">{formatViews(song?.views)}</div>
      </div>
      <div className="whitespace-nowrap ml-2 px-2 py-3 col-span-3">
        <div className="text-center text-slate-400">{formatTime(song.duration)}</div>
      </div>
    </div>
  )
}

export default function Song({ songs }) {
  return (
    <>
      {
        songs.length ?
          <>
            <div className="grid grid-cols-12 items-center text-slate-300 font-bold hover:bg-slate-700 mx-3 border-b border-slate-600 my-2 pb-2 pt-4 sticky">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 pl-2">Name</div>
              <div className="col-span-3 text-center">Streams</div>
              <div className="col-span-3 text-center">Duration</div>
            </div>
            <div className="overflow-auto pb-36  object-cover">
              {
                songs?.map((song, index) => (
                  <SongItem key={song.id} song={song} index={index + 1} />
                ))
              }
            </div>
          </>
          :
          <div className="text-slate-600 font-semibold text-2xl pt-4 text-center w-full">
            No song match
          </div>
      }
    </>
  )
};
