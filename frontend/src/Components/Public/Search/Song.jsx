import { PlayIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { actions, useStore } from "../../../store";

function formatTime(time) {
  const [hh, mm, ss] = time.split(':');
  return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
}

const SongItem = ({ song }) => {
  const [globalState, globalDispatch] = useStore()

  const [hover, setHover] = useState(false)

  return (
    <div
      className="grid grid-cols-2 items-center hover:bg-slate-700 rounded-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="px-2 py-1">
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
                onClick={() => {
                  globalDispatch(actions.setCurrentSong(song));
                }}
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
      <div className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-center text-slate-400">{formatTime(song.duration)}</div>
      </div>
    </div>
  )
}

export default function Song({ songs }) {
  return (
    <>
      {
        songs?.map((song) => (
          <SongItem key={song.id} song={song} />
        ))
      }
    </>
  )
};
