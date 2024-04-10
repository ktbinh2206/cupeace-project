import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import axiosClient from "../../../CommonAction/axios";
import { actions, useStore } from "../../../store";
import { Tooltip } from "@material-tailwind/react"
import { Link } from "react-router-dom";
import { PlayCircleIcon } from '@heroicons/react/24/solid'
import "./artistCard.css"
export default function ArtistCard({ artist = null }) {

    const [state, dispatch] = useStore();

    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <Link to={'/artist/' + artist?.id}
            className="
                    song-card
                    hover:bg-[#4444441f]
                    shadow-md rounded-xl hover:shadow-xl overflow-hidden hover:cursor-pointer  "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            {/* Avatar */}
            <div className=" relative w-full h-[70%] mb-2">
                {
                    artist?.avatar ?
                        <img
                            loading={'lazy'}
                            src={`${import.meta.env.VITE_GET_IMAGE_URL}/` + artist?.avatar}
                            className={`w-full aspect-square object-cover rounded-full`} />
                        :
                        <div className="w-full aspect-square  object-cover rounded-full"></div>
                }
            </div>
            {/* Artist Name */}
            <div className="px-2 py-3 w-full">
                <Tooltip content={artist?.name}>
                    <div to={'/artist/' + artist?.id} data-tooltip-target="tooltip-songname" className="text-lg font-bold text-white truncate block capitalize hover:text-[#5449DE]">
                        {artist?.name}
                    </div>
                </Tooltip>
                <div className="flex items-center">
                    <p className="text-base  text-neutral-400 cursor-auto my-3 ">
                        Artist
                    </p>
                </div>
            </div>
            <div
                className={`translate-x-52 -translate-y-20 transform duration-100 ${hovered ? 'opacity-100' : 'opacity-0'} `}
                onMouseEnter={() => setHovered(true)}
            >
            </div>
        </Link>
    )
}
