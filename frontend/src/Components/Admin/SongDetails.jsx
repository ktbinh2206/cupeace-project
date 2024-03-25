import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios";
import { Link } from "react-router-dom";

const status = [
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
        Public
      </div>,
  },
]

export default function SongDetails({ openSongDetails, setOpenSongDetails, song = null }) {

  const localDate = new Date(song?.created_at || 123);
  const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const localDateString = formatter.format(localDate);

  return (
    <div className={`absolute min-h-60 max-h-[80vh] overflow-auto min-w-96 max-w-[40rem] rounded-md bg-gradient-to-b from-slate-800 to-[#0a0d36]  border border-slate-600 top-[10vh] right-0 left-0 mx-auto z-50 ${openSongDetails || 'hidden'}`}>
      <header className=" text-slate-300">
        <h1 className="font-semibold text-center py-2 text-2xl border-b border-slate-600">
          Song Details
        </h1>
        {/* Image */}
        <div className="w-full p-3 flex gap-3">
          <div className="">
            <img className=" object-cover rounded-md w-40 h-40" src={`${import.meta.env.VITE_API_BASE_URL}/get-image/${song?.image}`} />
          </div>
          <div className="flex flex-col justify-end">
            <div className="font-bold text-sm">
              Song
            </div>
            <div className="block font-extrabold pb-2 text-3xl" >
              {song?.name}
            </div>
            <div className="flex">
              {
                song?.artists.map((artist, index) => {
                  return (
                    <Link to={''} key={index} className="flex gap-2">
                      <div className=" object-cover rounded-md h-5">
                        <img
                          className=" object-cover rounded-full h-5"
                          src={`${import.meta.env.VITE_API_BASE_URL}/get-image/${artist.avatar}`} />
                      </div>
                      <div className="hover:underline font-extrabold text-sm">
                        {artist?.name}{
                          song?.artists.length - 1 === index ? `` : `, `}
                      </div>
                    </Link>
                  )
                }
                )
              }
            </div>
            <div className="font-semibold text-sm">
              {localDateString}
            </div>
            <div className="text-sm flex gap-3">
              <span>{song?.duration}</span>
              <span><span className="font-medium">{song?.views}</span> streaming</span>
            </div>
          </div>
        </div>
        <table className="px-3">
          <tbody>
            <tr className="">
              <td className="font-bold">Status</td>
              <td className="flex gap-2"><span className="font-bold">:</span>{status.filter((status) => status?.id == song?.song_status_id)[0]?.icon}</td>
            </tr>
            <tr className="">
              <td className="font-bold">Release</td>
              <td className="flex gap-2"><span className="font-bold">:</span>{Date(song?.created_at)}</td>
            </tr>
            <tr className="">
              <td className="font-bold">Last Update</td>
              <td className="flex gap-2"><span className="font-bold">:</span>{Date(song?.updated_at)}</td>
            </tr>
            <tr className="">
              <td className="font-bold">Upload by</td>
              <td className="flex gap-2">
                <span className="font-bold">:</span>
                <span className="font-semibold hover:underline hover:cursor-pointer">
                  {song?.upload_by?.name}
                </span>
              </td>
            </tr>
            <tr className="">
              <td className="font-bold">Description</td>
              <td className="flex gap-2"><span className="font-bold">:</span>{song?.desription}</td>
            </tr>
            <tr className="">
              <td className="font-bold" style={{ verticalAlign: 'top' }} >
                Lyrics
              </td>
              <td className="flex gap-2"><span className="font-bold">:</span>
                <div dangerouslySetInnerHTML={{ __html: song?.lyrics }}>
                </div>
              </td>
            </tr>
          </tbody>
        </table>


        <div className="flex justify-end gap-2 p-3">
          <button
            className="font-bold text-slate-400 hover:text-slate-500 active:scale-95"
            onClick={() => { setOpenSongDetails(false) }}
          >Close</button>
        </div>
      </header>
    </div>
  )
};
