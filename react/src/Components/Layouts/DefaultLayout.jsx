import { Outlet } from "react-router";
import MusicPlay from "../Public/MusicPlay";
import StickyNarbar from '../Public/NavBar/NavBar'
export default function DefaultLayout() {
  return (
    <>
      <StickyNarbar />
      <Outlet />
      <MusicPlay />
    </>
  )
}
