import SongItem from "../../Admin/SongItem";
import Artist from "./Artist";
import Song from "./Song";

export default function All({ data }) {
  const artists = data?.artists
  const songs = data?.songs

  return (
    <div className="grid grid-cols-2 pb-36 overflow-auto">
      <div className="pl-20">
        <div className="text-white font-medium  text-2xl">
          Artist
        </div>
        <div>
          <Artist artists={artists} />
        </div>
      </div>
      <div className="pr-10">
        <div className="text-white font-medium text-2xl overflow-auto">
          Song
        </div>
        <div>
          <Song songs={songs} />
        </div>
      </div>
    </div>
  )
};
