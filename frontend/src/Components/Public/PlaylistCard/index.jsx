import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import axiosClient from "../../../axios";
import { actions, useStore } from "../../../store";
import { Tooltip } from "@material-tailwind/react"
import { Link } from "react-router-dom";
import { PlayCircleIcon } from '@heroicons/react/24/solid'
import "./style.css"
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
    <div
      className="
      song-card
    hover:bg-[#4444441f]
     shadow-md rounded-xl hover:shadow-xl overflow-hidden hover:cursor-pointer  "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Image */}
      <div className=" relative w-full h-[70%]">
        {
          song?.image ?
            <img
              loading={'lazy'}
              src={`${import.meta.env.VITE_GET_IMAGE_URL}/` + song?.image}
              className={`w-full h-full object-cover rounded-t-lg`} />
            :
            <div className="w-full h-full object-cover rounded-t-lg"></div>
        }
        <Tooltip content="Play Song"
          placement="top"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}>
          <PlayCircleIcon
            onClick={handleClick}
            className={`absolute
           right-[6%] bottom-[-10px] h-16 w-16 text-[#4741B5]  hover:scale-105 active:text-[#2c2a5c] transform duration-300 ${hovered ? 'opacity-100 -translate-y-[10px]' : 'opacity-0'} `}
            onMouseEnter={() => setHovered(true)}
          />
        </Tooltip>
      </div>
      {/* Artist and Songs */}
      <div className="px-2 py-3 w-full flex flex-col">
        <Tooltip content={song?.name}>
          <Link to={'/song/' + song?.id} data-tooltip-target="tooltip-songname" className="text-lg font-bold text-white truncate block capitalize hover:text-[#5449DE]">
            {song?.name}
          </Link>
        </Tooltip>
        <div className="">
          <p className="text-base  text-neutral-400 cursor-auto my-3 ">
            {
              song?.artists.map((artist, index) => {
                return (
                  <Link to={'/artist/' + artist?.id} key={index} className="hover:underline">{artist.name}{
                    song?.artists.length - 1 === index ? `` : `, `}</Link>
                )
              }
              )
            }
          </p>
        </div>
      </div>
      {/* Play */}
      <div
        className={`translate-x-52 -translate-y-20 transform duration-100 ${hovered ? 'opacity-100' : 'opacity-0'} `}
        onMouseEnter={() => setHovered(true)}
      >

      </div>
    </div>
  )
}
