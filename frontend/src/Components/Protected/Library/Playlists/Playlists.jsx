import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Tooltip } from "@material-tailwind/react"
import { createContext, useEffect, useRef, useState } from "react"
import axiosClient from "../../../../axios"
import PlayListItem from "./PlayListItem"

import PlayListProfile from "./PlayListProfile"

export const PlaylistsContext = createContext({
  playlists: null,
  setPlaylists: () => { },
  currentPlaylist: null,
  setCurrentPlaylist: () => { },
});

export default function Playlists() {

  const [playlists, setPlaylists] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)

  const handleCreatePlaylist = () => {
    axiosClient
      .post('/song-lists')
      .then(({ data }) => {
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


  const value = {
    playlists,
    setPlaylists,
    currentPlaylist,
    setCurrentPlaylist,
  };

  return (
    <PlaylistsContext.Provider value={value} >
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
                <div className="w-full h-full  max-h-[70vh] min-h-96 rounded-lg overflow-hidden overflow-y-auto">
                  <PlayListProfile
                    playlist={currentPlaylist}
                    setPlayList={setCurrentPlaylist}
                    playlists={playlists}
                    setPlaylists={setPlaylists}
                  />
                </div>
              </div>
            </>
        }
      </div>
    </PlaylistsContext.Provider>
  )
}
