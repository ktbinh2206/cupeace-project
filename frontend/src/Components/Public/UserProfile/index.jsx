import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../../../axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

import verified from "../../../assets/verified.svg"
import default_bg from "../../../assets/default-bg.jpg";
import { Tooltip } from "@material-tailwind/react";
import { actions, useStore } from "../../../store";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [state, dispatch] = useStore()

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
    <div className="fixed p-4 pb-[13.7rem] w-[100vw] max-w-screen h-screen max-h-screen overflow-hidden">
      <div className="w-full h-full rounded-lg bg-[#060c1d] overflow-hidden overflow-y-auto">
        <div
          className={` rounded-t-lg -z-10`}
          style={{ background: `url(${default_bg}) no-repeat`, backgroundSize: "cover", backgroundColor: "#fffff" }}
        >
          <div className="flex h-full">
            <div className=" mx-6 relative mt-20">
              <div className="flex justify-end w-64 h-64">
                <img src={`${import.meta.env.VITE_GET_IMAGE_URL}/${user?.avatar}`} alt="" className="w-64 aspect-square rounded-full border-2 border-slate-200 object-cover" />
              </div>
            </div>
            {/* User name and handle */}
            <div className="w-full flex flex-col">
              <div className="text-white ">
                Profile
              </div>
              <div className="">
                <span className="mb-0 font-bold text-white text-6xl stroke-slate-900 text-nowrap">
                  {user?.name}
                </span>
                <span className="mb-0 block b text-white font-medium"> {user?.playlists?.length || 0} public playlists • {user?.followings?.length || 0} following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
