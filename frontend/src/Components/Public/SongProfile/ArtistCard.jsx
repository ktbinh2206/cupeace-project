import { Link } from "react-router-dom";

export default function ArtistCard({ artist }) {
    return (
        <Link
            to={'/artist/' + artist.id}
            className=" hover:cursor-pointer object-contain ">
            <div className="p-1 flex gap-2 hover:bg-slate-800 rounded-lg">
                <div className="">
                    <img
                        className=" object-cover rounded-full w-[4rem] h-[4rem]"
                        src={`${import.meta.env.VITE_GET_IMAGE_URL}/${artist?.avatar}`} />
                </div>
                <div className=" flex-grow ml-2 text-white ">
                    <div className="text-lg">
                        Artist
                    </div>
                    <div className="text-xl">
                        {artist.name}
                    </div>
                </div>
            </div>
        </Link>
    )
};
