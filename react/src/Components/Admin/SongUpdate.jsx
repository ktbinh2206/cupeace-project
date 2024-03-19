
import { useState } from "react";
import SongItem from "./SongItem";
import { Option, Select } from "@material-tailwind/react";
import axiosClient from "../../axios";

const status = [
  {
    id: 1,
    label: 'Public',
    icon:
      <div className='text-green-600 font-bold'>
        Public
      </div>,
    className: 'text-green-600 font-bold',
  },
  {
    id: 2,
    label: 'Private',
    icon:
      <div className='text-blue-600 font-bold'>
        Private
      </div>,
    className: 'text-blue-600 font-bold',
  },
  {
    id: 3,
    label: 'Pending',
    icon:
      <div className='text-yellow-600 font-bold'>
        Pending
      </div>,
    className: 'text-yellow-600 font-bold',
  },
  {
    id: 4,
    label: 'Banned',
    icon:
      <div className='text-red-600 font-bold'>
        Banned
      </div>,
    className: 'text-red-600 font-bold',
  },
]

export default function SongUpdate({ isOpenUpdateSongModal, songs, isScrolling = null, setIsOpenUpdateSongModal, setTriggerRerender }) {
  const [statusUpdate, setStatusUpdate] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    axiosClient
      .post('/songs/status', { 'songs': songs, 'status-id': statusUpdate })
      .then(data => {
        console.log(data.data);
        setTriggerRerender(prev => !prev)
      })
      .catch(err => {
        console.log(err);
      })

  }

  return (
    <div className={`absolute min-h-60 max-h-[80vh] min-w-96 max-w-[40rem] rounded-md bg-gradient-to-b from-slate-800 to-[#1a1452]  border border-slate-600 top-[10vh] right-0 left-0 mx-auto z-50 ${isOpenUpdateSongModal || 'hidden'}`}>
      <form onSubmit={handleSubmit} action="" method="post">
        <table className="block max-h-96 min-h-96 overflow-auto text-[#cbd5e1] table-auto w-full pt-0" style={{ tableLayout: 'fixed' }}>
          <thead className="w-full border-slate-700 text-slate-400 uppercase font-[600] text-sm border-y" style={{ width: '100%' }}>
            <tr className="bg-[#1a2633] sticky top-0 z-50">
              <th className="">
              </th>
              <th className="py-3 px-2 whitespace-nowrap ">
                <div className="font-[600] text-left w-4/12">
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
          <tbody className="w-full">
            {songs &&
              songs?.map((song) => (
                <SongItem
                  key={song?.id}
                  song={song}
                  isScrolling={isScrolling} />
              ))
            }
          </tbody>
        </table>

        <div className="flex justify-between gap-2 p-3">
          <div>
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-white">Select Status</label>
            <select
              id="countries"
              className="border rounded-lg block w-full p-1 bg-gray-700 border-gray-600 "
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
            >
              {status.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className={item.className}
                >
                  {item.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="font-bold text-slate-400 hover:text-slate-500 active:scale-95"
              onClick={() => { setIsOpenUpdateSongModal(false) }}
            >Close</button>
            <button type="submit" className="bg-[#5449DE] hover:bg-[#413bbb] active:bg-[#36309b] p-3 rounded-lg">
              Save
            </button>
          </div>
        </div>
      </form>
    </div >
  )
};
