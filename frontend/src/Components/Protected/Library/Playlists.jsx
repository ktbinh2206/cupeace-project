import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Tooltip } from "@material-tailwind/react"
import { useEffect, useRef, useState } from "react"
import axiosClient from "../../../axios"
import PlayListItem from "./PlayListItem"

import { getAverageColor, getTextColor } from "../../../getColor";
import UpdatePlayListModal from "./UpdatePlayListModal"
import { useModal } from "../../../CustomeHooks"
import SearchField from "./SearchField"

export default function Playlists() {

  const [playlists, setPlaylists] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [textColor, setTextColor] = useState('')

  const [hoverImage, setHoverImage] = useState(false)
  const [isShowing, toggle] = useModal()

  const imageRef = useRef(null)

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const { R, G, B } = getAverageColor(imageRef.current, 4)
        setTextColor(getTextColor({ R, G, B }))
        setBackgroundColor(`rgb(${R}, ${G}, ${B})`);
      }
    }
  }, [currentPlaylist]);

  const handleCreatePlaylist = () => {
    axiosClient
      .post('/song-lists')
      .then(({ data }) => {
        console.log(data);
        setPlaylists([data, ...playlists])
      })
      .catch(err => {
        console.log(err);
      })

  }

  useEffect(() => {
    axiosClient
      .get('/song-lists')
      .then(({ data }) => {
        setPlaylists(data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div className="w-full flex justify-center my-4">
      {
        currentPlaylist == null ?
          <div className="w-[80%] max-h-[80vh] overflow-auto bg-[#252525] min-h-96 rounded-lg">
            <div className="sticky top-0 bg-[#252525] p-3">
              <Tooltip
                className="bg-black font-bold"
                content="Create Playlist"
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <PlusIcon
                  className="text-white w-8 aspect-square hover:cursor-pointer hover:scale-110 rounded-full hover:bg-[#3a3a3a]"
                  onClick={handleCreatePlaylist}
                />
              </Tooltip>

              <div className="grid grid-cols-[56px_1fr_1fr] pb-2 mt-2 border-b border-[#ffffff7c]">
                <div className="font-bold text-[#ffffff59]">Name</div>
                <div className=""></div>
                <div className="font-bold text-[#ffffff59]">Created</div>
              </div>
            </div>
            {
              playlists !== null
                ?
                playlists?.length > 0
                  ?
                  <div className="pt-4 px-3">
                    <div className="flex flex-col">
                      {
                        playlists.map((playlist) => (
                          <PlayListItem
                            key={playlist.id}
                            playlist={playlist}
                            setPlayLists={setPlaylists}
                            setCurrentPlaylist={setCurrentPlaylist}
                          />
                        ))
                      }
                    </div>
                  </div>
                  :
                  <div className="flex justify-center">
                    <div className="bg-[#363636af] w-1/2 px-10 py-3 text-center rounded-xl">
                      <div className="text-white font-semibold mb-5">
                        Create your first playlist for best  experience.
                      </div>
                      <button
                        onClick={handleCreatePlaylist}
                        className="text-black bg-slate-50 font-bold px-2 py-1 rounded-xl hover:scale-105">
                        Create Playlist
                      </button>
                    </div>
                  </div>
                :
                <></>
            }
          </div>
          :
          <>
            <div className="w-full  grid grid-cols-[2fr_7fr] px-2">
              <div className="overflow-auto max-h-[70vh] min-h-96 bg-[#252525]">
                <div className="sticky top-0 bg-[#252525] p-3 ">
                  <Tooltip
                    className="bg-black font-bold"
                    content="Create Playlist"
                    placement="top"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}>
                    <PlusIcon
                      className="text-white w-8 aspect-square hover:cursor-pointer hover:scale-110 rounded-full hover:bg-[#3a3a3a]"
                      onClick={handleCreatePlaylist}
                    />
                  </Tooltip>

                  <div className="grid grid-cols-[56px_1fr] pb-2 mt-2 border-b border-[#ffffff7c]">
                    <div className="font-bold text-[#ffffff59]">Name</div>
                    <div className=""></div>
                  </div>
                </div>
                <div className="pt-4 px-1 bg-[#252525]">
                  <div className="flex flex-col">
                    {
                      playlists.map((playlist) => (
                        <PlayListItem
                          key={playlist.id}
                          playlist={playlist}
                          setPlayLists={setPlaylists}
                          setCurrentPlaylist={setCurrentPlaylist}
                          currentPlaylist={currentPlaylist}
                        />
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className="w-full h-full rounded-lg overflow-hidden overflow-y-auto">
                <div
                  className={`h-full rounded-t-lg -z-10`}
                  style={{ backgroundSize: "cover", background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0,0,0,0.01) 100%)` }}
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
                            src={`${currentPlaylist?.image && import.meta.env.VITE_GET_IMAGE_URL}/${currentPlaylist?.image}`}
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
                        {currentPlaylist?.name}
                      </span>
                      <div className="font-medium flex gap-2 hover:cursor-pointer">
                        <img className="w-6 aspect-square rounded-full inline-block shadow-xl shadow-black" src={`${currentPlaylist?.user?.name && import.meta.env.VITE_GET_IMAGE_URL}/${currentPlaylist?.user?.avatar}`} />
                        {currentPlaylist?.user?.name}
                      </div>
                    </div>
                  </div>
                  {/* Song */}
                  <div className="px-16 pt-7 min-h-60"
                    style={{ backgroundSize: "cover", background: `linear-gradient(180deg, rgba(0,0,0,0.3533788515406162) 0%, rgba(0,0,0,0.6474964985994398) 10%, rgba(0,0,0,1) 78%)` }}
                  >
                    <SearchField />
                  </div>
                </div>
              </div>
            </div>
            <UpdatePlayListModal
              isShowing={isShowing}
              toggle={toggle}
              playlist={currentPlaylist}
              setCurrentPlaylist={setCurrentPlaylist}
              playlists={playlists}
              setPlaylists={setPlaylists}
            />
          </>
      }
    </div>
  )
}
