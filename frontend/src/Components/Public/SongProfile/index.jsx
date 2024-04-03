import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../axios";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import ArtistCard from "./ArtistCard";
import { Tooltip } from "@material-tailwind/react";
import { actions, useStore } from "../../../store";
import { getAverageColor, getTextColor } from "../../../getColor"; // Import the getAverageColor function
import { Link } from "react-router-dom";

function formatViews(view) {
  if (view) {
    return view.toString().replace(/\B(?=((\d{3})*(\d{3}))+(?!\d))/g, '.');
  }
  return 0;
}

function formatDuration(time) {
  if (time) {
    const [hh, mm, ss] = time.split(':');
    return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
  }
}

function OutlineHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-8 aspect-square hover:scale-105 hover:cursor-pointer active:scale-100">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>

  )
}
function SolidHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4741B5" className="w-8 aspect-square hover:scale-105 hover:cursor-pointer active:scale-100">
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
  )
}

export default function SongProfile() {
  const [state, dispatch] = useStore()

  const { id } = useParams();
  const [song, setSong] = useState();
  const [backgroundColor, setBackgroundColor] = useState(''); // State for background   const [state, dispatch] = useStore();
  const [textColor, setTextColor] = useState('')

  const imageRef = useRef(null); // Ref for the image element

  useEffect(() => {
    axiosClient
      .get('/songs/' + id)
      .then(({ data }) => {
        let title = `${data.name} • `
        data.artists.map((artist, index) => {
          title = title.concat(`${artist.name}` + `${data.artists.length - 1 === index ? `` : `, `}`)
        }
        )
        document.title = title
        setSong(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const { R, G, B } = getAverageColor(imageRef.current, 4)
        setTextColor(getTextColor({ R, G, B }))
        setBackgroundColor(`rgb(${R}, ${G}, ${B})`);
      }
    }
  }, [imageRef?.current?.src]); // Run this effect whenever song changes

  function handleFollow() {
    setSong({ ...song, is_followed: true });
    axiosClient
      .post(`/song/follow?songId=${id}`)
      .then(() => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `FOLLOW SONG SUCCESS`,
          content: `You have just follow song "${song?.name}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }

  function handleUnfollow() {
    setSong({ ...song, is_followed: false });
    axiosClient
      .post(`/song/unfollow?songId=${id}`)
      .then(data => {
        dispatch(actions.setNotificationPopup([{
          type: 'success',
          emphasize: `UNFOLLOW SONG SUCCESS`,
          content: `You have just unfollow song "${song?.name}"`
        }]))
      })
      .catch(err => {
        console.log(err);
      })
  }


  function FollowButton({ song }) {
    return (
      <div>{
        song?.id ?
          <>
            <div
              className={`${song?.is_followed ? '' : 'hidden scale-0'} active:scale-75`}
              onClick={handleUnfollow}
            >
              <SolidHeart />
            </div>
            <div
              className={`${!song?.is_followed ? '' : 'hidden scale-0'} active:scale-75`}
              onClick={handleFollow}
            >
              <OutlineHeart />
            </div>
          </>
          :
          <></>
      }
      </div>
    )
  }

  let currentController;
  const handleClick = () => {
    if (!state.currentUserID) {
      navigate('/login');
      dispatch(actions.setNotificationPopup([
        {
          type: 'warning',
          emphasize: 'LOGIN REQUIRED',
          content: 'You need to login first'
        }
      ]));
    } else {

      if (currentController) {
        // If there's a previous request, abort it
        currentController.abort();
      }
      currentController = new AbortController();
      const signal = currentController.signal;
      if (state.currentSong?.id != song.id) {

        axiosClient
          .get('/song/get-playlists?songId=' + song.id, { signal })
          .then(({ data }) => {
            dispatch(actions.setCurrentPlaylist(data.playlist));
            dispatch(actions.setCurrentSong(data.playlist[0]));
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              console.error(err);
              // Handle other errors (not abort errors) if needed
            }
          });
      }
    }
  };


  return (
    <div className="fixed p-4 pb-[11rem] min-h-[815px] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden" >
      <div className="w-full h-full rounded-lg bg-[#060c1d] overflow-hidden overflow-y-auto">
        <div
          className={`h-full rounded-t-lg -z-10`}
          style={{ backgroundSize: "cover", background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0,0,0,0.1) 100%)` }}
        >
          <div className="flex items-center h-2/3 p-7 gap-10">
            <div className=" h-full flex items-end">
              <div className="flex items-end w-64 h-full">
                <img
                  ref={imageRef}
                  src={`${song?.image && import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`}
                  alt=""
                  className="w-64 h-64 rounded-lg shadow-2xl shadow-slate-950 object-cover"
                  crossOrigin="true"
                />
                {/* <a className="absolute top-5 right-3" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified" href="/pages/profile#!">
                  <img src={verified} alt="" height="40" width="40" className="" />
                </a> */}
              </div>
            </div>
            {/* Song name */}
            <div className={`w-full h-full flex flex-col justify-end text-${textColor}`}>
              <span className="font-bold ">
                Song
              </span>
              <span className=" max-w-full py-4 font-bold text-6xl stroke-slate-900 text-nowrap truncate">
                {song?.name}
              </span>
              <div className=" font-medium flex gap-2">
                <img className="w-6 aspect-square rounded-full inline-block" src={`${song?.image && import.meta.env.VITE_GET_IMAGE_URL}/${song?.artists[0]?.avatar}`} />
                <Link
                  className="hover:cursor-pointer hover:underline"
                  to={'/artist/' + song?.artists[0].id}>{song?.artists[0]?.name}
                </Link> • {formatDuration(song?.duration)} • {formatViews(song?.views)}
              </div>
            </div>
          </div>

          {/* Song */}

          <div className="px-16 pt-7 min-h-60"
            style={{ backgroundSize: "cover", background: `linear-gradient(180deg, rgba(0,0,0,0.3533788515406162) 0%, rgba(0,0,0,0.6474964985994398) 11%, rgba(0,0,0,1) 78%)` }}
          >
            {/**Function Button */}
            <div className="flex items-center gap-5">
              <Tooltip content="Play Song"
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <PlayCircleIcon
                  onClick={handleClick}
                  className={`
                    h-20 w-20 text-[#4741B5] hover:text-[#534dc7] hover:cursor-pointer  hover:scale-105 active:text-[#2c2a5c] transform duration-300 `}
                />
              </Tooltip>
              <FollowButton
                song={song}
              />
            </div>
            <div className=" grid lg:grid-cols-2 "
            >
              <div className="text-white font-semibold text-3xl pb-4">
                <div>
                  Lyrics
                </div>
                <div
                  className="text-slate-300 font-semibold text-base p-2"
                  dangerouslySetInnerHTML={{ __html: song?.lyrics }}
                >

                </div>
              </div>
              <div className="text-white font-semibold text-3xl">
                {song?.artists.map((item) => (
                  <ArtistCard key={item.id} artist={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
