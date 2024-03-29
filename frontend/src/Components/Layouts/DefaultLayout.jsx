import { Outlet } from "react-router";
import MusicPlay from "../Public/AudioPlayer/MusicPlay";
import StickyNarbar from '../Public/NavBar/NavBar'
import { useStore } from "../../store";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Footer = () => {
  return (
    <div className="absolute min-w-[817px] bottom-0 w-full px-2 pb-1 rounded-sm">
      <Link to={"/signup"} className="min-h-10 bg-gradient-to-r from-[#3b4677] to-blue-500 flex justify-between items-center py-2 pr-7 pl-3 
      hover:cursor-pointer">
        <div className="text-white ">
          <div className="font-bold text-base">
            Sign up our website
          </div>
          <div className="font-normal text-lg font-sans">
            Join us and get access to exclusive features and benefits.
          </div>
        </div>
        <div className="bg-white text-black py-2 px-4 rounded-lg font-bold hover:scale-105">
          Sign up for free
        </div>
      </Link>
    </div>

  )
}

export default function DefaultLayout() {
  const [state, dispatch] = useStore()

  return (
    <>
      <StickyNarbar />
      <Outlet />
      {
        state?.currentUserID
          ?
          state?.currentPlaylist?.length > 0
            ?
            <MusicPlay />
            :
            <></>
          :
          <Footer />
      }
    </>
  )
}
