import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../axios";
import SongFieldData from "./SongFieldData"

import verified from "../../../assets/verified.svg"
import { getAverageColor, getTextColor } from "../../../getColor";

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
function formatDuration(time) {
  const [hh, mm, ss] = time.split(':');
  return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
}

export default function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState();

  const [backgroundColor, setBackgroundColor] = useState(''); // State for background   const [state, dispatch] = useStore();
  const [textColor, setTextColor] = useState('')
  const imageRef = useRef(null);


  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const { R, G, B } = getAverageColor(imageRef.current, 4)
        setTextColor(getTextColor({ R, G, B }))
        setBackgroundColor(`rgb(${R}, ${G}, ${B})`);
      }
    }
  }, [imageRef?.current?.src]);

  useEffect(() => {
    axiosClient
      .get('/artist/profile?id=' + id)
      .then(({ data }) => {
        document.title = `${data.name}'s Profile | Cupeace`;
        setArtist(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(backgroundColor);

  return (
    <div className="fixed p-4 pb-[11rem] min-h-[815px] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden" >
      <div className="w-full h-full rounded-lg bg-[#060c1d] overflow-hidden overflow-y-auto">
        <div
          className={`h-full rounded-t-lg -z-10`}
          style={{ backgroundSize: "cover", background: `linear-gradient(180deg, ${backgroundColor} 0%, rgba(0,0,0,0.1) 100%)` }}
        >
          <div className="flex items-center h-2/3 p-7 gap-10">
            <div className=" h-full flex items-end">
              <div className="flex items-end w-64 h-full">
                <img
                  ref={imageRef}
                  src={`${artist?.avatar && import.meta.env.VITE_GET_IMAGE_URL}/${artist?.avatar}`}
                  alt=""
                  className="w-64 h-64 rounded-full shadow-2xl shadow-slate-950 object-cover"
                  crossOrigin="true"
                />
                {/* <a className="absolute top-5 right-3" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified" href="/pages/profile#!">
                  <img src={verified} alt="" height="40" width="40" className="" />
                </a> */}
              </div>
            </div>
            {/* User name and handle */}

            <div className={`w-full h-full flex flex-col justify-end text-${textColor}`}>
              <span className="font-bold ">
                Artist
              </span>
              <span className=" max-w-full py-4 font-bold text-6xl stroke-slate-900 text-nowrap truncate">
                {artist?.name}
              </span>
              <div className="font-medium flex gap-2">
                {formatViews(artist?.views)} streaming
              </div>
            </div>
          </div>
          {/* Song */}
          <div className="px-16 pt-7 min-h-60"
            style={{ backgroundSize: "cover", background: `linear-gradient(180deg, rgba(0,0,0,0.3533788515406162) 0%, rgba(0,0,0,0.6474964985994398) 11%, rgba(0,0,0,1) 78%)` }}
          >
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
