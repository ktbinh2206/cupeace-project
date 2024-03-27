import { useEffect, useState } from "react";
import PlaylistCard from "../PlaylistCard";
import axiosClient from "../../../axios";
import { useStore } from "../../../store";
import ArtistCard from "./ArtistCard"

import "./common.css"
export default function CommonSection() {

  const [data, setData] = useState()
  const [state, dispatch] = useStore()
  const [gridCol, setGridCol] = useState(3)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    if (state.currentUserID) {
      axiosClient
        .get('/home/user', { signal })
        .then(({ data }) => {
          console.log(data);
          setData(data)
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      axiosClient
        .get('/home/guest', { signal })
        .then(({ data }) => {
          setData(data)
        })
        .catch((err) => {
        })
    }

    return () => {
      controller.abort()
    }

  }, [state.currentUserID])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize()
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []); // Empty dependency array to run only once on mount

  const handleWindowResize = () => {
    let windowWidth = window.innerWidth;
    switch (true) {
      case windowWidth >= 1776:
        setGridCol(9);
        break;
      case windowWidth >= 1596:
        setGridCol(8);
        break;
      case windowWidth >= 1416:
        setGridCol(7);
        break;
      case windowWidth >= 1236:
        setGridCol(6);
        break;
      case windowWidth >= 1036:
        setGridCol(5);
        break;
      case windowWidth >= 836:
        setGridCol(4);
        break;
      default:
        setGridCol(3); // Default for smaller screens
    }

  }

  const calculateNumberCard = (length, cols) => {
    if (cols > length) {
      return length
    }
    return cols
  }

  return (
    <div className="mb-32">
      {
        !state?.currentUserID
          ?
          <>
            <div className=" mx-auto mt-4 border-solid h-1/2 overflow-hidden mb-32">
              <div className="ml-5 text-white font-bold text-2xl">
                Popular
              </div>
              <section className="common-section">
                {
                  data?.popular_songs && data?.popular_songs?.length > 0 ? (
                    data?.popular_songs.slice(0, gridCol).map((song) => (
                      <PlaylistCard
                        key={song.id}
                        song={song} />
                    ))
                  ) : (
                    <>
                      {
                        Array.from({ length: gridCol }, (_, index) => (
                          <PlaylistCard key={index} />
                        ))
                      }
                    </>
                  )
                }
              </section>
            </div>
          </>
          :
          <>
            {
              data?.recently_songs?.length > 0 &&
              <div className=" mx-auto mt-4 border-solid h-1/2 overflow-hidden">
                <div className="ml-5 text-white font-bold text-2xl">
                  Recently
                </div>
                <section className="common-section">
                  {
                    data?.recently_songs && data.recently_songs.length > 0 ? (
                      data.recently_songs.slice(0, calculateNumberCard(data.recently_songs.length, gridCol))?.map((song) => (
                        <PlaylistCard
                          key={song.id}
                          song={song} />
                      ))
                    ) : (
                      <>
                        {
                          Array.from({ length: gridCol }, (_, index) => (
                            <PlaylistCard key={index} />
                          ))
                        }
                      </>
                    )
                  }
                </section>
              </div>
            }
            {data?.popular_songs?.length > 0 &&
              <div className=" mx-auto mt-4 border-solid h-1/2 overflow-hidden">
                <div className="ml-5 text-white font-bold text-2xl">
                  Hot
                </div>
                <section className="common-section">
                  {
                    data?.popular_songs && data.popular_songs.length > 0 ? (
                      data.popular_songs.slice(0, calculateNumberCard(data.popular_songs.length, gridCol))?.map((song) => (
                        <PlaylistCard
                          key={song.id}
                          song={song} />
                      ))
                    ) : (
                      <>
                        {
                          Array.from({ length: gridCol }, (_, index) => (
                            <PlaylistCard key={index} />
                          ))
                        }
                      </>
                    )
                  }
                </section>
              </div>
            }
            {
              data?.popular_artists?.length > 0 &&
              <div className=" mx-auto mt-4 border-solid h-1/2 overflow-hidden">
                <div className="ml-5 text-white font-bold text-2xl">
                  Popular Artist
                </div>
                <section id="Projects"
                  className="
                  common-section
                ">
                  {
                    data?.popular_artists && data.popular_artists.length > 0 ? (
                      data.popular_artists.slice(0, calculateNumberCard(data.popular_artists.length, gridCol))?.map((artist) => (
                        <ArtistCard
                          key={artist.id}
                          artist={artist} />
                      ))
                    ) : (
                      <>
                        {
                          Array.from({ length: gridCol }, (_, index) => (
                            <ArtistCard key={index} />
                          ))
                        }
                      </>
                    )
                  }
                </section>
              </div>

            }
          </>
      }
    </div>
  )
}
