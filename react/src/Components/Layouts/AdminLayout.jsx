import { Outlet } from "react-router";
import SideBar from "../Admin/SideBar";
import NavBar from "../Admin/NavBar";
import { useState } from "react";

export default function AdminLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  window.addEventListener('resize', function () {
    if (window.screen.width > 1024) {
      setIsSideBarOpen(false)
    }
  })

  return (
    <>
      <div className="flex max-h-screen overflow-hidden">
        <div className={`${isSideBarOpen ? 'translate-x-0' : '-translate-x-full'} absolute z-30 lg:translate-x-0 lg:relative transform duration-200`}>
          <SideBar setIsSideBarOpen={setIsSideBarOpen} />
        </div>
        <div className={`${isSideBarOpen && 'blur-[1px]'} flex-grow`}
        >
          <NavBar setIsSideBarOpen={setIsSideBarOpen} />
          <div onClick={() => setIsSideBarOpen(false)}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
};
