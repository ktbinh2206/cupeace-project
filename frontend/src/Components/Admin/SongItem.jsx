import { Link } from "react-router-dom";
import { OptionItem, calculateDuration, status } from "./Song";


const SongItem = ({ song = null, selected = null, setSelected = null, isScrolling = null, isOpenUpdateSongModal }) => {


  const handleSelect = (e) => {
    let updatedSelected;
    e.target.checked
      ? updatedSelected = [...selected, song]
      : updatedSelected = selected.filter((selected) => selected.id !== song?.id)
    setSelected(updatedSelected);
  };

  let timeCreated = calculateDuration(song?.created_at)
  let timeUpdated = calculateDuration(song?.updated_at)


  return (
    <tr key={song?.id} className="border-t-[0.5px] border-slate-700 ">
      <td className=" ccr3m cwqwq whitespace-nowrap px-2 py-3">
        <div className="flex items-center">
          <label className="inline-flex">
            <span></span>
            <input
              onChange={e => handleSelect(e)}
              checked={selected?.some((selected) => selected.id === song?.id)}
              className="table-item h-4 w-4  hover:cursor-pointer border-[#334155] bg-[#0f172a4d] border border-r-[0.25rem] text-[#6366f1]"
              type="checkbox" />
          </label>
        </div>
      </td>
      <td className="px-2 py-3">
        <div className="flex items-center">
          <div className="mr-2 flex-shrink-0 sm:mr-3 w-14 h-14">
            <img className=" object-cover rounded-full w-14 h-14" src={`${import.meta.env.VITE_API_BASE_URL}/get-image/${song?.image}`} />
          </div>
          <div className="text-slate-100 font-[500] hover:underline hover:cursor-pointer">
            {song?.name}
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left"> {
          song?.artists.map((artist, index) => {
            return (
              <Link to={''} key={index} className="hover:underline">{artist.name}{
                song?.artists.length - 1 === index ? `` : `, `}</Link>
            )
          }
          )
        }
        </div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{timeCreated}</div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{timeUpdated}</div>
      </td>
      <td className="whitespace-nowrap ml-2 px-2 py-3">
        <div className="text-left">{status.filter((status) => status.id == song?.song_status_id)[0]?.icon}</div>
      </td>
      <td>
        <OptionItem isScrolling={isScrolling} song={song} />
      </td>
    </tr>
  )
}

export default SongItem
