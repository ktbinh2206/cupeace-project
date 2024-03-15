import { Outlet } from "react-router";
import MusicPlay from "../Public/MusicPlay";

export default function DefaultLayout() {
  return (
    <>
      <Outlet />
      <MusicPlay />
    </>
  )
}
