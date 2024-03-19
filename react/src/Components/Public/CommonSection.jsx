import { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import axiosClient from "../../axios";

export default function CommonSection() {

  const [songs, setSongs] = useState();

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    axiosClient
      .get('/songs',{ signal })
      .then(({ data }) => {
        setSongs(data)
      })
      .catch((err) => {
      })

    return () => {
      controller.abort()
    }

  }, [])


  return (
    <>
      <div className=" mx-auto mt-4 border-solid h-1/2 overflow-hidden mb-32">
        <div className="ml-5 text-white font-bold text-4xl">
          All
        </div>
        <section id="Projects"
          className="w-fit mx-auto grid grid-cols-1  xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {
            songs && songs.length > 0 ? (
              songs.map((song) => (
                <PlaylistCard
                  key={song.id}
                  song={song}
                  image={`${import.meta.env.VITE_GET_IMAGE_URL}/${song.image}`}
                  link={`${import.meta.env.VITE_GET_SONG_URL}/${song.link}`} />
              ))
            ) : (
              <>
                <PlaylistCard />
                <PlaylistCard />
                <PlaylistCard />
                <PlaylistCard />
                <PlaylistCard />
              </>
            )
          }
        </section>
      </div>
    </>
  )
}
