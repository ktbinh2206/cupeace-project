import { PlayIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { actions, useStore } from "../../../store";

function formatTime(time) {
  const [hh, mm, ss] = time.split(':');
  return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
}

function formatViews(view) {
  return view.toString().replace(/\B(?=((\d{3})*(\d{3}))+(?!\d))/g, '.');
}


const SongItem = ({ song = null, index }) => {
  const [globalState, globalDispatch] = useStore()

  const [hover, setHover] = useState(false)

  return (
    <tr
      className="items-center hover:bg-slate-700 rounded-md "
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <td className="text-center py-1 text-slate-200 font-semibold rounded-l-xl">
        {index}
      </td>
      <td className="py-1">
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
            <Link to={'/song/' + song?.id} className="pl-3 text-slate-100 font-[500] hover:underline hover:cursor-pointer">
              {song?.name}
            </Link>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-center text-slate-400">{formatViews(song?.views)}</div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3 rounded-r-xl">
        <div className="text-center text-slate-400">{formatTime(song.duration)}</div>
      </td>
    </tr>
  )
}

export default function Song({ songs = null }) {
  return (
    <>
      <table className="overflow-auto object-cover w-full">
        <tbody>
          {
            songs?.map((song, index) => (
              <SongItem key={song.id} song={song} index={index + 1} />
            ))
          }
        </tbody>
      </table>
    </>
  )
};
