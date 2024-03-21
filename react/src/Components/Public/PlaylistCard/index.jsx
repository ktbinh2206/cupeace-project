import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import axiosClient from "../../../axios";
import { actions, useStore } from "../../../store";
import { Tooltip } from "@material-tailwind/react"
import { Link } from "react-router-dom";
import { PlayCircleIcon } from '@heroicons/react/24/solid'

export default function PlaylistCard({ song = null }) {

  const [state, dispatch] = useStore();

  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {

    if (!state.currentUserID) {
      dispatch(actions.setNotificationPopup([{
        type: 'warning',
        emphasize: 'LOGIN REQUIRED',
        content: 'You need login first'
      }]))
      navigate('/login')
    }
    if (song?.id != state?.currentSong?.id || !state.currentSong.id) {
      dispatch(actions.setCurrentSong(song));
    }
  }

  return (
    <div className="w-72 bg-slate-800 shadow-md rounded-xl hover:shadow-xl overflow-hidden hover:cursor-pointer  ">
      {
        song?.image ?
          <img
            loading={'lazy'}
            src={`${import.meta.env.VITE_GET_IMAGE_URL}/`+song?.image}
            className={`h-80 w-72 object-cover rounded-t-xl ${hovered && 'scale-[102%]'} duration-200`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)} />
          :
          <div className="h-80 w-72 object-cover rounded-t-xl"></div>
      }
      <div
        className={`translate-x-52 -translate-y-20 transform duration-100 ${hovered ? 'opacity-100' : 'opacity-0'} `}
        onMouseEnter={() => setHovered(true)}
      >
        <PlayCircleIcon
          onClick={handleClick}
          className=" absolute h-16 w-16 text-[#4741B5]  hover:scale-105 active:text-[#2c2a5c] "
        />
      </div>
      <div className="px-4 py-3 w-72">
        <Tooltip content={song?.name}>
          <p data-tooltip-target="tooltip-songname" className="text-xl font-bold text-white truncate block capitalize hover:text-[#5449DE]">{song?.name}</p>
        </Tooltip>
        <div className="flex items-center">
          <p className="text-lg  text-neutral-400 cursor-auto my-3 ">
            {
              song?.artists.map((artist, index) => {
                return (
                  <Link to={''} key={index} className="hover:underline">{artist.name}{
                    song?.artists.length - 1 === index ? `` : `, `}</Link>
                )
              }
              )
            }
          </p>
        </div>
      </div>
    </div>
  )
}
