import { Link } from "react-router-dom"

const ArtistCard = ({ artist }) => {
  return (
    <Link
      to={'/artist/' + artist.id}
      className="hover:bg-slate-700 hover:cursor-pointer object-contain rounded-xl">
      <div className="w-40 h-40 p-1">
        <div className="w-full h-[7.5rem] flex justify-center">
          <img
            className=" object-cover rounded-full w-[7.5rem] h-[7.5rem]"
            src={`${import.meta.env.VITE_GET_IMAGE_URL}/${artist?.avatar}`} />
        </div>
        <div className="ml-2 text-white font-medium">
          {artist.name}
        </div>
      </div>
    </Link>
  )
}

export default function Artist({ artists }) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      {
        artists.length ?
          artists?.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))
          :
          <div className="text-slate-600 font-semibold text-2xl text-center w-full">
            No artist match
          </div>
      }
    </div>
  )
};
