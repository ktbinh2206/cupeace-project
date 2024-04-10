import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../CommonAction/axios";

import { actions, useStore } from "../../../store";
import { getAverageColor } from "../../../CommonAction/getColor";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [state, dispatch] = useStore()
  const [backgroundColor, setBackgroundColor] = useState('');
  const imageRef = useRef(null); // Ref for the image element

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        const { R, G, B } = getAverageColor(imageRef.current, 4)
        setBackgroundColor(`rgb(${R}, ${G}, ${B})`);
      }
    }
  }, [imageRef?.current?.src]); // Run this effect whenever song changes


  useEffect(() => {
    axiosClient
      .get('/user/profile?id=' + id)
      .then(({ data }) => {
        console.log(data);
        setUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="fixed p-4 pb-[11rem] min-h-[815px] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden" >
      <div className="w-full h-full rounded-lg bg-[#060c1d] overflow-hidden overflow-y-auto">
        <div
          className={`h-full rounded-t-lg -z-10`}
          style={{ backgroundSize: "cover", background: `linear-gradient(180deg, ${backgroundColor} 0%, ${backgroundColor} 90%, rgba(0,0,0,0.5) 100%)` }}
        >
          <div className="flex items-center h-2/3 p-7 gap-10">
            <div className=" h-full flex items-end">
              <div className="flex items-end w-64 h-full">
                <img
                  ref={imageRef}
                  src={`${import.meta.env.VITE_GET_IMAGE_URL}/${user?.avatar}`}
                  alt=""
                  className="w-64 aspect-square rounded-full shadow-2xl shadow-slate-950 object-cover"
                  crossOrigin="true"
                />
              </div>
            </div>
            {/* User name and handle */}
            <div className="w-full h-full justify-end flex flex-col text-shadow-lg drop-shadow-xl ">
              <div className="font-bold text-white ">
                Profile
              </div>
              <div className="">
                <span className="mb-0 font-bold text-white text-6xl stroke-slate-900 text-nowrap">
                  {user?.name}
                </span>
                <span className="mb-0 block b text-white font-medium">
                  {user?.playlists?.length || 0} public playlists • {user?.followings?.length || 0} following</span>
              </div>
            </div>
          </div>
          <div className="px-16 pt-7 min-h-60"
            style={{ backgroundSize: "cover", background: `linear-gradient(180deg, rgba(0,0,0,0.3533788515406162) 0%, rgba(0,0,0,0.6474964985994398) 30%, rgba(0,0,0,1) 78%)` }}
          >
            <div>
              <button className="px-3 py-1 rounded-2xl border border-slate-300 font-bold text-white hover:scale-105 hover:border-white">
                Follow
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
