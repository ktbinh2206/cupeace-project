import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

import verified from "../../../assets/verified.svg"
import default_bg from "../../../assets/default-bg.jpg";
import { Tooltip } from "@material-tailwind/react";
import { actions, useStore } from "../../../store";

export default function UserProfile() {
  const { id } = useParams();
  const [song, setSong] = useState();
  const [state, dispatch] = useStore()

  useEffect(() => {
    axiosClient
      .get('/songs/' + id)
      .then(({ data }) => {
        console.log(data);
        setSong(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleFollow() {
    setSong({ ...song, followed: true })
    axiosClient
      .post(`/song/follow?songId=${id}`)
      .then(() => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `FOLLOW SONG SUCCESS`,
          content: `You have just follow song " ${song?.name}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }
  function handleUnfollow() {
    setSong({ ...song, followed: false })
    axiosClient
      .post(`/song/unfollow?songId=${id}`)
      .then(data => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `UNFOLLOW SONG SUCCESS`,
          content: `You have just unfollow song " ${song?.name}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }
  return (
    <div className="fixed p-4 pb-[13.7rem] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden">
      <div className="w-full h-full rounded-lg bg-[#060c1d] overflow-hidden overflow-y-auto">
        <div
          className={`h-56 rounded-t-lg -z-10`}
          style={{ background: `url(${default_bg}) no-repeat`, backgroundSize: "cover", backgroundColor: "#fffff" }}
        >
          <div className="flex items-center">
            <div className=" mx-6 relative mt-20">
              <div className="flex justify-end w-64 h-64">
                <img src={`${import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`} alt="" className="w-64 h-64 rounded-lg border-2 border-slate-200 object-cover" />
                <a className="absolute top-5 right-3" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified" href="/pages/profile#!">
                  <img src={verified} alt="" height="40" width="40" className="" />
                </a>
              </div>
            </div>
            {/* User name and handle */}
            <div className="w-full">
              <div className="ml-3 mt-16">

                <span className="mb-0 font-bold text-white text-6xl stroke-slate-900 text-nowrap">
                  {song?.name}
                </span>
                <p className="mb-0 block b text-white font-medium">{song?.views} views</p>
              </div>
              <div className="ml-3 mt-5">

                <button className=" rounded-lg px-2 py-1">
                  <div className="text-white font-bold">

                    <Tooltip
                      content="Remove song from library"
                      className="bg-black"
                      placement="top"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <CheckCircleIcon
                        onClick={handleUnfollow}
                        className={`text-[#3f5bd8]  transform duration-1000 ${!song?.followed && 'hidden'}`}
                        width={30}
                        height={30} />
                    </Tooltip>

                    <Tooltip
                      content="Add song to library"
                      className="bg-black "
                      placement="top"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <PlusCircleIcon
                        className={` transform duration-1000 ${song?.followed && 'hidden'}`}
                        onClick={handleFollow}
                        width={30}
                        height={30} />
                    </Tooltip>

                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Song */}
          <div className="px-16 pt-7 grid grid-cols-2">
            <div className="text-white font-semibold text-3xl font-mono">
              <div>
                Lyrics
              </div>
              <div
                className="text-slate-300 font-semibold text-xl font-mono p-2"
                dangerouslySetInnerHTML={{ __html: song?.lyrics }}
              >

              </div>
            </div>
            <div className="text-white font-semibold text-3xl font-mono">
              {/* {song?.artists.map((item) => (
                <ArtistCard key={item.id} artist={item} />
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
