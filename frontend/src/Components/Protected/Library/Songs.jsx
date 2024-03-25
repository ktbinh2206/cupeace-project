import { useEffect, useState } from "react"
import axiosClient from "../../../axios"
import { Link } from "react-router-dom"
import { Tooltip } from "@material-tailwind/react"
import { PlayIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { actions, useStore } from "../../../store"

function OutlineHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>

  )
}
function SolidHeart() {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
  )
}

const calculateDuration = (currentDate) => {

  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date + ' ' + time;

  // Parse strings to Date objects
  let time1 = new Date(dateTime);
  let time2 = new Date(currentDate);

  // Calculate the difference in milliseconds
  let timeDifference = Math.abs(time2 - time1);

  // Convert milliseconds to years, months, days, hours, minutes, and seconds
  let millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Account for leap years
  let years = Math.floor(timeDifference / millisecondsInYear);
  let remainingMilliseconds = timeDifference % millisecondsInYear;

  let millisecondsInMonth = millisecondsInYear / 12; // Approximation
  let months = Math.floor(remainingMilliseconds / millisecondsInMonth);
  remainingMilliseconds %= millisecondsInMonth;

  let millisecondsInDay = 1000 * 60 * 60 * 24;
  let days = Math.floor(remainingMilliseconds / millisecondsInDay);
  remainingMilliseconds %= millisecondsInDay;

  let millisecondsInHour = 1000 * 60 * 60;
  let hours = Math.floor(remainingMilliseconds / millisecondsInHour);
  remainingMilliseconds %= millisecondsInHour;

  let millisecondsInMinute = 1000 * 60;
  let minutes = Math.floor(remainingMilliseconds / millisecondsInMinute);
  remainingMilliseconds %= millisecondsInMinute;

  let seconds = Math.floor(remainingMilliseconds / 1000);

  let result = years > 0
    ? <>{years}{years > 1 ? ' years ' : ' year '}ago</>
    : months > 0
      ? <>{months}{months > 1 ? ' months ' : ' month '}ago</>
      : days > 0
        ? <>{days}{days > 1 ? ' days ' : ' day '}ago</>
        : hours > 0
          ? <>{hours}{hours > 1 ? ' hrs ' : ' hour '}ago</>
          : minutes > 0
            ? <>{minutes}{minutes > 1 ? ' mins ' : ' min '}ago</>
            : <>Several secs ago</>
  return result
}

function SongItem({ index = '#', song = null }) {
  const [hover, setHover] = useState(false);
  const [isFollow, setIsFollow] = useState(true)
  const [state, dispatch] = useStore()

  let time = song ? calculateDuration(song?.action_at) : '--'

  function handleFollow() {
    axiosClient
      .post(`/song/follow?songId=${song?.id}`)
      .then(() => {
        setIsFollow(true)
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
    axiosClient
      .post(`/song/unfollow?songId=${song?.id}`)
      .then(data => {
        console.log(data);
        setIsFollow(false)
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

  const handlePlay = () => {
    console.log(song?.name);
    if (song?.id != state?.currentSong?.id || !state.currentSong.id) {
      dispatch(actions.setCurrentSong(song));
    }
  }

  return (
    <div className="h-16 hover:bg-[#fdfdfd41] grid grid-cols-12 rounded-lg pl-3 items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={` ${hover ? 'text-white ' : 'text-[#a09696]'} col-span-1  font-bold  hover:cursor-default`}>
        {hover
          ?
          <Tooltip content="Play Song"
            placement="top"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}>
            <PlayIcon className="w-5 h-5 hover:cursor-pointer" onClick={handlePlay} />
          </Tooltip>
          : index}
      </div>
      <div className="col-span-4">
        <Link to={'/song/' + song?.id} className="text-white font-mono text-xl ">
          {song?.name.length > 30 ? song?.name.slice(0, 30) + '...' : song?.name}
        </Link>
      </div>
      <div className="col-span-3">
        <div className={`  ${hover ? 'text-white ' : 'text-[#7e7575]'} font-bold`}>
          {
            song?.artists.map((artist, index) => {
              return (
                <Link to={'/artist/' + artist.id} key={index} className="hover:underline">{artist.name}{
                  song?.artists.length - 1 === index ? `` : `, `}</Link>
              )
            }
            )
          }
        </div>
      </div>
      <div className="col-span-2 text-[#a09696] hover:cursor-default">
        {time}
      </div>
      <div className="col-span-1 text-white flex align-content-center">
        {
          hover && (
            isFollow
              ? <Tooltip content="Delete from library "
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <p data-tooltip-target="tooltip-songname" onClick={handleUnfollow}><SolidHeart /></p>
              </Tooltip>
              : <Tooltip content="Add to library "
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <p data-tooltip-target="tooltip-songname" onClick={handleFollow} ><OutlineHeart /></p>
              </Tooltip>
          )
        }
      </div>
      <div className="col-span-1 flex flex-row-reverse items-center">
        <div className="text-white pr-4">
          {
            hover &&
            <Tooltip content="Options"
              placement="top"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}>
              <EllipsisHorizontalIcon className="w-7 h-7 hover:cursor-pointer" />
            </Tooltip>
          }
        </div>
      </div>
    </div>
  )
}

export default function Songs() {
  const [songs, setSongs] = useState()

  useEffect(() => {

    const controller = new AbortController()
    const signal = controller.signal

    axiosClient
      .get('/library/songs', { signal })
      .then(({ data }) => setSongs(data))
      .catch(err => console.log(err))

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="w-[80%] m-auto mt-2 flex flex-col justify-around gap-1">

      {songs ?
        songs.length
          ? <>
            <div className="pb-3 grid grid-cols-12 text-[#8184a3] font-bold border-b-[0.2px] ">
              <div className="col-span-1 pl-3">
                #
              </div>
              <div className="col-span-4 pl-3">
                Name
              </div>
              <div className="col-span-3 pl-2">
                Artist
              </div>
              <div className="col-span-2 pl-2">
                Action
              </div>
              <div className="col-span-1">

              </div>
              <div className="col-span-1">

              </div>
            </div>
            {
              songs.map((item, index) => {
                return (
                  <SongItem key={item.id} index={index + 1} song={item} />
                )
              })
            }
          </>
          :
          <div className="grid">
            <h1 className="text-slate-400 font-semibold text-2xl text-center pt-7">
              You haven't follow any song
            </h1>
          </div>
        :
        <>
        </>
      }
    </div>
  )
}
