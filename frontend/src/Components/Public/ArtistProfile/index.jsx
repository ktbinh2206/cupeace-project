import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../axios";
import SongFieldData from "./SongFieldData"

import verified from "../../../assets/verified.svg"
import default_bg from "../../../assets/default-bg.jpg";

// Formatting function for displaying view count with a '.' as a thousand separator.
// This function uses Regular Expression (RegEx) to replace every 3rd digit from the right
// (except for the last group of 3 digits) with a '.' character to make the number easier to read.
//
// Example:
//   formatViews(1000000)  // returns '1.000.000'
//   formatViews(1500)   // returns '1.500'
//   formatViews(5000)   // returns '5.000'
//
function formatViews(view) {
  if (view) {
    return view.toString().replace(/\B(?=((\d{3})*(\d{3}))+(?!\d))/g, '.');
  }
  return 0;

}
export default function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState();

  useEffect(() => {
    axiosClient
      .get('/artist/profile?id=' + id)
      .then(({ data }) => {
        console.log(data);
        setArtist(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="fixed p-4 pb-[13.7rem] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden">
      <div className="w-full h-full rounded-lg bg-[#050916] overflow-hidden overflow-y-auto">
        <div
          className={`h-56 rounded-t-lg -z-10`}
          style={{ background: `url(${default_bg}) no-repeat`, backgroundSize: "cover", backgroundColor: "#fffff" }}
        >
          <div className="flex items-center">
            <div className=" mx-6 relative mt-20">
              <div className="flex justify-end w-64 h-64">
                <img src={`${import.meta.env.VITE_GET_IMAGE_URL}/${artist?.avatar}`} alt="" className="w-64 h-64 rounded-full border-4 border-slate-200 object-cover" />
                <a className="absolute top-5 right-3" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified" href="/pages/profile#!">
                  <img src={verified} alt="" height="40" width="40" className="" />
                </a>
              </div>
            </div>
            {/* User name and handle */}
            <div className="w-full">
              <div className="ml-3 mt-16">

                <span className="mb-0 font-bold text-white text-6xl stroke-slate-900">
                  {artist?.name}
                </span>
                <p className="mb-0 block b text-white font-medium">{formatViews(artist?.views)} views • {formatViews(artist?.followers)} followers</p>
              </div>
              <div className="ml-3 mt-7">
                <button className="border border-slate-400 rounded-lg px-2 py-1">
                  <div className="text-white font-bold">
                    Follow
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Song */}
          <div className="px-16 pt-7">
            <div className="text-white font-semibold text-3xl font-mono">
              Songs
            </div>
            <div>
              <SongFieldData songs={artist?.songs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
