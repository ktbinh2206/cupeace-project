import { PencilIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react";
import { getAverageColor, getTextColor } from "~/getColor";
import UpdatePlayListModal from "~/Modals/UpdatePlayListModal"
import { useModal } from "~/CustomeHooks";
import SongField from "./SongField"
import SearchField from "./SearchField"



export default function PlayListProfile({
    playlist,
    playlists,
    setPlaylists,
    setPlayList
}) {

    const [backgroundColor, setBackgroundColor] = useState('')
    const [textColor, setTextColor] = useState('')

    const [hoverImage, setHoverImage] = useState(false)
    const imageRef = useRef(null)

    const [isShowing, toggle] = useModal()
    const [songs, setSongs] = useState([])

    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.onload = () => {
                const { R, G, B } = getAverageColor(imageRef.current, 4)
                setTextColor(getTextColor({ R, G, B }))
                setBackgroundColor(`rgb(${R}, ${G}, ${B})`);
            }
        }
        setSongs(playlist.songs)
        console.log(playlist);
    }, [playlist]);


    return (
        <>
            <div
                className={`h-full rounded-t-lg -z-10`}
                style={{ backgroundSize: "cover", background: `linear-gradient(180deg, ${backgroundColor} 0%, ${backgroundColor} 40%, rgba(0,0,0,0.01) 100%)` }}
            >
                <div className="flex items-center h-2/3 p-7 gap-10">
                    <div className=" h-full flex items-end">
                        <div className="flex items-end w-64 h-full ">
                            <div className="relative">
                                <div
                                    onClick={toggle}
                                    onMouseEnter={() => { setHoverImage(true) }}
                                    onMouseLeave={() => { setHoverImage(false) }}
                                    className="absolute inset-0 hover:bg-[#0000006b] hover:cursor-pointer rounded-lg
                          flex justify-center items-center
                        ">{
                                        hoverImage &&
                                        <PencilIcon className="text-[#5449DE] w-20 aspect-square" />
                                    }
                                </div>
                                <img
                                    ref={imageRef}
                                    src={`${playlist?.image && import.meta.env.VITE_GET_IMAGE_URL}/${playlist?.image}`}
                                    alt=""
                                    className="w-64 h-64 rounded-lg shadow-2xl hover:cursor-pointer shadow-slate-950 object-cover"
                                    crossOrigin="true"
                                />
                            </div>
                            {/* <a className="absolute top-5 right-3" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified" href="/pages/profile#!">
                  <img src={verified} alt="" height="40" width="40" className="" />
                </a> */}
                        </div>
                    </div>
                    {/* User name and handle */}

                    <div className={`w-full h-full flex flex-col justify-end text-${textColor}`}>
                        <span className="font-bold  hover:cursor-pointer">
                            Playlist
                        </span>
                        <span className={`hover:cursor-pointer max-w-full py-4 font-bold text-[4vw] text-nowrap truncate`}>
                            {playlist?.name}
                        </span>
                        <p className="pt-1 pb-2 w-full inline-block  font-medium break-normal">
                            {playlist?.description}
                        </p>

                        <div className="font-medium flex gap-2 hover:cursor-pointer">
                            <img className="w-6 aspect-square rounded-full inline-block shadow-xl shadow-black" src={`${playlist?.user?.name && import.meta.env.VITE_GET_IMAGE_URL}/${playlist?.user?.avatar}`} />
                            {playlist?.user?.name}
                        </div>
                    </div>
                </div>
                {/* Song */}
                <div className="min-h-60"
                    style={{ backgroundSize: "cover", background: `linear-gradient(180deg, rgba(0,0,0,0.3533788515406162) 0%, rgba(0,0,0,0.6474964985994398) 40%, rgba(0,0,0,1) 90%)` }}
                >
                    <div>
                        f
                    </div>
                    <SongField
                        setSongs={setSongs}
                        songs={songs}
                    />
                    <SearchField
                        setPlayList={setPlayList}
                        playlist={playlist}
                    />
                </div>
            </div>
            {
                isShowing
                    ?
                    <UpdatePlayListModal
                        setCurrentPlaylist={setPlayList}
                        toggle={toggle}
                        playlist={playlist}
                        playlists={playlists}
                        setPlaylists={setPlaylists}
                    />
                    :
                    <></>
            }

        </>
    )
};
