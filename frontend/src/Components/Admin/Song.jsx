import { PlusIcon } from '@heroicons/react/24/solid'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import axiosClient from '../../CommonAction/axios'
import { Tooltip } from "@material-tailwind/react"
import { ArrowPathIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { Link } from 'react-router-dom'
import SongDetails from './SongDetails'
import SongUpdate from './SongUpdate'
import SongItem from './SongItem'

export const status = [
  {
    id: 1,
    label: 'Public',
    icon:
      <div className='text-green-600 font-bold'>
        Public
      </div>,
  },
  {
    id: 2,
    label: 'Private',
    icon:
      <div className='text-blue-600 font-bold'>
        Private
      </div>,
  },
  {
    id: 3,
    label: 'Pending',
    icon:
      <div className='text-yellow-600 font-bold'>
        Pending
      </div>,
  },
  {
    id: 4,
    label: 'Banned',
    icon:
      <div className='text-red-600 font-bold'>
        Banned
      </div>,
  },
]

export const calculateDuration = (currentDate) => {

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
  let millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // User for leap years
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
          ? <>{hours}{hours > 1 ? ' hrs ' : ' hr '}ago</>
          : minutes > 0
            ? <>{minutes}{minutes > 1 ? ' mins ' : ' min '}ago</>
            : <>Several secs ago</>

  return result
}

export const OptionItem = ({ isScrolling, song }) => {


  const options = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openSongDetailsModal, setopenSongDetailsModal] = useState(false)

  useOutsideAlerter(options);;
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", () => {
      })
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useEffect(() => {
    setIsOpen(false)
  }, [isScrolling])

  return (<>
    <div
      ref={options}
      className='relative'>
      <Tooltip
        content="Options"
        placement="top"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
      >
        <EllipsisHorizontalIcon
          className="w-7 h-7 hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} />
      </Tooltip>

      <div
        ref={options}
        className={`${isOpen ? 'scale-100 ' : 'scale-0 hidden'} z-[1000] transform absolute duration-200 w-40 top-0 right-0 bottom-auto left-auto translate-y-5 -translate-x-2 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5`}>
        <ul className='flex flex-col gap-1  rounded-lg font-medium'>
          <li className='hover:bg-slate-600 p-2 rounded-t-lg'
            onClick={() => {
              setopenSongDetailsModal(true)
              setIsOpen(!isOpen)
            }}>Details</li>

        </ul>
      </div>
    </div>
    {/* Modal Add User */}
    <div
      className={`absolute h-screen w-screen bg-[#ffffff0e] top-0 right-0 z-40  ${openSongDetailsModal || 'hidden'}`}
      onClick={() => {
        setopenSongDetailsModal(false)
      }}
    ></div>
    <SongDetails openSongDetails={openSongDetailsModal} song={song} setOpenSongDetails={setopenSongDetailsModal} />
  </>
  )
}

const StatusItems = ({ setStatusId, statusId, setLoading, handleChange, triggerRerender }) => {

  const [statuses, setStatuses] = useState()

  useEffect(() => {

    const controller = new AbortController()
    const signal = controller.signal
    axiosClient
      .get('/songs/statuses', { signal })
      .then(({ data }) => {
        setStatuses(data)
      })
      .catch((err) => {
      })

    return () => {
      controller.abort()
    }
  }, [triggerRerender])

  useEffect(() => {
    const controller = new AbortController()
    handleChange(statusId, controller)
    return () => {
      setLoading(false)
      controller.abort()
    }
  }, [statusId])

  const statusButton = (status) => {
    switch (status.id) {
      case 1:
        return (
          <button
            onClick={() => setStatusId(1)}
            className='bg-green-700 hover:bg-green-800 font-bold text-white border border-slate-500 rounded-md p-1'>
            {status.name}
            <span className='text-sm pl-1 font-thin'>
              {status.total}
            </span>
          </button>
        )
      case 2:

        return (
          <button
            onClick={() => setStatusId(2)}
            className='bg-blue-700 hover:bg-blue-800 font-bold text-white border border-slate-500 rounded-md p-1'>
            {status.name}
            <span className='text-sm pl-1 font-thin'>
              {status.total}
            </span>
          </button>
        )
      case 3:

        return (
          <button
            onClick={() => setStatusId(3)}
            className='bg-yellow-700 hover:bg-yellow-800 font-bold text-white border border-slate-500 rounded-md p-1'>
            {status.name}
            <span className='text-sm pl-1 font-thin'>
              {status.total}
            </span>
          </button>
        )
      case 4:

        return (
          <button
            onClick={() => setStatusId(4)}
            className='bg-red-700 hover:bg-red-800 font-bold text-white border border-slate-500 rounded-md p-1'>
            {status.name}
            <span className='text-sm pl-1 font-thin'>
              {status.total}
            </span>
          </button>
        )

      default:
        break;
    }
  }

  return (
    <>
      {
        statuses?.map((status) => (
          <div key={status.id} className={`${statusId == status.id && 'scale-110 transform duration-100'}`}>
            {statusButton(status)}
          </div>
        ))
      }
    </>
  )
}

export default function Song() {

  const [songs, setSongs] = useState()
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [urlTail, setUrlTail] = useState('order=desc&field=id&per_page=10')
  const [totalSong, setTotalSong] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isOpenUpdateSongModal, setIsOpenUpdateSongModal] = useState(false)
  const [triggerRerender, setTriggerRerender] = useState(false);


  const [statusId, setStatusId] = useState(0)

  const handleSelectAll = (e) => {
    !e.target.checked
      ? setSelected([])
      : setSelected(songs)
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    setLoading(true)
    axiosClient
      .get('/songs?' + urlTail, { signal })
      .then(({ data }) => {
        console.log(data);
        setLoading(false)
        setPage(data)
        setTotalSong(data.total)
        setSongs(data.data);
        setLoading(false)
      })
      .catch((err) => {
      })

    return () => {
      controller.abort()
    }
  }, [triggerRerender])

  const handleScroll = (e) => {
    setIsScrolling(prevState => !prevState)
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && page.next_page_url) {
      setLoadingMore(true)
      axiosClient
        .get(page.next_page_url + '&' + urlTail + `${statusId != 0 && `&status_id= ${statusId}`}`)
        .then(({ data }) => {
          console.log(data);
          setPage(data)
          setSongs([...songs, ...data.data])

        })
        .catch((err) => {
        })
        .finally(() => {
          setLoadingMore(false)
          setLoading(false);
        }
        )
    }
    return () => {
      setIsScrolling(true)
    }
  }


  const handleChange = (id, controller) => {
    setLoading(true)
    setSongs()
    setSelected([])
    const signal = controller.signal
    axiosClient
      .get('/songs?' + urlTail + "&status_id=" + id, { signal })
      .then(({ data }) => {
        setPage(data)
        setSongs(data.data);
      })
      .catch((err) => {
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div
        className={`absolute h-screen w-screen bg-[#ffffff0e] top-0 right-0 z-40  ${isOpenUpdateSongModal || 'hidden'}`}
        onClick={() => {
          setIsOpenUpdateSongModal(false)
        }}
      ></div>
      <main
        className="flex-grow  h-full max-h-screen min-h-28 pb-16 overflow-y-scroll"
        onScroll={handleScroll}>
        <div className="px-6 py-8 pb-52 lg:px-8 lg:py-8 max-w-[96rem] mx-auto w-full">
          {/* Page Header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left */}
            <div className="sm:mb-0 mb-4">
              <h1 className="text-slate-100 font-bold sm:text-2xl text-xl">Songs</h1>
            </div>
            {/* Right */}
            <div className="sm:justify-end sm:auto-cols-max gap-2 justify-start grid-flow-col grid">
              <Link
                to={'/upload-song'}
                className="hover:bg-[#3c3e92] active:scale-95 rounded-md pl-1 pr-2 py-1 inline-flex items-center content-center border border-transparent font-[500] text-xs bg-[#6366f1] text-white">
                <PlusIcon className="w-6 h-6" />
                <span
                  className="hidden sm:block ml-2 text-nowrap text-[1.1rem]"
                >
                  {'Song'}
                </span>
              </Link>
            </div>
          </div>
          {/* Table */}
          <div className="bg-slate-800 rounded-sm border border-slate-700">
            <header className="py-4 px-5">
              <div>
                <Link
                  onClick={() => {
                    const controller = new AbortController()
                    handleChange('', controller)
                  }
                  }
                  className="text-slate-100 font-[600] hover:text-slate-500 ">
                  {"All Songs "}
                  <span className="font-[500] text-opacity-100 text-[#64748b]">{totalSong}</span>
                </Link>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2 mt-2'>
                    <StatusItems
                      triggerRerender={triggerRerender}
                      setPage={setPage}
                      setSongs={setSongs}
                      urlTail={urlTail}
                      setLoading={setLoading}
                      handleChange={handleChange}
                      setSelected={setSelected}
                      statusId={statusId}
                      setStatusId={setStatusId}
                    />
                  </div>
                  <div
                    className={`border-slate-500 border p-2 text-white font-semibold bg-[#5449DE] rounded-lg hover:cursor-pointer ${selected?.length ? '' : 'hidden'}`}
                    onClick={() => {
                      setIsOpenUpdateSongModal(true)
                    }}
                  >
                    Update Selected Song
                  </div>
                  <SongUpdate
                    isOpenUpdateSongModal={isOpenUpdateSongModal}
                    songs={selected}
                    isScrolling={isScrolling}
                    setIsOpenUpdateSongModal={setIsOpenUpdateSongModal}
                    setTriggerRerender={setTriggerRerender} />
                </div>
              </div>
            </header>
            <div className="overflow-auto  min-h-28 ">
              <table className="text-[#cbd5e1] overflow-auto table-auto w-full pb-28">
                <thead className="border-slate-700 text-slate-400 uppercase font-[600] text-sm border-y">
                  <tr className="bg-[#1a2633]">
                    <th className="">
                      <label>
                        <span></span>
                        {/* Check total row in table,
                        If has no selected row or change status -> unchecked */}
                        <input
                          id="parent-checkbox"
                          checked={selected ? selected.length : false}
                          onChange={(e) => handleSelectAll(e)}
                          className="h-4 w-4 border-[#334155] bg-[#0f172a4d] border border-r-[0.25rem] text-[#6366f1] hover:cursor-pointer"
                          type="checkbox" />
                      </label>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left ">
                        Song
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Artist
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Created
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Updated
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="font-[600] text-left">
                        Status
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={` ${loading ? '' : 'hidden'} `}>
                    <td className='w-full' colSpan={7}>
                      <ArrowPathIcon className={`w-7 h-7 my-2 mx-auto animate-spin ${loading ? '' : 'hidden'} `} />
                    </td>
                  </tr>
                  {songs &&
                    songs?.map((song) => (
                      <SongItem
                        key={song?.id}
                        song={song}
                        selected={selected}
                        setSelected={setSelected}
                        isScrolling={isScrolling} />
                    ))
                  }

                  <tr className={` ${loadingMore ? '' : 'hidden'} `}>
                    <td className=' w-full' colSpan={7}>
                      <ArrowPathIcon className={`w-7 h-7 my-2 mx-auto animate-spin ${loadingMore ? '' : ''} `} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
};
