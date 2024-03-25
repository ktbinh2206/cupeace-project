import SongItem from "../../Admin/SongItem";
import Artist from "./Artist";
import Song from "./Song";

export default function All({ data }) {
  const artists = data?.artists
  const songs = data?.songs
  return (
    <div className="grid grid-cols-2 pb-36 overflow-auto mt-4">
      <div className="ml-16 mr-5 p-2 pl-4 bg-[#050916] rounded-md">
        <div className="text-white font-medium  text-2xl">
          Artist
        </div>
        <div>
          {
            !artists?.length  ?
              <div className="text-slate-600 font-semibold text-xl">No artist match</div>
              :
              <Artist artists={artists} />
          }
        </div>
      </div>
      <div className="mr-10 pl-4 p-2 bg-[#050916] rounded-md">
        <div className="text-white font-medium text-2xl overflow-auto">
          Song
        </div>
        <div>{
          !songs?.length  ?
            <div className="text-slate-600 font-semibold text-xl">
              No song match
            </div>
            :
            <Song songs={songs} />
        }
        </div>
      </div>
    </div>
  )
};
